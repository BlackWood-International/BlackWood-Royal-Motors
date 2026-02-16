import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { ArrowRight, Globe, MessageCircle, ExternalLink } from 'lucide-react';

interface HeroProps {
  onEnterCatalog: () => void;
}

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1738&auto=format&fit=crop", // New Requested Image (Porsche Detail Dark)

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
    <div className="relative h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden bg-black selection:bg-brand-gold selection:text-black">
      
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
                className="w-full h-full object-cover opacity-60 md:opacity-70"
             />
             {/* Gradient Overlays for Readability */}
             <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_140%)]" />
          </motion.div>
        </AnimatePresence>
        
        {/* Animated Grain/Noise */}
        <div className="absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none" />
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-20 w-full max-w-[1800px] mx-auto px-4 sm:px-6 flex flex-col items-center justify-center h-full text-center pb-8 sm:pb-12">
        
        {/* LOGO */}
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="mb-4 sm:mb-8"
        >
            <img 
                src="https://i.imgur.com/5QiFb0Y.png" 
                alt="BlackWood Logo" 
                className="h-16 sm:h-24 md:h-32 w-auto object-contain drop-shadow-[0_0_25px_rgba(197,160,89,0.3)]"
            />
        </motion.div>

        {/* Top Tag */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-4 flex items-center justify-center gap-3 sm:gap-4"
        >
            <div className="h-[1px] w-8 md:w-16 bg-gradient-to-r from-transparent to-brand-gold" />
            <span className="text-brand-gold text-[9px] sm:text-xs font-bold tracking-[0.3em] sm:tracking-[0.4em] uppercase whitespace-nowrap px-2">
              Excellence in Motion
            </span>
            <div className="h-[1px] w-8 md:w-16 bg-gradient-to-l from-transparent to-brand-gold" />
        </motion.div>

        {/* Massive Typography - Adjusted for Mobile Fit */}
        <div className="relative mb-8 sm:mb-12 flex flex-col items-center w-full">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="text-[2.5rem] sm:text-6xl md:text-8xl lg:text-[10rem] leading-[0.9] font-serif text-white mix-blend-overlay tracking-tight"
          >
            BlackWood
          </motion.h1>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            className="text-[2rem] sm:text-5xl md:text-8xl lg:text-[10rem] leading-[0.9] font-serif text-transparent bg-clip-text bg-gradient-to-b from-brand-gold via-[#F0E6D2] to-brand-gold/40 tracking-tight mt-0 sm:mt-[-5px] md:mt-[-15px]"
          >
            Royal Motors
          </motion.h1>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col items-center gap-6 sm:gap-10 w-full max-w-2xl mx-auto">
            
            {/* Main Entry Button */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="w-full px-4 sm:px-0 sm:w-auto"
            >
               <Button onClick={onEnterCatalog} className="w-full sm:w-auto h-12 sm:h-16 px-8 sm:px-16 text-xs sm:text-sm !tracking-[0.3em] bg-white text-black hover:bg-brand-gold hover:text-black border-none shadow-[0_0_50px_-15px_rgba(255,255,255,0.4)]">
                  Découvrir le Catalogue
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
               </Button>
            </motion.div>

            {/* Discrete Links - Glassmorphism Style */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full px-6 sm:px-0"
            >
                <a 
                    href="https://discord.gg/88peMJRz95" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative w-full sm:w-auto overflow-hidden rounded-full p-[1px] transition-all duration-300 hover:shadow-[0_0_20px_rgba(197,160,89,0.3)]"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 group-hover:from-brand-gold/50 group-hover:to-brand-gold/20 transition-all duration-500 rounded-full" />
                    <div className="relative bg-black/40 backdrop-blur-xl rounded-full px-6 py-3 flex items-center justify-center gap-3 border border-white/10 group-hover:border-transparent transition-all">
                        <MessageCircle className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-black transition-colors" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-200 group-hover:text-brand-black transition-colors whitespace-nowrap">
                            Intranet & News
                        </span>
                        <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-brand-black opacity-0 group-hover:opacity-100 transition-all -ml-1" />
                    </div>
                </a>

                <a 
                    href="https://blackwood-international.github.io/BlackWood/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative w-full sm:w-auto overflow-hidden rounded-full p-[1px] transition-all duration-300 hover:shadow-[0_0_20px_rgba(197,160,89,0.3)]"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 group-hover:from-brand-gold/50 group-hover:to-brand-gold/20 transition-all duration-500 rounded-full" />
                    <div className="relative bg-black/40 backdrop-blur-xl rounded-full px-6 py-3 flex items-center justify-center gap-3 border border-white/10 group-hover:border-transparent transition-all">
                        <Globe className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-black transition-colors" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-200 group-hover:text-brand-black transition-colors whitespace-nowrap">
                            BlackWood Corp
                        </span>
                         <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-brand-black opacity-0 group-hover:opacity-100 transition-all -ml-1" />
                    </div>
                </a>
            </motion.div>
        </div>
      </div>
    </div>
  );
};
