
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Vehicle } from '../types';
import { X, MessageCircle, Heart, Sparkles, BadgeCheck, ArrowLeft, Crown, Info } from 'lucide-react';
import { Button } from './Button';

interface VehicleModalProps {
  vehicle: Vehicle;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenVIP?: () => void;
}

export const VehicleModal: React.FC<VehicleModalProps> = ({ vehicle, onClose, isFavorite, onToggleFavorite, onOpenVIP }) => {
  const hasBadge = !!vehicle.badge && vehicle.badge.length > 0;
  const isVip = vehicle.vip;

  const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const modalVariants: Variants = {
    hidden: { opacity: 0, y: "100%" },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", damping: 30, stiffness: 300, mass: 0.8 }
    },
    exit: { opacity: 0, y: "100%", transition: { duration: 0.2 } }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center sm:p-6 md:p-10">
      
      {/* Backdrop */}
      <motion.div 
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />

      {/* --- MODAL CONTAINER --- */}
      <motion.div 
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="
            relative w-full h-[100dvh] md:h-auto md:max-h-[85vh] md:max-w-[90rem] 
            bg-[#050505] 
            md:rounded-[3.5rem] border border-white/10 shadow-2xl 
            flex flex-col md:flex-row overflow-hidden
        "
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* --- MOBILE TOP BAR (Navigation) --- */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-50 md:hidden bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
            <button 
                onClick={onClose} 
                className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10 pointer-events-auto active:scale-95 transition-transform"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>
            
            <button 
                onClick={onToggleFavorite}
                className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border pointer-events-auto transition-colors active:scale-95 ${isFavorite ? 'bg-brand-gold border-brand-gold text-black' : 'bg-black/40 border-white/10 text-white'}`}
            >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-black' : ''}`} />
            </button>
        </div>

        {/* --- DESKTOP FLOATING ACTIONS --- */}
        <div className="absolute top-8 right-8 z-50 hidden md:flex items-center gap-3">
             <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onToggleFavorite}
                className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 ${
                    isFavorite 
                    ? 'bg-brand-gold border-brand-gold text-black shadow-[0_0_20px_rgba(197,160,89,0.4)]' 
                    : 'bg-black/40 border-white/10 text-white hover:bg-white/10'
                }`}
            >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-black' : ''}`} />
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-brand-gold hover:text-black transition-colors shadow-lg"
            >
                <X className="w-6 h-6" />
            </motion.button>
        </div>

        {/* --- PARTIE GAUCHE (Image) --- */}
        {/* Mobile: Top 35% height (reduced to show more content). Desktop: 60% Width */}
        <div className="relative w-full h-[35dvh] md:h-auto md:w-[60%] shrink-0 bg-[#080808]">
            {vehicle.image ? (
                <img 
                    src={vehicle.image} 
                    alt={vehicle.model} 
                    className="w-full h-full object-cover" 
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-brand-charcoal pattern-grid-lg">
                    <span className="text-white/20 text-xs uppercase tracking-widest">Image Indisponible</span>
                </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-100 md:opacity-0" />
            
            {hasBadge && (
                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-30">
                    <div className="flex items-center gap-2 bg-brand-gold/90 backdrop-blur-xl px-4 py-2 rounded-full shadow-lg">
                        <Sparkles className="w-3.5 h-3.5 text-black" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">{vehicle.badge}</span>
                    </div>
                </div>
            )}

            {isVip && (
                <div className="absolute top-6 left-6 md:top-10 md:left-10 z-30">
                     <div className="flex items-center gap-2 bg-black/80 backdrop-blur-xl border border-brand-gold/50 px-5 py-2.5 rounded-full shadow-[0_0_30px_rgba(197,160,89,0.3)]">
                        <Crown className="w-4 h-4 text-brand-gold fill-brand-gold animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">VIP Collection</span>
                    </div>
                </div>
            )}
        </div>

        {/* --- PARTIE DROITE (Content) --- */}
        <div className="flex-1 flex flex-col bg-[#050505] border-l border-white/5 h-[65dvh] md:h-full overflow-hidden">
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 pb-24 md:pb-10">
                <div className="flex flex-wrap items-center gap-3 mb-4 md:mb-6">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-gold border border-brand-gold/20 bg-brand-gold/5 px-2 py-1 rounded">
                        {vehicle.brand}
                    </span>
                    <span className="text-[9px] font-medium uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        <div className="w-1 h-1 bg-slate-500 rounded-full" />
                        {vehicle.category}
                    </span>
                    {isVip && (
                         <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black bg-brand-gold px-2 py-1 rounded flex items-center gap-1">
                            <Crown className="w-3 h-3 fill-black" />
                            VIP
                        </span>
                    )}
                </div>

                <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-white leading-[0.9] tracking-tight mb-6 md:mb-8">
                    {vehicle.model}
                </h2>

                <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">Prix Catalogue</span>
                    <div className="flex items-center justify-between">
                        <span className="text-2xl md:text-3xl font-mono text-brand-gold font-light tracking-tight">{vehicle.price}</span>
                        
                        {isVip && (
                             <div className="flex items-center gap-2 text-brand-gold/80 border border-brand-gold/30 px-3 py-1 rounded-full bg-brand-gold/5">
                                 <Crown className="w-4 h-4" />
                                 <span className="text-[9px] font-bold uppercase tracking-widest">Abonnement Requis</span>
                             </div>
                        )}
                    </div>
                </div>

                <div className="prose prose-invert">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-3 flex items-center gap-2">
                        <BadgeCheck className="w-4 h-4 text-brand-gold" />
                        Fiche Véhicule
                    </h3>
                    <p className="text-sm text-slate-400 font-light leading-relaxed pl-4 border-l-2 border-white/10">
                        {vehicle.description}
                    </p>
                </div>

                {isVip && (
                    <div className="mt-8 p-4 bg-gradient-to-r from-brand-gold/10 to-transparent border-l-2 border-brand-gold rounded-r-xl">
                        <div className="flex justify-between items-start mb-2">
                             <h4 className="text-brand-gold font-serif text-lg flex items-center gap-2">
                                 <Crown className="w-4 h-4 fill-brand-gold" />
                                 Réservé aux Membres VIP
                            </h4>
                            {onOpenVIP && (
                                <button onClick={onOpenVIP} className="text-[9px] uppercase tracking-widest font-bold text-white hover:text-brand-gold flex items-center gap-1 transition-colors border-b border-white/20 pb-0.5 hover:border-brand-gold">
                                    <Info className="w-3 h-3" />
                                    Infos Avantages
                                </button>
                            )}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Ce véhicule fait partie de la collection exclusive Royal Elite. Son acquisition est strictement réservée aux détenteurs de l'abonnement VIP BlackWood actif.
                        </p>
                    </div>
                )}
            </div>

            {/* STICKY FOOTER ACTION */}
            <div className="p-4 md:p-8 border-t border-white/5 bg-[#080808] z-20 md:relative absolute bottom-0 w-full safe-pb">
                <a href="https://discord.gg/88peMJRz95" target="_blank" rel="noopener noreferrer" className="block w-full">
                    <Button className={`w-full !py-4 md:!py-5 !text-xs !tracking-[0.25em] rounded-full shadow-lg active:scale-95 ${isVip ? 'bg-gradient-to-r from-brand-gold via-[#e8c683] to-brand-gold text-black hover:brightness-110' : 'bg-white hover:bg-brand-gold text-brand-black'}`}>
                        {isVip ? <Crown className="w-4 h-4 mr-2 fill-black" /> : <MessageCircle className="w-4 h-4 mr-2" />}
                        {isVip ? "Contacter (Accès VIP)" : "Contacter Un Vendeur"}
                    </Button>
                </a>
            </div>

        </div>
      </motion.div>
    </div>
  );
};
