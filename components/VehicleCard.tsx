import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Vehicle } from '../types';
import { BadgeCheck, ArrowUpRight, ShieldCheck, Car, Star, Heart } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  index: number;
  onSelect: (vehicle: Vehicle) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onSelect, isFavorite, onToggleFavorite }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [shouldLoadImage, setShouldLoadImage] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // PREMIUM LOADING LOGIC
  useEffect(() => {
    if (!vehicle.image) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadImage(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '1200px 0px 1200px 0px', 
        threshold: 0
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [vehicle.image]);

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: 0.05 }}
      className="group relative w-full h-full content-visibility-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Container with Hover Lift */}
      {/* FIX: WebkitMaskImage forces the browser to respect border-radius clipping during transforms */}
      <motion.div 
        whileHover={{ y: -2 }} 
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="relative h-full flex flex-col bg-[#0a0a0a] rounded-[2rem] overflow-hidden border border-white/5 transition-colors duration-500 ease-out group-hover:border-brand-gold/40 group-hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] transform-gpu"
        style={{ 
            WebkitMaskImage: "-webkit-radial-gradient(white, black)",
            maskImage: "radial-gradient(white, black)"
        }}
      >
        
        {/* Image Section */}
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#050505] cursor-pointer" onClick={() => onSelect(vehicle)}>
          {vehicle.image ? (
            <div className="w-full h-full overflow-hidden bg-[#0a0a0a] relative">
                {shouldLoadImage && (
                    <img 
                        src={vehicle.image} 
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className={`w-full h-full object-cover transition-transform duration-[1000ms] ease-out ${isHovered ? 'scale-110' : 'scale-100'} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setImageLoaded(true)}
                        style={{ willChange: 'transform' }}
                    />
                )}
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[#050505] pattern-grid-lg">
               <div className="text-center opacity-30 group-hover:opacity-60 transition-opacity duration-500">
                  <Car className="w-12 h-12 mx-auto mb-3 text-brand-gold" />
                  <span className="text-[9px] uppercase tracking-[0.3em] font-mono border border-brand-gold/30 px-3 py-1 rounded-full text-brand-gold">Image Confidentielle</span>
               </div>
            </div>
          )}

          {/* Placeholder Background */}
          {!imageLoaded && vehicle.image && <div className="absolute inset-0 bg-[#0f0f0f] z-0" />}

          {/* Overlay Gradient */}
          <div 
            className={`absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent transition-opacity duration-700 ${isHovered ? 'opacity-40' : 'opacity-60'} z-10`}
          />
          
          {/* Top Left Tags - FIXED BLUR STYLE */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            <span className="bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold font-mono uppercase tracking-widest text-white px-3 py-1.5 rounded-full shadow-sm">
              {vehicle.category}
            </span>
          </div>

          {/* Top Right: Favorites & Exclusive */}
          <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
             {/* Favorite Button */}
             <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite();
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border shadow-sm transition-colors duration-300 ${isFavorite ? 'bg-brand-gold border-brand-gold text-brand-black' : 'bg-black/40 border-white/10 text-white hover:bg-white/20'}`}
             >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-black' : ''}`} />
             </motion.button>

             {/* Exclusive Star */}
             {parseInt(vehicle.priceValue.toString()) > 500000 && (
                 <div className="w-8 h-8 rounded-full bg-brand-gold/20 backdrop-blur-sm flex items-center justify-center border border-brand-gold/50 shadow-sm">
                    <Star className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" />
                 </div>
             )}
          </div>
        </div>
        
        {/* Content Section */}
        <div className="flex-1 p-6 flex flex-col justify-between relative z-10">
          
          <div>
             <div className="flex items-center justify-between mb-3">
                 <span className="text-[10px] font-bold text-brand-gold/90 uppercase tracking-[0.2em] border border-brand-gold/10 px-2 py-1 rounded bg-brand-gold/5">
                   {vehicle.brand}
                 </span>
                 
                 <div className={`transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                     <BadgeCheck className="w-4 h-4 text-brand-gold" />
                 </div>
             </div>

             <h3 className="text-2xl font-serif text-white mb-4 line-clamp-1 leading-tight group-hover:text-brand-gold transition-colors duration-300 cursor-pointer" onClick={() => onSelect(vehicle)}>
               {vehicle.model}
             </h3>

             {/* Separator Line */}
             <div className="relative w-full h-[1px] bg-white/5 mb-5 overflow-hidden">
                <div className={`absolute inset-0 bg-brand-gold h-full transition-transform duration-700 ease-out ${isHovered ? 'translate-x-0' : '-translate-x-full'}`} />
             </div>
             
             {/* Info Tags */}
             <div className={`flex flex-wrap gap-2 mb-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-60'}`}>
                <span className="flex items-center text-[10px] text-slate-300 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                   <ShieldCheck className="w-3 h-3 mr-1.5 text-brand-gold" />
                   Certifié BlackWood
                </span>
             </div>
          </div>

          {/* Footer Price & Action */}
          <div className="flex items-end justify-between pt-2">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Prix d'acquisition</span>
              <span className="text-lg font-mono text-white tracking-tight group-hover:text-white transition-colors">
                {vehicle.price}
              </span>
            </div>
            
            <motion.button 
              whileHover={{ rotate: 45, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(vehicle)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-brand-black group-hover:bg-brand-gold transition-colors duration-300 shadow-[0_0_10px_-5px_rgba(255,255,255,0.3)] group-hover:shadow-[0_0_15px_-5px_rgba(197,160,89,0.6)] cursor-pointer"
            >
              <ArrowUpRight className="w-5 h-5" />
            </motion.button>
          </div>

        </div>

      </motion.div>
    </motion.div>
  );
};