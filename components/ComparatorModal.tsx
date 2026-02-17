import React from 'react';
import { motion } from 'framer-motion';
import { Vehicle } from '../types';
import { X, Heart, Trash2, Plus, Gauge, Scale as ScaleIcon, AlertCircle } from 'lucide-react';

interface ComparatorModalProps {
  vehicles: Vehicle[];
  onClose: () => void;
  onRemove: (id: string) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

export const ComparatorModal: React.FC<ComparatorModalProps> = ({ 
    vehicles, onClose, onRemove, favorites, toggleFavorite 
}) => {
  
  if (vehicles.length === 0) return null;

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-[#050505]/95 backdrop-blur-xl p-0 md:p-8"
        onClick={onClose} // Click outside closes
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full h-full max-w-[95vw] md:max-w-7xl md:h-[90vh] bg-[#080808] border border-white/5 md:rounded-[2rem] flex flex-col shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent close on modal click
      >
         
         {/* --- HEADER --- */}
         <div className="flex items-center justify-between px-6 py-5 md:px-10 md:py-8 border-b border-white/5 bg-[#0a0a0a] z-20 shrink-0">
             <div>
                 <h2 className="text-2xl md:text-3xl font-serif text-white tracking-tight">
                     Comparatif <span className="text-brand-gold italic">Technique</span>
                 </h2>
                 <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mt-1 font-bold">
                    {vehicles.length} Véhicules sur 3 emplacements
                 </p>
             </div>
             
             <button 
                onClick={onClose} 
                className="group w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 hover:border-brand-gold/50 flex items-center justify-center transition-all hover:bg-white/5 active:scale-95 bg-[#0a0a0a]"
             >
                 <X className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
             </button>
         </div>

         {/* --- CONTENT GRID --- */}
         <div className="flex-1 overflow-hidden bg-[#050505] relative flex flex-col">
             
             {/* Background Grid Pattern */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

             {/* SCROLL CONTAINER (Vertical desktop, Horizontal Mobile Snap) */}
             <div className="
                flex-1 w-full h-full
                overflow-x-auto md:overflow-hidden 
                overflow-y-hidden md:overflow-y-auto 
                flex md:grid md:grid-cols-3 
                divide-x divide-white/5
                snap-x snap-mandatory md:snap-none
             ">
                 
                 {/* SLOTS (1, 2, 3) */}
                 {[0, 1, 2].map((i) => {
                     const v = vehicles[i];
                     
                     if (!v) {
                         // === EMPTY SLOT STATE ===
                         return (
                            <div key={`empty-${i}`} className="min-w-[85vw] md:min-w-0 h-full flex flex-col items-center justify-center p-8 snap-center border-r border-white/5 md:border-r-0 last:border-r-0">
                                <button 
                                    onClick={onClose}
                                    className="group relative flex flex-col items-center justify-center w-full h-full max-h-[400px] border border-dashed border-white/10 rounded-3xl hover:border-brand-gold/50 hover:bg-white/[0.02] transition-all duration-300"
                                >
                                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-brand-gold/20 transition-colors duration-300 shadow-[0_0_30px_-10px_rgba(0,0,0,0.5)]">
                                        <Plus className="w-8 h-8 text-slate-500 group-hover:text-brand-gold transition-colors duration-300" />
                                    </div>
                                    <span className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold group-hover:text-white transition-colors">Ajouter un véhicule</span>
                                    <span className="text-[10px] text-slate-600 mt-2">Depuis le catalogue</span>
                                </button>
                            </div>
                         );
                     }

                     // === FILLED VEHICLE SLOT ===
                     return (
                         <div key={v.id} className="relative flex flex-col h-full min-w-[90vw] md:min-w-0 bg-[#080808]/50 snap-center border-r border-white/5 md:border-r-0 last:border-r-0">
                             
                             {/* IMAGE HEADER */}
                             {/* Fixed: Overflow hidden applied correctly to container */}
                             <div className="relative h-[35%] md:h-[40%] min-h-[220px] shrink-0 w-full overflow-hidden group">
                                 {v.image ? (
                                     <div className="w-full h-full overflow-hidden relative">
                                        <img 
                                            src={v.image} 
                                            alt={v.model} 
                                            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-80" />
                                     </div>
                                 ) : (
                                     <div className="w-full h-full flex items-center justify-center bg-[#0c0c0c] pattern-grid-lg">
                                         <div className="flex flex-col items-center opacity-30">
                                            <ScaleIcon className="w-12 h-12 text-white" />
                                            <span className="text-[9px] uppercase mt-2">No Image</span>
                                         </div>
                                     </div>
                                 )}
                                 
                                 {/* Floating Remove Button - Visible on touch, hover on desktop */}
                                 <button 
                                     onClick={(e) => {
                                         e.stopPropagation();
                                         onRemove(v.id);
                                     }}
                                     className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-slate-400 hover:text-brand-crimsonBright hover:bg-black/80 hover:border-brand-crimsonBright/30 transition-all md:opacity-0 md:group-hover:opacity-100 md:translate-y-[-10px] md:group-hover:translate-y-0 shadow-lg active:scale-90"
                                     title="Retirer du comparateur"
                                 >
                                     <Trash2 className="w-4 h-4" />
                                 </button>

                                 {/* Category Badge */}
                                 <div className="absolute top-4 left-4 z-20">
                                     <span className="px-3 py-1 bg-brand-gold text-black text-[9px] font-bold uppercase tracking-widest rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                                         {v.category}
                                     </span>
                                 </div>
                             </div>

                             {/* SPECS CONTENT */}
                             <div className="flex-1 px-6 md:px-8 pb-8 pt-0 flex flex-col relative z-10 overflow-y-auto custom-scrollbar">
                                 
                                 {/* Title Block - Overlapping Image */}
                                 <div className="mb-6 -mt-10 md:-mt-12 relative z-20">
                                     <div className="flex items-center justify-between mb-2">
                                         <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold bg-black/50 backdrop-blur px-2 py-1 rounded">{v.brand}</span>
                                         <button 
                                            onClick={() => toggleFavorite(v.id)}
                                            className="p-2 rounded-full hover:bg-white/5 transition-colors"
                                         >
                                             <Heart className={`w-5 h-5 transition-colors ${favorites.includes(v.id) ? 'fill-brand-gold text-brand-gold' : 'text-slate-500 hover:text-white'}`} />
                                         </button>
                                     </div>
                                     <h3 className="text-3xl md:text-4xl font-serif text-white mb-4 leading-none drop-shadow-lg">{v.model}</h3>
                                     <div className="w-full h-[1px] bg-white/10" />
                                 </div>

                                 {/* Price Block */}
                                 <div className="mb-6 p-4 bg-white/[0.03] rounded-xl border border-white/5 flex flex-col items-center text-center">
                                     <span className="block text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-1">Prix Catalogue</span>
                                     <span className="text-xl md:text-2xl font-mono text-brand-gold tracking-tight">{v.price}</span>
                                 </div>

                                 {/* Description */}
                                 <div className="flex-1">
                                     <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                                         <Gauge className="w-3.5 h-3.5" />
                                         Détails techniques
                                     </h4>
                                     <p className="text-xs md:text-sm text-slate-300 font-light leading-relaxed border-l-2 border-white/10 pl-4 py-1">
                                         {v.description}
                                     </p>
                                 </div>

                             </div>
                         </div>
                     );
                 })}
             </div>
             
             {/* Mobile Indicator Scroll hint */}
             <div className="md:hidden absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
                 <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                 <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                 <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
             </div>
         </div>
      </motion.div>
    </motion.div>
  );
};
