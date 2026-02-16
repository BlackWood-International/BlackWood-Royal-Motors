import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { SortOption } from '../types';
import { Search, X, SlidersHorizontal, ArrowUpDown, Building2, Tag, Check, DollarSign, Heart } from 'lucide-react';

interface FilterPanelProps {
  categories: string[];
  activeCategories: string[];
  onCategoryChange: (cats: string[]) => void;
  brands: string[];
  selectedBrands: string[];
  onBrandChange: (brands: string[]) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  priceRange: { min: string, max: string };
  onPriceRangeChange: (range: { min: string, max: string }) => void;
  onReset: () => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  favoritesCount: number;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  categories, activeCategories, onCategoryChange,
  brands, selectedBrands, onBrandChange,
  searchQuery, onSearchChange,
  activeSort, onSortChange,
  priceRange, onPriceRangeChange,
  onReset,
  showFavoritesOnly, onToggleFavorites, favoritesCount
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Détection du clic à l'extérieur pour fermer le panneau (UX Improvement)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Vérifie si un filtre est actif
  const isFilterActive = 
    !activeCategories.includes('All') || 
    !selectedBrands.includes('All') || 
    activeSort !== 'original' ||
    priceRange.min !== '' ||
    priceRange.max !== '' ||
    showFavoritesOnly;

