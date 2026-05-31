import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogOut, Upload, Trash2, Image as ImageIcon, Users } from 'lucide-react';
import { cloudinaryService } from '../../services/cloudinary';
import { dataManager } from '../../services/dataManager';

const TABS = ['Players', 'Team Photos', 'Events', 'Practice', 'Fan Moments'];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Players');
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Player Form State
  const [playerName, setPlayerName] = useState('');
  const [playerRole, setPlayerRole] = useState('');
  const [isCaptain, setIsCaptain] = useState(false);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const folder = activeTab.toLowerCase().replace(' ', '-');
      const data = await dataManager.getImagesByFolder(folder);
      setImages(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('mfa_admin_auth');
    navigate('/admin');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      return;
    }

    if (activeTab === 'Players' && (!playerName || !playerRole)) {
      return;
    }

    setUploading(true);
    try {
      const folder = activeTab.toLowerCase().replace(' ', '-');
      
      let context = null;
      if (activeTab === 'Players') {
        context = { name: playerName, role: playerRole, isCaptain: isCaptain ? 'true' : 'false' };
      }

      const uploadRes = await cloudinaryService.uploadImage(file, folder, context);
      
      // Reset form
      setPlayerName('');
      setPlayerRole('');
      setIsCaptain(false);
      
      // Inject instantly to avoid Cloudinary CDN cache delay
      setImages(prev => [{
        public_id: uploadRes.public_id,
        secure_url: uploadRes.secure_url,
        resource_type: uploadRes.resource_type || (file.type.startsWith('video') ? 'video' : 'image'),
        context: { custom: context }
      }, ...prev]);
      
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
      e.target.value = null; // reset file input
    }
  };

  const handleDelete = async (publicId, resourceType) => {
    try {
      await dataManager.deleteImage(publicId, resourceType);
      setImages(images.filter(img => img.public_id !== publicId));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-midnight-black text-white p-4 md:p-8 relative">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">MFA <span className="text-primary-orange">Admin System</span></h1>
          <p className="text-muted text-sm uppercase tracking-widest mt-1">Command Center</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg transition-colors text-sm"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Sidebar Tabs */}
        <div className="flex flex-col gap-2">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-left px-5 py-4 rounded-xl font-bold transition-all ${
                activeTab === tab 
                  ? 'bg-primary-orange/10 border border-primary-orange text-primary-orange shadow-[0_0_15px_rgba(255,122,0,0.2)]'
                  : 'bg-card-bg border border-white/5 text-muted hover:text-white hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                {tab === 'Players' ? <Users size={18} /> : <ImageIcon size={18} />}
                {tab}
              </div>
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3 bg-card-bg/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden">
          {/* Glow */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary-orange/5 blur-[80px] pointer-events-none" />

          <h2 className="text-2xl font-heading font-bold mb-6 flex items-center justify-between">
            Manage {activeTab}
            {uploading && <span className="text-sm text-primary-orange animate-pulse">Uploading...</span>}
          </h2>

          {/* Upload Section */}
          <div className="bg-black/30 border border-white/5 rounded-xl p-6 mb-8">
            {activeTab === 'Players' && (
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input 
                  type="text" 
                  placeholder="Player Name" 
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="bg-black/50 border border-white/20 rounded p-2 text-sm text-white"
                />
                <select 
                  value={playerRole}
                  onChange={(e) => setPlayerRole(e.target.value)}
                  className="bg-black/50 border border-white/20 rounded p-2 text-sm text-white"
                >
                  <option value="">Select Role</option>
                  <option value="Batsman">Batsman</option>
                  <option value="Bowler">Bowler</option>
                  <option value="All-Rounder">All-Rounder</option>
                  <option value="Wicket Keeper">Wicket Keeper</option>
                </select>
                <label className="col-span-2 flex items-center gap-2 text-sm text-white/70 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isCaptain} 
                    onChange={(e) => setIsCaptain(e.target.checked)} 
                    className="accent-primary-orange w-4 h-4" 
                  />
                  Mark as Team Captain
                </label>
              </div>
            )}
            
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 hover:border-primary-orange/50 rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition-colors group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-3 text-muted group-hover:text-primary-orange transition-colors" />
                <p className="mb-2 text-sm text-muted group-hover:text-white transition-colors">
                  <span className="font-semibold">Click to upload</span> {activeTab === 'Players' ? 'player media' : 'media'}
                </p>
                <p className="text-xs text-muted/50">PNG, JPG, MP4, WEBM (MAX. 10MB)</p>
              </div>
              <input type="file" className="hidden" accept="image/*,video/*" onChange={handleFileUpload} disabled={uploading} />
            </label>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoading ? (
              <p className="text-muted col-span-full">Loading Cloudinary data...</p>
            ) : images.length === 0 ? (
              <p className="text-muted col-span-full bg-black/20 p-8 rounded-xl text-center border border-white/5">
                No images found in <span className="text-primary-orange">medak-falcons/{activeTab.toLowerCase().replace(' ', '-')}</span>.
              </p>
            ) : (
              images.map((img) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={img.public_id} 
                  className="relative group rounded-xl overflow-hidden border border-white/10 bg-black aspect-square"
                >
                  {img.resource_type === 'video' ? (
                    <video 
                      src={img.secure_url || `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload/v${img.version}/${img.public_id}.${img.format || 'mp4'}`} 
                      autoPlay loop muted playsInline
                      className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-all duration-500"
                    />
                  ) : (
                    <img 
                      src={img.secure_url || `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/v${img.version}/${img.public_id}.${img.format}`} 
                      alt="Uploaded" 
                      className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-all duration-500" 
                    />
                  )}
                  
                  {activeTab === 'Players' && img.context && (
                    <div className="absolute top-0 left-0 w-full bg-black/80 backdrop-blur-sm p-2 text-xs">
                      <div className="font-bold text-primary-orange">{img.context.custom?.name || 'Unknown'} {img.context.custom?.isCaptain === 'true' && '👑'}</div>
                      <div className="text-white/70">{img.context.custom?.role || 'TBA'}</div>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => handleDelete(img.public_id, img.resource_type || 'image')}
                      className="bg-red-500/80 hover:bg-red-500 text-white p-3 rounded-full transition-transform hover:scale-110"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
