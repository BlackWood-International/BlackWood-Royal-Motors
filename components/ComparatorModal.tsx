import React from 'react';
import { motion } from 'framer-motion';
import { Vehicle } from '../types';
import { X, Heart, Scale, Trash2 } from 'lucide-react';

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
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-lg p-4 md:p-10">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-7xl h-full max-h-[90vh] bg-[#050505] border border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-2xl"
      >
         {/* HEADER */}
         <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#080808]">
             <div className="flex items-center gap-3">
                 <Scale className="w-5 h-5 text-brand-gold" />
                 <h2 className="text-xl font-serif text-white">Comparateur</h2>
                 <span className="text-xs text-slate-500 font-mono">({vehicles.length}/3)</span>
             </div>
             <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
                 <X className="w-5 h-5" />
             </button>
         </div>

         {/* CONTENT - HORIZONTAL SCROLL ON MOBILE */}
         <div className="flex-1 overflow-x-auto custom-scrollbar bg-[#050505]">
             <div className="min-w-max md:min-w-0 md:w-full h-full flex">
                 
                 {/* LABELS COLUMN (Sticky on mobile?) - Keep simple for now */}
                 <div className="hidden md:flex flex-col w-48 border-r border-white/5 bg-[#080808]/50 shrink-0">
                     <div className="h-48 md:h-64 border-b border-white/5" /> {/* Image spacer */}
                     <div className="p-4 h-16 border-b border-white/5 flex items-center text-xs font-bold uppercase tracking-widest text-slate-500">Modèle</div>
                     <div className="p-4 h-16 border-b border-white/5 flex items-center text-xs font-bold uppercase tracking-widest text-slate-500">Marque</div>
                     <div className="p-4 h-16 border-b border-white/5 flex items-center text-xs font-bold uppercase tracking-widest text-slate-500">Catégorie</div>
                     <div className="p-4 h-16 border-b border-white/5 flex items-center text-xs font-bold uppercase tracking-widest text-slate-500">Prix</div>
                     <div className="p-4 flex-1 flex items-start text-xs font-bold uppercase tracking-widest text-slate-500 pt-8">Description</div>
                 </div>

                 {/* VEHICLE COLUMNS */}
                 {vehicles.map((v) => (
                     <div key={v.id} className="w-[85vw] md:flex-1 min-w-[300px] border-r border-white/5 flex flex-col relative group">
                         
                         {/* REMOVE BUTTON */}
                         <button 
                             onClick={() => onRemove(v.id)}
                             className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-slate-400 hover:text-brand-crimsonBright hover:bg-black/80 transition-colors"
                         >
                             <Trash2 className="w-4 h-4" />
                         </button>

                         {/* IMAGE */}
                         <div className="h-48 md:h-64 relative border-b border-white/5 bg-[#080808]">
                             {v.image ? (
                                 <img src={v.image} alt={v.model} className="w-full h-full object-cover" />
                             ) : (
                                 <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs uppercase tracking-widest">No Image</div>
                             )}
                             <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-60" />
                             
                             {/* Actions overlay */}
                             <div className="absolute bottom-4 left-4 z-20">
                                 <button 
                                     onClick={() => toggleFavorite(v.id)}
                                     className={`p-2 rounded-full border backdrop-blur-md ${favorites.includes(v.id) ? 'bg-brand-gold border-brand-gold text-black' : 'bg-black/40 border-white/10 text-white'}`}
                                 >
                                     <Heart className={`w-4 h-4 ${favorites.includes(v.id) ? 'fill-black' : ''}`} />
                                 </button>
                             </div>
                         </div>

                         {/* DATA CELLS */}
                         <div className="p-4 h-16 border-b border-white/5 flex items-center justify-between md:justify-start">
                             <span className="md:hidden text-[9px] font-bold text-slate-500 uppercase">Modèle</span>
                             <span className="text-lg font-serif text-white truncate">{v.model}</span>
                         </div>
                         <div className="p-4 h-16 border-b border-white/5 flex items-center justify-between md:justify-start">
                             <span className="md:hidden text-[9px] font-bold text-slate-500 uppercase">Marque</span>
                             <span className="text-sm font-bold uppercase tracking-widest text-brand-gold">{v.brand}</span>
                         </div>
                         <div className="p-4 h-16 border-b border-white/5 flex items-center justify-between md:justify-start">
                             <span className="md:hidden text-[9px] font-bold text-slate-500 uppercase">Catégorie</span>
                             <span className="text-xs font-mono text-slate-300 bg-white/5 px-2 py-1 rounded">{v.category}</span>
                         </div>
                         <div className="p-4 h-16 border-b border-white/5 flex items-center justify-between md:justify-start">
                             <span className="md:hidden text-[9px] font-bold text-slate-500 uppercase">Prix</span>
                             <span className="text-lg font-mono text-white">{v.price}</span>
                         </div>
                         <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                             <span className="md:hidden block text-[9px] font-bold text-slate-500 uppercase mb-2">Description</span>
                             <p className="text-sm text-slate-400 font-light leading-relaxed">
                                 {v.description}
                             </p>
                         </div>
                     </div>
                 ))}

                 {/* EMPTY SLOTS (Desktop Only) */}
                 {Array.from({ length: 3 - vehicles.length }).map((_, i) => (
                     <div key={`empty-${i}`} className="hidden md:flex flex-1 border-r border-white/5 flex-col items-center justify-center text-slate-600 bg-[#060606]">
                         <Scale className="w-12 h-12 mb-4 opacity-20" />
                         <span className="text-xs uppercase tracking-widest opacity-40">Emplacement Libre</span>
                     </div>
                 ))}

             </div>
         </div>
      </motion.div>
    </div>
  );
};
