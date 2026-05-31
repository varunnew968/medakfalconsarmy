import axios from 'axios';
import CryptoJS from 'crypto-js';

// The credentials must be set in .env
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY || '';
const API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET || '';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || ''; // Important for unsigned uploads if not using signed

// Removed basic auth since it triggers CORS error on client-side requests

export const cloudinaryService = {
  // 1. Upload Image
  uploadImage: async (file, folder, context = null) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const timestamp = Math.round((new Date()).getTime() / 1000);
      formData.append('api_key', API_KEY);
      formData.append('timestamp', timestamp);

      // Create params to sign
      const paramsToSign = {
        folder: `medak-falcons/${folder}`,
        tags: `mfa_${folder}`,
        timestamp: timestamp
      };

      if (context) {
        paramsToSign.context = Object.entries(context).map(([k, v]) => `${k}=${v}`).join('|');
      }

      // Sort alphabetically and generate signature
      const sortedKeys = Object.keys(paramsToSign).sort();
      const stringToSign = sortedKeys.map(k => `${k}=${paramsToSign[k]}`).join('&') + API_SECRET;
      const signature = CryptoJS.SHA1(stringToSign).toString();
      
      formData.append('signature', signature);
      formData.append('folder', paramsToSign.folder);
      formData.append('tags', paramsToSign.tags);
      if (paramsToSign.context) {
        formData.append('context', paramsToSign.context);
      }

      const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;
      
      const response = await axios.post(url, formData);
      return response.data; // contains public_id, secure_url, resource_type
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  },

  // 2. Fetch Images from Folder
  getImagesByFolder: async (folder) => {
    // We CANNOT use Admin API (api.cloudinary.com) from browser due to strict CORS.
    // Instead, we use our public tag fetcher which is open to CORS on res.cloudinary.com
    return cloudinaryService.getPublicImagesByTag(`mfa_${folder}`);
  },

  // 3. Delete Media (Image or Video)
  deleteImage: async (publicId, resourceType = 'image') => {
    try {
      // Must use Upload API (destroy) because Admin API fails with CORS in browsers
      const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/destroy`;
      
      const timestamp = Math.round((new Date()).getTime() / 1000);
      const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`;
      const signature = CryptoJS.SHA1(stringToSign).toString();

      const formData = new FormData();
      formData.append('public_id', publicId);
      formData.append('api_key', API_KEY);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      
      const response = await axios.post(url, formData);
      return response.data;
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw error;
    }
  },

  // 4. Fetch Media by Tag (PUBLIC API - No Secret Needed!)
  getPublicImagesByTag: async (tag, resourceType = 'image') => {
    if (!CLOUD_NAME) return [];
    try {
      const url = `https://res.cloudinary.com/${CLOUD_NAME}/${resourceType}/list/${tag}.json`;
      const response = await axios.get(url);
      
      // Inject resource_type into the response objects so we know what they are later
      return response.data.resources.map(res => ({ ...res, resource_type: resourceType }));
    } catch (error) {
      // It's normal to get 404 if the tag doesn't exist yet for that resource type
      return [];
    }
  }
};
