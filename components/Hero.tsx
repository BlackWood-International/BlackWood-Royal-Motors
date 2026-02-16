import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Button } from './Button';
import { ArrowRight, ShieldCheck, Globe, Zap } from 'lucide-react';

interface HeroProps {
  onEnterCatalog: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onEnterCatalog }) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 z-0">
        {/* Animated Glows */}
        <motion.div 
            animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2] 
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-brand-gold/10 rounded-full blur-[120px]" 
        />
        <motion.div 
            animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.1, 0.2, 0.1] 
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-brand-slate/20 rounded-full blur-[120px]" 
        />
        
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-6 text-center flex flex-col items-center"
      >
        <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 py-2 px-6 border border-brand-gold/30 text-brand-gold text-[10px] uppercase tracking-[0.5em] rounded-full bg-brand-gold/5 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold"></span>
                </span>
                Luxury redefined • New York
            </span>
        </motion.div>

        {/* LOGO */}
        <motion.div variants={itemVariants} className="mb-10">
            <img 
                src="https://i.imgur.com/5QiFb0Y.png" 
                alt="BlackWood Royal Motors" 
                className="w-full max-w-[400px] md:max-w-[650px] lg:max-w-[850px] h-auto object-contain mx-auto filter drop-shadow-[0_0_30px_rgba(197,160,89,0.2)]"
            />
        </motion.div>

        <motion.p 
          variants={itemVariants}
          className="text-slate-400 max-w-2xl mx-auto text-base md:text-xl leading-relaxed font-light tracking-wide mb-12"
        >
          Découvrez une collection exclusive où l'élégance rencontre la puissance. 
          BlackWood Royal Motors : l'excellence automobile sans compromis.
        </motion.p>

        {/* CTAs */}
        <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
        >
            <Button onClick={onEnterCatalog} className="group px-10 py-4 text-sm">
                Accéder au Catalogue 
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <a href="https://blackwood-international.github.io/BlackWood/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="px-10 py-4 text-sm">
                    BlackWood Group
                </Button>
            </a>
        </motion.div>

        {/* MINI FEATURES */}
        <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12 border-t border-white/10 w-full max-w-4xl"
        >
            <div className="flex flex-col items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-gold opacity-60" />
                <span className="text-[10px] uppercase tracking-widest text-slate-500">Sécurité Maximale</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Globe className="w-5 h-5 text-brand-gold opacity-60" />
                <span className="text-[10px] uppercase tracking-widest text-slate-500">Import International</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                < Zap className="w-5 h-5 text-brand-gold opacity-60" />
                <span className="text-[10px] uppercase tracking-widest text-slate-500">Performance Elite</span>
            </div>
        </motion.div>
      </motion.div>

      {/* Background decoration lines */}
      <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent ml-[5%]" />
      <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent mr-[5%]" />
    </div>
  );
};
