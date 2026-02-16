import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { ArrowRight, Globe, MessageCircle } from 'lucide-react';

interface HeroProps {
  onEnterCatalog: () => void;
}

// Image unique demandée
const HERO_IMAGE = "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1738&auto=format&fit=crop";

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
        <div className="relative mb-8 md:mb-14 flex flex-col items-center w-full">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="text-4xl sm:text-6xl md:text-8xl lg:text-[9rem] leading-[0.9] font-serif text-white mix-blend-overlay tracking-tight"
          >
            BlackWood
          </motion.h1>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            className="text-[2rem] sm:text-5xl md:text-8xl lg:text-[9rem] leading-[0.9] font-serif text-transparent bg-clip-text bg-gradient-to-b from-brand-gold via-[#F0E6D2] to-brand-gold/40 tracking-tight mt-1 md:mt-[-10px]"
          >
            Royal Motors
          </motion.h1>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
            
            {/* Main Entry Button */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="w-full px-8 sm:px-0 sm:w-auto mb-8 md:mb-12"
            >
               <Button onClick={onEnterCatalog} className="w-full sm:w-auto h-12 md:h-16 px-8 md:px-14 text-xs md:text-sm !tracking-[0.25em] bg-white text-black hover:bg-brand-gold hover:text-black border-none shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                  Entrer
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
               </Button>
            </motion.div>

            {/* Recoded Discrete Links - Pill Style */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-6 sm:px-0"
            >
                {/* Intranet Button */}
                <a 
                    href="https://discord.gg/88peMJRz95" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group w-full sm:w-auto"
                >
                    <div className="relative overflow-hidden rounded-full border border-white/10 bg-black/30 backdrop-blur-md px-6 py-3.5 transition-all duration-300 hover:border-white/30 hover:bg-black/50 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                        {/* Blur Background behind button text */}
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative flex items-center justify-center gap-3">
                            <MessageCircle className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-300 group-hover:text-white transition-colors">
                                Intranet & News
                            </span>
                        </div>
                    </div>
                </a>

                {/* Vertical Divider for Desktop */}
                <div className="hidden sm:block w-[1px] h-8 bg-white/10 mx-2" />

                {/* Corporate Button */}
                <a 
                    href="https://blackwood-international.github.io/BlackWood/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group w-full sm:w-auto"
                >
                    <div className="relative overflow-hidden rounded-full border border-white/10 bg-black/30 backdrop-blur-md px-6 py-3.5 transition-all duration-300 hover:border-white/30 hover:bg-black/50 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                         {/* Blur Background behind button text */}
                         <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative flex items-center justify-center gap-3">
                            <Globe className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-300 group-hover:text-white transition-colors">
                                BlackWood Corp
                            </span>
                        </div>
                    </div>
                </a>
            </motion.div>
        </div>
      </div>
    </div>
  );
};
