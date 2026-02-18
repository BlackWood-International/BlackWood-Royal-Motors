
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShieldCheck, Globe, Crown, ChevronRight } from 'lucide-react';

interface HeroProps {
  onEnterCatalog: () => void;
  onEnterVIP?: () => void;
}

// Image unique demandée
const HERO_IMAGE = "https://images.unsplash.com/photo-1716231888723-35edaa8c7714?q=80&w=1740&auto=format&fit=crop";

export const Hero: React.FC<HeroProps> = ({ onEnterCatalog, onEnterVIP }) => {
  return (
    <div className="relative h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden bg-black selection:bg-brand-gold selection:text-black">
      
      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
         <motion.div
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0"
         >
             <img 
                src={HERO_IMAGE} 
                alt="BlackWood Premium Background" 
                className="w-full h-full object-cover opacity-60 md:opacity-50"
             />
             {/* Gradient Overlays for Readability & Mood */}
             <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/90 via-transparent to-[#050505]/90" />
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_120%)]" />
         </motion.div>
        
        {/* Cinematic Grain/Noise Texture */}
        <div className="absolute inset-0 opacity-[0.06] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay" />
      </div>

      {/* --- MAIN CONTENT LAYER --- */}
      <div className="relative z-20 w-full max-w-[1800px] mx-auto px-4 sm:px-6 flex flex-col items-center justify-between h-full py-12 md:py-16">
        
        {/* 1. TOP SPACER (Pour centrer le contenu principal) */}
        <div className="flex-1" />

        {/* 2. CENTRAL CONTENT */}
        <div className="flex flex-col items-center w-full max-w-5xl">
            
            {/* Logo Animated */}
            <motion.div
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 1, ease: "easeOut" }}
               className="mb-6 md:mb-8 relative"
            >
                <div className="absolute inset-0 bg-brand-gold/20 blur-[50px] rounded-full opacity-20" />
                <img 
                    src="https://i.imgur.com/5QiFb0Y.png" 
                    alt="BlackWood Logo" 
                    className="relative h-16 sm:h-24 md:h-32 w-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                />
            </motion.div>

            {/* Badge "Excellence" */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-6 md:mb-10 flex items-center justify-center gap-3 md:gap-4"
            >
                <div className="h-[1px] w-8 md:w-20 bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
                <span className="text-brand-gold/90 text-[10px] sm:text-xs font-bold tracking-[0.4em] uppercase whitespace-nowrap px-2 drop-shadow-sm">
                  Excellence in Motion
                </span>
                <div className="h-[1px] w-8 md:w-20 bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
            </motion.div>

            {/* Main Typography */}
            <div className="relative mb-12 md:mb-16 flex flex-col items-center w-full px-2 text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                className="text-[2.5rem] xs:text-[3rem] sm:text-6xl md:text-8xl lg:text-[7.5rem] leading-[0.95] font-serif text-white tracking-tight drop-shadow-2xl"
              >
                BlackWood
              </motion.h1>
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                // AJUSTEMENT: pb-6 au lieu de pb-2 pour éviter de couper le 'y' et les italiques
                className="text-[2rem] xs:text-[2.5rem] sm:text-5xl md:text-8xl lg:text-[7.5rem] leading-[1.1] md:leading-[0.9] font-serif italic text-transparent bg-clip-text bg-gradient-to-b from-[#C5A059] via-[#E5C585] to-[#8A703E] tracking-tight pb-6"
              >
                Royal Motors
              </motion.h1>
            </div>

            {/* ACTION BUTTONS */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="w-full flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center px-6"
            >
               {/* Primary CTA - CATALOGUE */}
               <button 
                  onClick={onEnterCatalog}
                  className="group relative w-full sm:w-auto min-w-[200px] h-14 md:h-16 bg-white text-black rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)] active:scale-95"
               >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200/50 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out z-0" />
                  <div className="relative z-10 flex items-center justify-center gap-3 h-full px-8 md:px-12">
                      <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.25em]">Accéder au Catalogue</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
               </button>

               {/* Secondary CTA - VIP (Glassmorphism) */}
               {onEnterVIP && (
                   <button 
                      onClick={onEnterVIP}
                      // FIX BLUR: Ajout de will-change-transform et backface-visibility pour forcer le rendu GPU du flou
                      style={{ 
                        WebkitBackfaceVisibility: 'hidden', 
                        backfaceVisibility: 'hidden',
                        willChange: 'transform'
                      }}
                      className="group relative w-full sm:w-auto min-w-[200px] h-14 md:h-16 rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-95 border border-white/10 hover:border-brand-gold/50 bg-white/5 backdrop-blur-xl hover:bg-white/10 shadow-lg transform-gpu"
                   >
                      <div className="relative z-10 flex items-center justify-center gap-3 h-full px-8 md:px-12 text-slate-200 group-hover:text-brand-gold transition-colors">
                          <Crown className="w-4 h-4" />
                          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em]">Espace VIP</span>
                      </div>
                   </button>
               )}
            </motion.div>
        </div>

        {/* 3. FOOTER FEATURES (Compact Mobile) */}
        <div className="flex-1 flex items-end w-full">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="w-full flex flex-row items-center justify-center gap-4 md:gap-16 pb-4 md:pb-8"
            >
                {/* Feature 1 */}
                <div className="flex flex-col md:flex-row items-center gap-2 group cursor-default">
                    {/* CENTRAGE FIX: Utilisation de Flex + Dimensions fixes (w-8/w-10) au lieu de padding simple */}
                    <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-brand-gold/60 group-hover:text-brand-gold group-hover:bg-brand-gold/10 group-hover:border-brand-gold/30 transition-all duration-500 backdrop-blur-md">
                        <Star className="w-3 h-3 md:w-4 md:h-4" />
                    </div>
                    <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-[0.25em] text-slate-500 group-hover:text-slate-300 transition-colors text-center">
                        Collection<br className="md:hidden" /> Exclusive
                    </span>
                </div>

                {/* Divider (Desktop Only) */}
                <div className="hidden md:block w-px h-8 bg-white/10" />

                {/* Feature 2 */}
                <div className="flex flex-col md:flex-row items-center gap-2 group cursor-default">
                    <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-brand-gold/60 group-hover:text-brand-gold group-hover:bg-brand-gold/10 group-hover:border-brand-gold/30 transition-all duration-500 backdrop-blur-md">
                        <ShieldCheck className="w-3 h-3 md:w-4 md:h-4" />
                    </div>
                    <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-[0.25em] text-slate-500 group-hover:text-slate-300 transition-colors text-center">
                        Qualité<br className="md:hidden" /> Certifiée
                    </span>
                </div>

                {/* Divider (Desktop Only) */}
                <div className="hidden md:block w-px h-8 bg-white/10" />

                {/* Feature 3 */}
                <div className="flex flex-col md:flex-row items-center gap-2 group cursor-default">
                    <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-brand-gold/60 group-hover:text-brand-gold group-hover:bg-brand-gold/10 group-hover:border-brand-gold/30 transition-all duration-500 backdrop-blur-md">
                        <Globe className="w-3 h-3 md:w-4 md:h-4" />
                    </div>
                    <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-[0.25em] text-slate-500 group-hover:text-slate-300 transition-colors text-center">
                        Service<br className="md:hidden" /> International
                    </span>
                </div>
            </motion.div>
        </div>

      </div>
    </div>
  );
};
