import React, { useEffect, useState, useMemo, useRef } from 'react';
import { fetchCatalog } from './services/dataService';
import { Vehicle, SortOption } from './types';
import { Hero } from './components/Hero';
import { VehicleCard } from './components/VehicleCard';
import { VehicleModal } from './components/VehicleModal';
import { FilterPanel } from './components/FilterPanel';
import { Footer } from './components/Footer';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, AlertCircle, Heart, ChevronLeft } from 'lucide-react';

function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // VIEW STATE: Gère l'affichage entre l'accueil (Hero) et le Catalogue
  const [view, setView] = useState<'home' | 'catalog'>('home');
  
  // Filter States
  const [activeCategories, setActiveCategories] = useState<string[]>(['All']);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(['All']);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceRange, setPriceRange] = useState<{min: string, max: string}>({ min: '', max: '' });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  
  // Favorites State
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('original');
  
  const isFirstRender = useRef(true);

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

  // --- FAVORITES PERSISTENCE ---
  useEffect(() => {
    const savedFavs = localStorage.getItem('bw_favorites');
    if (savedFavs) {
        try { setFavorites(JSON.parse(savedFavs)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bw_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (vehicleId: string) => {
    setFavorites(prev => 
        prev.includes(vehicleId) ? prev.filter(id => id !== vehicleId) : [...prev, vehicleId]
    );
  };

  // --- VIEW NAVIGATION ---
  const handleEnterCatalog = () => {
    setView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnHome = () => {
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- SCROLL AUTOMATION (Only in Catalog View) ---
  useEffect(() => {
    if (view !== 'catalog' || isFirstRender.current) {
        if (view === 'catalog') isFirstRender.current = false;
        return;
    }
    // Scroll doux vers l'ancre si un filtre change
    const anchor = document.getElementById('catalog-anchor');
    if (anchor) {
        const offset = -200; // Ajusté pour navbar + filter panel fixed
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = anchor.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition + offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  }, [activeCategories, selectedBrands, searchQuery, sortOption, priceRange.min, priceRange.max, showFavoritesOnly]);


  // --- FILTERING LOGIC ---
  const resetFilters = () => {
    setActiveCategories(['All']);
    setSelectedBrands(['All']);
    setSearchQuery('');
    setSortOption('original');
    setPriceRange({ min: '', max: '' });
    setShowFavoritesOnly(false);
  };

  const categories = useMemo(() => {
    const cats = Array.from(new Set(vehicles.map(v => v.category))).sort();
    return ['All', ...cats];
  }, [vehicles]);

  const brands = useMemo(() => {
    return Array.from(new Set(vehicles.map(v => v.brand))).sort();
  }, [vehicles]);

  const filteredAndSortedVehicles = useMemo(() => {
    let result = [...vehicles];

    if (showFavoritesOnly) result = result.filter(v => favorites.includes(v.id));
    if (!activeCategories.includes('All')) result = result.filter(v => activeCategories.includes(v.category));
    if (!selectedBrands.includes('All')) result = result.filter(v => selectedBrands.includes(v.brand));
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(v => v.model.toLowerCase().includes(q) || v.brand.toLowerCase().includes(q));
    }

    if (priceRange.min !== '') {
        const min = parseFloat(priceRange.min);
        if (!isNaN(min)) result = result.filter(v => v.priceValue >= min);
    }
    if (priceRange.max !== '') {
        const max = parseFloat(priceRange.max);
        if (!isNaN(max)) result = result.filter(v => v.priceValue <= max);
    }

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
    return result;
  }, [vehicles, activeCategories, selectedBrands, searchQuery, sortOption, priceRange, showFavoritesOnly, favorites]);

  // --- RENDER HELPERS ---
  if (loading) {
    return (
      <div className="h-screen w-full bg-brand-black flex flex-col items-center justify-center text-brand-gold relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-slate via-brand-black to-brand-black opacity-40"></div>
        <Loader2 className="w-12 h-12 animate-spin mb-6 relative z-10" />
        <span className="text-xs uppercase tracking-[0.3em] font-mono relative z-10 animate-pulse">Connexion Sécurisée en cours...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full bg-brand-black flex flex-col items-center justify-center text-brand-crimsonBright">
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
        
        {/* --- VUE: ACCUEIL OU CATALOGUE --- */}
        <AnimatePresence mode="wait">
          {view === 'home' ? (
            <motion.div 
                key="home-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -50, filter: 'blur(10px)' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
            >
                <Hero onEnterCatalog={handleEnterCatalog} />
            </motion.div>
          ) : (
            <motion.div 
                key="catalog-view"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex flex-col"
            >
                {/* FLOATING HEADER - Au dessus du filtre */}
                <header className="fixed top-0 left-0 w-full z-50 pointer-events-none p-6 flex justify-between items-start">
                    
                    {/* Bouton Retour Flottant Élégant */}
                    <button 
                        onClick={handleReturnHome}
                        className="pointer-events-auto flex items-center gap-2 pl-2 pr-4 py-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-300 hover:text-white hover:border-brand-gold/50 hover:bg-black/80 transition-all group shadow-lg"
                    >
                        <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-brand-gold group-hover:text-black transition-colors">
                            <ChevronLeft className="w-3.5 h-3.5" />
                        </div>
                        <span className="mt-[1px]">Accueil</span>
                    </button>

                    {/* Logo discret en haut à droite (ou centré si préféré, mais le filtre est centré) */}
                    <div className="pointer-events-auto opacity-50 hover:opacity-100 transition-opacity">
                         <img src="https://i.imgur.com/5QiFb0Y.png" alt="Logo" className="h-6 object-contain" />
                    </div>
                </header>

                {/* Main Content Area */}
                <div className="min-h-screen">
                    
                    {/* FILTER PANEL - Now centered and unencumbered */}
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
                    />

                    {/* Contenu principal */}
                    <main className="max-w-[1800px] mx-auto px-4 md:px-6 py-12 pt-32">
                        {/* ANCRE DE CATALOGUE */}
                        <div id="catalog-anchor" className="mb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-4 mx-4 scroll-mt-40">
                            <div>
                                <motion.h2 
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="text-3xl font-serif text-white mb-2"
                                >
                                    {showFavoritesOnly ? 'Ma Sélection Privée' : 'Catalogue Officiel'}
                                </motion.h2>
                                <motion.p 
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="text-slate-500 text-sm font-light tracking-wide"
                                >
                                    {showFavoritesOnly 
                                        ? 'Vos véhicules d\'exception sauvegardés' 
                                        : (activeCategories.includes('All') ? 'Inventaire Complet' : activeCategories.join(', '))} 
                                    {' '}• <span className="text-brand-gold">{filteredAndSortedVehicles.length}</span> actifs disponibles
                                </motion.p>
                            </div>
                        </div>

                        {/* GRID DE VÉHICULES */}
                        <motion.div 
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8"
                        >
                            <AnimatePresence mode='popLayout'>
                                {filteredAndSortedVehicles.map((vehicle, index) => (
                                    <VehicleCard 
                                        key={vehicle.id} 
                                        vehicle={vehicle} 
                                        index={index % 20} 
                                        onSelect={setSelectedVehicle}
                                        isFavorite={favorites.includes(vehicle.id)}
                                        onToggleFavorite={() => toggleFavorite(vehicle.id)}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                        
                        {/* EMPTY STATE */}
                        {filteredAndSortedVehicles.length === 0 && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-32 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02] mx-4"
                            >
                                <div className="flex justify-center mb-6">
                                    {showFavoritesOnly ? <Heart className="w-16 h-16 text-brand-gold/20" /> : <AlertCircle className="w-16 h-16 text-white/20" />}
                                </div>
                                <p className="text-brand-gold font-serif text-3xl mb-3">Aucun véhicule trouvé</p>
                                <p className="text-slate-500 text-sm font-mono uppercase tracking-wider mb-8">
                                    {showFavoritesOnly 
                                        ? "Votre sélection privée est vide." 
                                        : "Ajustez vos filtres pour voir plus de résultats."}
                                </p>
                                <button 
                                    onClick={resetFilters}
                                    className="px-8 py-3 rounded-full bg-white text-brand-black text-xs font-bold hover:bg-brand-gold hover:shadow-lg transition-all uppercase tracking-widest"
                                >
                                    {showFavoritesOnly ? "Retour au catalogue" : "Réinitialiser les filtres"}
                                </button>
                            </motion.div>
                        )}
                    </main>
                    
                    <Footer />
                </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- MODAL (Toujours accessible) --- */}
        <AnimatePresence>
            {selectedVehicle && (
                <VehicleModal 
                    vehicle={selectedVehicle} 
                    onClose={() => setSelectedVehicle(null)}
                    isFavorite={favorites.includes(selectedVehicle.id)}
                    onToggleFavorite={() => toggleFavorite(selectedVehicle.id)}
                />
            )}
        </AnimatePresence>

      </div>
    </div>
  );
}

export default App;
