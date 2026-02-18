
import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { fetchCatalog } from './services/dataService';
import { Vehicle, SortOption } from './types';
import { Hero } from './components/Hero';
import { VehicleCard } from './components/VehicleCard';
import { VehicleModal } from './components/VehicleModal';
import { FilterPanel } from './components/FilterPanel';
import { Footer } from './components/Footer';
import { CompareBar } from './components/CompareBar';
import { ComparatorModal } from './components/ComparatorModal';
import { VIPPage } from './components/VIPPage'; 
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, AlertCircle, Heart, ChevronLeft, LayoutList, Grid2x2, Grid3x3, ChevronDown } from 'lucide-react';
import { fuzzySearch } from './utils/search';

function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // VIEW STATE
  const [view, setView] = useState<'home' | 'catalog' | 'vip'>('home');
  // Navigation History State
  const [previousView, setPreviousView] = useState<'home' | 'catalog'>('home');
  
  // Filter States
  const [activeCategories, setActiveCategories] = useState<string[]>(['All']);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(['All']);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceRange, setPriceRange] = useState<{min: string, max: string}>({ min: '', max: '' });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  
  // Pagination State - Initialisé à 50
  const [visibleCount, setVisibleCount] = useState<number>(50);
  
  // Mobile Grid State
  const [mobileColCount, setMobileColCount] = useState<1 | 2 | 3>(1);
  
  // VIP Filter State ('all' | 'only-vip' | 'no-vip')
  const [vipFilter, setVipFilter] = useState<'all' | 'only-vip' | 'no-vip'>('all');
  
  // Favorites & Comparator State
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]); // IDs of vehicles to compare
  const [isComparatorOpen, setIsComparatorOpen] = useState(false);
  
  const [sortOption, setSortOption] = useState<SortOption>('original');
  const isFirstRender = useRef(true);
  
  // Scroll Locking State
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  // --- DATA LOADING ---
  useEffect(() => {
    fetchCatalog()
      .then((data) => {
        setVehicles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Impossible de récupérer les données classifiées des serveurs BlackWood.");
        setLoading(false);
      });
  }, []);

  // --- URL HANDLING (Deep Linking) ---
  useEffect(() => {
    if (vehicles.length > 0) {
        const params = new URLSearchParams(window.location.search);
        
        // 1. Share Selection Logic (Legacy)
        const sharedSelection = params.get('selection');
        if (sharedSelection) {
          const sharedIds = sharedSelection.split(',');
          const validIds = sharedIds.filter(id => vehicles.some(v => v.id === id));
          if (validIds.length > 0) {
            setFavorites(validIds);
            setShowFavoritesOnly(true);
            setView('catalog');
          }
        } else {
             const savedFavs = localStorage.getItem('bw_favorites');
             if (savedFavs) {
                 try { setFavorites(JSON.parse(savedFavs)); } catch (e) { console.error(e); }
             }
        }

        // 2. Direct Vehicle Link Logic (?car=id)
        const carId = params.get('car');
        if (carId) {
            const vehicle = vehicles.find(v => v.id === carId);
            if (vehicle) {
                setSelectedVehicle(vehicle);
                if (view === 'home') setView('catalog');
            }
        }
    }
  }, [vehicles]); // Run once when vehicles are loaded

  // Sync URL when selectedVehicle changes
  useEffect(() => {
    if (loading) return;
    
    const url = new URL(window.location.href);
    if (selectedVehicle) {
        url.searchParams.set('car', selectedVehicle.id);
    } else {
        url.searchParams.delete('car');
    }
    // Update URL without reloading
    window.history.pushState({}, '', url);
  }, [selectedVehicle, loading]);


  // --- FAVORITES PERSISTENCE ---
  useEffect(() => {
    if (favorites.length > 0) {
        localStorage.setItem('bw_favorites', JSON.stringify(favorites));
    } else {
        localStorage.removeItem('bw_favorites'); 
    }
  }, [favorites]);

  // --- SCROLL LOCK LOGIC (Prevents Layout Shift) ---
  useEffect(() => {
    const isLocked = !!selectedVehicle || isComparatorOpen;
    
    if (isLocked) {
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
      // Cleanup on unmount
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [selectedVehicle, isComparatorOpen]);


  const toggleFavorite = useCallback((vehicleId: string) => {
    setFavorites(prev => 
        prev.includes(vehicleId) ? prev.filter(id => id !== vehicleId) : [...prev, vehicleId]
    );
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    setShowFavoritesOnly(false); 
  }, []);

  // --- COMPARATOR LOGIC ---
  const toggleCompare = useCallback((vehicleId: string) => {
    setCompareList(prev => {
        if (prev.includes(vehicleId)) {
            return prev.filter(id => id !== vehicleId);
        }
        if (prev.length >= 3) {
            alert("Le comparateur est limité à 3 véhicules.");
            return prev;
        }
        return [...prev, vehicleId];
    });
  }, []);

  const clearCompare = useCallback(() => {
      setCompareList([]);
      setIsComparatorOpen(false);
  }, []);

  // --- SHARE FUNCTIONALITY ---
  const handleShareSelection = useCallback(() => {
    if (favorites.length === 0) return;
    const favoriteVehicles = vehicles.filter(v => favorites.includes(v.id));
    const carList = favoriteVehicles.map(v => `- **${v.brand} ${v.model}** — \`${v.price}\``).join('\n');
    const message = `
# 👑 BLACKWOOD ROYAL MOTORS
### 📂 SÉLECTION PRIVÉE CLIENT

> Voici la liste des véhicules retenus pour le dossier d'acquisition :

${carList}

\`\`\`fix
📞 Contactez un vendeur pour finaliser le dossier.
\`\`\`
    `.trim();
    navigator.clipboard.writeText(message);
  }, [favorites, vehicles]);

  // --- VIEW NAVIGATION ---
  const handleEnterCatalog = () => {
    setView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnHome = () => {
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // NEW: Navigate to VIP Page with Context Awareness
  const handleEnterVIP = () => {
      // Record where we came from (Home or Catalog)
      if (view !== 'vip') {
          setPreviousView(view);
      }
      
      // If modal is open, close it first
      if (selectedVehicle) setSelectedVehicle(null);
      
      setView('vip');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // NEW: Return from VIP Page based on history
  const handleExitVIP = () => {
      setView(previousView); 
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- RESET FILTER ---
  const resetFilters = () => {
    setActiveCategories(['All']);
    setSelectedBrands(['All']);
    setSearchQuery('');
    setSortOption('original');
    setPriceRange({ min: '', max: '' });
    setShowFavoritesOnly(false);
    setVipFilter('all');
    setVisibleCount(50); // Reset to 50
  };

  // --- FILTERING & GROUPING LOGIC ---
  
  const categories = useMemo(() => {
    const cats = new Set(vehicles.map(v => v.category));
    return ['All', ...Array.from(cats)];
  }, [vehicles]);

  const brands = useMemo(() => {
    const b = new Set(vehicles.map(v => v.brand));
    return ['All', ...Array.from(b)];
  }, [vehicles]);

  // Reset pagination when any filter changes
  useEffect(() => {
    setVisibleCount(50); // Reset to 50
  }, [activeCategories, selectedBrands, searchQuery, sortOption, priceRange, showFavoritesOnly, vipFilter]);

  const filteredVehicles = useMemo(() => {
    let result = [...vehicles];

    if (showFavoritesOnly) result = result.filter(v => favorites.includes(v.id));
    if (!activeCategories.includes('All')) result = result.filter(v => activeCategories.includes(v.category));
    if (!selectedBrands.includes('All')) result = result.filter(v => selectedBrands.includes(v.brand));
    
    // VIP Filter Logic
    if (vipFilter === 'only-vip') {
        result = result.filter(v => v.vip);
    } else if (vipFilter === 'no-vip') {
        result = result.filter(v => !v.vip);
    }

    if (searchQuery) {
      // REPLACEMENT: Use local fuzzySearch instead of Fuse.js
      result = fuzzySearch(result, searchQuery, ['model', 'brand', 'category']);
    }

    if (priceRange.min !== '') {
        const min = parseFloat(priceRange.min);
        if (!isNaN(min)) result = result.filter(v => v.priceValue >= min);
    }
    if (priceRange.max !== '') {
        const max = parseFloat(priceRange.max);
        if (!isNaN(max)) result = result.filter(v => v.priceValue <= max);
    }

    // Apply sorting
    if (searchQuery === '' || sortOption !== 'original') {
        result.sort((a, b) => {
          switch (sortOption) {
            case 'original': return a.originalIndex - b.originalIndex; 
            case 'brand-asc': return a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model);
            case 'price-asc': return a.priceValue - b.priceValue;
            case 'price-desc': return b.priceValue - a.priceValue;
            case 'name-asc': return a.model.localeCompare(b.model);
            default: return 0;
          }
        });
    }
    return result;
  }, [vehicles, activeCategories, selectedBrands, searchQuery, sortOption, priceRange, showFavoritesOnly, favorites, vipFilter]);

  // Apply Pagination Slice
  const displayedVehicles = useMemo(() => {
      return filteredVehicles.slice(0, visibleCount);
  }, [filteredVehicles, visibleCount]);

  const isGroupedView = useMemo(() => {
      const isDefaultSort = sortOption === 'original';
      const noSearch = searchQuery === '';
      const noCategoryFilter = activeCategories.includes('All');
      const noBrandFilter = selectedBrands.includes('All');
      const noPriceFilter = priceRange.min === '' && priceRange.max === '';
      const noFavoritesFilter = !showFavoritesOnly;
      const noVipFilter = vipFilter === 'all';

      return isDefaultSort && 
             noSearch && 
             noCategoryFilter && 
             noBrandFilter && 
             noPriceFilter && 
             noFavoritesFilter && 
             noVipFilter;
  }, [sortOption, searchQuery, activeCategories, selectedBrands, priceRange, showFavoritesOnly, vipFilter]);

  const groupedVehicles = useMemo(() => {
      if (!isGroupedView) return null;
      
      const groups: Record<string, Vehicle[]> = {};
      // Use displayedVehicles instead of filteredVehicles to respect pagination
      displayedVehicles.forEach(v => {
          if (!groups[v.category]) groups[v.category] = [];
          groups[v.category].push(v);
      });
      return groups;
  }, [displayedVehicles, isGroupedView]);

  const visibleCategories = useMemo(() => {
      if (!isGroupedView || !groupedVehicles) return [];
      const presentCategories = new Set(Object.keys(groupedVehicles));
      return categories.filter(c => c !== 'All' && presentCategories.has(c));
  }, [categories, groupedVehicles, isGroupedView]);

  // --- AUTO SCROLL ---
  useEffect(() => {
    if (view === 'catalog' && !isFirstRender.current) {
         const anchor = document.getElementById('catalog-anchor');
         if (anchor) {
             const scrollY = window.scrollY;
             if (scrollY > 500) {
                 const offset = -200; 
                 const elementPosition = anchor.getBoundingClientRect().top + window.scrollY;
                 window.scrollTo({ top: elementPosition + offset, behavior: 'smooth' });
             }
         }
    }
    if (view === 'catalog') isFirstRender.current = false;
  }, [activeCategories, selectedBrands, searchQuery, sortOption, priceRange, showFavoritesOnly, view, vipFilter]);

  const getGridClasses = () => {
      const base = "gap-3 md:gap-8 pb-4";
      const mobile = mobileColCount === 1 ? 'grid-cols-1' : (mobileColCount === 2 ? 'grid-cols-2' : 'grid-cols-3');
      return `grid ${mobile} md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 ${base}`;
  };

  // --- RENDER HELPERS ---
  if (loading) {
    return (
      <div className="h-[100dvh] w-full bg-brand-black flex flex-col items-center justify-center text-brand-gold relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-slate via-brand-black to-brand-black opacity-40"></div>
        <Loader2 className="w-12 h-12 animate-spin mb-6 relative z-10" />
        <span className="text-xs uppercase tracking-[0.3em] font-mono relative z-10 animate-pulse">Connexion Sécurisée en cours...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[100dvh] w-full bg-brand-black flex flex-col items-center justify-center text-brand-crimsonBright">
        <AlertCircle className="w-16 h-16 mb-4" />
        <h1 className="text-3xl font-serif mb-2">Connexion Interrompue</h1>
        <p className="text-slate-500 font-mono text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-brand-black min-h-screen text-slate-200 selection:bg-brand-gold/30 flex flex-col font-sans relative overflow-x-hidden">
      
      {/* Background Fixe */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#1a1a1a] via-[#050505] to-[#000000]"></div>
         <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(#C5A059 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
         }}></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        
        <AnimatePresence mode="wait">
          
          {view === 'home' && (
            <motion.div 
                key="home-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -50, filter: 'blur(10px)' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
            >
                <Hero 
                    onEnterCatalog={handleEnterCatalog} 
                    onEnterVIP={handleEnterVIP} 
                />
            </motion.div>
          )}

          {view === 'catalog' && (
            <motion.div 
                key="catalog-view"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex flex-col"
            >
                <header 
                    className="fixed top-0 left-0 w-full z-[100] pointer-events-none flex justify-between items-center px-4 py-3 md:px-8 md:py-6 bg-gradient-to-b from-black/95 via-black/80 to-transparent transition-all duration-300"
                    style={{ paddingRight: scrollbarWidth ? `${scrollbarWidth + (window.innerWidth >= 768 ? 32 : 16)}px` : undefined }}
                >
                    <div className="flex items-center gap-2 md:gap-4 pointer-events-auto">
                        <button 
                            onClick={handleReturnHome}
                            className="flex items-center justify-center w-10 h-10 p-0 md:w-auto md:h-auto md:py-2 md:pl-2 md:pr-4 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-slate-300 hover:text-white hover:border-brand-gold/50 hover:bg-black/80 transition-all group shadow-lg active:scale-95"
                        >
                            <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-brand-gold group-hover:text-black transition-colors flex items-center justify-center">
                                <ChevronLeft className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold mt-[1px] hidden md:inline ml-2">Accueil</span>
                        </button>

                        <div className="flex md:hidden bg-black/60 backdrop-blur-xl border border-white/10 rounded-full p-1 gap-1 pointer-events-auto">
                             <button 
                                onClick={() => setMobileColCount(1)}
                                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${mobileColCount === 1 ? 'bg-brand-gold text-black' : 'text-slate-400 hover:text-white'}`}
                             >
                                <LayoutList className="w-4 h-4" />
                             </button>
                             <button 
                                onClick={() => setMobileColCount(2)}
                                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${mobileColCount === 2 ? 'bg-brand-gold text-black' : 'text-slate-400 hover:text-white'}`}
                             >
                                <Grid2x2 className="w-4 h-4" />
                             </button>
                             <button 
                                onClick={() => setMobileColCount(3)}
                                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${mobileColCount === 3 ? 'bg-brand-gold text-black' : 'text-slate-400 hover:text-white'}`}
                             >
                                <Grid3x3 className="w-4 h-4" />
                             </button>
                        </div>
                    </div>

                    <div className="pointer-events-auto hover:opacity-100 transition-opacity">
                         <img 
                            src="https://i.imgur.com/5QiFb0Y.png" 
                            alt="Logo" 
                            className="h-10 md:h-14 object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]" 
                         />
                    </div>
                </header>

                <div className="min-h-screen">
                    <FilterPanel 
                        categories={categories}
                        activeCategories={activeCategories}
                        onCategoryChange={setActiveCategories}
                        brands={brands}
                        selectedBrands={selectedBrands}
                        onBrandChange={setSelectedBrands}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        activeSort={sortOption}
                        onSortChange={setSortOption}
                        priceRange={priceRange}
                        onPriceRangeChange={setPriceRange}
                        onReset={resetFilters}
                        showFavoritesOnly={showFavoritesOnly}
                        onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
                        favoritesCount={favorites.length}
                        onShare={handleShareSelection}
                        onClearFavorites={clearFavorites}
                        vipFilter={vipFilter}
                        onVipFilterChange={setVipFilter}
                    />

                    <CompareBar 
                        count={compareList.length} 
                        onOpenComparator={() => setIsComparatorOpen(true)} 
                        onClear={clearCompare}
                    />

                    <main className="max-w-[1800px] mx-auto px-2 xs:px-4 md:px-6 py-12 pt-32 md:pt-48 pb-24">
                        <div id="catalog-anchor" className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-4 mx-0 md:mx-4 scroll-mt-64">
                            <div>
                                <motion.h2 
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="text-2xl md:text-3xl font-serif text-white mb-2"
                                >
                                    {showFavoritesOnly ? 'Ma Sélection Privée' : 'Catalogue Officiel'}
                                </motion.h2>
                                <motion.p 
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="text-slate-500 text-xs md:text-sm font-light tracking-wide leading-relaxed"
                                >
                                    {showFavoritesOnly 
                                        ? 'Vos véhicules d\'exception sauvegardés' 
                                        : (activeCategories.includes('All') ? 'Inventaire Complet' : activeCategories.join(', '))} 
                                    {' '}• <span className="text-brand-gold">{filteredVehicles.length}</span> actifs disponibles
                                </motion.p>
                            </div>
                        </div>

                        {isGroupedView && groupedVehicles ? (
                            <div className="space-y-16">
                                {visibleCategories.map((cat) => {
                                    const count = groupedVehicles[cat].length;
                                    return (
                                        <div key={cat} id={`cat-${cat}`} className="scroll-mt-32">
                                            <div className="flex items-center gap-6 mb-8 select-none">
                                                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                                <div className="flex flex-col items-center">
                                                    <h3 className="text-2xl md:text-3xl font-serif text-brand-gold uppercase tracking-[0.15em] drop-shadow-sm">
                                                        {cat}
                                                    </h3>
                                                    <span className="text-[10px] font-mono text-slate-500 font-bold tracking-widest mt-1">
                                                        {count} VÉHICULE{count > 1 ? 'S' : ''}
                                                    </span>
                                                </div>
                                                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                            </div>

                                            <div className={getGridClasses()}>
                                                {groupedVehicles[cat].map((vehicle, index) => (
                                                    <VehicleCard 
                                                        key={vehicle.id} 
                                                        vehicle={vehicle} 
                                                        index={index} 
                                                        onSelect={setSelectedVehicle}
                                                        isFavorite={favorites.includes(vehicle.id)}
                                                        onToggleFavorite={() => toggleFavorite(vehicle.id)}
                                                        isComparing={compareList.includes(vehicle.id)}
                                                        onToggleCompare={() => toggleCompare(vehicle.id)}
                                                        mobileLayout={mobileColCount}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <motion.div 
                                layout
                                className={getGridClasses()}
                            >
                                <AnimatePresence mode='popLayout'>
                                    {displayedVehicles.map((vehicle, index) => (
                                        <VehicleCard 
                                            key={vehicle.id} 
                                            vehicle={vehicle} 
                                            index={index} 
                                            onSelect={setSelectedVehicle}
                                            isFavorite={favorites.includes(vehicle.id)}
                                            onToggleFavorite={() => toggleFavorite(vehicle.id)}
                                            isComparing={compareList.includes(vehicle.id)}
                                            onToggleCompare={() => toggleCompare(vehicle.id)}
                                            mobileLayout={mobileColCount}
                                        />
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                        
                        {filteredVehicles.length === 0 && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-24 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02] mx-0 md:mx-4"
                            >
                                <div className="flex justify-center mb-6">
                                    {showFavoritesOnly ? <Heart className="w-16 h-16 text-brand-gold/20" /> : <AlertCircle className="w-16 h-16 text-white/20" />}
                                </div>
                                <p className="text-brand-gold font-serif text-2xl md:text-3xl mb-3">Aucun véhicule trouvé</p>
                                <button 
                                    onClick={resetFilters}
                                    className="px-8 py-3 rounded-full bg-white text-brand-black text-xs font-bold hover:bg-brand-gold hover:shadow-lg transition-all uppercase tracking-widest active:scale-95"
                                >
                                    {showFavoritesOnly ? "Retour au catalogue" : "Réinitialiser les filtres"}
                                </button>
                            </motion.div>
                        )}

                        {/* LOAD MORE BUTTON */}
                        {visibleCount < filteredVehicles.length && (
                             <div className="mt-16 flex flex-col items-center justify-center gap-4">
                                <button
                                    onClick={() => setVisibleCount(filteredVehicles.length)}
                                    className="group relative px-8 py-4 bg-[#0a0a0a] hover:bg-brand-gold text-slate-300 hover:text-black rounded-full border border-white/10 hover:border-brand-gold transition-all duration-300 flex items-center gap-4 shadow-lg active:scale-95"
                                >
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Afficher le reste</span>
                                    <span className="text-[9px] font-mono opacity-60 bg-white/10 group-hover:bg-black/10 px-2 py-0.5 rounded">
                                        {Math.min(visibleCount, filteredVehicles.length)} / {filteredVehicles.length}
                                    </span>
                                    <ChevronDown className="w-4 h-4 animate-bounce group-hover:animate-none" />
                                </button>
                                <div className="text-[9px] uppercase tracking-widest text-slate-600">Chargement du catalogue complet</div>
                             </div>
                        )}

                        {visibleCount >= filteredVehicles.length && filteredVehicles.length > 0 && (
                           <div className="mt-20 flex flex-col items-center justify-center opacity-30">
                              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent mb-2" />
                              <span className="text-[8px] uppercase tracking-[0.3em] font-mono">Fin du catalogue</span>
                           </div>
                        )}

                    </main>
                    <Footer />
                </div>
            </motion.div>
          )}

          {view === 'vip' && (
              <motion.div
                  key="vip-view"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full relative z-[200]" 
              >
                  <VIPPage onBack={handleExitVIP} />
              </motion.div>
          )}

        </AnimatePresence>

        <AnimatePresence>
            {selectedVehicle && view !== 'vip' && (
                <VehicleModal 
                    vehicle={selectedVehicle} 
                    onClose={() => setSelectedVehicle(null)}
                    isFavorite={favorites.includes(selectedVehicle.id)}
                    onToggleFavorite={() => toggleFavorite(selectedVehicle.id)}
                    onOpenVIP={handleEnterVIP} 
                />
            )}
        </AnimatePresence>

        <AnimatePresence>
            {isComparatorOpen && view !== 'vip' && (
                <ComparatorModal 
                    vehicles={vehicles.filter(v => compareList.includes(v.id))}
                    onClose={() => setIsComparatorOpen(false)}
                    onRemove={(id) => toggleCompare(id)}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                />
            )}
        </AnimatePresence>

      </div>
    </div>
  );
}

export default App;
