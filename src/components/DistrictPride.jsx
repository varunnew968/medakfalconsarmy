import React from 'react';
import { motion } from 'framer-motion';
import { Castle, TreePine, Flame, Trophy } from 'lucide-react';

const cards = [
  {
    icon: <Castle size={40} className="text-primary-orange mb-6" />,
    title: "Kakatiya Legacy",
    desc: "Unbreakable defense inspired by the ancient stone of Methuku Durgam."
  },
  {
    icon: <TreePine size={40} className="text-primary-orange mb-6" />,
    title: "Nature's Sanctuary",
    desc: "Wild and relentless energy drawn from the Pocharam forests."
  },
  {
    icon: <Flame size={40} className="text-primary-orange mb-6" />,
    title: "Cultural Pride",
    desc: "Vibrant spirit and passionate fanbase celebrating Telangana's soul."
  },
  {
    icon: <Trophy size={40} className="text-primary-orange mb-6" />,
    title: "Future Champions",
    desc: "Building a dynasty of modern cricket dominance in the TG20 League."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

const DistrictPride = () => {
  return (
    <section className="section-padding relative bg-dark-bg">
      <div className="container relative z-10">
        <div className="text-center mb-16">
          <h2 className="heading-lg text-white">District <span className="text-primary-orange">Pride</span></h2>
          <p className="text-muted text-lg mt-2">The soul of Medak, woven into our DNA.</p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6"
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -10, 
                scale: 1.02,
                boxShadow: "0px 20px 40px rgba(255, 122, 0, 0.15)",
                borderColor: "rgba(255, 122, 0, 0.5)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-card-bg/60 backdrop-blur-md border border-white/5 rounded-[20px] p-8 flex flex-col h-full relative overflow-hidden group"
            >
              {/* Subtle hover background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-orange/0 to-primary-orange/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10 flex flex-col h-full">
                {card.icon}
                <h3 className="text-xl font-bold font-heading mb-3 text-white tracking-wide">{card.title}</h3>
                <p className="text-muted text-sm leading-relaxed flex-grow">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default DistrictPride;
