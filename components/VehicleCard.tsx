
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Vehicle } from '../types';
import { BadgeCheck, ArrowUpRight, ShieldCheck, Car, Heart, Sparkles, Scale, Crown } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  index: number;
  onSelect: (vehicle: Vehicle) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isComparing?: boolean;
  onToggleCompare?: () => void;
  mobileLayout?: 1 | 2 | 3; // Prop pour le layout mobile
}

export const VehicleCard: React.FC<VehicleCardProps> = React.memo(({ 
    vehicle, onSelect, isFavorite, onToggleFavorite, isComparing, onToggleCompare, mobileLayout = 1 
}) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);
  const [shouldLoadImage, setShouldLoadImage] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const hasBadge = !!vehicle.badge && vehicle.badge.length > 0;
  const isVip = vehicle.vip;

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

  // --- DYNAMIC STYLES BASED ON MOBILE LAYOUT ---
  // Layout 3 = Tiny (Micro)
  // Layout 2 = Compact (Small)
  // Layout 1 = Standard (Full)
  
  const containerRadius = mobileLayout === 3 ? 'rounded-xl' : mobileLayout === 2 ? 'rounded-2xl' : 'rounded-[2rem]';
  const contentPadding = mobileLayout === 3 ? 'p-2' : mobileLayout === 2 ? 'p-3' : 'p-6';
  
  const brandSize = mobileLayout === 3 ? 'text-[8px] tracking-tight' : mobileLayout === 2 ? 'text-[9px]' : 'text-[10px]';
  const modelSize = mobileLayout === 3 ? 'text-xs mb-1' : mobileLayout === 2 ? 'text-sm mb-2' : 'text-2xl mb-4';
  const priceSize = mobileLayout === 3 ? 'text-xs' : mobileLayout === 2 ? 'text-sm' : 'text-lg';
  
  const buttonSize = mobileLayout === 3 ? 'w-6 h-6' : mobileLayout === 2 ? 'w-8 h-8' : 'w-10 h-10';
  const iconSize = mobileLayout === 3 ? 'w-3 h-3' : mobileLayout === 2 ? 'w-4 h-4' : 'w-5 h-5';
  
  // Hide non-essential elements on layout 3/2
  const showBadgeOnImage = mobileLayout === 1; // Only show category badge on full view mobile or desktop
  const showCertifications = mobileLayout === 1;
  const showPriceLabel = mobileLayout === 1;

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="group relative w-full h-full hover:z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div 
        whileHover={{ y: -4, transition: { type: "spring", stiffness: 500, damping: 30, mass: 1 } }}
        className={`
            relative h-full flex flex-col overflow-hidden z-0
            transition-all duration-300 ease-out
            ${containerRadius} md:rounded-[2rem]
            ${isComparing ? 'ring-2 ring-brand-gold shadow-[0_0_20px_rgba(197,160,89,0.3)]' : ''}
            ${isVip 
               ? 'bg-[#080808] border border-brand-gold/40 shadow-[0_0_30px_-15px_rgba(197,160,89,0.15)] group-hover:border-brand-gold/60 group-hover:shadow-[0_0_50px_-10px_rgba(197,160,89,0.25)]' 
               : hasBadge
                 ? 'bg-[#0f0f0f] border border-transparent' 
                 : 'bg-[#0a0a0a] border border-white/5 hover:border-brand-gold/40 hover:shadow-2xl'
            }
        `}
      >
        {/* === STANDARD BADGE EFFECTS (Sheen/Pulse) - NOT FOR VIP === */}
        {(hasBadge && !isVip) && (
            <>
                <div className={`absolute -inset-[2px] blur-xl opacity-0 animate-pulse group-hover:opacity-60 transition-opacity duration-300 pointer-events-none z-0 bg-brand-gold/20 ${containerRadius} md:rounded-[2rem]`} />
                <div className={`absolute inset-0 border border-brand-gold/40 shadow-[inset_0_0_20px_rgba(197,160,89,0.05)] pointer-events-none z-20 ${containerRadius} md:rounded-[2rem]`} />
                <div className={`absolute inset-0 z-20 overflow-hidden pointer-events-none mix-blend-overlay ${containerRadius} md:rounded-[2rem]`}>
                     <div className="absolute -inset-[200%] w-[400%] h-[400%] bg-gradient-to-r from-transparent via-white/20 to-transparent -rotate-45 translate-x-[-100%] animate-[sheen_4s_infinite_ease-in-out]" />
                </div>
                <style>{`
                    @keyframes sheen {
                        0% { transform: translateX(-100%) rotate(-45deg); }
                        15% { transform: translateX(100%) rotate(-45deg); }
                        100% { transform: translateX(100%) rotate(-45deg); }
                    }
                `}</style>
            </>
        )}

        {/* === VIP EFFECTS (Static, Elegant, Premium) === */}
        {isVip && (
             <>
                {/* Subtle Radial Gold Glow (Top Right) */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-gold/10 blur-[80px] pointer-events-none z-0 mix-blend-screen opacity-60" />
                
                {/* Inner Border Glow (Static) */}
                <div className={`absolute inset-0 shadow-[inset_0_0_40px_rgba(197,160,89,0.05)] pointer-events-none z-20 ${containerRadius} md:rounded-[2rem]`} />
             </>
        )}
        
        {/* Zone Image */}
        <div 
            className={`relative w-full bg-[#050505] cursor-pointer overflow-hidden z-10 ${mobileLayout === 3 ? 'aspect-square' : 'aspect-[16/10]'}`} 
            onClick={() => onSelect(vehicle)}
            style={{ 
                borderTopLeftRadius: mobileLayout === 3 ? '0.75rem' : mobileLayout === 2 ? '1rem' : '2rem', 
                borderTopRightRadius: mobileLayout === 3 ? '0.75rem' : mobileLayout === 2 ? '1rem' : '2rem' 
            }}
        >
          
          {/* Image Loader */}
          {vehicle.image && imageState !== 'error' ? (
            <div className="w-full h-full relative overflow-hidden">
                {shouldLoadImage && (
                    <img 
                        src={currentSrc}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className={`w-full h-full object-cover transition-transform duration-200 ease-out 
                            ${isHovered ? 'scale-105' : 'scale-100'} 
                            ${imageState === 'loaded' ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
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
            <div className="absolute inset-0 flex items-center justify-center bg-[#050505] pattern-grid-lg">
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

          {/* Category Badge (Top Left) - Hidden on mobile dense layouts */}
          <div className={`absolute top-4 left-4 z-40 flex flex-col gap-2 pointer-events-none items-start ${!showBadgeOnImage ? 'hidden md:flex' : ''}`}>
            <span className="bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold font-mono uppercase tracking-widest text-white px-3 py-1.5 rounded-full">
              {vehicle.category}
            </span>
          </div>

          {/* Actions (Top Right) - Scaled for mobile */}
          <div className={`absolute z-40 flex items-center gap-2 ${mobileLayout === 3 ? 'top-2 right-2 scale-75' : mobileLayout === 2 ? 'top-2 right-2 scale-90' : 'top-4 right-4'} md:top-4 md:right-4 md:scale-100`}>
             {/* COMPARE BUTTON */}
             {onToggleCompare && (
                 <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); onToggleCompare(); }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-colors ${isComparing ? 'bg-brand-gold border-brand-gold text-black' : 'bg-black/40 border-white/10 text-white hover:bg-white/20'}`}
                    title="Comparer"
                 >
                    <Scale className="w-3.5 h-3.5" />
                 </motion.button>
             )}

             <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
                className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-colors ${isFavorite ? 'bg-brand-gold border-brand-gold text-black' : 'bg-black/40 border-white/10 text-white hover:bg-white/20'}`}
             >
                <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-black' : ''}`} />
             </motion.button>
          </div>

          {/* DYNAMIC BADGE - Scaled for mobile */}
          {hasBadge && (
             <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`absolute z-40 flex justify-center pointer-events-none ${mobileLayout === 3 ? 'bottom-2 left-2 right-2' : 'bottom-4 left-4 right-4'} md:bottom-4 md:left-4 md:right-4`}
             >
                <div className={`relative overflow-hidden rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/20 backdrop-blur-xl bg-gradient-to-r from-brand-gold via-[#e8c683] to-brand-gold ${mobileLayout === 3 ? 'scale-75 origin-bottom' : ''} md:scale-100`}>
                    <div className="relative px-5 py-1.5 flex items-center justify-center gap-2">
                        <Sparkles className="w-3 h-3 text-black animate-[pulse_2s_infinite]" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black whitespace-nowrap drop-shadow-sm">
                            {vehicle.badge}
                        </span>
                        <Sparkles className="w-3 h-3 text-black animate-[pulse_2s_infinite]" />
                    </div>
                </div>
             </motion.div>
          )}
        </div>
        
        {/* Contenu Texte */}
        <div className={`flex-1 flex flex-col justify-between relative z-10 ${contentPadding} md:p-6`}>
          <div>
             <div className="flex items-center justify-between mb-1 md:mb-3">
                 <span className={`${brandSize} md:text-[10px] font-bold uppercase tracking-[0.2em] px-1 md:px-2 py-0.5 md:py-1 rounded transition-colors ${hasBadge ? 'text-brand-black bg-brand-gold/80' : 'text-brand-gold/90 bg-brand-gold/5'}`}>
                   {vehicle.brand}
                 </span>
                 <BadgeCheck className={`w-4 h-4 text-brand-gold transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'} hidden md:block`} />
             </div>

             <h3 className={`${modelSize} md:text-2xl md:mb-4 font-serif text-white line-clamp-1 group-hover:text-brand-gold transition-colors cursor-pointer leading-none`} onClick={() => onSelect(vehicle)}>
               {vehicle.model}
             </h3>

             <div className={`relative w-full h-[1px] bg-white/5 overflow-hidden ${mobileLayout === 3 ? 'mb-2' : mobileLayout === 2 ? 'mb-3' : 'mb-5'} md:mb-5`}>
                <div className={`absolute inset-0 bg-brand-gold h-full transition-transform duration-300 ease-out ${isHovered ? 'translate-x-0' : '-translate-x-full'}`} />
             </div>
             
             {/* Badges Certification & VIP - Hidden on compact mobile */}
             <div className={`flex flex-wrap gap-2 mb-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-60'} ${!showCertifications ? 'hidden md:flex' : ''}`}>
                <span className="flex items-center text-[10px] text-slate-300 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                   <ShieldCheck className="w-3 h-3 mr-1.5 text-brand-gold" />
                   Certifié
                </span>
                
                {isVip && (
                    <span className="flex items-center text-[10px] font-bold uppercase tracking-widest text-[#050505] bg-gradient-to-r from-[#C5A059] to-[#E5C585] px-2.5 py-1 rounded-full shadow-[0_2px_8px_rgba(197,160,89,0.25)]">
                       <Crown className="w-3 h-3 mr-1.5 fill-[#050505]" />
                       VIP
                    </span>
                )}
             </div>
          </div>

          <div className="flex items-end justify-between pt-1 md:pt-2">
            <div className="flex flex-col">
              {showPriceLabel && <span className="text-[9px] text-slate-500 uppercase tracking-widest mb-1 font-bold md:block hidden">Prix</span>}
              <span className={`${priceSize} md:text-lg font-mono tracking-tight ${hasBadge || isVip ? 'text-brand-gold font-bold drop-shadow-[0_0_10px_rgba(197,160,89,0.3)]' : 'text-white'}`}>
                {vehicle.price}
              </span>
            </div>
            
            <motion.button 
              whileHover={{ rotate: 45, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(vehicle)}
              className={`${buttonSize} md:w-10 md:h-10 flex items-center justify-center rounded-full text-black group-hover:bg-brand-gold transition-colors shadow-lg z-30 ${isVip ? 'bg-brand-gold ring-2 ring-brand-gold/50' : 'bg-white'}`}
            >
              <ArrowUpRight className={`${iconSize} md:w-5 md:h-5`} />
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
    prevProps.isComparing === nextProps.isComparing && 
    prevProps.index === nextProps.index &&
    prevProps.mobileLayout === nextProps.mobileLayout // Check layout prop
  );
});
