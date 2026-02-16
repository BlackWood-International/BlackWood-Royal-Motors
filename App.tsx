import React, { useEffect, useState, useMemo, useRef } from 'react';
import { fetchCatalog } from './services/dataService';
import { Vehicle, SortOption } from './types';
import { Hero } from './components/Hero';
import { VehicleCard } from './components/VehicleCard';
import { VehicleModal } from './components/VehicleModal';
import { FilterPanel } from './components/FilterPanel';
import { Footer } from './components/Footer';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, AlertCircle, Heart } from 'lucide-react';

function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  
  // Filter States - Now Arrays for Multi-select
  const [activeCategories, setActiveCategories] = useState<string[]>(['All']);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(['All']);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceRange, setPriceRange] = useState<{min: string, max: string}>({ min: '', max: '' });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  
  // Favorites State (Persisted)
  const [favorites, setFavorites] = useState<string[]>([]);

  // Default sort is catalog order (Sheet order)
  const [sortOption, setSortOption] = useState<SortOption>('original');
  
  const isFirstRender = useRef(true);

  // Load Data
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

  // Load Favorites from LocalStorage
  useEffect(() => {
    const savedFavs = localStorage.getItem('bw_favorites');
    if (savedFavs) {
        try {
            setFavorites(JSON.parse(savedFavs));
        } catch (e) {
            console.error("Failed to parse favorites", e);
        }
    }
  }, []);

  // Save Favorites to LocalStorage
  useEffect(() => {
    localStorage.setItem('bw_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (vehicleId: string) => {
    setFavorites(prev => 
        prev.includes(vehicleId) 
        ? prev.filter(id => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  // Automatic scroll on filter change
  useEffect(() => {
    if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
    }

    const anchor = document.getElementById('catalog-anchor');
    if (anchor) {
        const offset = -120; 
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = anchor.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition + offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
  }, [activeCategories, selectedBrands, searchQuery, sortOption, priceRange.min, priceRange.max, showFavoritesOnly]);

  // Reset all filters
  const resetFilters = () => {
    setActiveCategories(['All']);
    setSelectedBrands(['All']);
    setSearchQuery('');
    setSortOption('original');
    setPriceRange({ min: '', max: '' });
    setShowFavoritesOnly(false);
  };

  // Extract unique categories and brands
  const categories = useMemo(() => {
    const cats = Array.from(new Set(vehicles.map(v => v.category))).sort();
    return ['All', ...cats];
  }, [vehicles]);

  const brands = useMemo(() => {
    return Array.from(new Set(vehicles.map(v => v.brand))).sort();
  }, [vehicles]);

  // Filtering Logic
  const filteredAndSortedVehicles = useMemo(() => {
    let result = [...vehicles];

    // 0. Favorites Filter
    if (showFavoritesOnly) {
        result = result.filter(v => favorites.includes(v.id));
    }

    // 1. Category Filter (Multi-select OR logic)
    if (!activeCategories.includes('All')) {
      result = result.filter(v => activeCategories.includes(v.category));
    }

    // 2. Brand Filter (Multi-select OR logic)
    if (!selectedBrands.includes('All')) {
      result = result.filter(v => selectedBrands.includes(v.brand));
    }

    // 3. Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(v => 
        v.model.toLowerCase().includes(q) || 
        v.brand.toLowerCase().includes(q)
      );
    }

    // 4. Price Range Filter
    if (priceRange.min !== '') {
        const min = parseFloat(priceRange.min);
        if (!isNaN(min)) {
            result = result.filter(v => v.priceValue >= min);
        }
    }
    if (priceRange.max !== '') {
        const max = parseFloat(priceRange.max);
        if (!isNaN(max)) {
            result = result.filter(v => v.priceValue <= max);
        }
    }

    // 5. Sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case 'original':
            return a.originalIndex - b.originalIndex;
        case 'brand-asc':
            const brandComparison = a.brand.localeCompare(b.brand);
            if (brandComparison !== 0) return brandComparison;
            return a.model.localeCompare(b.model);
        case 'price-asc':
          return a.priceValue - b.priceValue;
        case 'price-desc':
          return b.priceValue - a.priceValue;
        case 'name-asc':
          return a.model.localeCompare(b.model);
        default:
          return 0;
      }
    });

    return result;
  }, [vehicles, activeCategories, selectedBrands, searchQuery, sortOption, priceRange, showFavoritesOnly, favorites]);

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
    // MAIN WRAPPER WITH UNIFIED BACKGROUND
    <div className="bg-brand-black min-h-screen text-slate-200 selection:bg-brand-gold/30 flex flex-col font-sans relative overflow-x-hidden">
      
      {/* GLOBAL BACKGROUND TEXTURE & GRADIENT */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#1a1a1a] via-[#050505] to-[#000000]"></div>
         <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(#C5A059 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
         }}></div>
      </div>

      {/* Content z-index > 0 to sit on top of fixed background */}
      <div className="relative z-10">
        <Hero />

        {/* Modal Overlay */}
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

        <div id="catalog" className="min-h-screen pt-10">
          <FilterPanel 
              categories={categories}
              activeCategories={activeCategories}
              onCategoryChange={(newCats) => setActiveCategories(newCats)}
              brands={brands}
              selectedBrands={selectedBrands}
              onBrandChange={(newBrands) => setSelectedBrands(newBrands)}
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

          <main className="max-w-[1800px] mx-auto px-4 md:px-6 py-12">
            
            <div id="catalog-anchor" className="mb-12 flex items-end justify-between border-b border-white/5 pb-4 mx-4 scroll-mt-32">
                <div>
                  <motion.h2 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="text-3xl font-serif text-white mb-2"
                  >
                      {showFavoritesOnly ? 'Ma Sélection' : 'Catalogue Officiel'}
                  </motion.h2>
                  <motion.p 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                      className="text-slate-500 text-sm font-light tracking-wide"
                  >
                      {showFavoritesOnly 
                        ? 'Véhicules sauvegardés' 
                        : (activeCategories.includes('All') ? 'Inventaire Complet' : activeCategories.join(', '))} 
                      {' '}• <span className="text-brand-gold">{filteredAndSortedVehicles.length}</span> véhicules disponibles
                  </motion.p>
                </div>
            </div>

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
            
            {filteredAndSortedVehicles.length === 0 && (
              <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-32 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02] mx-4"
              >
                <div className="flex justify-center mb-4">
                    {showFavoritesOnly ? <Heart className="w-16 h-16 text-brand-gold/20" /> : <AlertCircle className="w-16 h-16 text-white/20" />}
                </div>
                <p className="text-brand-gold font-serif text-3xl mb-3">Aucun actif trouvé</p>
                <p className="text-slate-500 text-sm font-mono uppercase tracking-wider mb-8">
                    {showFavoritesOnly 
                        ? "Vous n'avez ajouté aucun véhicule à vos favoris." 
                        : "Veuillez ajuster vos critères de recherche"}
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
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default App;