import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Identity = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const parallaxY = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <section id="identity" className="section-padding relative overflow-hidden bg-dark-bg" ref={containerRef}>
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="identity-content"
          >
            <h2 className="heading-lg mb-4 text-white">
              Rise of the <span className="text-primary-orange">Falcons</span>
            </h2>
            {/* Animated orange underline */}
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "100px" }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="h-1 bg-primary-orange mb-8 rounded-full"
            />
            
            <p className="text-muted text-lg mb-6 leading-relaxed">
              Forged in the heart of Medak, the Falcons represent more than just a team. We are the embodiment of the district's rich Kakatiya heritage, striking with the precision and power of a descending falcon.
            </p>
            <p className="text-muted text-lg leading-relaxed">
              From the historic walls of the Medak Fort to the towering spires of the Cathedral, our spirit is intertwined with the soil we play on. Sponsored by Bhrunda Infra, we bring luxury, speed, and undeniable dominance to the TG20 League.
            </p>
          </motion.div>

          <motion.div 
            style={{ y: parallaxY }}
            className="identity-visual relative w-full h-[300px] md:h-[500px]"
          >
            <div className="absolute inset-0 bg-primary-orange/5 blur-[100px] rounded-full pointer-events-none" />
            
            {/* Floating Card Effect */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="glass p-4 rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] h-full overflow-hidden relative"
            >
              <motion.div style={{ scale: imgScale }} className="w-full h-full origin-center">
                <img 
                  src="/medak_cathedral.png" 
                  alt="Medak Cathedral" 
                  className="w-full h-full object-cover rounded-xl"
                />
              </motion.div>
              
              {/* Inner subtle glow and borders */}
              <div className="absolute inset-0 border border-primary-orange/20 rounded-2xl m-4 pointer-events-none" />
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Identity;
