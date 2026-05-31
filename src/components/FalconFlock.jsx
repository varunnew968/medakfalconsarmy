import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Zap } from 'lucide-react';
import { dataManager } from '../services/dataManager';

const FalconFlock = () => {
  const [players, setPlayers] = useState([]);
  const [captain, setCaptain] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      const data = await dataManager.getImagesByFolder('players');
      if (data && data.length > 0) {
        let foundCaptain = null;
        
        const fetchedPlayers = data.map(img => {
          let name = 'CLASSIFIED';
          let role = 'TBA';
          let isCap = false;
          if (img.context && img.context.custom) {
             name = img.context.custom.name || name;
             role = img.context.custom.role || role;
             isCap = img.context.custom.isCaptain === 'true';
          } else if (!img.public_id.startsWith('local_')) {
             name = img.public_id.split('/').pop().replace(/-/g, ' ').toUpperCase();
          }
          
          const p = {
            name: name,
            role: role,
            isCaptain: isCap,
            resourceType: img.resource_type || 'image',
            image: img.secure_url || `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/${img.resource_type || 'image'}/upload/v${img.version}/${img.public_id}.${img.format || 'mp4'}`
          };
          if (isCap) foundCaptain = p;
          return p;
        });
        
        setCaptain(foundCaptain);
        
        // Ensure regular players array excludes the captain, or just show everyone. 
        // Showing everyone including the captain in the squad grid is fine, but usually captain is excluded.
        const squad = fetchedPlayers.filter(p => !p.isCaptain);
        setPlayers(squad);
      }
    };
    fetchPlayers();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <section id="squad" className="section-padding relative bg-[#0A0D10]">
      <div className="container relative z-10">
        <div className="text-center mb-8">
          <h2 className="heading-lg text-white">The Falcon <span className="text-primary-orange">Flock</span></h2>
          <p className="text-muted text-lg tracking-widest uppercase mt-2">Draft Incoming</p>
        </div>

        {/* Draft Notice */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-primary-orange/10 border border-primary-orange/30 rounded-xl p-6 text-center max-w-3xl mx-auto mb-16 backdrop-blur-sm"
        >
          <p className="text-white text-lg font-medium">
            🚨 Official player drafts and full squad announcements will be made on the upcoming auction day as per the latest <span className="text-primary-orange font-bold uppercase tracking-wide">TG20 League</span> schedule. Stay tuned!
          </p>
        </motion.div>

        {/* Captain Spotlight */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-card-bg border border-white/10 hover:border-primary-orange/50 transition-colors duration-500 rounded-[20px] overflow-hidden max-w-5xl mx-auto mb-20 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative group"
        >
          {/* Inner Glow */}
          <div className="absolute inset-0 bg-primary-orange/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div className="grid md:grid-cols-2">
            <div className="relative overflow-hidden h-[400px] md:h-auto bg-black">
              {/* Image zoom effect */}
              {captain && captain.resourceType === 'video' ? (
                <video 
                  src={captain.image} 
                  autoPlay loop muted playsInline
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 ease-out pointer-events-none"
                />
              ) : (
                <img 
                  src={captain ? captain.image : "/player_silhouette.png"} 
                  alt="Captain Spotlight" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-card-bg hidden md:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-card-bg via-transparent to-transparent block md:hidden" />
            </div>
            
            <div className="p-10 flex flex-col justify-center relative z-10">
              <div className="text-primary-orange font-bold tracking-[0.2em] mb-3 text-sm flex items-center gap-2">
                <Shield size={16} /> CAPTAIN SPOTLIGHT
              </div>
              <h3 className="heading-md text-white mb-2 text-4xl">{captain ? captain.name : "UNKNOWN"}</h3>
              <p className="text-muted mb-8 leading-relaxed">
                The commander of the Medak Falcons is a seasoned international star ready to lead our franchise to ultimate victory. Stay tuned for the official reveal.
              </p>
              
              <div className="flex gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold font-heading text-white flex justify-center"><Target size={24} className="text-primary-orange mr-2" /></div>
                  <div className="text-xs text-muted mt-1 uppercase tracking-wider">{captain ? captain.role : "Batsman"}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold font-heading text-white flex justify-center"><Zap size={24} className="text-primary-orange mr-2" /></div>
                  <div className="text-xs text-muted mt-1 uppercase tracking-wider">Aggressive</div>
                </div>
              </div>
              
              <div>
                <button className="btn btn-primary w-full md:w-auto">View Full Profile</button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Roster Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-6 md:gap-8 justify-items-center"
        >
          {players.map((player, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(255, 122, 0, 0.2)" }}
              className="group relative w-full aspect-[28/38] rounded-2xl overflow-hidden border border-white/5 bg-card-bg transition-all duration-300 shadow-xl max-w-[280px]"
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-orange/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
              
              {/* Image Wrapper */}
              <div className="absolute inset-0 bg-[#050505]">
                {player.resourceType === 'video' ? (
                  <video 
                    src={player.image} 
                    autoPlay loop muted playsInline
                    className="w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-80 transition-all duration-500 pointer-events-none"
                  />
                ) : (
                  <img 
                    src={player.image} 
                    alt={player.name} 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-80 transition-all duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-card-bg via-card-bg/60 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-2 md:p-5 z-20 flex flex-col items-center text-center transform translate-y-2 md:translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h4 className="font-heading font-bold text-white text-[0.7rem] md:text-xl mb-0.5 md:mb-1 tracking-wide truncate w-full px-1">{player.name}</h4>
                <p className="text-primary-orange text-[0.5rem] md:text-xs font-semibold tracking-widest uppercase mb-1 md:mb-4">{player.role}</p>
                <button className="opacity-0 group-hover:opacity-100 text-[0.5rem] md:text-xs text-white border border-white/20 hover:border-primary-orange hover:text-primary-orange px-2 py-1 md:px-4 md:py-2 rounded transition-all duration-300 uppercase tracking-wider">
                  View
                </button>
              </div>

              {/* Glowing Border */}
              <div className="absolute inset-0 border-2 border-primary-orange opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FalconFlock;
