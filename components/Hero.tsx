
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { ArrowRight, Star, ShieldCheck, Globe } from 'lucide-react';

interface HeroProps {
  onEnterCatalog: () => void;
}

// Image unique demandée
const HERO_IMAGE = "https://images.unsplash.com/photo-1716231888723-35edaa8c7714?q=80&w=1740&auto=format&fit=crop";

export const Hero: React.FC<HeroProps> = ({ onEnterCatalog }) => {
  return (
    <div className="relative h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden bg-black selection:bg-brand-gold selection:text-black">
      
      {/* BACKGROUND IMAGE (UNIQUE) */}
      <div className="absolute inset-0 z-0">
         <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0"
         >
             <img 
                src={HERO_IMAGE} 
                alt="BlackWood Premium Background" 
                className="w-full h-full object-cover opacity-60 md:opacity-50"
             />
             {/* Gradient Overlays for Readability */}
             <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/90" />
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_150%)]" />
         </motion.div>
        
        {/* Animated Grain/Noise */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none" />
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-20 w-full max-w-[1800px] mx-auto px-4 sm:px-6 flex flex-col items-center justify-center h-full text-center pb-12 sm:pb-0">
        
        {/* LOGO - Responsive sizing */}
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="mb-4 sm:mb-6 md:mb-10"
        >
            <img 
                src="https://i.imgur.com/5QiFb0Y.png" 
                alt="BlackWood Logo" 
                className="h-14 sm:h-20 md:h-32 w-auto object-contain drop-shadow-[0_0_30px_rgba(197,160,89,0.25)]"
            />
        </motion.div>

        {/* Top Tag */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-4 md:mb-6 flex items-center justify-center gap-3 sm:gap-4"
        >
            <div className="h-[1px] w-6 md:w-16 bg-gradient-to-r from-transparent to-brand-gold" />
            <span className="text-brand-gold text-[10px] sm:text-xs font-bold tracking-[0.3em] sm:tracking-[0.4em] uppercase whitespace-nowrap px-2">
              Excellence in Motion
            </span>
            <div className="h-[1px] w-6 md:w-16 bg-gradient-to-l from-transparent to-brand-gold" />
        </motion.div>

        {/* Massive Typography - Optimized for Mobile */}
        <div className="relative mb-8 md:mb-14 flex flex-col items-center w-full px-2">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="text-4xl xs:text-5xl sm:text-6xl md:text-8xl lg:text-[9rem] leading-[0.95] md:leading-[0.9] font-serif text-white mix-blend-overlay tracking-tight"
          >
            BlackWood
          </motion.h1>
          {/* Increased padding-bottom to ensure 'y' descender is fully visible */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            className="text-[2rem] xs:text-[2.5rem] sm:text-5xl md:text-8xl lg:text-[9rem] leading-[1] md:leading-[0.9] pb-8 md:pb-10 font-serif text-transparent bg-clip-text bg-gradient-to-b from-brand-gold via-[#F0E6D2] to-brand-gold/40 tracking-tight mt-1 md:mt-[-10px] break-words"
          >
            Royal Motors
          </motion.h1>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
            
            {/* Main Entry Button */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="w-full px-8 sm:px-0 sm:w-auto mb-16 md:mb-24"
            >
               <Button onClick={onEnterCatalog} className="w-full sm:w-auto h-14 md:h-16 px-8 md:px-14 text-xs md:text-sm !tracking-[0.25em] bg-white text-black hover:bg-brand-gold hover:text-black border-none shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] active:scale-95">
                  Entrer
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
               </Button>
            </motion.div>

            {/* PRESTIGE INDICATORS (Replaces old buttons) */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 w-full px-6"
            >
                {/* Feature 1 */}
                <div className="flex flex-col items-center gap-2 group cursor-default">
                    <div className="p-2.5 rounded-full bg-white/5 border border-white/5 text-brand-gold group-hover:bg-brand-gold group-hover:text-black transition-colors duration-500 shadow-lg">
                        <Star className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-500 group-hover:text-brand-gold transition-colors duration-300">
                        Collection Exclusive
                    </span>
                </div>

                {/* Divider (Desktop Only) */}
                <div className="hidden md:block w-px h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                {/* Feature 2 */}
                <div className="flex flex-col items-center gap-2 group cursor-default">
                    <div className="p-2.5 rounded-full bg-white/5 border border-white/5 text-brand-gold group-hover:bg-brand-gold group-hover:text-black transition-colors duration-500 shadow-lg">
                        <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-500 group-hover:text-brand-gold transition-colors duration-300">
                        Qualité Certifiée
                    </span>
                </div>

                {/* Divider (Desktop Only) */}
                <div className="hidden md:block w-px h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                {/* Feature 3 */}
                <div className="flex flex-col items-center gap-2 group cursor-default">
                    <div className="p-2.5 rounded-full bg-white/5 border border-white/5 text-brand-gold group-hover:bg-brand-gold group-hover:text-black transition-colors duration-500 shadow-lg">
                        <Globe className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-500 group-hover:text-brand-gold transition-colors duration-300">
                        Service International
                    </span>
                </div>
            </motion.div>
        </div>
      </div>
    </div>
  );
};
