import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { SortOption } from '../types';
import { Search, X, SlidersHorizontal, ArrowDownAZ, ArrowUpDown, Building2, Tag, Check, DollarSign, Heart } from 'lucide-react';

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
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Check if any filter is active
  const isFilterActive = 
    !activeCategories.includes('All') || 
    !selectedBrands.includes('All') || 
    activeSort !== 'original' ||
    priceRange.min !== '' ||
    priceRange.max !== '' ||
    showFavoritesOnly;

  // Animation variants
  const panelVariants: Variants = {
    hidden: { 
        opacity: 0, 
        y: -15, 
        scale: 0.99,
        transition: { duration: 0.2, ease: "easeInOut" }
    },
    visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { type: "spring", stiffness: 120, damping: 20 }
    }
  };

  // Helper for multi-select logic
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
      
      // If 'All' was selected, clear it when selecting a specific item
      if (newSelection.includes('All')) {
          newSelection = [];
      }

      if (newSelection.includes(item)) {
          newSelection = newSelection.filter(i => i !== item);
      } else {
          newSelection.push(item);
      }

      // If nothing selected, revert to 'All'
      if (newSelection.length === 0) {
          newSelection = ['All'];
      }

      updater(newSelection);
  };

  return (
    // Fixed width constraint
    <div className="sticky top-6 z-50 w-full px-[1%] mb-12 relative group">
        
        {/* Main Floating Bar */}
        <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="max-w-4xl mx-auto bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] p-2 pr-2 transition-all duration-300 hover:border-brand-gold/30 relative z-50"
        >
            <div className="flex items-center gap-3">
                
                {/* Search Input */}
                <div className="relative flex-1 group/search">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/search:text-brand-gold transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Rechercher un modèle, une marque..." 
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-white/5 hover:bg-white/10 focus:bg-black/20 border border-transparent focus:border-white/10 rounded-full py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all font-medium tracking-wide"
                    />
                    {searchQuery && (
                        <button onClick={() => onSearchChange('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-1 hover:bg-white/10 rounded-full transition-colors">
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </div>

                <div className="h-8 w-[1px] bg-white/10 hidden sm:block mx-1" />

                {/* Filter Toggle Button */}
                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`relative mr-1 flex items-center gap-3 px-6 py-3.5 rounded-full text-xs uppercase tracking-widest font-bold transition-all border ${
                        isExpanded 
                        ? 'bg-brand-gold text-brand-black border-brand-gold shadow-[0_0_20px_-5px_rgba(197,160,89,0.5)]' 
                        : 'bg-white/5 text-white border-white/5 hover:border-brand-gold/30 hover:bg-white/10 hover:text-brand-gold'
                    }`}
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="hidden sm:inline">Filtres</span>
                    
                    {/* Active Filters Indicator */}
                    {isFilterActive && (
                        <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-gold"></span>
                        </span>
                    )}
                </motion.button>
            </div>
        <motion.div
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-full max-w-6xl z-40 bg-[#0f0f0f]/95 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden"
        >

        {/* Expanded Panel - Grid Layout */}
        <AnimatePresence>
            {isExpanded && (
                <motion.div
                    variants={panelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="absolute left-0 right-0 top-full mt-4 mx-auto max-w-6xl z-40 bg-[#0f0f0f]/95 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden"
                >
                    <div className="p-6 md:p-8 relative max-h-[85vh] overflow-y-auto custom-scrollbar">
                        
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
                            
                            {/* COL 1: Sorting, Price & Favorites */}
                            <div className="lg:col-span-1 space-y-8">
                                
                                {/* Favorites Toggle */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4 text-brand-gold">
                                        <Heart className="w-4 h-4" />
                                        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold">Mes Favoris</h4>
                                    </div>
                                    <motion.button 
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={onToggleFavorites}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl text-xs font-medium transition-all duration-300 ${
                                            showFavoritesOnly 
                                            ? 'bg-brand-gold text-brand-black shadow-lg shadow-brand-gold/10' 
                                            : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                                            <span>Afficher mes favoris</span>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${showFavoritesOnly ? 'bg-black/20' : 'bg-white/10'}`}>
                                            {favoritesCount}
                                        </span>
                                    </motion.button>
                                </div>

                                {/* Sorting Section */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4 text-brand-gold">
                                        <ArrowUpDown className="w-4 h-4" />
                                        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold">Tri & Ordre</h4>
                                    </div>
                                    <div className="space-y-2">
                                        <SortButton active={activeSort === 'original'} onClick={() => onSortChange('original')} label="Par Défaut" />
                                        <SortButton active={activeSort === 'brand-asc'} onClick={() => onSortChange('brand-asc')} label="Marque (A-Z)" />
                                        <SortButton active={activeSort === 'price-asc'} onClick={() => onSortChange('price-asc')} label="Prix Croissant" />
                                        <SortButton active={activeSort === 'price-desc'} onClick={() => onSortChange('price-desc')} label="Prix Décroissant" />
                                    </div>
                                </div>

                                {/* Price Range Section */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4 text-brand-gold">
                                        <DollarSign className="w-4 h-4" />
                                        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold">Budget ($)</h4>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <input 
                                                type="number" 
                                                placeholder="Min"
                                                value={priceRange.min}
                                                onChange={(e) => onPriceRangeChange({...priceRange, min: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-3 text-sm text-white focus:border-brand-gold focus:bg-black/40 focus:outline-none transition-all placeholder:text-slate-600"
                                            />
                                        </div>
                                        <div className="relative flex-1">
                                            <input 
                                                type="number" 
                                                placeholder="Max"
                                                value={priceRange.max}
                                                onChange={(e) => onPriceRangeChange({...priceRange, max: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-3 text-sm text-white focus:border-brand-gold focus:bg-black/40 focus:outline-none transition-all placeholder:text-slate-600"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* COL 2 & 3: Main Filters (Categories & Brands) */}
                            <div className="lg:col-span-3 space-y-8 lg:border-l border-white/5 lg:pl-8">
                                
                                {/* Categories */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4 text-brand-gold">
                                        <Tag className="w-4 h-4" />
                                        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold">Catégories (Multi)</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.map(cat => {
                                            const isActive = activeCategories.includes(cat);
                                            return (
                                                <motion.button
                                                    layout
                                                    key={cat}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleMultiSelect(activeCategories, cat, onCategoryChange)}
                                                    className={`px-4 py-2 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-colors border ${
                                                        isActive
                                                        ? 'bg-brand-gold text-brand-black border-brand-gold shadow-lg shadow-brand-gold/10' 
                                                        : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10 hover:text-white'
                                                    }`}
                                                >
                                                    {cat === 'All' ? 'Tout' : cat}
                                                </motion.button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Brands */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4 text-brand-gold">
                                        <Building2 className="w-4 h-4" />
                                        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold">Constructeurs (Multi)</h4>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                                         <motion.button
                                            layout
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => onBrandChange(['All'])}
                                            className={`col-span-1 px-3 py-2 rounded border text-left text-[10px] uppercase tracking-wider font-bold transition-colors ${
                                                selectedBrands.includes('All')
                                                ? 'border-brand-gold text-brand-gold bg-brand-gold/5'
                                                : 'border-white/5 text-slate-500 hover:text-white hover:bg-white/5'
                                            }`}
                                        >
                                            Tout
                                        </motion.button>
                                        {brands.map(brand => {
                                            const isActive = selectedBrands.includes(brand);
                                            return (
                                                <motion.button
                                                    layout
                                                    key={brand}
                                                    whileHover={{ scale: 1.02, x: 2 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handleMultiSelect(selectedBrands, brand, onBrandChange)}
                                                    className={`truncate px-3 py-2 rounded border text-left text-[10px] uppercase tracking-wider font-bold transition-colors ${
                                                        isActive
                                                        ? 'border-brand-gold text-brand-gold bg-brand-gold/5'
                                                        : 'border-white/5 text-slate-500 hover:text-white hover:bg-white/5'
                                                    }`}
                                                >
                                                    {brand}
                                                </motion.button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                            <span className="text-[10px] text-slate-600 uppercase tracking-widest font-mono">
                                {isFilterActive ? 'Filtres actifs' : 'Aucun filtre'}
                            </span>
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onReset}
                                className="group flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-brand-crimsonBright hover:text-white transition-colors"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-current group-hover:scale-150 transition-transform"/>
                                Réinitialiser Tout
                            </motion.button>
                        </div>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};

// Helper Component for Sort Buttons
const SortButton = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
    <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-medium transition-all duration-200 ${
            active 
            ? 'bg-brand-gold text-brand-black shadow-md shadow-brand-gold/10' 
            : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
        }`}
    >
        <span>{label}</span>
        {active && <Check className="w-3.5 h-3.5" />}
    </motion.button>
);
