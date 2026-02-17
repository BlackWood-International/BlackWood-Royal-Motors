import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, X, ArrowRight } from 'lucide-react';

interface CompareBarProps {
  count: number;
  onOpenComparator: () => void;
  onClear: () => void;
}

export const CompareBar: React.FC<CompareBarProps> = ({ count, onOpenComparator, onClear }) => {
  return (
    <>
      <style>{`
        @keyframes sheen-fast {
          0% { transform: translateX(-150%) skewX(12deg); }
          20% { transform: translateX(150%) skewX(12deg); }
          100% { transform: translateX(150%) skewX(12deg); }
        }
        .animate-sheen-fast {
          animation: sheen-fast 3s infinite;
        }
      `}</style>
      <AnimatePresence>
        {count > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0, x: "-50%", scale: 0.9 }}
            animate={{ y: 0, opacity: 1, x: "-50%", scale: 1 }}
            exit={{ y: 100, opacity: 0, x: "-50%", scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="fixed bottom-6 md:bottom-10 left-1/2 z-[90] w-fit max-w-[95vw]"
          >
            {/* Glass Pill Container */}
            <div className="relative group rounded-full p-[1px] bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]">
              <div className="flex items-center gap-3 md:gap-4 py-2 pl-3 pr-2 md:py-3 md:px-5 bg-[#080808]/90 backdrop-blur-2xl rounded-full border border-white/10 relative overflow-hidden">
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-sheen-fast pointer-events-none" />

                  {/* Counter */}
                  <div className="flex items-center gap-3 pl-2">
                     <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-brand-gold/10 border border-brand-gold/30 shrink-0">
                       <Scale className="w-4 h-4 text-brand-gold" />
                     </div>
                     <div className="flex flex-col min-w-[60px]">
                         <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Comparateur</span>
                         <span className="text-xs font-bold text-white leading-none">
                             <span className="text-brand-gold">{count}</span>
                             <span className="text-slate-600 mx-1">/</span>
                             3
                         </span>
                     </div>
                  </div>

                  <div className="w-[1px] h-8 bg-white/10 mx-1 hidden xs:block" />

                  {/* Main Action */}
                  <button 
                      onClick={onOpenComparator}
                      className="group/btn relative px-4 md:px-6 py-2.5 rounded-full bg-brand-gold text-black text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-white transition-all duration-300 flex items-center gap-2 overflow-hidden shadow-lg shadow-brand-gold/20 active:scale-95"
                  >
                      <span className="relative z-10 hidden xs:inline">Comparer</span>
                      <span className="relative z-10 xs:hidden">Voir</span>
                      <ArrowRight className="w-3.5 h-3.5 relative z-10 transition-transform group-hover/btn:translate-x-1" />
                      {/* Hover internal glow */}
                      <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity" />
                  </button>
                  
                  {/* Close/Clear */}
                  <button 
                      onClick={onClear}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-brand-crimsonBright hover:bg-brand-crimsonBright/10 transition-colors ml-1 active:scale-90"
                      title="Vider la sélection"
                  >
                      <X className="w-4 h-4" />
                  </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
