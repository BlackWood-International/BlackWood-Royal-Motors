import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { ArrowRight, Star, Shield, Zap, ChevronDown } from 'lucide-react';

interface HeroProps {
  onEnterCatalog: () => void;
}

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2940&auto=format&fit=crop", // Dark Porsche vibe
  "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=2874&auto=format&fit=crop", // Moody Mercedes
  "https://images.unsplash.com/photo-1603584173870-7b297f0f3317?q=80&w=2940&auto=format&fit=crop"  // Detailed interior/Exterior
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
    <div className="relative h-screen w-full flex flex-col justify-center overflow-hidden bg-black selection:bg-brand-gold selection:text-black">
      
      {/* BACKGROUND SLIDESHOW */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
             <img 
                src={HERO_IMAGES[currentImage]} 
                alt="Luxury Car Background" 
                className="w-full h-full object-cover opacity-60"
             />
             {/* Gradient Overlays for Readability */}
             <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_120%)]" />
          </motion.div>
        </AnimatePresence>
        
        {/* Animated Grain/Noise */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none" />
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-20 w-full max-w-[1800px] mx-auto px-6 md:px-12 lg:px-20 flex flex-col items-start justify-center h-full pt-20">
        
        {/* Top Tag */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-8 flex items-center gap-4"
        >
            <div className="h-[1px] w-12 bg-brand-gold/50" />
            <span className="text-brand-gold text-xs font-bold tracking-[0.4em] uppercase">Collection 2026</span>
        </motion.div>

        {/* Massive Typography */}
        <div className="relative mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-8xl lg:text-[9rem] leading-[0.9] font-serif text-white mix-blend-overlay"
          >
            BlackWood
          </motion.h1>
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-8xl lg:text-[9rem] leading-[0.9] font-serif text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-[#e8c683] to-brand-gold/50"
          >
            Royal Motors
          </motion.h1>
        </div>

        {/* Description & CTA */}
        <div className="flex flex-col md:flex-row items-end gap-12 w-full max-w-5xl">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-slate-400 text-sm md:text-lg leading-relaxed font-light max-w-lg border-l border-white/20 pl-6"
            >
              L'excellence n'est pas un acte, c'est une habitude. Découvrez notre catalogue exclusif de véhicules d'exception, importés et préparés pour l'élite de Los Santos.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex items-center gap-6"
            >
               <Button onClick={onEnterCatalog} className="h-16 px-10 text-sm !tracking-[0.25em] bg-white text-black hover:bg-brand-gold hover:text-black border-none shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                  Explorer le Catalogue
                  <ArrowRight className="w-5 h-5 ml-2" />
               </Button>
            </motion.div>
        </div>

      </div>

      {/* FOOTER STATS */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-0 left-0 w-full border-t border-white/5 bg-black/20 backdrop-blur-sm"
      >
         <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-widest text-slate-500 font-mono">
            
            <div className="flex gap-12">
               <div className="flex items-center gap-3">
                  <Star className="w-4 h-4 text-brand-gold" />
                  <span>Premium Dealer</span>
               </div>
               <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-brand-gold" />
                  <span>Garantie à Vie</span>
               </div>
               <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-brand-gold" />
                  <span>Livraison Instantanée</span>
               </div>
            </div>

            <div className="flex items-center gap-2 animate-bounce">
                <span>Scroll</span>
                <ChevronDown className="w-3 h-3" />
            </div>

         </div>
      </motion.div>

    </div>
  );
};
