import React from 'react';
import { motion } from 'framer-motion';


const Footer = () => {
  return (
    <footer className="bg-midnight-black relative overflow-hidden">
      {/* Orange Accent Line Top */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary-orange to-transparent opacity-50" />
      
      <div className="container relative z-10 pt-24 pb-12">
        


        {/* Footer Bottom */}
        <div className="text-center border-t border-white/5 pt-12">
          <h2 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 select-none tracking-tight">
            MFA <span className="text-primary-orange">ARMY</span>
          </h2>
          
          <div className="text-sm font-bold tracking-[0.3em] text-eagle-gold mb-12 uppercase">
            One Team. One Pride.
          </div>

          <div className="flex justify-center gap-6 mb-12">
            <a href="https://www.instagram.com/medakfalconsarmy/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-white/10 bg-card-bg flex items-center justify-center text-muted hover:text-white hover:bg-primary-orange hover:border-primary-orange hover:shadow-[0_0_20px_rgba(255,122,0,0.4)] transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
          </div>

          <div className="text-xs text-muted/60 uppercase tracking-wider">
            <p>&copy; 2026 Medak Falcons Army. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
