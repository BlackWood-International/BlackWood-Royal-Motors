import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { ArrowRight, Globe, MessageCircle } from 'lucide-react';

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
             <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/30 to-black/90" />
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_120%)]" />
          </motion.div>
        </AnimatePresence>
        
        {/* Animated Grain/Noise */}
        <div className="absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none" />
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-20 w-full max-w-[1800px] mx-auto px-6 flex flex-col items-center justify-center h-full text-center pb-12">
        
        {/* LOGO */}
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="mb-6 md:mb-10"
        >
            <img 
                src="https://i.imgur.com/5QiFb0Y.png" 
                alt="BlackWood Logo" 
                className="h-20 md:h-32 w-auto object-contain drop-shadow-[0_0_25px_rgba(197,160,89,0.2)]"
            />
        </motion.div>

        {/* Top Tag */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-4 flex items-center justify-center gap-4"
        >
            <div className="h-[1px] w-8 md:w-16 bg-gradient-to-r from-transparent to-brand-gold" />
            <span className="text-brand-gold text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase whitespace-nowrap px-2">
              Excellence in Motion
            </span>
            <div className="h-[1px] w-8 md:w-16 bg-gradient-to-l from-transparent to-brand-gold" />
        </motion.div>

        {/* Massive Typography */}
        <div className="relative mb-10 flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] leading-[0.85] font-serif text-white mix-blend-overlay tracking-tight"
          >
            BlackWood
          </motion.h1>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            className="text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] leading-[0.85] font-serif text-transparent bg-clip-text bg-gradient-to-b from-brand-gold via-[#F0E6D2] to-brand-gold/40 tracking-tight mt-1 md:mt-[-15px]"
          >
            Royal Motors
          </motion.h1>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto">
            
            {/* Main Entry Button */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="w-full sm:w-auto"
            >
               <Button onClick={onEnterCatalog} className="w-full sm:w-auto h-14 md:h-16 px-10 md:px-16 text-xs md:text-sm !tracking-[0.3em] bg-white text-black hover:bg-brand-gold hover:text-black border-none shadow-[0_0_50px_-15px_rgba(255,255,255,0.4)]">
                  Découvrir le Catalogue
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
               </Button>
            </motion.div>

            {/* Discrete Links */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="flex flex-wrap justify-center gap-4 md:gap-8 mt-2"
            >
                <a 
                    href="https://discord.gg/88peMJRz95" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/20 backdrop-blur-sm text-[9px] md:text-[10px] uppercase tracking-widest text-slate-400 hover:text-brand-gold hover:border-brand-gold/50 transition-all duration-300"
                >
                    <MessageCircle className="w-3 h-3" />
                    <span>Intranet & News</span>
                </a>
                
                <div className="w-[1px] h-4 bg-white/10 my-auto hidden md:block"></div>

                <a 
                    href="https://blackwood-international.github.io/BlackWood/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/20 backdrop-blur-sm text-[9px] md:text-[10px] uppercase tracking-widest text-slate-400 hover:text-brand-gold hover:border-brand-gold/50 transition-all duration-300"
                >
                    <Globe className="w-3 h-3" />
                    <span>BlackWood Corp</span>
                </a>
            </motion.div>
        </div>
      </div>
    </div>
  );
};
