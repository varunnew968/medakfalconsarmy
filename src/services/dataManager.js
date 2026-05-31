import { cloudinaryService } from './cloudinary';

// Static fallbacks
const localGallery = [
  { public_id: 'local_events_1', secure_url: '/medak_cathedral.png', folder: 'events' },
  { public_id: 'local_team_1', secure_url: '/hero_eagle.png', folder: 'team-photos' },
  { public_id: 'local_practice_1', secure_url: '/player_silhouette.png', folder: 'practice' },
  { public_id: 'local_fan_1', secure_url: '/hero_eagle.png', folder: 'fan-moments' },
  { public_id: 'local_events_2', secure_url: '/medak_cathedral.png', folder: 'events' },
];

const localPlayers = Array(10).fill(null).map((_, i) => ({
  public_id: `local_player_${i}`,
  secure_url: '/player_silhouette.png',
  folder: 'players',
  context: { custom: { name: 'CLASSIFIED', role: 'TBA' } }
}));

export const dataManager = {
  getDeletedIds: () => {
    return JSON.parse(localStorage.getItem('mfa_deleted_images') || '[]');
  },

  deleteImage: async (publicId, resourceType = 'image') => {
    // If it's a local static image, just hide it via localStorage
    if (publicId.startsWith('local_')) {
      const deleted = dataManager.getDeletedIds();
      deleted.push(publicId);
      localStorage.setItem('mfa_deleted_images', JSON.stringify(deleted));
      return true;
    }

    // Otherwise delete from Cloudinary
    await cloudinaryService.deleteImage(publicId, resourceType);
    return true;
  },

  getImagesByFolder: async (folder) => {
    const deletedIds = dataManager.getDeletedIds();
    
    // 1. Get local placeholders for this folder
    let localItems = folder === 'players' 
      ? localPlayers 
      : localGallery.filter(img => img.folder === folder);
    
    // Filter out deleted local placeholders
    localItems = localItems.filter(img => !deletedIds.includes(img.public_id));

    // 2. Fetch Cloudinary items (Both Images and Videos)
    let cloudItems = [];
    try {
      const [imgData, vidData] = await Promise.allSettled([
        cloudinaryService.getPublicImagesByTag(`mfa_${folder}`, 'image'),
        cloudinaryService.getPublicImagesByTag(`mfa_${folder}`, 'video')
      ]);
      
      const images = imgData.status === 'fulfilled' ? imgData.value : [];
      const videos = vidData.status === 'fulfilled' ? vidData.value : [];
      
      cloudItems = [...images, ...videos].filter(item => !deletedIds.includes(item.public_id));
      
      // Sort so newest uploads appear first
      cloudItems.sort((a, b) => b.version - a.version);
    } catch (e) {
      console.warn("Could not fetch Cloudinary media", e);
    }

    // 3. Merge them (Cloud items first, then local items as fillers)
    // For gallery, just merge. For players, we pad up to 10 if needed.
    if (folder === 'players') {
      const merged = [...cloudItems];
      let localIndex = 0;
      while (merged.length < 10 && localIndex < localItems.length) {
        merged.push(localItems[localIndex]);
        localIndex++;
      }
      return merged;
    }

    return [...cloudItems, ...localItems];
  }
};