  // Animation variants pour le panneau
  const panelVariants: Variants = {
    hidden: { 
        opacity: 0, 
        y: -20, 
        scale: 0.98,
        transition: { duration: 0.2, ease: "easeInOut" }
    },
    visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { type: "spring", stiffness: 100, damping: 20 }
    }
  };

  // Logique de sélection multiple
  const handleMultiSelect = (
      currentSelection: string[], 
      item: string, 
      updater: (items: string[]) => void
  ) => {
      if (item === 'All') {
          updater(['All']);
          return;
      }
      let newSelection = [...currentSelection];
      if (newSelection.includes('All')) newSelection = [];
      
      if (newSelection.includes(item)) {
          newSelection = newSelection.filter(i => i !== item);
      } else {
          newSelection.push(item);
      }
      if (newSelection.length === 0) newSelection = ['All'];
      updater(newSelection);
  };

  return (
    // FIX STICKY: Utilisation de 'sticky top-4' pour que la barre reste en haut au scroll
    // FIX SCROLL: 'w-full px-4' assure que la barre ne dépasse jamais la largeur d'écran
    <div ref={panelRef} className="sticky top-4 z-50 w-full px-4 mb-8 pointer-events-none">
        
        {/* CSS injecté localement pour masquer les scrollbars tout en gardant le scroll fonctionnel */}
        <style>{`
            .hide-scrollbar::-webkit-scrollbar { display: none; }
            .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            .custom-scrollbar::-webkit-scrollbar { width: 4px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(197,160,89,0.3); border-radius: 4px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(197,160,89,0.8); }
        `}</style>

        {/* Main Floating Bar Container */}
        <div className="max-w-4xl mx-auto pointer-events-auto">
            <motion.div 
                layout
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "circOut" }}
                className={`bg-[#0f0f0f]/80 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl p-2 transition-all duration-300 relative z-50 ${isExpanded ? 'border-brand-gold/30' : 'hover:border-white/20'}`}
            >
                <div className="flex items-center gap-2 md:gap-3">
                    
                    {/* Search Input - Improved UX focus state */}
                    <div className="relative flex-1 group/search">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/search:text-brand-gold transition-colors duration-300" />
                        <input 
                            type="text" 
                            placeholder="Rechercher..." 
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full bg-white/5 hover:bg-white/10 focus:bg-black/40 border border-transparent focus:border-brand-gold/20 rounded-full py-3 pl-12 pr-10 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all duration-300 shadow-inner"
                        />
                        {searchQuery && (
                            <button 
                                onClick={() => onSearchChange('')} 
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white hover:bg-white/10 p-1 rounded-full transition-all"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    <div className="h-6 w-[1px] bg-white/10 hidden sm:block mx-1" />

                    {/* Filter Toggle Button - Redesigned Active State */}
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`relative flex items-center gap-3 px-5 py-3 rounded-full text-xs uppercase tracking-widest font-bold transition-all border overflow-hidden ${
                            isExpanded 
                            ? 'bg-brand-gold text-brand-black border-brand-gold shadow-[0_0_25px_-5px_rgba(197,160,89,0.4)]' 
                            : 'bg-white/5 text-white border-white/5 hover:bg-white/10 hover:border-white/20'
                        }`}
                    >
                        <div className="flex items-center gap-2 relative z-10">
                            <SlidersHorizontal className="w-4 h-4" />
                            <span className="hidden sm:inline">Filtres</span>
                            
                            {/* FIX POINT LUMINEUX: Intégré directement dans le flux du bouton */}
                            {isFilterActive && (
                                <span className="flex h-2 w-2 ml-1 relative">
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isExpanded ? 'bg-black' : 'bg-brand-gold'}`}></span>
                                    <span className={`relative inline-flex rounded-full h-2 w-2 ${isExpanded ? 'bg-black' : 'bg-brand-gold'}`}></span>
                                </span>
                            )}
                        </div>
                    </motion.button>
                </div>
            </motion.div>

            {/* Expanded Panel */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        variants={panelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="absolute left-0 right-0 top-full mt-4 mx-4 md:mx-0 z-40 bg-[#121212]/95 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden ring-1 ring-white/5"
                    >
                        {/* Scroll Container avec max-height pour éviter de dépasser l'écran sur mobile */}
                        <div className="max-h-[75vh] overflow-y-auto custom-scrollbar p-6 md:p-8 relative">
                            
                            {/* Décoration d'arrière-plan */}
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-gold/5 rounded-full blur-[120px] pointer-events-none" />

                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
                                
                                {/* COL 1: Favoris, Tri & Budget */}
                                <div className="lg:col-span-1 space-y-8">
                                    
                                    {/* Favorites Toggle */}
                                    <Section title="Préférences" icon={<Heart className="w-4 h-4" />}>
                                        <motion.button 
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={onToggleFavorites}
                                            className={`w-full flex items-center justify-between p-4 rounded-xl text-xs font-medium transition-all duration-300 border ${
                                                showFavoritesOnly 
                                                ? 'bg-brand-gold text-brand-black border-brand-gold shadow-lg shadow-brand-gold/10' 
                                                : 'bg-white/5 text-slate-300 border-transparent hover:bg-white/10 hover:border-white/10'
                                            }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <Heart className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                                                Mes Favoris
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${showFavoritesOnly ? 'bg-black/20' : 'bg-white/10'}`}>
                                                {favoritesCount}
                                            </span>
                                        </motion.button>
                                    </Section>

                                    {/* Sorting */}
                                    <Section title="Tri" icon={<ArrowUpDown className="w-4 h-4" />}>
                                        <div className="space-y-2">
                                            <SortButton active={activeSort === 'original'} onClick={() => onSortChange('original')} label="Pertinence" />
                                            <SortButton active={activeSort === 'price-asc'} onClick={() => onSortChange('price-asc')} label="Prix Croissant" />
                                            <SortButton active={activeSort === 'price-desc'} onClick={() => onSortChange('price-desc')} label="Prix Décroissant" />
                                        </div>
                                    </Section>

                                    {/* Budget - FIX MOTION DESIGN */}
                                    <Section title="Budget ($)" icon={<DollarSign className="w-4 h-4" />}>
                                        <div className="flex gap-3">
                                            <BudgetInput 
                                                placeholder="Min" 
                                                value={priceRange.min} 
                                                onChange={(v) => onPriceRangeChange({...priceRange, min: v})} 
                                            />
                                            <BudgetInput 
                                                placeholder="Max" 
                                                value={priceRange.max} 
                                                onChange={(v) => onPriceRangeChange({...priceRange, max: v})} 
                                            />
                                        </div>
                                    </Section>
                                </div>

                                {/* COL 2 & 3: Filtres Principaux */}
                                <div className="lg:col-span-3 space-y-8 lg:border-l border-white/5 lg:pl-8">
                                    
                                    {/* Categories */}
                                    <Section title="Catégories" icon={<Tag className="w-4 h-4" />}>
                                        <div className="flex flex-wrap gap-2">
                                            {categories.map(cat => (
                                                <FilterChip 
                                                    key={cat} 
                                                    label={cat === 'All' ? 'Toutes' : cat} 
                                                    active={activeCategories.includes(cat)} 
                                                    onClick={() => handleMultiSelect(activeCategories, cat, onCategoryChange)} 
                                                />
                                            ))}
                                        </div>
                                    </Section>

                                    {/* Marques */}
                                    <Section title="Constructeurs" icon={<Building2 className="w-4 h-4" />}>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                                             <BrandButton 
                                                label="Tous" 
                                                active={selectedBrands.includes('All')} 
                                                onClick={() => onBrandChange(['All'])} 
                                             />
                                            {brands.map(brand => (
                                                <BrandButton 
                                                    key={brand}
                                                    label={brand} 
                                                    active={selectedBrands.includes(brand)} 
                                                    onClick={() => handleMultiSelect(selectedBrands, brand, onBrandChange)} 
                                                />
                                            ))}
                                        </div>
                                    </Section>

                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">
                                    {isFilterActive ? 'Filtres appliqués' : 'Affichage par défaut'}
                                </span>
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onReset}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold text-brand-crimsonBright hover:bg-brand-crimsonBright/10 transition-colors"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-current"/>
                                    Réinitialiser
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    </div>
  );
};

// --- Sous-composants pour la propreté du code ---

const Section = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <div>
        <div className="flex items-center gap-2 mb-4 text-brand-gold/80">
            {icon}
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold">{title}</h4>
        </div>
        {children}
    </div>
);

const SortButton = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
    <motion.button 
        whileHover={{ x: 4 }}
        onClick={onClick}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
            active 
            ? 'bg-white/10 text-brand-gold border-l-2 border-brand-gold' 
            : 'text-slate-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
        }`}
    >
        <span>{label}</span>
        {active && <Check className="w-3 h-3" />}
    </motion.button>
);

const BudgetInput = ({ placeholder, value, onChange }: { placeholder: string, value: string, onChange: (val: string) => void }) => (
    <div className="relative flex-1 group">
        <motion.div 
            className="absolute inset-0 bg-brand-gold/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity blur-md" 
            layoutId="glow"
        />
        <input 
            type="number" 
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="relative w-full bg-white/5 border border-white/10 rounded-xl py-3 px-3 text-sm text-white focus:border-brand-gold focus:bg-[#1a1a1a] focus:outline-none transition-all placeholder:text-slate-600 z-10"
        />
    </div>
);

const FilterChip = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
    <motion.button
        layout
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all border ${
            active
            ? 'bg-brand-gold text-brand-black border-brand-gold shadow-md shadow-brand-gold/10' 
            : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10 hover:text-white'
        }`}
    >
        {label}
    </motion.button>
);

const BrandButton = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
    <motion.button
        layout
        whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`truncate px-3 py-2.5 rounded-lg border text-left text-[10px] uppercase tracking-wider font-bold transition-all ${
            active
            ? 'border-brand-gold text-brand-gold bg-brand-gold/5'
            : 'border-white/5 text-slate-500 bg-white/5'
        }`}
    >
        {label}
    </motion.button>
);
