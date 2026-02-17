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
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] w-auto max-w-[90vw]"
        >
          <div className="flex items-center gap-3 p-2 pr-3 bg-[#0a0a0a]/90 backdrop-blur-xl border border-brand-gold/30 rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]">
            
            <div className="flex items-center gap-3 pl-4">
               <div className="relative">
                 <Scale className="w-5 h-5 text-brand-gold" />
                 <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-gold text-black text-[8px] font-bold flex items-center justify-center rounded-full">
                    {count}
                 </span>
               </div>
               <span className="text-[10px] font-bold uppercase tracking-widest text-white hidden sm:inline">
                  Véhicules sélectionnés
               </span>
            </div>

            <div className="h-6 w-[1px] bg-white/10 mx-1" />

            <div className="flex items-center gap-2">
                <button 
                    onClick={onOpenComparator}
                    className="px-4 py-2 rounded-full bg-brand-gold text-black text-[9px] font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2"
                >
                    Comparer
                    <ArrowRight className="w-3 h-3" />
                </button>
                
                <button 
                    onClick={onClear}
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
