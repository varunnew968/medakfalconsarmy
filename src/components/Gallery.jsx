import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { dataManager } from '../services/dataManager';

// Placeholders managed by dataManager

const categories = ['All', 'Team Photos', 'Events', 'Practice', 'Fan Moments'];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [images, setImages] = useState([]); // Start empty, fetch immediately

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const folders = ['team-photos', 'events', 'practice', 'fan-moments'];
        let fetchedImages = [];
        
        for (const folder of folders) {
          const data = await dataManager.getImagesByFolder(folder);
          if (data && data.length > 0) {
            const categoryName = folder.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            
            const formatted = data.map((img, i) => ({
              id: img.public_id,
              resourceType: img.resource_type || 'image',
              src: img.secure_url || `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/${img.resource_type || 'image'}/upload/v${img.version}/${img.public_id}.${img.format || 'mp4'}`,
              category: categoryName,
              // Randomly assign spans for masonry look
              span: i % 3 === 0 ? 'col-span-2 md:col-span-2 row-span-2' : 'col-span-1 row-span-1'
            }));
            fetchedImages = [...fetchedImages, ...formatted];
          }
        }

        if (fetchedImages.length > 0) {
          setImages(fetchedImages);
        }
      } catch (error) {
        console.error("Failed to load gallery from Cloudinary", error);
      }
    };
    fetchGallery();
  }, []);

  const filteredImages = activeCategory === 'All' 
    ? images 
    : images.filter(img => img.category === activeCategory);

  return (
    <section id="gallery" className="section-padding bg-dark-bg">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="heading-lg text-white">The <span className="text-primary-orange">Gallery</span></h2>
          <p className="text-muted text-lg mt-2">Moments that define our franchise.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeCategory === cat 
                  ? 'bg-primary-orange text-white shadow-[0_0_15px_rgba(255,122,0,0.5)]' 
                  : 'bg-card-bg text-muted hover:text-white border border-white/10 hover:border-primary-orange/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-3 md:grid-cols-4 auto-rows-[120px] md:auto-rows-[250px] gap-2 md:gap-4">
          <AnimatePresence>
            {filteredImages.map(img => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
                key={img.id}
                onClick={() => setSelectedImage(img)}
                className={`relative rounded-xl overflow-hidden cursor-pointer group border border-white/5 hover:border-primary-orange transition-colors ${img.span} md:col-span-auto`}
              >
                {img.resourceType === 'video' ? (
                  <video 
                    src={img.src} 
                    autoPlay loop muted playsInline
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 pointer-events-none" 
                  />
                ) : (
                  <img 
                    src={img.src} 
                    alt={img.category} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                  />
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    className="text-center p-4"
                  >
                    <span className="text-primary-orange font-bold tracking-widest uppercase text-sm block mb-1">
                      {img.category}
                    </span>
                    <span className="text-white font-heading text-lg">View Image</span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-6 right-6 text-white hover:text-primary-orange transition-colors z-50">
              <X size={40} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-[90vh] rounded-xl overflow-hidden shadow-[0_0_50px_rgba(255,122,0,0.15)] border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedImage.resourceType === 'video' ? (
                <video
                  src={selectedImage.src}
                  controls autoPlay
                  className="w-full max-h-[80vh] object-contain"
                />
              ) : (
                <img
                  src={selectedImage.src}
                  alt={selectedImage.category}
                  className="w-full h-full object-contain"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                <span className="text-primary-orange font-bold tracking-widest uppercase">{selectedImage.category}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
