import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
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

  // --- SHARE URL HANDLING (Legacy support) ---
  useEffect(() => {
    if (vehicles.length > 0) {
        const params = new URLSearchParams(window.location.search);
        const sharedSelection = params.get('selection');
        
        if (sharedSelection) {
          const sharedIds = sharedSelection.split(',');
          const validIds = sharedIds.filter(id => vehicles.some(v => v.id === id));
          
          if (validIds.length > 0) {
            setFavorites(validIds);
            setShowFavoritesOnly(true);
            setView('catalog');
            window.history.replaceState({}, '', window.location.pathname);
          }
        } else {
             const savedFavs = localStorage.getItem('bw_favorites');
             if (savedFavs) {
                 try { setFavorites(JSON.parse(savedFavs)); } catch (e) { console.error(e); }
             }
        }
    }
  }, [vehicles]);

  // --- FAVORITES PERSISTENCE ---
  useEffect(() => {
    if (favorites.length > 0) {
        localStorage.setItem('bw_favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  const toggleFavorite = useCallback((vehicleId: string) => {
    setFavorites(prev => 
        prev.includes(vehicleId) ? prev.filter(id => id !== vehicleId) : [...prev, vehicleId]
    );
  }, []);

  // --- SHARE FUNCTIONALITY (DISCORD OPTIMIZED) ---
  const handleShareSelection = useCallback(() => {
    if (favorites.length === 0) return;
    
    // 1. Get Vehicle Objects
    const favoriteVehicles = vehicles.filter(v => favorites.includes(v.id));
    
    // 2. Format List for Discord (Bold Model, Code block for Price)
    const carList = favoriteVehicles.map(v => `- **${v.brand} ${v.model}** — \`${v.price}\``).join('\n');

    // 3. Construct Message with Discord Markdown
    const message = `
# 👑 BLACKWOOD ROYAL MOTORS
### 📂 SÉLECTION PRIVÉE CLIENT

> Voici la liste des véhicules retenus pour le dossier d'acquisition :

${carList}

\`\`\`fix
📞 Contactez un vendeur pour finaliser le dossier.
\`\`\`
    `.trim();
    
    // 4. Copy to Clipboard
    navigator.clipboard.writeText(message).then(() => {
       console.log("Discord list copied to clipboard");
    }).catch(err => {
        console.error("Copy failed", err);
    });
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

  // --- RESET FILTER ---
  const resetFilters = () => {
    setActiveCategories(['All']);
    setSelectedBrands(['All']);
    setSearchQuery('');
    setSortOption('original');
    setPriceRange({ min: '', max: '' });
    setShowFavoritesOnly(false);
  };

  // --- FILTERING LOGIC ---
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


  // --- AUTO SCROLL TO TOP ON FILTER CHANGE ---
  useEffect(() => {
    if (view === 'catalog' && !isFirstRender.current) {
         const anchor = document.getElementById('catalog-anchor');
         if (anchor) {
             const scrollY = window.scrollY;
             // Only scroll if we are way down the page
             if (scrollY > 500) {
                 const offset = -200; // Compensate for fixed header + filter panel
                 const bodyRect = document.body.getBoundingClientRect().top;
                 const elementRect = anchor.getBoundingClientRect().top;
                 const elementPosition = elementRect - bodyRect;
                 const offsetPosition = elementPosition + offset;
                 window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
             }
         }
    }
    if (view === 'catalog') isFirstRender.current = false;
  }, [filteredAndSortedVehicles, view]);

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
                {/* FLOATING HEADER - Z-INDEX 100 (Highest) - Improved Mobile Visibility */}
                <header className="fixed top-0 left-0 w-full z-[100] pointer-events-none flex justify-between items-center px-4 py-3 md:px-8 md:py-6 bg-gradient-to-b from-black/95 via-black/80 to-transparent transition-all duration-300">
                    <button 
                        onClick={handleReturnHome}
                        className="pointer-events-auto flex items-center gap-2 pl-2 pr-4 py-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-300 hover:text-white hover:border-brand-gold/50 hover:bg-black/80 transition-all group shadow-lg active:scale-95"
                    >
                        <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-brand-gold group-hover:text-black transition-colors">
                            <ChevronLeft className="w-3.5 h-3.5" />
                        </div>
                        <span className="mt-[1px] hidden sm:inline">Accueil</span>
                    </button>

                    <div className="pointer-events-auto hover:opacity-100 transition-opacity">
                         <img 
                            src="https://i.imgur.com/5QiFb0Y.png" 
                            alt="Logo" 
                            className="h-10 md:h-14 object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]" 
                         />
                    </div>
                </header>

                {/* Main Content Area */}
                <div className="min-h-screen">
                    
                    {/* FILTER PANEL */}
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
                    />

                    {/* Contenu principal - PADDING AJUSTÉ POUR MOBILE */}
                    <main className="max-w-[1800px] mx-auto px-4 md:px-6 py-12 pt-32 md:pt-48 pb-24">
                        {/* ANCRE DE CATALOGUE */}
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
                                    {' '}• <span className="text-brand-gold">{filteredAndSortedVehicles.length}</span> actifs disponibles
                                </motion.p>
                            </div>
                        </div>

                        {/* GRID DE VÉHICULES - OPTIMIZED GAP FOR MOBILE */}
                        <motion.div 
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8"
                        >
                            <AnimatePresence mode='popLayout'>
                                {filteredAndSortedVehicles.map((vehicle, index) => (
                                    <VehicleCard 
                                        key={vehicle.id} 
                                        vehicle={vehicle} 
                                        index={index} 
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
                                className="py-24 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02] mx-0 md:mx-4"
                            >
                                <div className="flex justify-center mb-6">
                                    {showFavoritesOnly ? <Heart className="w-16 h-16 text-brand-gold/20" /> : <AlertCircle className="w-16 h-16 text-white/20" />}
                                </div>
                                <p className="text-brand-gold font-serif text-2xl md:text-3xl mb-3">Aucun véhicule trouvé</p>
                                <p className="text-slate-500 text-xs md:text-sm font-mono uppercase tracking-wider mb-8 px-4">
                                    {showFavoritesOnly 
                                        ? "Votre sélection privée est vide." 
                                        : "Ajustez vos filtres pour voir plus de résultats."}
                                </p>
                                <button 
                                    onClick={resetFilters}
                                    className="px-8 py-3 rounded-full bg-white text-brand-black text-xs font-bold hover:bg-brand-gold hover:shadow-lg transition-all uppercase tracking-widest active:scale-95"
                                >
                                    {showFavoritesOnly ? "Retour au catalogue" : "Réinitialiser les filtres"}
                                </button>
                            </motion.div>
                        )}

                        {/* Fin de liste decorative */}
                        {filteredAndSortedVehicles.length > 0 && (
                           <div className="mt-20 flex justify-center opacity-30">
                              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent" />
                           </div>
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
