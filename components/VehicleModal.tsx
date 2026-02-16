import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Vehicle } from '../types';
import { X, MessageCircle, Gauge, Car, ShieldCheck, Heart } from 'lucide-react';
import { Button } from './Button';

interface VehicleModalProps {
  vehicle: Vehicle;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const VehicleModal: React.FC<VehicleModalProps> = ({ vehicle, onClose, isFavorite, onToggleFavorite }) => {
  // Staggered animation variants for content
  const contentVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop with Blur */}
      <motion.div 
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
        animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80"
      />

      {/* Modal Content Wrapper - Sophisticated Entrance */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.95, y: 20, filter: "blur(10px)" }}
        transition={{ type: "spring", stiffness: 200, damping: 25, mass: 0.8 }}
        className="relative w-full max-w-7xl bg-[#0a0a0a] border border-brand-gold/20 rounded-[2.5rem] shadow-[0_20px_100px_-20px_rgba(197,160,89,0.1)] flex flex-col overflow-hidden max-h-[90vh]"
      >
        {/* Actions (Close & Favorite) */}
        <div className="absolute top-4 right-4 z-50 flex gap-2">
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onToggleFavorite}
                className={`p-2 rounded-full transition-colors backdrop-blur-md border ${isFavorite ? 'bg-brand-gold text-brand-black border-brand-gold' : 'bg-black/50 text-white border-white/10 hover:bg-white/10'}`}
            >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
            </motion.button>
            <motion.button 
                whileHover={{ scale: 1.05, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-brand-gold hover:text-black transition-colors backdrop-blur-md border border-white/10"
            >
                <X className="w-6 h-6" />
            </motion.button>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col md:flex-row h-full overflow-y-auto custom-scrollbar p-3 md:p-4 gap-6 md:gap-10">
            
            {/* LEFT: Image Container - 16:9 */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="w-full md:w-[60%] shrink-0 flex flex-col"
            >
                <div className="w-full aspect-video relative bg-[#050505] rounded-[1.5rem] overflow-hidden border border-white/5 shadow-2xl flex items-center justify-center group">
                    {vehicle.image ? (
                        <img 
                            src={vehicle.image} 
                            alt={vehicle.model} 
                            className="w-full h-full object-contain" 
                        />
                    ) : (
                        <div className="flex flex-col items-center opacity-20">
                            <Car className="w-24 h-24 text-brand-gold mb-4" />
                            <span className="text-xs uppercase tracking-widest font-mono">Visuel non disponible</span>
                        </div>
                    )}
                    {/* Subtle vignetting */}
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_50%,#050505_100%)] opacity-40" />
                    
                    {/* Category Tag on Image */}
                    <div className="absolute top-6 left-6">
                        <span className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full">
                            {vehicle.category}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* RIGHT: Info Container - Cascading Text */}
            <motion.div 
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col flex-1 min-h-0 py-2 md:py-4 pr-2 md:pr-4"
            >
                
                <div className="flex-1 flex flex-col">
                    {/* Header: Brand & State */}
                    <motion.div variants={itemVariants} className="flex items-center gap-4 mb-4">
                        <span className="text-brand-gold text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                             <span className="w-6 h-[1px] bg-brand-gold/50"></span>
                             {vehicle.brand}
                        </span>
                        
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                           <Gauge className="w-3 h-3 text-brand-gold" />
                           <span className="text-[9px] text-slate-300 font-bold uppercase tracking-wider">Neuf</span>
                        </div>
                    </motion.div>

                    {/* Title */}
                    <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-2 leading-[0.9] tracking-tight">
                        {vehicle.model}
                    </motion.h2>
                    
                    {/* Decorative Divider */}
                    <motion.div variants={itemVariants} className="w-12 h-1 bg-brand-gold/20 my-6 rounded-full origin-left" />

                    {/* Price & Description */}
                    <motion.div variants={itemVariants} className="space-y-6">
                         <div>
                            <span className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Prix d'acquisition</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl md:text-4xl font-light text-white tracking-tight">{vehicle.price}</span>
                                <span className="text-xs text-slate-500 font-bold uppercase">TTC</span>
                            </div>
                         </div>
                         
                         <p className="text-slate-400 text-sm font-light leading-relaxed border-l-2 border-white/5 pl-4">
                             {vehicle.description}
                         </p>
                    </motion.div>
                </div>

                {/* Footer Action */}
                <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-white/5">
                    <a href="https://discord.gg/88peMJRz95" target="_blank" rel="noopener noreferrer" className="block w-full">
                        <Button className="w-full !py-5 text-sm !tracking-[0.25em]">
                            <div className="flex items-center justify-center gap-3 w-full">
                                <MessageCircle className="w-5 h-5" />
                                <span>Prendre Contact</span>
                            </div>
                        </Button>
                    </a>
                    
                    <div className="flex justify-center mt-5 gap-6 opacity-60">
                         <div className="flex items-center gap-2 text-[9px] text-slate-500 uppercase tracking-widest">
                             <ShieldCheck className="w-3 h-3 text-brand-gold" />
                             <span>Garantie BlackWood</span>
                         </div>
                         <div className="flex items-center gap-2 text-[9px] text-slate-500 uppercase tracking-widest">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
                             <span>Dispo. Immédiate</span>
                         </div>
                    </div>
                </motion.div>
            </motion.div>

        </div>
      </motion.div>
    </div>
  );
};