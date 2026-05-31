import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import './components.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
      className={`navbar ${scrolled ? 'glass' : ''}`}
    >
      <div className="container nav-container">
        <a href="#home" className="logo flex items-center gap-3">
          <img src="/favicon.png" alt="MFA Logo" className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-[0_0_15px_rgba(255,122,0,0.5)]" />
          <div className="flex flex-col">
            <span className="text-xl leading-none tracking-wider text-white">MEDAK FALCONS</span>
            <span className="text-[0.65rem] text-primary-orange tracking-[0.2em] uppercase mt-1 font-body font-bold">Official Fan Community</span>
          </div>
        </a>
        
        <div className="nav-links desktop-only">
          <a href="#home">Home</a>
          <a href="#identity">Identity</a>
          <a href="#squad">The Squad</a>
          <a href="#gallery">Gallery</a>

          <a href="https://www.instagram.com/medakfalconsarmy/" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">Join Army</a>
        </div>

        <button className="mobile-menu-btn mobile-only" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mobile-nav glass"
        >
          <a href="#home" onClick={() => setIsOpen(false)}>Home</a>
          <a href="#identity" onClick={() => setIsOpen(false)}>Identity</a>
          <a href="#squad" onClick={() => setIsOpen(false)}>The Squad</a>
          <a href="#gallery" onClick={() => setIsOpen(false)}>Gallery</a>

          <a href="https://www.instagram.com/medakfalconsarmy/" target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className="text-red">Join Army</a>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
