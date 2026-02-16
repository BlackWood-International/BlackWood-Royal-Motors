import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SortOption } from '../types';
import { 
  Search, X, SlidersHorizontal, ArrowUpDown, Building2, 
  Tag, DollarSign, Heart 
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

  // Indicateur de filtre actif
  const isFilterActive = 
    (activeCategories.length > 0 && !activeCategories.includes('All')) || 
    (selectedBrands.length > 0 && !selectedBrands.includes('All')) || 
    activeSort !== 'original' ||
    priceRange.min !== '' ||
    priceRange.max !== '' ||
    showFavoritesOnly;

  // Gestion de la sélection multiple (sans "All")
  const handleMultiSelect = (current: string[], item: string, updater: (items: string[]) => void) => {
    // Si "All" traîne dans la sélection, on l'enlève
    let newVal = current.filter(i => i !== 'All');
    
    if (newVal.includes(item)) {
      newVal = newVal.filter(i => i !== item);
    } else {
      newVal.push(item);
    }
    
    // Si vide, on renvoie un tableau vide (ou 'All' si votre logique l'exige, mais ici on veut strict)
    // Pour que le parent comprenne "tout", on peut envoyer tableau vide ou 'All' selon votre implémentation DataService.
    // Ici je renvoie 'All' si vide pour garder la compatibilité, mais sans l'afficher.
    if (newVal.length === 0) newVal = ['All'];
    updater(newVal);
  };

  const tabs = [
    { id: 'brands' as const, label: 'Marques', icon: <Building2 className="w-4 h-4" /> },
    { id: 'categories' as const, label: 'Types', icon: <Tag className="w-4 h-4" /> },
    { id: 'budget' as const, label: 'Budget', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'sort' as const, label: 'Trier', icon: <ArrowUpDown className="w-4 h-4" /> },
    { id: 'favorites' as const, label: 'Favoris', icon: <Heart className="w-4 h-4" />, badge: favoritesCount > 0 ? favoritesCount : undefined },
  ];

  return (
    // FIX STICKY: Remplacement par 'fixed' pour garantir que ça reste en haut
    <div className="fixed top-0 left-0 right-0 z-50 w-full flex justify-center pointer-events-none pt-4 pb-4">
      
      {/* Fond dégradé subtil pour lisibilité quand on scroll */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none h-32 -z-10" />

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(197,160,89,0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(197,160,89,0.6); }
      `}</style>

      {/* Conteneur Principal */}
      <div ref={panelRef} className="w-full max-w-2xl px-4 pointer-events-auto relative">
        
        {/* BARRE FLOTTANTE */}
        <motion.div 
          layout
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className={`bg-[#0f0f0f]/95 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-2 relative z-50 transition-colors duration-300 ${isExpanded ? 'border-brand-gold/40 bg-black' : 'hover:border-white/20'}`}
        >
          <div className="flex items-center gap-2">
            
            {/* Recherche */}
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-gold transition-colors" />
              <input 
                type="text" 
                placeholder="Rechercher un modèle..." 
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-transparent focus:border-brand-gold/30 rounded-full py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all"
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

            {/* Bouton Toggle */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                isExpanded 
                ? 'bg-brand-gold/10 text-brand-gold border-brand-gold shadow-[0_0_20px_-5px_rgba(197,160,89,0.3)]' 
                : 'bg-white/5 text-white border-white/5 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filtres</span>
              {isFilterActive && (
                <span className="relative flex h-2 w-2 ml-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold"></span>
                </span>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* PANNEAU DÉPLIÉ */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="absolute top-full left-4 right-4 mt-3 bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-40 flex flex-col max-h-[70vh]"
            >
              {/* Navigation des Onglets */}
              <div className="p-2 border-b border-white/5 bg-black/40">
                <div className="grid grid-cols-5 gap-1">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative flex flex-col sm:flex-row items-center justify-center gap-1.5 py-3 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wide transition-all ${
                          isActive 
                            ? 'text-brand-gold bg-brand-gold/10 border border-brand-gold/20' 
                            : 'text-slate-500 hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        {tab.icon}
                        <span className="hidden sm:inline">{tab.label}</span>
                        {tab.badge !== undefined && (
                          <span className={`absolute top-1 right-1 sm:static sm:ml-1 w-4 h-4 sm:w-auto sm:h-auto sm:px-1.5 sm:py-0.5 flex items-center justify-center rounded-full text-[9px] ${isActive ? 'bg-brand-gold text-black' : 'bg-white/20 text-white'}`}>
                            {tab.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6 overflow-y-auto custom-scrollbar bg-gradient-to-b from-[#0f0f0f] to-[#050505] min-h-[350px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    {/* MARQUES (Sans bouton ALL) */}
                    {activeTab === 'brands' && (
                      <div className="space-y-5">
                        <SectionHeader title="Constructeurs" subtitle="Sélection multiple possible" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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

                    {/* CATÉGORIES (Sans bouton ALL, Ordre exact du Sheets) */}
                    {activeTab === 'categories' && (
                      <div className="space-y-5">
                         <SectionHeader title="Types de Véhicule" subtitle="Tel que défini au catalogue" />
                         <div className="grid grid-cols-2 gap-3">
                            {/* Affichage direct de la prop 'categories' sans tri, ni bouton 'All' */}
                            {categories.map(cat => (
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

                    {/* BUDGET */}
                    {activeTab === 'budget' && (
                      <div className="space-y-8 py-4">
                        <SectionHeader title="Budget" subtitle="Définissez votre fourchette de prix" />
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                           <div className="w-full space-y-3">
                              <label className="text-xs text-brand-gold uppercase font-bold tracking-widest ml-1">Minimum</label>
                              <div className="relative group">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-gold transition-colors" />
                                <input 
                                  type="number" 
                                  value={priceRange.min}
                                  onChange={(e) => onPriceRangeChange({...priceRange, min: e.target.value})}
                                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-lg font-mono text-white focus:border-brand-gold focus:bg-white/5 focus:outline-none transition-all placeholder:text-slate-700"
                                  placeholder="0"
                                />
                              </div>
                           </div>
                           
                           <div className="w-8 h-[1px] sm:w-[1px] sm:h-12 bg-white/10" />

                           <div className="w-full space-y-3">
                              <label className="text-xs text-brand-gold uppercase font-bold tracking-widest ml-1">Maximum</label>
                              <div className="relative group">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-gold transition-colors" />
                                <input 
                                  type="number" 
                                  value={priceRange.max}
                                  onChange={(e) => onPriceRangeChange({...priceRange, max: e.target.value})}
                                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-lg font-mono text-white focus:border-brand-gold focus:bg-white/5 focus:outline-none transition-all placeholder:text-slate-700"
                                  placeholder="Illimité"
                                />
                              </div>
                           </div>
                        </div>
                      </div>
                    )}

                    {/* TRI */}
                    {activeTab === 'sort' && (
                      <div className="space-y-5">
                        <SectionHeader title="Trier par" subtitle="Organiser les résultats" />
                        <div className="space-y-3">
                          <SortOptionItem active={activeSort === 'original'} onClick={() => onSortChange('original')} label="Pertinence (Par défaut)" />
                          <SortOptionItem active={activeSort === 'price-asc'} onClick={() => onSortChange('price-asc')} label="Prix Croissant" />
                          <SortOptionItem active={activeSort === 'price-desc'} onClick={() => onSortChange('price-desc')} label="Prix Décroissant" />
                          <SortOptionItem active={activeSort === 'brand-asc'} onClick={() => onSortChange('brand-asc')} label="Marque (A-Z)" />
                        </div>
                      </div>
                    )}

                    {/* FAVORIS */}
                    {activeTab === 'favorites' && (
                      <div className="flex flex-col items-center justify-center py-10 space-y-6 text-center">
                         <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`p-6 rounded-full border-2 ${showFavoritesOnly ? 'bg-brand-gold/10 border-brand-gold text-brand-gold' : 'bg-white/5 border-white/5 text-slate-600'}`}
                          >
                            <Heart className={`w-10 h-10 ${showFavoritesOnly ? 'fill-brand-gold' : ''}`} />
                         </motion.div>
                         <div className="space-y-2">
                            <h3 className="text-xl font-bold text-white uppercase tracking-wider">
                              {showFavoritesOnly ? 'Filtre Actif' : 'Mes Favoris'}
                            </h3>
                            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                              {showFavoritesOnly 
                                ? `Affichage de vos ${favoritesCount} véhicules favoris.` 
                                : `Activez cette option pour masquer les autres véhicules et ne voir que votre sélection.`}
                            </p>
                         </div>
                         <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onToggleFavorites}
                            className={`px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${
                              showFavoritesOnly 
                              ? 'bg-transparent text-white border-white/20 hover:bg-white/10' 
                              : 'bg-brand-gold text-black border-brand-gold hover:bg-brand-gold/90 shadow-lg shadow-brand-gold/20'
                            }`}
                         >
                            {showFavoritesOnly ? 'Tout Afficher' : 'Voir mes favoris'}
                         </motion.button>
                      </div>
                    )}

                  </motion.div>
                </AnimatePresence>
              </div>

              {/* PIED DE PAGE */}
              <div className="p-4 border-t border-white/5 bg-[#0a0a0a] flex justify-between items-center">
                 <button 
                    onClick={onReset}
                    className="text-[10px] uppercase tracking-widest font-bold text-slate-500 hover:text-brand-crimsonBright transition-colors flex items-center gap-2 group"
                 >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 group-hover:bg-brand-crimsonBright transition-colors" />
                    Réinitialiser tout
                 </button>
                 <div className="text-[10px] text-brand-gold/50 font-mono tracking-widest">
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

// --- COMPOSANTS UI ---

const SectionHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="mb-4 pl-1">
    <h3 className="text-xs font-bold text-brand-gold uppercase tracking-[0.15em]">{title}</h3>
    <p className="text-[10px] text-slate-500 mt-1 font-medium">{subtitle}</p>
  </div>
);

const SelectionCard = ({ label, active, onClick, fullWidth }: { label: string, active: boolean, onClick: () => void, fullWidth?: boolean }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`
      ${fullWidth ? 'col-span-full' : ''}
      relative px-4 py-3.5 rounded-xl text-left border transition-all duration-300 group overflow-hidden
      ${active 
        ? 'bg-brand-gold/10 border-brand-gold shadow-[0_0_15px_-5px_rgba(197,160,89,0.2)]' 
        : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10' 
      }
    `}
  >
    <div className="flex items-center justify-between relative z-10">
      <span className={`text-[11px] font-bold uppercase tracking-wider truncate ${active ? 'text-brand-gold' : 'text-slate-400 group-hover:text-white'}`}>
        {label}
      </span>
      {active && <div className="w-1.5 h-1.5 rounded-full bg-brand-gold shadow-[0_0_8px_rgba(197,160,89,1)]" />}
    </div>
  </motion.button>
);

const SortOptionItem = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
      active 
      ? 'bg-brand-gold/10 border-brand-gold' 
      : 'bg-transparent border-transparent text-slate-500 hover:bg-white/5 hover:text-white'
    }`}
  >
    <span className={`text-xs font-bold uppercase tracking-wide ${active ? 'text-brand-gold' : ''}`}>{label}</span>
    {active && <div className="w-2 h-2 rounded-full bg-brand-gold shadow-[0_0_10px_rgba(197,160,89,0.8)]" />}
  </button>
);
