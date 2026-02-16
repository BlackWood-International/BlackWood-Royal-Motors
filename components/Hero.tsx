import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Button } from './Button';

export const Hero: React.FC = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Réduit le délai pour une sensation plus vive
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 }, // Réduit la distance de mouvement pour moins de calcul
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" } // Courbe simplifiée
    }
  };

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden gpu-accelerated">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-6 text-center -mt-20 flex flex-col items-center"
      >
        <motion.div variants={itemVariants}>
            <span className="inline-block py-1.5 px-6 border border-brand-gold/20 text-brand-gold text-[10px] uppercase tracking-[0.4em] mb-8 rounded-full bg-brand-gold/5 backdrop-blur-sm shadow-[0_0_20px_-5px_rgba(197,160,89,0.2)]">
                Est. Delaware • Based in New York
            </span>
        </motion.div>

        {/* LOGO INTEGRATION */}
        <motion.div variants={itemVariants} className="mb-8 md:mb-12">
            <img 
                src="https://i.imgur.com/5QiFb0Y.png" 
                alt="BlackWood Royal Motors" 
                className="w-full max-w-[300px] md:max-w-[500px] lg:max-w-[700px] h-auto object-contain mx-auto drop-shadow-2xl"
                width="700"
                height="300"
            />
        </motion.div>

        <motion.div 
            variants={itemVariants}
            className="w-full flex justify-center mb-8 md:mb-10"
        >
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-50" />
        </motion.div>

        <motion.p 
          variants={itemVariants}
          className="text-slate-400 max-w-2xl mx-auto text-sm md:text-lg leading-relaxed font-light tracking-wide mb-10 mix-blend-plus-lighter"
        >
          L'incarnation de l'ingénierie de pointe et du prestige automobile. Chaque véhicule de notre collection représente l'apogée de la performance et du luxe international.
        </motion.p>

        <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row gap-6 justify-center items-center"
        >
            <Button onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}>
                Découvrir la Collection
            </Button>
            
            <a href="https://blackwood-international.github.io/BlackWood/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                    BlackWood International
                </Button>
            </a>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
      >
        <span className="text-[9px] uppercase tracking-[0.3em] text-brand-gold/60 font-medium">Explorer</span>
        <motion.div
            animate={{ y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="w-[1px] h-12 bg-gradient-to-b from-transparent via-brand-gold to-transparent"
        />
      </motion.div>
    </div>
  );
};