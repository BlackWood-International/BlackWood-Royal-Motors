import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Vehicle } from '../types';
import { X, MessageCircle, Gauge, Car, ShieldCheck, Heart, Sparkles, Fuel, Wind, Users, Briefcase } from 'lucide-react';
import { Button } from './Button';

interface VehicleModalProps {
  vehicle: Vehicle;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const VehicleModal: React.FC<VehicleModalProps> = ({ vehicle, onClose, isFavorite, onToggleFavorite }) => {
  const hasBadge = !!vehicle.badge && vehicle.badge.length > 0;

  // --- FAUSSES SPECS VISUELLES BASÉES SUR CATÉGORIE (Pour le look) ---
  const specs = useMemo(() => {
    const cat = vehicle.category.toUpperCase();
    let speed = "200 km/h";
    let acc = "4.5s";
    let seats = "2";
    let trunk = "25kg";

    if (['SUPER', 'SPORTS'].includes(cat)) { speed = "320 km/h"; acc = "3.2s"; seats = "2"; trunk = "10kg"; }
    else if (['SUVS', 'OFF-ROAD'].includes(cat)) { speed = "240 km/h"; acc = "5.5s"; seats = "4"; trunk = "80kg"; }
    else if (['SEDANS', 'COMPACTS'].includes(cat)) { speed = "220 km/h"; acc = "6.0s"; seats = "4"; trunk = "50kg"; }
    else if (['MOTORCYCLES', 'BIKES'].includes(cat)) { speed = "280 km/h"; acc = "2.9s"; seats = "1"; trunk = "5kg"; }
    else if (['VANS', 'COMMERCIAL'].includes(cat)) { speed = "180 km/h"; acc = "8.0s"; seats = "2"; trunk = "500kg"; }

    return [
      { icon: <Wind className="w-4 h-4" />, label: "Vitesse Max", value: speed },
      { icon: <Gauge className="w-4 h-4" />, label: "0-100 km/h", value: acc },
      { icon: <Users className="w-4 h-4" />, label: "Places", value: seats },
      { icon: <Briefcase className="w-4 h-4" />, label: "Coffre", value: trunk },
    ];
  }, [vehicle.category]);


  return (
    <div className="fixed inset-0 z-[120] flex items-end md:items-center justify-center sm:p-4">
      
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xl"
      />

      {/* Modal Container */}
      <motion.div 
        layoutId={`card-container-${vehicle.id}`}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`
            relative w-full max-w-6xl h-[95vh] md:h-[85vh] 
            bg-[#080808] 
            rounded-t-[2.5rem] md:rounded-[2.5rem] 
            overflow-hidden 
            flex flex-col md:flex-row
            border border-white/10
            shadow-2xl
            ${hasBadge ? 'shadow-brand-gold/10 border-brand-gold/30' : ''}
        `}
      >
        {/* --- HEADER MOBILE STICKY (Close Button) --- */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-50 pointer-events-none">
             {/* Brand Tag */}
             <div className="pointer-events-auto bg-black/40 backdrop-blur-md border border-white/5 rounded-full px-4 py-2 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-pulse" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-white">{vehicle.brand}</span>
             </div>

             {/* Actions */}
             <div className="pointer-events-auto flex gap-2">
                 <button 
                    onClick={onToggleFavorite}
                    className={`p-3 rounded-full backdrop-blur-md border transition-all active:scale-95 ${isFavorite ? 'bg-brand-gold border-brand-gold text-black' : 'bg-black/40 border-white/10 text-white hover:bg-white/10'}`}
                 >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-black' : ''}`} />
                 </button>
                 <button 
                    onClick={onClose}
                    className="p-3 rounded-full bg-white text-black hover:bg-brand-gold transition-colors active:scale-95 shadow-lg"
                 >
                    <X className="w-5 h-5" />
                 </button>
             </div>
        </div>

        {/* --- LEFT: IMMERSIVE IMAGE (Top on Mobile) --- */}
        <div className="relative w-full md:w-[55%] h-[40vh] md:h-full bg-[#050505] shrink-0">
            {vehicle.image ? (
                <motion.img 
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    src={vehicle.image} 
                    alt={vehicle.model} 
                    className="w-full h-full object-cover md:object-contain p-0 md:p-8"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center opacity-20">
                    <Car className="w-24 h-24 text-white" />
                </div>
            )}
            
            {/* Gradients pour fusionner l'image */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#080808]" />
            
            {/* Badge Overlay */}
            {hasBadge && (
                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20">
                     <div className="inline-flex items-center gap-2 bg-brand-gold/90 text-black backdrop-blur-xl px-4 py-2 rounded-full shadow-[0_0_30px_rgba(197,160,89,0.4)]">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{vehicle.badge}</span>
                     </div>
                </div>
            )}
        </div>

        {/* --- RIGHT: CONTENT SCROLLABLE --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-[#080808]">
            <div className="p-6 md:p-10 pb-24 md:pb-10 flex flex-col gap-8">
                
                {/* 1. TITLE & PRICE */}
                <div className="mt-2 md:mt-12">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-3 mb-4"
                    >
                        <span className="text-xs font-bold text-brand-gold uppercase tracking-widest border border-brand-gold/30 px-3 py-1 rounded-full">
                            {vehicle.category}
                        </span>
                        <div className="h-[1px] flex-1 bg-white/10" />
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl md:text-6xl font-serif text-white leading-[0.9] mb-4"
                    >
                        {vehicle.model}
                    </motion.h1>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col"
                    >
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Prix Catalogue</span>
                        <div className="flex items-baseline gap-2">
                             <span className="text-3xl md:text-4xl font-mono text-brand-gold font-light tracking-tight">{vehicle.price}</span>
                             <span className="text-xs text-slate-500 font-bold">TTC</span>
                        </div>
                    </motion.div>
                </div>

                {/* 2. SPECS GRID (Visual Flair) */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-2 gap-3"
                >
                    {specs.map((spec, i) => (
                        <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-2 hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-2 text-slate-400">
                                {spec.icon}
                                <span className="text-[10px] uppercase tracking-wider font-bold">{spec.label}</span>
                            </div>
                            <span className="text-lg text-white font-mono">{spec.value}</span>
                        </div>
                    ))}
                </motion.div>

                {/* 3. DESCRIPTION */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="prose prose-invert"
                >
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-2 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-brand-gold" />
                        Description & Notes
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed font-light">
                        {vehicle.description}
                    </p>
                </motion.div>

                {/* 4. FOOTER ACTION (Sticky Bottom on Mobile) */}
                <div className="md:mt-auto pt-8">
                    <a href="https://discord.gg/88peMJRz95" target="_blank" rel="noopener noreferrer">
                        <Button className="w-full !py-6 text-sm !tracking-[0.2em] bg-white text-black hover:bg-brand-gold">
                            <div className="flex items-center gap-3">
                                <MessageCircle className="w-5 h-5" />
                                Contacter un Vendeur
                            </div>
                        </Button>
                    </a>
                    <div className="mt-4 text-center">
                        <span className="text-[9px] text-slate-600 uppercase tracking-widest">
                            Véhicule certifié BlackWood Royal Motors
                        </span>
                    </div>
                </div>

            </div>
        </div>

      </motion.div>
    </div>
  );
};
