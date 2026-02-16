import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Vehicle } from '../types';
import { BadgeCheck, ArrowUpRight, ShieldCheck, Car, Heart, Sparkles } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  index: number;
  onSelect: (vehicle: Vehicle) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = React.memo(({ vehicle, onSelect, isFavorite, onToggleFavorite }) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);
  const [shouldLoadImage, setShouldLoadImage] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const hasBadge = !!vehicle.badge && vehicle.badge.length > 0;

  const cleanUrl = (rawUrl: string): string => {
    if (!rawUrl) return '';
    let url = rawUrl.trim().replace(/['"]/g, '');
    if (!url) return '';
    if (url.includes('wikia') || url.includes('fandom')) {
       url = url.split('/revision')[0];
       url = url.split('?')[0];
    }
    return url;
  };

  useEffect(() => {
    if (!vehicle.image) {
        setImageState('error');
        return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadImage(true);
          observer.disconnect();
        }
      },
      { rootMargin: '500px 0px', threshold: 0 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [vehicle.image]);

  useEffect(() => {
    if (!shouldLoadImage || !vehicle.image) return;

    const originalUrl = cleanUrl(vehicle.image);
    const proxyUrl = `https://wsrv.nl/?url=${encodeURIComponent(originalUrl)}&w=800&output=webp&il`;
    setCurrentSrc(proxyUrl);
  }, [shouldLoadImage, vehicle.image]);

  const handleImageError = () => {
    const originalUrl = cleanUrl(vehicle.image);
    if (currentSrc.includes('wsrv.nl')) {
        console.log(`Proxy failed for ${vehicle.model}, retrying direct link...`);
        setCurrentSrc(originalUrl);
    } else {
        setImageState('error');
    }
  };

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="group relative w-full h-full content-visibility-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div 
        whileHover={{ y: -4 }} 
        className={`
            relative h-full flex flex-col rounded-[2rem] overflow-hidden transition-all duration-500 z-0
            ${hasBadge 
                ? 'bg-[#0f0f0f] border border-brand-gold/60 shadow-[0_0_20px_-5px_rgba(197,160,89,0.3)]' 
                : 'bg-[#0a0a0a] border border-white/5 hover:border-brand-gold/40 hover:shadow-2xl'
            }
        `}
      >
        {/* SPECIAL BADGE ANIMATED BACKGROUND EFFECT */}
        {hasBadge && (
            <div className="absolute inset-0 z-[-1] overflow-hidden rounded-[2rem]">
                 {/* Moving Gradient Shine */}
                 <div className="absolute -inset-[200%] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(197,160,89,0.2)_360deg)] animate-[spin_5s_linear_infinite] opacity-30" />
                 {/* Inner Glow */}
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.15),transparent_60%)]" />
            </div>
        )}
        
        {/* Zone Image */}
        <div className="relative w-full aspect-[16/10] bg-[#050505] cursor-pointer rounded-t-[2rem] overflow-hidden" onClick={() => onSelect(vehicle)}>
          
          {/* Image Loader logic remains same */}
          {vehicle.image && imageState !== 'error' ? (
            <div className="w-full h-full relative overflow-hidden rounded-t-[2rem]">
                {shouldLoadImage && (
                    <img 
                        src={currentSrc}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className={`w-full h-full object-cover transition-all duration-700 ease-out 
                            ${isHovered ? 'scale-110' : 'scale-100'} 
                            ${imageState === 'loaded' ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
                        style={{ borderTopLeftRadius: '2rem', borderTopRightRadius: '2rem' }}
                        onLoad={() => setImageState('loaded')}
                        onError={handleImageError}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                    />
                )}
                {imageState === 'loading' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]">
                        <div className="w-6 h-6 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[#050505] pattern-grid-lg rounded-t-[2rem]">
               <div className="text-center opacity-30 group-hover:opacity-60 transition-opacity duration-500">
                  <Car className="w-12 h-12 mx-auto mb-3 text-brand-gold" />
                  <span className="text-[9px] uppercase tracking-[0.3em] font-mono border border-brand-gold/30 px-3 py-1 rounded-full text-brand-gold">
                      Image Non Disponible
                  </span>
               </div>
            </div>
          )}

          {/* Overlay Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent pointer-events-none z-10 ${isHovered ? 'opacity-40' : 'opacity-60'}`} />

          {/* Badges (Top Left) */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
            <span className="bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold font-mono uppercase tracking-widest text-white px-3 py-1.5 rounded-full">
              {vehicle.category}
            </span>
          </div>

          {/* Actions (Top Right) */}
          <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
             <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
                className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-colors ${isFavorite ? 'bg-brand-gold border-brand-gold text-black' : 'bg-black/40 border-white/10 text-white hover:bg-white/20'}`}
             >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-black' : ''}`} />
             </motion.button>
          </div>

          {/* DYNAMIC BADGE - CENTRÉ EN BAS DE L'IMAGE POUR IMPACT */}
          {hasBadge && (
             <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-4 left-4 right-4 z-30 flex justify-center pointer-events-none"
             >
                <div className="relative overflow-hidden rounded-full shadow-[0_4px_20px_rgba(197,160,89,0.4)] border border-white/40 backdrop-blur-xl bg-brand-gold/90">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2.5s_infinite]" />
                    <div className="relative px-6 py-2 flex items-center justify-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-black animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black whitespace-nowrap drop-shadow-sm">
                            {vehicle.badge}
                        </span>
                        <Sparkles className="w-3.5 h-3.5 text-black animate-pulse" />
                    </div>
                </div>
             </motion.div>
          )}
        </div>
        
        {/* Contenu Texte */}
        <div className="flex-1 p-6 flex flex-col justify-between relative z-10">
          <div>
             <div className="flex items-center justify-between mb-3">
                 <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded ${hasBadge ? 'text-brand-black bg-brand-gold' : 'text-brand-gold/90 bg-brand-gold/5'}`}>
                   {vehicle.brand}
                 </span>
                 <BadgeCheck className={`w-4 h-4 text-brand-gold transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
             </div>

             <h3 className="text-2xl font-serif text-white mb-4 line-clamp-1 group-hover:text-brand-gold transition-colors cursor-pointer" onClick={() => onSelect(vehicle)}>
               {vehicle.model}
             </h3>

             <div className="relative w-full h-[1px] bg-white/5 mb-5 overflow-hidden">
                <div className={`absolute inset-0 bg-brand-gold h-full transition-transform duration-700 ease-out ${isHovered ? 'translate-x-0' : '-translate-x-full'}`} />
             </div>
             
             <div className={`flex flex-wrap gap-2 mb-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-60'}`}>
                <span className="flex items-center text-[10px] text-slate-300 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                   <ShieldCheck className="w-3 h-3 mr-1.5 text-brand-gold" />
                   Certifié
                </span>
             </div>
          </div>

          <div className="flex items-end justify-between pt-2">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Prix</span>
              <span className={`text-lg font-mono tracking-tight ${hasBadge ? 'text-brand-gold font-bold' : 'text-white'}`}>
                {vehicle.price}
              </span>
            </div>
            
            <motion.button 
              whileHover={{ rotate: 45, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(vehicle)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black group-hover:bg-brand-gold transition-colors shadow-lg"
            >
              <ArrowUpRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.vehicle.id === nextProps.vehicle.id &&
    prevProps.isFavorite === nextProps.isFavorite &&
    prevProps.index === nextProps.index
  );
});
