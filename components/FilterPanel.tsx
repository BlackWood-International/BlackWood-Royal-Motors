import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SortOption } from '../types';
import { 
  Search, X, SlidersHorizontal, ArrowUpDown, Building2, 
  Tag, DollarSign, Heart, ChevronDown, Check, Layers, Copy, Trash2, Crown
} from 'lucide-react';

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
  onShare?: () => void;
  onClearFavorites: () => void;
  vipFilter: 'all' | 'only-vip' | 'no-vip';
  onVipFilterChange: (val: 'all' | 'only-vip' | 'no-vip') => void;
}

type TabID = 'brands' | 'categories' | 'budget' | 'sort' | 'vip' | 'favorites';

export const FilterPanel: React.FC<FilterPanelProps> = ({
  categories, activeCategories, onCategoryChange,
  brands, selectedBrands, onBrandChange,
  searchQuery, onSearchChange,
  activeSort, onSortChange,
  priceRange, onPriceRangeChange,
  onReset,
  showFavoritesOnly, onToggleFavorites, favoritesCount,
  onShare, onClearFavorites,
  vipFilter, onVipFilterChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // Default tab changed to 'categories' as per new order request
  const [activeTab, setActiveTab] = useState<TabID>('categories');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  
  // New state for 2-step clear confirmation
  const [isClearConfirming, setIsClearConfirming] = useState(false);
  
  // Scroll Lock Width state
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  const panelRef = useRef<HTMLDivElement>(null);

  // Fermeture au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- SCROLL LOCK LOGIC FOR FILTER PANEL ---
  useEffect(() => {
    if (isExpanded) {
        const width = window.innerWidth - document.documentElement.clientWidth;
        setScrollbarWidth(width);
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${width}px`;
    } else {
        setScrollbarWidth(0);
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }
    return () => {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }
  }, [isExpanded]);


  // Indicateur de filtre actif
  const isFilterActive = 
    (activeCategories.length > 0 && !activeCategories.includes('All')) || 
    (selectedBrands.length > 0 && !selectedBrands.includes('All')) || 
    activeSort !== 'original' ||
    priceRange.min !== '' ||
    priceRange.max !== '' ||
    showFavoritesOnly ||
    vipFilter !== 'all';

  // Filtrage simple sans tri alphabétique (respect de l'ordre CSV)
  const displayCategories = useMemo(() => {
    return categories.filter(c => c !== 'All');
  }, [categories]);

  const displayBrands = useMemo(() => {
      return brands.filter(b => b !== 'All');
  }, [brands]);

  const handleShareClick = () => {
    if (onShare) {
        onShare();
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 3000);
    }
  };

  const handleClearClick = () => {
    if (isClearConfirming) {
        onClearFavorites();
        setIsClearConfirming(false);
    } else {
        setIsClearConfirming(true);
        setTimeout(() => setIsClearConfirming(false), 3000);
    }
  };

  const handleMultiSelect = (current: string[], item: string, updater: (items: string[]) => void) => {
    let newVal = current.filter(i => i !== 'All');
    
    if (newVal.includes(item)) {
      newVal = newVal.filter(i => i !== item); // Deselect
    } else {
      newVal.push(item); // Select
    }
    
    if (newVal.length === 0) newVal = ['All'];
    updater(newVal);
  };

  const tabs = [
    { id: 'categories' as const, label: 'Catégories', icon: <Tag className="w-4 h-4" /> },
    { id: 'brands' as const, label: 'Marques', icon: <Building2 className="w-4 h-4" /> },
    { id: 'budget' as const, label: 'Budget', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'sort' as const, label: 'Trier', icon: <ArrowUpDown className="w-4 h-4" /> },
    { id: 'vip' as const, label: 'VIP', icon: <Crown className="w-4 h-4" /> },
    { id: 'favorites' as const, label: 'Favoris', icon: <Heart className="w-4 h-4" />, badge: favoritesCount > 0 ? favoritesCount : undefined },
  ];

  // Budget Quick Presets
  const budgetPresets = [
    { label: "Entrée (< 50k)", min: "", max: "50000" },
    { label: "Sport (50k-300k)", min: "50000", max: "300000" },
    { label: "Luxe (300k-1M)", min: "300000", max: "1000000" },
    { label: "Élite (> 1M)", min: "1000000", max: "" },
  ];

  return (
    <div 
        className="fixed top-[4rem] sm:top-[4.5rem] md:top-24 left-0 right-0 z-[90] w-full flex justify-center pointer-events-none transition-all duration-300"
        style={{ paddingRight: scrollbarWidth ? `${scrollbarWidth}px` : undefined }}
    >
      <div className="w-full px-2 sm:px-4 flex justify-center">
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(197,160,89,0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(197,160,89,0.6); }
      `}</style>

      {/* Conteneur Principal */}
      <div ref={panelRef} className="w-full max-w-3xl pointer-events-auto relative">
        
        {/* BARRE FLOTTANTE */}
        <motion.div 
          layout
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className={`
            relative flex items-center justify-between p-1.5 sm:p-2 pl-4 sm:pl-5 pr-1.5 sm:pr-2
            bg-[#050505]/95 backdrop-blur-xl border border-white/10 
            rounded-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]
            transition-all duration-500 z-50
            ${isExpanded ? 'border-brand-gold/30' : 'hover:border-white/20 hover:bg-[#0a0a0a]/90'}
          `}
        >
            {/* Zone Input Recherche */}
            <motion.div 
              className="flex-1 flex items-center gap-2 sm:gap-3 mr-2 group/search"
              layout
            >
              <Search className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${isSearchFocused ? 'text-brand-gold' : 'text-slate-500 group-hover/search:text-white'}`} />
              <input 
                type="text" 
                placeholder="Rechercher un modèle..." 
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-transparent border-none text-base sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-0 font-medium h-9 sm:h-10 tracking-wide"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => onSearchChange('')}
                    className="p-1 text-slate-500 hover:text-white rounded-full hover:bg-white/10"
                  >
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Séparateur */}
            <div className="w-[1px] h-6 bg-white/10 hidden sm:block mr-2" />

            {/* Bouton Toggle Filtres */}
            <motion.button 
              layout
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className={`
                flex items-center gap-2 sm:gap-3 px-3 sm:px-6 h-9 sm:h-11 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all duration-300
                ${isExpanded 
                  ? 'bg-brand-gold text-black shadow-[0_0_20px_-5px_rgba(197,160,89,0.4)]' 
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Filtres</span>
              </div>
              
              <div className="flex items-center justify-center w-3 h-3 ml-0 sm:ml-1">
                 {isExpanded ? (
                    <ChevronDown className="w-3 h-3 transition-transform rotate-180" />
                 ) : (
                    isFilterActive ? (
                        <div className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold shadow-[0_0_8px_rgba(197,160,89,0.8)]"></span>
                        </div>
                    ) : (
                        <ChevronDown className="w-3 h-3 text-white/30" />
                    )
                 )}
              </div>
            </motion.button>
        </motion.div>

        {/* PANNEAU DÉROULANT */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 12, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, scale: 0.98, filter: "blur(10px)" }}
              transition={{ type: "spring", stiffness: 180, damping: 25 }}
              className="absolute top-full left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-3xl border border-white/10 rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl z-40 flex flex-col max-h-[75vh] sm:max-h-[75vh] mx-0"
            >
              {/* Onglets */}
              <div className="p-2 sm:p-3 border-b border-white/5 bg-[#050505]/50">
                <div className="grid grid-cols-6 gap-1 sm:gap-2">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          relative flex flex-col items-center justify-center gap-1.5 py-3 sm:py-4 rounded-full transition-all duration-300 group
                          ${isActive 
                            ? 'bg-white/10 text-brand-gold shadow-inner' 
                            : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                          }
                        `}
                      >
                        {tab.icon}
                        <span className="text-[6px] xs:text-[7px] md:text-[9px] font-bold uppercase tracking-wider hidden xs:block">{tab.label}</span>
                        {isActive && (
                            <motion.div layoutId="activeTabIndicator" className="absolute bottom-1 w-1 h-1 rounded-full bg-brand-gold" />
                        )}
                        {tab.badge !== undefined && (
                          <span className={`absolute top-1 right-1 sm:top-2 sm:right-4 min-w-[12px] h-[12px] sm:min-w-[14px] sm:h-[14px] flex items-center justify-center rounded-full text-[7px] sm:text-[8px] font-bold px-1 ${isActive ? 'bg-brand-gold text-black' : 'bg-white/20 text-white'}`}>
                            {tab.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Contenu */}
              <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar bg-[#0a0a0a] min-h-[300px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="h-full pb-8"
                  >
                    {/* CATÉGORIES */}
                    {activeTab === 'categories' && (
                      <div className="space-y-4 sm:space-y-6">
                         <SectionHeader title="Catégories Officielles" subtitle="Classification BlackWood" />
                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                             <SelectionCard 
                                label="TOUT" 
                                active={activeCategories.includes('All')} 
                                onClick={() => onCategoryChange(['All'])}
                                special
                             />
                            {displayCategories.map(cat => (
                              <SelectionCard 
                                key={cat}
                                label={cat} 
                                active={activeCategories.includes(cat)} 
                                onClick={() => handleMultiSelect(activeCategories, cat, onCategoryChange)} 
                              />
                            ))}
                         </div>
                      </div>
                    )}
                    
                    {/* MARQUES */}
                    {activeTab === 'brands' && (
                      <div className="space-y-4 sm:space-y-6">
                        <SectionHeader title="Constructeurs" subtitle="Sélectionnez vos marques favorites" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          <SelectionCard 
                            label="TOUT" 
                            active={selectedBrands.includes('All')} 
                            onClick={() => onBrandChange(['All'])}
                            special
                          />
                          {displayBrands.map(brand => (
                            <SelectionCard 
                              key={brand}
                              label={brand} 
                              active={selectedBrands.includes(brand)} 
                              onClick={() => handleMultiSelect(selectedBrands, brand, onBrandChange)} 
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* BUDGET (REWORKED) */}
                    {activeTab === 'budget' && (
                      <div className="space-y-6 sm:space-y-8 py-2 px-1 flex flex-col items-center max-w-2xl mx-auto">
                        
                        <div className="w-full">
                            <SectionHeader title="Budget Rapide" subtitle="Sélections fréquentes" centered />
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                                {budgetPresets.map((preset, idx) => {
                                    const isActive = priceRange.min === preset.min && priceRange.max === preset.max;
                                    return (
                                        <motion.button
                                            key={idx}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => onPriceRangeChange({ min: preset.min, max: preset.max })}
                                            className={`
                                                py-3 px-2 rounded-2xl text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border transition-colors
                                                ${isActive 
                                                    ? 'bg-brand-gold text-black border-brand-gold shadow-[0_0_15px_rgba(197,160,89,0.3)]' 
                                                    : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white hover:border-white/20'
                                                }
                                            `}
                                        >
                                            {preset.label}
                                        </motion.button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="w-full pt-4 border-t border-white/5">
                            <SectionHeader title="Budget Personnalisé" subtitle="Définissez votre fourchette exacte" centered />
                            
                            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center w-full">
                            <div className="w-full relative group">
                                <label className="text-[9px] text-brand-gold/70 font-bold uppercase tracking-widest mb-2 block pl-4">Minimum</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-6 text-slate-500 text-lg font-light">$</span>
                                    <input 
                                    type="number" 
                                    value={priceRange.min}
                                    onChange={(e) => onPriceRangeChange({...priceRange, min: e.target.value})}
                                    className="w-full bg-[#151515] border border-white/5 rounded-[2rem] py-3.5 sm:py-4 pl-10 pr-6 text-lg sm:text-xl font-mono text-white focus:border-brand-gold/50 focus:bg-[#1a1a1a] focus:outline-none transition-all placeholder:text-slate-700 text-center"
                                    placeholder="0"
                                    />
                                </div>
                            </div>
                            
                            <div className="text-slate-700 hidden sm:block pt-6">
                                <ArrowUpDown className="w-5 h-5 rotate-90 opacity-50" />
                            </div>

                            <div className="w-full relative group">
                                <label className="text-[9px] text-brand-gold/70 font-bold uppercase tracking-widest mb-2 block pl-4">Maximum</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-6 text-slate-500 text-lg font-light">$</span>
                                    <input 
                                    type="number" 
                                    value={priceRange.max}
                                    onChange={(e) => onPriceRangeChange({...priceRange, max: e.target.value})}
                                    className="w-full bg-[#151515] border border-white/5 rounded-[2rem] py-3.5 sm:py-4 pl-10 pr-6 text-lg sm:text-xl font-mono text-white focus:border-brand-gold/50 focus:bg-[#1a1a1a] focus:outline-none transition-all placeholder:text-slate-700 text-center"
                                    placeholder="∞"
                                    />
                                </div>
                            </div>
                            </div>
                        </div>
                      </div>
                    )}
                    
                    {/* TRI (Moved before VIP) */}
                    {activeTab === 'sort' && (
                      <div className="space-y-6 max-w-md mx-auto">
                        <SectionHeader title="Ordre d'affichage" subtitle="Organiser la collection" centered />
                        <div className="space-y-3">
                          <SortOptionItem active={activeSort === 'original'} onClick={() => onSortChange('original')} label="Pertinence (Catalogue)" />
                          <SortOptionItem active={activeSort === 'price-asc'} onClick={() => onSortChange('price-asc')} label="Prix : Croissant" />
                          <SortOptionItem active={activeSort === 'price-desc'} onClick={() => onSortChange('price-desc')} label="Prix : Décroissant" />
                          <SortOptionItem active={activeSort === 'brand-asc'} onClick={() => onSortChange('brand-asc')} label="Alphabétique (Marque)" />
                        </div>
                      </div>
                    )}

                    {/* VIP FILTERS */}
                    {activeTab === 'vip' && (
                        <div className="space-y-6 max-w-md mx-auto">
                            <SectionHeader title="Collection VIP" subtitle="Gérer l'affichage des véhicules exclusifs" centered />
                            <div className="space-y-3">
                                <SortOptionItem 
                                    active={vipFilter === 'all'} 
                                    onClick={() => onVipFilterChange('all')} 
                                    label="Tout Afficher (Standard + VIP)" 
                                />
                                <SortOptionItem 
                                    active={vipFilter === 'only-vip'} 
                                    onClick={() => onVipFilterChange('only-vip')} 
                                    label="Collection VIP Uniquement" 
                                    highlightGold
                                />
                                <SortOptionItem 
                                    active={vipFilter === 'no-vip'} 
                                    onClick={() => onVipFilterChange('no-vip')} 
                                    label="Masquer les exclusivités" 
                                />
                            </div>
                        </div>
                    )}

                    {/* FAVORIS */}
                    {activeTab === 'favorites' && (
                      <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                         <motion.div 
                            onClick={onToggleFavorites}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`mb-6 p-6 rounded-full border-[3px] transition-colors duration-500 cursor-pointer ${showFavoritesOnly ? 'bg-brand-gold/10 border-brand-gold text-brand-gold shadow-[0_0_50px_-10px_rgba(197,160,89,0.4)]' : 'bg-white/5 border-white/5 text-slate-600 hover:border-white/20 hover:text-white'}`}
                          >
                            <Heart className={`w-12 h-12 ${showFavoritesOnly ? 'fill-brand-gold' : ''}`} />
                         </motion.div>
                         
                         <div className="space-y-3 max-w-sm mb-6">
                            <h3 className="text-xl font-bold text-white font-serif">
                              {showFavoritesOnly ? 'Mode Favoris Actif' : 'Vos Favoris'}
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed px-4">
                              {showFavoritesOnly 
                                ? `Affichage exclusif de vos ${favoritesCount} véhicules sélectionnés.` 
                                : `Vous avez ${favoritesCount} véhicule(s) dans votre sélection.`}
                            </p>
                         </div>
                         
                         <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onToggleFavorites}
                            className={`mb-8 px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${
                              showFavoritesOnly 
                              ? 'bg-transparent text-white border-white/20 hover:bg-white/10' 
                              : 'bg-brand-gold text-black border-brand-gold hover:bg-brand-gold/90 shadow-lg shadow-brand-gold/20'
                            }`}
                         >
                            {showFavoritesOnly ? 'Retour au catalogue' : 'Activer le filtre favoris'}
                         </motion.button>
                         
                         {favoritesCount > 0 && (
                            <div className="w-full max-w-xs border-t border-white/10 pt-6">
                                <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-3 font-bold">Actions sur la sélection</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="relative">
                                        <motion.button
                                            whileHover={{ scale: 1.02, backgroundColor: "rgba(197, 160, 89, 0.15)" }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleShareClick}
                                            className="w-full py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border border-brand-gold/30 text-brand-gold bg-brand-gold/5 flex flex-col items-center justify-center gap-1.5"
                                        >
                                            <Copy className="w-4 h-4" />
                                            <span>Copier Liste</span>
                                        </motion.button>
                                        
                                        <AnimatePresence>
                                            {showCopied && (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute -top-10 left-0 right-0 mx-auto w-max px-3 py-1 bg-brand-gold text-black text-[9px] font-bold rounded-md shadow-lg"
                                                >
                                                    Copié !
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    
                                    <motion.button
                                        whileHover={!isClearConfirming ? { scale: 1.02, backgroundColor: "rgba(155, 28, 28, 0.15)" } : { scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleClearClick}
                                        className={`w-full py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border flex flex-col items-center justify-center gap-1.5 ${
                                            isClearConfirming 
                                            ? 'bg-brand-crimson text-white border-brand-crimson shadow-lg shadow-brand-crimson/30' 
                                            : 'border-brand-crimsonBright/30 text-brand-crimsonBright bg-brand-crimsonBright/5'
                                        }`}
                                    >
                                        <Trash2 className={`w-4 h-4 ${isClearConfirming ? 'animate-bounce' : ''}`} />
                                        <span>{isClearConfirming ? 'Confirmer ?' : 'Vider tout'}</span>
                                    </motion.button>
                                </div>
                            </div>
                         )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-6 sm:px-8 py-4 sm:py-5 border-t border-white/5 bg-[#050505] flex justify-between items-center rounded-b-[2rem] sm:rounded-b-[3rem]">
                 <button 
                    onClick={onReset}
                    className="text-[8px] sm:text-[9px] uppercase tracking-widest font-bold text-slate-500 hover:text-white transition-colors flex items-center gap-2 group px-2 py-1"
                 >
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500 group-hover:bg-brand-crimsonBright transition-colors" />
                    Réinitialiser
                 </button>
                 <div className="text-[8px] sm:text-[9px] text-brand-gold/30 font-mono tracking-[0.2em] uppercase">
                    BlackWood
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>
    </div>
  );
};

// UI Components
interface SectionHeaderProps {
  title: string;
  subtitle: string;
  centered?: boolean;
}
const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, centered }) => (
  <div className={`mb-4 sm:mb-6 ${centered ? 'text-center' : 'pl-4 border-l-2 border-brand-gold/30'}`}>
    <h3 className="text-xs font-bold text-white uppercase tracking-[0.15em]">{title}</h3>
    <p className="text-[10px] text-slate-500 mt-1 font-medium tracking-wide">{subtitle}</p>
  </div>
);

interface SelectionCardProps {
  label: string;
  active: boolean;
  onClick: () => void;
  fullWidth?: boolean;
  special?: boolean;
}
const SelectionCard: React.FC<SelectionCardProps> = ({ label, active, onClick, fullWidth, special }) => (
  <motion.button
    whileHover={{ scale: 1.02, backgroundColor: active ? '' : "rgba(255,255,255,0.08)" }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`
      ${fullWidth ? 'col-span-full' : ''}
      relative px-3 sm:px-4 py-3 sm:py-3.5 rounded-[1.2rem] sm:rounded-[1.5rem] text-left border transition-all duration-300 group overflow-hidden
      ${active 
        ? 'bg-brand-gold/10 border-brand-gold shadow-[0_0_15px_-5px_rgba(197,160,89,0.2)]' 
        : special 
            ? 'bg-transparent border-brand-gold/30 text-brand-gold/80 hover:border-brand-gold hover:text-brand-gold'
            : 'bg-[#151515] border-white/5 hover:border-white/20' 
      }
    `}
  >
    <div className="flex items-center justify-between relative z-10">
      <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider truncate ${active ? 'text-brand-gold' : (special ? 'text-inherit' : 'text-slate-400 group-hover:text-white')}`}>
        {label === 'All' ? 'TOUT' : label}
      </span>
      {active ? (
         <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-brand-gold">
           <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
         </motion.div>
      ) : special && (
         <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-50" />
      )}
    </div>
  </motion.button>
);

interface SortOptionItemProps {
  label: string;
  active: boolean;
  onClick: () => void;
  highlightGold?: boolean;
}
const SortOptionItem: React.FC<SortOptionItemProps> = ({ label, active, onClick, highlightGold }) => (
  <motion.button
    whileHover={{ x: 4 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
    onClick={onClick}
    // Optimization: Removed transition-all, switched to transition-colors to fix hover lag with framer motion x
    className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-[1.2rem] sm:rounded-[1.5rem] border transition-colors duration-200 ${
      active 
      ? 'bg-brand-gold/10 border-brand-gold shadow-[0_0_15px_-5px_rgba(197,160,89,0.2)]' 
      : 'bg-[#151515] border-white/5 text-slate-500 hover:bg-white/5 hover:text-white hover:border-white/10'
    }`}
  >
    <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${active ? 'text-brand-gold' : (highlightGold ? 'text-brand-gold/70' : '')}`}>{label}</span>
    {active && <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-gold" />}
  </motion.button>
);
