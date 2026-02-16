import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SortOption } from '../types';
import { 
  Search, X, SlidersHorizontal, ArrowUpDown, Building2, 
  Tag, Check, DollarSign, Heart, LayoutGrid 
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

  // Calculs d'état
  const isFilterActive = 
    !activeCategories.includes('All') || 
    !selectedBrands.includes('All') || 
    activeSort !== 'original' ||
    priceRange.min !== '' ||
    priceRange.max !== '' ||
    showFavoritesOnly;

  const handleMultiSelect = (current: string[], item: string, updater: (items: string[]) => void) => {
    if (item === 'All') return updater(['All']);
    let newVal = [...current];
    if (newVal.includes('All')) newVal = [];
    if (newVal.includes(item)) newVal = newVal.filter(i => i !== item);
    else newVal.push(item);
    if (newVal.length === 0) newVal = ['All'];
    updater(newVal);
  };

  // Configuration des onglets
  const tabs = [
    { id: 'brands' as const, label: 'Marques', icon: <Building2 className="w-4 h-4" /> },
    { id: 'categories' as const, label: 'Types', icon: <Tag className="w-4 h-4" /> },
    { id: 'budget' as const, label: 'Budget', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'sort' as const, label: 'Trier', icon: <ArrowUpDown className="w-4 h-4" /> },
    { id: 'favorites' as const, label: 'Favoris', icon: <Heart className="w-4 h-4" />, badge: favoritesCount > 0 ? favoritesCount : undefined },
  ];

  return (
    <div ref={panelRef} className="sticky top-6 z-50 w-full px-4 mb-8 pointer-events-none flex justify-center">
      
      {/* Styles globaux pour scrollbar */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="w-full max-w-2xl pointer-events-auto relative">
        
        {/* BARRE FLOTTANTE PRINCIPALE */}
        <motion.div 
          layout
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`bg-[#121212]/90 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl p-2 relative z-50 transition-colors duration-300 ${isExpanded ? 'border-brand-gold/50 bg-[#0a0a0a]' : 'hover:border-white/20'}`}
        >
          <div className="flex items-center gap-2">
            
            {/* Recherche */}
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-gold transition-colors" />
              <input 
                type="text" 
                placeholder="Rechercher une voiture..." 
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-white/5 hover:bg-white/10 focus:bg-black/50 border border-transparent focus:border-brand-gold/30 rounded-full py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all shadow-inner"
              />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="w-[1px] h-6 bg-white/10 mx-1 hidden sm:block" />

            {/* Bouton Toggle Filtres */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                isExpanded 
                ? 'bg-brand-gold text-brand-black border-brand-gold shadow-[0_0_15px_-3px_rgba(197,160,89,0.4)]' 
                : 'bg-white/5 text-white border-white/5 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filtres</span>
              {isFilterActive && (
                <div className="relative flex h-2 w-2 ml-1">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isExpanded ? 'bg-black' : 'bg-brand-gold'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isExpanded ? 'bg-black' : 'bg-brand-gold'}`}></span>
                </div>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* PANNEAU DÉPLIÉ (Compact & Tabbed) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="absolute top-full left-0 right-0 mt-3 bg-[#0f0f0f] border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-40 flex flex-col max-h-[70vh]"
            >
              {/* En-tête des Onglets */}
              <div className="flex items-center gap-1 p-2 border-b border-white/5 overflow-x-auto hide-scrollbar bg-black/20">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wide transition-all whitespace-nowrap flex-1 justify-center ${
                        isActive ? 'text-brand-black' : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="activeTab"
                          className="absolute inset-0 bg-brand-gold rounded-2xl"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className="relative z-10">{tab.icon}</span>
                      <span className="relative z-10 hidden sm:inline">{tab.label}</span>
                      {tab.badge !== undefined && (
                        <span className={`relative z-10 ml-1 px-1.5 py-0.5 rounded text-[9px] ${isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-white'}`}>
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Contenu de l'onglet actif */}
              <div className="p-6 overflow-y-auto custom-scrollbar bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] min-h-[300px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    {/* CONTENU : MARQUES */}
                    {activeTab === 'brands' && (
                      <div className="space-y-4">
                        <SectionHeader title="Constructeurs Disponibles" subtitle="Sélection multiple possible" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <SelectionCard 
                            label="Tous les modèles" 
                            active={selectedBrands.includes('All')} 
                            onClick={() => onBrandChange(['All'])}
                            fullWidth
                          />
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

                    {/* CONTENU : CATÉGORIES */}
                    {activeTab === 'categories' && (
                      <div className="space-y-4">
                         <SectionHeader title="Type de Véhicule" subtitle="Filtrer par carrosserie" />
                         <div className="flex flex-wrap gap-3">
                            {categories.map(cat => (
                              <SelectionCard 
                                key={cat}
                                label={cat === 'All' ? 'Toutes catégories' : cat} 
                                active={activeCategories.includes(cat)} 
                                onClick={() => handleMultiSelect(activeCategories, cat, onCategoryChange)} 
                              />
                            ))}
                         </div>
                      </div>
                    )}

                    {/* CONTENU : BUDGET */}
                    {activeTab === 'budget' && (
                      <div className="space-y-8 py-4">
                        <SectionHeader title="Fourchette de Prix" subtitle="Définissez votre budget ($)" />
                        <div className="flex items-center gap-4">
                           <div className="flex-1 space-y-2">
                              <label className="text-xs text-slate-500 uppercase font-bold tracking-wider ml-1">Minimum</label>
                              <div className="relative group">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gold opacity-50 group-focus-within:opacity-100 transition-opacity" />
                                <input 
                                  type="number" 
                                  value={priceRange.min}
                                  onChange={(e) => onPriceRangeChange({...priceRange, min: e.target.value})}
                                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-10 pr-4 text-lg font-mono text-white focus:border-brand-gold focus:bg-black/40 focus:outline-none transition-all"
                                  placeholder="0"
                                />
                              </div>
                           </div>
                           <div className="w-4 h-[1px] bg-white/20 mt-6" />
                           <div className="flex-1 space-y-2">
                              <label className="text-xs text-slate-500 uppercase font-bold tracking-wider ml-1">Maximum</label>
                              <div className="relative group">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gold opacity-50 group-focus-within:opacity-100 transition-opacity" />
                                <input 
                                  type="number" 
                                  value={priceRange.max}
                                  onChange={(e) => onPriceRangeChange({...priceRange, max: e.target.value})}
                                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-10 pr-4 text-lg font-mono text-white focus:border-brand-gold focus:bg-black/40 focus:outline-none transition-all"
                                  placeholder="Illimité"
                                />
                              </div>
                           </div>
                        </div>
                      </div>
                    )}

                    {/* CONTENU : TRI */}
                    {activeTab === 'sort' && (
                      <div className="space-y-4">
                        <SectionHeader title="Ordre d'affichage" subtitle="Organiser les résultats" />
                        <div className="space-y-2">
                          <SortOptionItem active={activeSort === 'original'} onClick={() => onSortChange('original')} label="Pertinence (Par défaut)" />
                          <SortOptionItem active={activeSort === 'price-asc'} onClick={() => onSortChange('price-asc')} label="Prix Croissant (Moins cher en premier)" />
                          <SortOptionItem active={activeSort === 'price-desc'} onClick={() => onSortChange('price-desc')} label="Prix Décroissant (Plus cher en premier)" />
                          <SortOptionItem active={activeSort === 'brand-asc'} onClick={() => onSortChange('brand-asc')} label="Marque (A-Z)" />
                        </div>
                      </div>
                    )}

                    {/* CONTENU : FAVORIS */}
                    {activeTab === 'favorites' && (
                      <div className="flex flex-col items-center justify-center py-8 space-y-6 text-center">
                         <div className={`p-4 rounded-full ${showFavoritesOnly ? 'bg-brand-gold text-black' : 'bg-white/5 text-slate-500'}`}>
                            <Heart className={`w-8 h-8 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                         </div>
                         <div className="space-y-2">
                            <h3 className="text-lg font-medium text-white">
                              {showFavoritesOnly ? 'Mode Favoris Activé' : 'Afficher uniquement les favoris'}
                            </h3>
                            <p className="text-sm text-slate-400 max-w-xs mx-auto">
                              {showFavoritesOnly 
                                ? `Vous voyez actuellement vos ${favoritesCount} véhicules favoris.` 
                                : `Activez cette option pour masquer les autres véhicules et ne voir que vos coups de cœur.`}
                            </p>
                         </div>
                         <button
                            onClick={onToggleFavorites}
                            className={`px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                              showFavoritesOnly 
                              ? 'bg-white/10 text-white hover:bg-white/20' 
                              : 'bg-brand-gold text-black hover:bg-brand-gold/90 shadow-lg shadow-brand-gold/20'
                            }`}
                         >
                            {showFavoritesOnly ? 'Désactiver' : 'Activer le filtre'}
                         </button>
                      </div>
                    )}

                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Pied de page du panneau */}
              <div className="p-4 border-t border-white/5 bg-[#0f0f0f] flex justify-between items-center">
                 <button 
                    onClick={onReset}
                    className="text-[10px] uppercase tracking-widest font-bold text-slate-500 hover:text-brand-crimsonBright transition-colors flex items-center gap-2 group"
                 >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 group-hover:bg-brand-crimsonBright transition-colors" />
                    Réinitialiser tout
                 </button>
                 <div className="text-[10px] text-slate-600 font-mono">
                    {isFilterActive ? 'Filtres actifs' : 'Standard'}
                 </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

// --- COMPOSANTS UI REUTILISABLES ---

const SectionHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="mb-6">
    <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>
    <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
  </div>
);

const SelectionCard = ({ label, active, onClick, fullWidth }: { label: string, active: boolean, onClick: () => void, fullWidth?: boolean }) => (
  <motion.button
    whileHover={{ scale: 1.02, backgroundColor: active ? 'rgb(197, 160, 89)' : 'rgba(255,255,255,0.08)' }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`
      ${fullWidth ? 'col-span-full' : ''}
      relative px-4 py-3 rounded-xl text-left border transition-all duration-200 group overflow-hidden
      ${active 
        ? 'bg-brand-gold border-brand-gold text-black shadow-lg shadow-brand-gold/10' 
        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:border-white/10'
      }
    `}
  >
    <div className="flex items-center justify-between relative z-10">
      <span className="text-xs font-bold uppercase tracking-wide truncate">{label}</span>
      {active && <Check className="w-3.5 h-3.5" />}
    </div>
  </motion.button>
);

const SortOptionItem = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
      active 
      ? 'bg-brand-gold/10 border-brand-gold text-brand-gold' 
      : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-white'
    }`}
  >
    <span className="text-xs font-medium">{label}</span>
    {active && <div className="w-2 h-2 rounded-full bg-brand-gold shadow-[0_0_10px_rgba(197,160,89,0.8)]" />}
  </button>
);
