import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SortOption } from '../types';
import { 
  Search, X, SlidersHorizontal, ArrowUpDown, Building2, 
  Tag, DollarSign, Heart, ChevronDown 
} from 'lucide-react';

// --- CONSTANTES ---
const CATEGORY_ORDER = [
  'COMPACTS', 'COUPES', 'SEDANS', 'SUVS', 'OFF-ROAD', 'MUSCLE', 
  'SPORTS', 'SPORTS CLASSICS', 'SUPER', 'MOTORCYCLES', 'BIKES', 
  'HELICOPTERS', 'PLANES', 'BOATS', 'COMMERCIAL', 'INDUSTRIAL', 
  'MILITARY', 'SERVICE', 'EMERGENCY', 'UTILITY', 'VANS', 'CYCLES'
];

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

type TabID = 'brands' | 'categories' | 'budget' | 'sort' | 'favorites';

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
  const [activeTab, setActiveTab] = useState<TabID>('brands');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
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

  // Indicateur de filtre actif
  const isFilterActive = 
    (activeCategories.length > 0 && !activeCategories.includes('All')) || 
    (selectedBrands.length > 0 && !selectedBrands.includes('All')) || 
    activeSort !== 'original' ||
    priceRange.min !== '' ||
    priceRange.max !== '' ||
    showFavoritesOnly;

  // Tri des catégories
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      const indexA = CATEGORY_ORDER.indexOf(a.toUpperCase());
      const indexB = CATEGORY_ORDER.indexOf(b.toUpperCase());
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });
  }, [categories]);

  const handleMultiSelect = (current: string[], item: string, updater: (items: string[]) => void) => {
    let newVal = current.filter(i => i !== 'All');
    if (newVal.includes(item)) {
      newVal = newVal.filter(i => i !== item);
    } else {
      newVal.push(item);
    }
    if (newVal.length === 0) newVal = ['All'];
    updater(newVal);
  };

  const tabs = [
    { id: 'brands' as const, label: 'Marques', icon: <Building2 className="w-4 h-4" /> },
    { id: 'categories' as const, label: 'Catégories', icon: <Tag className="w-4 h-4" /> },
    { id: 'budget' as const, label: 'Budget', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'sort' as const, label: 'Trier', icon: <ArrowUpDown className="w-4 h-4" /> },
    { id: 'favorites' as const, label: 'Favoris', icon: <Heart className="w-4 h-4" />, badge: favoritesCount > 0 ? favoritesCount : undefined },
  ];

  return (
    // CONTENEUR STICKY (Flottant)
    <div className="sticky top-6 z-50 w-full flex justify-center pointer-events-none mb-10">
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(197,160,89,0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(197,160,89,0.6); }
      `}</style>

      {/* Conteneur de l'Île */}
      <div ref={panelRef} className="w-full max-w-4xl px-4 pointer-events-auto relative">
        
        {/* BARRE PRINCIPALE (Glassmorphism + Largeur) */}
        <motion.div 
          layout
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className={`
            bg-[#121212]/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] 
            p-3 relative z-50 transition-all duration-500 overflow-hidden
            ${isExpanded ? 'border-brand-gold/30 bg-[#0f0f0f]' : 'hover:border-white/20 hover:bg-[#151515]/90'}
          `}
        >
          <div className="flex items-center gap-3">
            
            {/* 1. INPUT RECHERCHE (Large & Fluide) */}
            <motion.div 
              layout
              className={`
                relative flex items-center flex-1 h-12 rounded-xl transition-all duration-300
                ${isSearchFocused ? 'bg-white/10 shadow-inner' : 'bg-white/5 hover:bg-white/10'}
              `}
            >
              <Search className={`absolute left-4 w-5 h-5 transition-colors ${isSearchFocused ? 'text-brand-gold' : 'text-slate-500'}`} />
              <input 
                type="text" 
                placeholder="Rechercher un modèle, une marque..." 
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full h-full bg-transparent border-none py-0 pl-12 pr-10 text-base text-white placeholder:text-slate-500/70 focus:outline-none focus:ring-0 font-medium"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 p-1 text-slate-500 hover:text-white rounded-full hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Séparateur Vertical */}
            <div className="w-[1px] h-8 bg-white/10 hidden sm:block" />

            {/* 2. BOUTON FILTRES (Premium Button) */}
            <motion.button 
              layout
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className={`
                flex items-center gap-3 px-6 h-12 rounded-xl text-sm font-bold uppercase tracking-wider border transition-all duration-300
                ${isExpanded 
                  ? 'bg-brand-gold text-black border-brand-gold shadow-[0_0_20px_-5px_rgba(197,160,89,0.4)]' 
                  : 'bg-white/5 text-white border-white/5 hover:bg-white/10 hover:border-white/20'
                }
              `}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filtres</span>
              
              {/* Indicateur de status */}
              <div className="relative w-4 h-4 flex items-center justify-center">
                 {isExpanded ? (
                    <ChevronDown className="w-4 h-4 rotate-180 transition-transform" />
                 ) : (
                    isFilterActive ? (
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-gold"></span>
                        </span>
                    ) : (
                        <ChevronDown className="w-4 h-4 text-white/50" />
                    )
                 )}
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* PANNEAU DÉROULANT (Contenu) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 8, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, scale: 0.98, filter: "blur(10px)" }}
              transition={{ type: "spring", stiffness: 180, damping: 25 }}
              className="absolute top-full left-4 right-4 bg-[#121212] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-40 flex flex-col max-h-[75vh]"
            >
              {/* Barre de Navigation des Onglets */}
              <div className="px-4 py-3 border-b border-white/5 bg-[#0a0a0a]">
                <div className="grid grid-cols-5 gap-2">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          relative flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl transition-all duration-300
                          ${isActive 
                            ? 'bg-brand-gold/10 text-brand-gold ring-1 ring-brand-gold/30' 
                            : 'text-slate-500 hover:text-white hover:bg-white/5'
                          }
                        `}
                      >
                        {tab.icon}
                        <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">{tab.label}</span>
                        
                        {/* Badge de Notification */}
                        {tab.badge !== undefined && (
                          <span className={`absolute top-1 right-1 sm:top-1 sm:right-2 min-w-[16px] h-4 flex items-center justify-center rounded-full text-[9px] font-bold px-1 ${isActive ? 'bg-brand-gold text-black' : 'bg-white/20 text-white'}`}>
                            {tab.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Contenu Dynamique */}
              <div className="p-6 overflow-y-auto custom-scrollbar bg-gradient-to-b from-[#121212] to-[#0a0a0a] min-h-[400px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="h-full"
                  >
                    {/* ONGLET MARQUES */}
                    {activeTab === 'brands' && (
                      <div className="space-y-6">
                        <SectionHeader title="Constructeurs" subtitle="Sélectionnez vos marques favorites" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {brands.map(brand => (
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

                    {/* ONGLET CATÉGORIES */}
                    {activeTab === 'categories' && (
                      <div className="space-y-6">
                         <SectionHeader title="Catégories Officielles" subtitle="Classification BlackWood" />
                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {sortedCategories.map(cat => (
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

                    {/* ONGLET BUDGET */}
                    {activeTab === 'budget' && (
                      <div className="space-y-10 py-8 px-4">
                        <SectionHeader title="Fourchette de Prix" subtitle="Définissez votre budget d'investissement" />
                        
                        <div className="flex flex-col md:flex-row items-center gap-8 justify-center max-w-2xl mx-auto">
                           {/* MIN */}
                           <div className="w-full relative group">
                              <label className="absolute -top-6 left-1 text-[10px] text-brand-gold font-bold uppercase tracking-widest">Minimum</label>
                              <div className="relative flex items-center">
                                <span className="absolute left-4 text-slate-500 text-lg">$</span>
                                <input 
                                  type="number" 
                                  value={priceRange.min}
                                  onChange={(e) => onPriceRangeChange({...priceRange, min: e.target.value})}
                                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-10 pr-4 text-2xl font-mono text-white focus:border-brand-gold focus:bg-white/10 focus:outline-none transition-all placeholder:text-slate-700"
                                  placeholder="0"
                                />
                              </div>
                           </div>
                           
                           <div className="text-slate-600 hidden md:block">
                              <ArrowUpDown className="w-6 h-6 rotate-90" />
                           </div>

                           {/* MAX */}
                           <div className="w-full relative group">
                              <label className="absolute -top-6 left-1 text-[10px] text-brand-gold font-bold uppercase tracking-widest">Maximum</label>
                              <div className="relative flex items-center">
                                <span className="absolute left-4 text-slate-500 text-lg">$</span>
                                <input 
                                  type="number" 
                                  value={priceRange.max}
                                  onChange={(e) => onPriceRangeChange({...priceRange, max: e.target.value})}
                                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-10 pr-4 text-2xl font-mono text-white focus:border-brand-gold focus:bg-white/10 focus:outline-none transition-all placeholder:text-slate-700"
                                  placeholder="Illimité"
                                />
                              </div>
                           </div>
                        </div>
                      </div>
                    )}

                    {/* ONGLET TRI */}
                    {activeTab === 'sort' && (
                      <div className="space-y-6 max-w-lg mx-auto">
                        <SectionHeader title="Critères de Tri" subtitle="Organiser l'affichage" />
                        <div className="space-y-3">
                          <SortOptionItem active={activeSort === 'original'} onClick={() => onSortChange('original')} label="Pertinence (Catalogue)" />
                          <SortOptionItem active={activeSort === 'price-asc'} onClick={() => onSortChange('price-asc')} label="Prix : Croissant" />
                          <SortOptionItem active={activeSort === 'price-desc'} onClick={() => onSortChange('price-desc')} label="Prix : Décroissant" />
                          <SortOptionItem active={activeSort === 'brand-asc'} onClick={() => onSortChange('brand-asc')} label="Alphabétique (Marque)" />
                        </div>
                      </div>
                    )}

                    {/* ONGLET FAVORIS */}
                    {activeTab === 'favorites' && (
                      <div className="flex flex-col items-center justify-center h-full py-12 space-y-8 text-center">
                         <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring" }}
                            className={`p-8 rounded-full border-[3px] ${showFavoritesOnly ? 'bg-brand-gold/10 border-brand-gold text-brand-gold shadow-[0_0_40px_-10px_rgba(197,160,89,0.5)]' : 'bg-white/5 border-white/5 text-slate-600'}`}
                          >
                            <Heart className={`w-12 h-12 ${showFavoritesOnly ? 'fill-brand-gold' : ''}`} />
                         </motion.div>
                         
                         <div className="space-y-3">
                            <h3 className="text-2xl font-bold text-white font-serif">
                              {showFavoritesOnly ? 'Mode Favoris Actif' : 'Vos Favoris'}
                            </h3>
                            <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                              {showFavoritesOnly 
                                ? `Vous consultez actuellement votre sélection privée de ${favoritesCount} véhicules.` 
                                : `Activez ce mode pour masquer le catalogue complet et vous concentrer sur votre sélection.`}
                            </p>
                         </div>
                         
                         <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onToggleFavorites}
                            className={`px-10 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${
                              showFavoritesOnly 
                              ? 'bg-transparent text-white border-white/20 hover:bg-white/10' 
                              : 'bg-brand-gold text-black border-brand-gold hover:bg-brand-gold/90 shadow-lg shadow-brand-gold/20'
                            }`}
                         >
                            {showFavoritesOnly ? 'Voir tout le catalogue' : 'Afficher mes favoris'}
                         </motion.button>
                      </div>
                    )}

                  </motion.div>
                </AnimatePresence>
              </div>

              {/* PIED DE PAGE DU PANNEAU */}
              <div className="p-4 border-t border-white/5 bg-[#080808] flex justify-between items-center">
                 <button 
                    onClick={onReset}
                    className="text-[10px] uppercase tracking-widest font-bold text-slate-500 hover:text-brand-crimsonBright transition-colors flex items-center gap-2 group px-2 py-1"
                 >
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500 group-hover:bg-brand-crimsonBright transition-colors" />
                    Réinitialiser
                 </button>
                 <div className="text-[10px] text-brand-gold/30 font-mono tracking-[0.2em]">
                    BLACKWOOD ROYAL MOTORS
                 </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

// --- COMPOSANTS UI AUXILIAIRES ---

const SectionHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="mb-6 pl-1 border-l-2 border-brand-gold/50 pl-4">
    <h3 className="text-sm font-bold text-white uppercase tracking-[0.15em]">{title}</h3>
    <p className="text-[11px] text-slate-500 mt-1 font-medium">{subtitle}</p>
  </div>
);

const SelectionCard = ({ label, active, onClick, fullWidth }: { label: string, active: boolean, onClick: () => void, fullWidth?: boolean }) => (
  <motion.button
    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`
      ${fullWidth ? 'col-span-full' : ''}
      relative px-4 py-4 rounded-xl text-left border transition-all duration-300 group overflow-hidden
      ${active 
        ? 'bg-brand-gold/10 border-brand-gold shadow-[0_0_20px_-10px_rgba(197,160,89,0.3)]' 
        : 'bg-[#1a1a1a] border-white/5 hover:border-white/20' 
      }
    `}
  >
    <div className="flex items-center justify-between relative z-10">
      <span className={`text-[11px] font-bold uppercase tracking-wider truncate ${active ? 'text-brand-gold' : 'text-slate-400 group-hover:text-white'}`}>
        {label}
      </span>
      {active && (
         <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="w-2 h-2 rounded-full bg-brand-gold shadow-[0_0_8px_rgba(197,160,89,1)]" 
         />
      )}
    </div>
  </motion.button>
);

const SortOptionItem = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <motion.button
    whileHover={{ x: 4 }}
    onClick={onClick}
    className={`w-full flex items-center justify-between p-5 rounded-xl border transition-all ${
      active 
      ? 'bg-brand-gold/10 border-brand-gold' 
      : 'bg-transparent border-white/5 text-slate-500 hover:bg-white/5 hover:text-white hover:border-white/10'
    }`}
  >
    <span className={`text-xs font-bold uppercase tracking-wide ${active ? 'text-brand-gold' : ''}`}>{label}</span>
    {active && <div className="w-2 h-2 rounded-full bg-brand-gold shadow-[0_0_10px_rgba(197,160,89,0.8)]" />}
  </motion.button>
);
