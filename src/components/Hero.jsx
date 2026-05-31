import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './components.css';

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section id="home" className="hero-section">
      {/* Background Image with Parallax */}
      <motion.div 
        className="hero-bg" 
        style={{ y: y1, backgroundImage: `url('/hero_eagle.png')` }}
      />
      
      {/* Overlay Gradients */}
      <div className="hero-overlay" />
      <div className="glow-bg glow-red" style={{ width: '600px', height: '600px', top: '10%', left: '10%' }} />
      <div className="glow-bg glow-gold" style={{ width: '500px', height: '500px', bottom: '10%', right: '10%' }} />

      <motion.div 
        className="container hero-content"
        style={{ opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h2 className="heading-md text-gold tracking-wide mb-4 text-center sm:text-left">One Team. One Pride.</h2>
          <h1 className="heading-xl mb-6 text-center sm:text-left">
            MEDAK <br/>
            <span className="text-red">FALCONS</span> ARMY
          </h1>
          <p className="text-muted text-lg max-w-2xl mb-10 text-center sm:text-left">
            The Ultimate Fan Community of Medak. A premium sports franchise experience where royal heritage meets modern speed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
            <a href="https://www.instagram.com/medakfalconsarmy/" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Join the Army</a>
            <a href="#squad" className="btn btn-outline">Explore the Flock</a>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Particles (simple CSS version) */}
      <div className="particles-container">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`
          }} />
        ))}
      </div>
    </section>
  );
};

export default Hero;
