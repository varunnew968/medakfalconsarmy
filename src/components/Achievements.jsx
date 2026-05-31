import React from 'react';
import { motion } from 'framer-motion';

const milestones = [
  { year: '2024', title: 'Team Founded', desc: 'The vision of a premium Medak franchise was established.' },
  { year: '2025', title: 'Community Launch', desc: 'MFA Army rallied 10,000 strong in the first month.' },
  { year: '2026', title: 'Expansion', desc: 'Entering the TG20 League with a world-class roster.' }
];

const Achievements = () => {
  return (
    <section id="achievements" className="section-padding bg-[#0A0D10] relative overflow-hidden">
      <div className="container relative z-10">
        <div className="text-center mb-20">
          <h2 className="heading-lg text-white">The <span className="text-eagle-gold">Legacy</span></h2>
          <p className="text-muted text-lg mt-2">Our journey is just beginning.</p>
        </div>

        <div className="relative max-w-6xl mx-auto px-4">
          {/* Animated horizontal connecting line (desktop) */}
          <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-1 bg-white/10 rounded-full">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-orange/20 via-primary-orange to-primary-orange/20 shadow-[0_0_15px_rgba(255,122,0,0.8)]"
            />
          </div>

          {/* Vertical connecting line (mobile) */}
          <div className="block md:hidden absolute left-8 top-0 bottom-0 w-1 bg-white/10 rounded-full">
             <motion.div 
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-full bg-primary-orange shadow-[0_0_15px_rgba(255,122,0,0.8)]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {milestones.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.3 }}
                className="relative flex md:flex-col items-start md:items-center text-left md:text-center group"
              >
                {/* Node */}
                <div className="relative z-10 md:mb-8 mr-8 md:mr-0 flex-shrink-0">
                  <motion.div 
                    whileHover={{ scale: 1.2 }}
                    className="w-[40px] h-[40px] md:w-[60px] md:h-[60px] bg-card-bg rounded-full border-4 border-primary-orange flex items-center justify-center shadow-[0_0_20px_rgba(255,122,0,0.3)] transition-shadow duration-300 group-hover:shadow-[0_0_30px_rgba(255,122,0,0.6)]"
                  >
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-eagle-gold rounded-full" />
                  </motion.div>
                </div>
                
                {/* Content Card */}
                <div className="bg-card-bg/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-white/5 hover:border-primary-orange/30 transition-colors w-full group-hover:-translate-y-2 duration-300 shadow-xl">
                  <span className="text-4xl md:text-5xl font-heading font-bold text-white/10 absolute top-4 right-4 pointer-events-none group-hover:text-primary-orange/10 transition-colors duration-500">
                    {item.year.slice(-2)}
                  </span>
                  <h3 className="text-eagle-gold font-bold text-xl md:text-2xl mb-2">{item.year}</h3>
                  <h4 className="heading-md text-white text-xl md:text-2xl mb-3">{item.title}</h4>
                  <p className="text-muted leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Achievements;
