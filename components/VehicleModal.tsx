import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Vehicle } from '../types';
import { X, MessageCircle, Heart, Sparkles, Share2, BadgeCheck } from 'lucide-react';
import { Button } from './Button';

interface VehicleModalProps {
  vehicle: Vehicle;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const VehicleModal: React.FC<VehicleModalProps> = ({ vehicle, onClose, isFavorite, onToggleFavorite }) => {
  const hasBadge = !!vehicle.badge && vehicle.badge.length > 0;

  // --- ANIMATION VARIANTS (Motion Design Avancé) ---
  
  const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 40 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        damping: 30, 
        stiffness: 300,
        mass: 0.8,
        delayChildren: 0.2, // Attendre que la modale s'ouvre pour lancer le contenu
        staggerChildren: 0.1 
      }
    },
    exit: { opacity: 0, scale: 0.95, y: 40, transition: { duration: 0.2 } }
  };

  const imageVariants: Variants = {
    hidden: { scale: 1.2, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } // "Ken Burns" effect
    }
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.5, ease: "easeOut" } 
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 sm:p-6 md:p-10">
      
      {/* Backdrop Sombre & Flou */}
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
        className="relative w-full max-w-[90rem] bg-[#050505] rounded-none sm:rounded-[2rem] border border-white/10 shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[100dvh] md:max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* BOUTONS FLOTTANTS (Absolu par dessus tout) */}
        <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
             <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onToggleFavorite}
                className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 ${
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
                className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center hover:bg-brand-gold hover:text-black transition-colors shadow-lg"
            >
                <X className="w-6 h-6" />
            </motion.button>
        </div>

        {/* --- PARTIE GAUCHE : VISUEL IMMERSIF (65% width) --- */}
        <div className="relative w-full md:w-[65%] h-[40vh] md:h-auto overflow-hidden bg-[#080808]">
            
            {/* Image Wrapper for Animation */}
            <motion.div variants={imageVariants} className="w-full h-full">
                {vehicle.image ? (
                    <img 
                        src={vehicle.image} 
                        alt={vehicle.model} 
                        className="w-full h-full object-cover object-center" 
                        /* object-cover est la clé pour éviter les barres noires */
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-brand-charcoal pattern-grid-lg">
                        <span className="text-white/20 text-xs uppercase tracking-widest">Image Indisponible</span>
                    </div>
                )}
            </motion.div>

            {/* Overlays / Gradients pour l'intégration */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80 md:opacity-0" /> {/* Mobile Bottom Fade */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#050505] opacity-0 md:opacity-100" /> {/* Desktop Right Fade */}

            {/* Badge Flottant sur l'image */}
            {hasBadge && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute top-6 left-6 md:bottom-8 md:top-auto md:left-8 z-30"
                >
                    <div className="flex items-center gap-2 bg-brand-gold/90 backdrop-blur-xl px-4 py-2 rounded-full shadow-[0_0_20px_rgba(197,160,89,0.3)]">
                        <Sparkles className="w-3.5 h-3.5 text-black" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">{vehicle.badge}</span>
                    </div>
                </motion.div>
            )}
        </div>

        {/* --- PARTIE DROITE : INFORMATION (35% width) --- */}
        <div className="relative w-full md:w-[35%] bg-[#050505] flex flex-col h-full border-l border-white/5">
            
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 flex flex-col justify-center">
                
                {/* Brand & Cat */}
                <motion.div variants={textVariants} className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold border border-brand-gold/20 bg-brand-gold/5 px-2 py-1 rounded">
                        {vehicle.brand}
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        <div className="w-1 h-1 bg-slate-500 rounded-full" />
                        {vehicle.category}
                    </span>
                </motion.div>

                {/* Main Title */}
                <motion.h2 
                    variants={textVariants} 
                    className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-[0.9] tracking-tight mb-8"
                >
                    {vehicle.model}
                </motion.h2>

                {/* Price Section */}
                <motion.div variants={textVariants} className="mb-10 p-4 rounded-xl bg-white/5 border border-white/5">
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">Prix Catalogue</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-mono text-brand-gold font-light tracking-tight">{vehicle.price}</span>
                        {/* Fake Stock Indicator just for UI flavor */}
                        <div className="ml-auto flex items-center gap-1.5 px-2 py-1 bg-green-900/20 rounded border border-green-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[9px] uppercase font-bold text-green-500 tracking-wider">Dispo</span>
                        </div>
                    </div>
                </motion.div>

                {/* Description */}
                <motion.div variants={textVariants} className="prose prose-invert">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-3 flex items-center gap-2">
                        <BadgeCheck className="w-4 h-4 text-brand-gold" />
                        Fiche Véhicule
                    </h3>
                    <p className="text-sm text-slate-400 font-light leading-relaxed border-l-2 border-white/10 pl-4">
                        {vehicle.description}
                    </p>
                </motion.div>

            </div>

            {/* Footer Fixe (CTA) */}
            <motion.div 
                variants={textVariants} 
                className="p-6 md:p-8 border-t border-white/5 bg-[#080808] z-20"
            >
                <a href="https://discord.gg/88peMJRz95" target="_blank" rel="noopener noreferrer" className="block w-full">
                    <Button className="w-full !py-5 !text-xs !tracking-[0.25em] bg-white hover:bg-brand-gold text-brand-black shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_-5px_rgba(197,160,89,0.4)]">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contacter Vendeur
                    </Button>
                </a>
                
                <div className="mt-3 text-center">
                    <span className="text-[8px] uppercase tracking-[0.3em] text-slate-600 opacity-60">
                        BlackWood Royal Motors
                    </span>
                </div>
            </motion.div>

        </div>
      </motion.div>
    </div>
  );
};
