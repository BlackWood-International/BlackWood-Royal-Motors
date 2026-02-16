import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { ArrowRight, Star, Shield, Zap } from 'lucide-react';

interface HeroProps {
  onEnterCatalog: () => void;
}

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2940&auto=format&fit=crop", // Dark Porsche
  "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=2874&auto=format&fit=crop", // Moody Mercedes
  "https://images.unsplash.com/photo-1603584173870-7b297f0f3317?q=80&w=2940&auto=format&fit=crop"  // Detail
];

export const Hero: React.FC<HeroProps> = ({ onEnterCatalog }) => {
  const [currentImage, setCurrentImage] = useState(0);

  // Slideshow Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black selection:bg-brand-gold selection:text-black">
      
      {/* BACKGROUND SLIDESHOW */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
             <img 
                src={HERO_IMAGES[currentImage]} 
                alt="Luxury Car Background" 
                className="w-full h-full object-cover opacity-50 md:opacity-60"
             />
             {/* Gradient Overlays for Readability */}
             <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/90" />
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_150%)]" />
          </motion.div>
        </AnimatePresence>
        
        {/* Animated Grain/Noise */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none" />
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-20 w-full max-w-[1800px] mx-auto px-6 flex flex-col items-center justify-center h-full text-center">
        
        {/* LOGO */}
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="mb-8 md:mb-12"
        >
            <img 
                src="https://i.imgur.com/5QiFb0Y.png" 
                alt="BlackWood Logo" 
                className="h-16 md:h-24 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            />
        </motion.div>

        {/* Top Tag */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-6 flex items-center justify-center gap-4"
        >
            <div className="h-[1px] w-8 md:w-12 bg-brand-gold/50" />
            <span className="text-brand-gold text-[10px] md:text-xs font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase whitespace-nowrap">
              Collection 2026
            </span>
            <div className="h-[1px] w-8 md:w-12 bg-brand-gold/50" />
        </motion.div>

        {/* Massive Typography - Optimized for Mobile */}
        <div className="relative mb-8 md:mb-12 flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] leading-[0.9] font-serif text-white mix-blend-overlay tracking-tight"
          >
            BlackWood
          </motion.h1>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            className="text-4xl sm:text-6xl md:text-8xl lg:text-[9rem] leading-[0.9] font-serif text-transparent bg-clip-text bg-gradient-to-b from-brand-gold via-[#e8c683] to-brand-gold/40 tracking-tight mt-1 md:mt-[-10px]"
          >
            Royal Motors
          </motion.h1>
        </div>

        {/* Description & CTA */}
        <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="text-slate-300 text-xs sm:text-sm md:text-lg leading-relaxed font-light px-4 md:px-0"
            >
              L'excellence n'est pas un acte, c'est une habitude. <br className="hidden md:block" />
              Découvrez notre catalogue exclusif de véhicules d'exception.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="w-full sm:w-auto"
            >
               <Button onClick={onEnterCatalog} className="w-full sm:w-auto h-14 md:h-16 px-8 md:px-12 text-xs md:text-sm !tracking-[0.25em] bg-white text-black hover:bg-brand-gold hover:text-black border-none shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                  Entrer
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
               </Button>
            </motion.div>
        </div>
      </div>

      {/* Minimal Footer Stats - Hidden on small mobile to save space */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 w-full hidden md:flex justify-center"
      >
         <div className="flex gap-8 md:gap-16 text-[9px] md:text-[10px] uppercase tracking-widest text-slate-500 font-mono">
             <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-brand-gold" />
                <span>Premium Dealer</span>
             </div>
             <div className="flex items-center gap-2">
                <Shield className="w-3 h-3 text-brand-gold" />
                <span>Garantie à Vie</span>
             </div>
             <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-brand-gold" />
                <span>Import Express</span>
             </div>
         </div>
      </motion.div>

    </div>
  );
};
