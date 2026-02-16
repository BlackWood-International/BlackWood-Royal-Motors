import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Vehicle } from '../types';
import { X, MessageCircle, Heart, Sparkles, Share2 } from 'lucide-react';
import { Button } from './Button';

interface VehicleModalProps {
  vehicle: Vehicle;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const VehicleModal: React.FC<VehicleModalProps> = ({ vehicle, onClose, isFavorite, onToggleFavorite }) => {
  const hasBadge = !!vehicle.badge && vehicle.badge.length > 0;

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", duration: 0.5, bounce: 0.3 }
    },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.3 } }
  };

  const contentVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-0 sm:p-4 md:p-8">
      
      {/* Backdrop Flou */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
      />

      {/* Modal Card */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        layoutId={`card-container-${vehicle.id}`}
        className="relative w-full max-w-7xl h-[100dvh] sm:h-[90vh] md:h-[80vh] bg-[#050505] sm:rounded-[2rem] border border-white/10 shadow-2xl flex flex-col md:flex-row overflow-hidden"
      >
        
        {/* --- ACTIONS FLOTTANTES (Fermer / Favoris) --- */}
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
                className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 ${
                    isFavorite 
                    ? 'bg-brand-gold border-brand-gold text-black shadow-[0_0_15px_rgba(197,160,89,0.5)]' 
                    : 'bg-black/20 border-white/10 text-white hover:bg-white/10'
                }`}
            >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-black' : ''}`} />
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.05, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-brand-gold transition-colors shadow-lg"
            >
                <X className="w-5 h-5" />
            </motion.button>
        </div>

        {/* --- PARTIE GAUCHE : IMAGE --- */}
        <div className="relative w-full md:w-3/5 h-[45vh] md:h-full bg-[#080808] flex items-center justify-center overflow-hidden group">
            
            {/* Background Spotlights */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.03),transparent_70%)]" />
            
            {/* Image du véhicule */}
            {vehicle.image ? (
                <motion.img 
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    src={vehicle.image} 
                    alt={vehicle.model} 
                    className="w-full h-full object-cover md:object-contain relative z-10 transition-transform duration-700 group-hover:scale-105"
                />
            ) : (
                <div className="opacity-20 flex flex-col items-center">
                    <span className="text-4xl">🏎️</span>
                    <span className="text-xs uppercase tracking-widest mt-4">Image indisponible</span>
                </div>
            )}

            {/* Gradient d'intégration (Bas sur mobile, Droite sur Desktop) */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#050505] z-20 pointer-events-none" />

            {/* Badge Flottant */}
            {hasBadge && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-30"
                >
                    <div className="flex items-center gap-2 bg-brand-gold/90 text-brand-black px-4 py-2 rounded-full shadow-[0_0_20px_rgba(197,160,89,0.3)] backdrop-blur-md">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{vehicle.badge}</span>
                    </div>
                </motion.div>
            )}
        </div>

        {/* --- PARTIE DROITE : INFORMATION --- */}
        <div className="relative w-full md:w-2/5 h-full flex flex-col bg-[#050505]">
            
            {/* Contenu Scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 lg:p-12 flex flex-col justify-center">
                
                <motion.div variants={contentVariants} initial="hidden" animate="visible" className="space-y-8">
                    
                    {/* Header Info */}
                    <div>
                        <div className="flex items-center gap-3 mb-4 opacity-70">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold border border-brand-gold/30 px-2 py-1 rounded">
                                {vehicle.brand}
                            </span>
                            <div className="w-1 h-1 bg-slate-500 rounded-full" />
                            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                                {vehicle.category}
                            </span>
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-[0.9] tracking-tight mb-4">
                            {vehicle.model}
                        </h2>

                        <div className="w-16 h-[1px] bg-gradient-to-r from-brand-gold to-transparent mb-6" />

                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Prix Catalogue</span>
                            <div className="flex items-baseline gap-2 text-brand-gold">
                                <span className="text-3xl md:text-4xl font-mono font-light tracking-tight">{vehicle.price}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="prose prose-invert">
                        <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed">
                            {vehicle.description}
                        </p>
                    </div>

                </motion.div>
            </div>

            {/* Footer Fixe avec CTA */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 md:p-10 border-t border-white/5 bg-[#050505] relative z-30"
            >
                <a href="https://discord.gg/88peMJRz95" target="_blank" rel="noopener noreferrer" className="block">
                    <Button className="w-full !h-14 !text-xs md:!text-sm !tracking-[0.25em] bg-white hover:bg-brand-gold text-brand-black shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_-5px_rgba(197,160,89,0.4)]">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contacter un Vendeur
                    </Button>
                </a>
                
                <div className="mt-4 flex items-center justify-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
                    <span className="text-[9px] uppercase tracking-widest text-slate-500">Ref. {vehicle.id}</span>
                </div>
            </motion.div>

        </div>
      </motion.div>
    </div>
  );
};
