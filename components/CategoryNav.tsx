import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';

interface CategoryNavProps {
  categories: string[];
  visible: boolean;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({ categories, visible }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('');

  // --- SCROLL SPY LOGIC ---
  useEffect(() => {
    if (!visible) return;

    const observers: IntersectionObserverEntry[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // L'ID est sous la forme "cat-NOM", on retire "cat-"
            const id = entry.target.id.replace('cat-', '');
            setActiveCategory(id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -60% 0px', // Zone de détection au centre de l'écran
        threshold: 0
      }
    );

    categories.forEach((cat) => {
      const el = document.getElementById(`cat-${cat}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [categories, visible]);

  // --- SCROLL TO FUNCTION ---
  const scrollToCategory = (cat: string) => {
    const el = document.getElementById(`cat-${cat}`);
    if (el) {
        const offset = 220; // Header + Filters height approx
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
        // Set active immediately for responsiveness
        setActiveCategory(cat);
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* --- DESKTOP VERTICAL DOCK (Premium Retractable) --- */}
      <motion.div 
        layout
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        className={`hidden 2xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isExpanded ? 'w-64' : 'w-16'}`}
      >
        {/* CONTAINER GLASS */}
        <motion.div 
            layout
            className="bg-[#050505]/80 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] rounded-[2rem] overflow-hidden flex flex-col max-h-[70vh]"
        >
            
            {/* HEADER / TOGGLE */}
            <div className="p-2 border-b border-white/5 flex justify-center shrink-0">
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-brand-gold flex items-center justify-center transition-colors"
                >
                    {isExpanded ? <ChevronRight className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
            </div>

            {/* SCROLLABLE LIST */}
            <div className="overflow-y-auto custom-scrollbar p-3 flex flex-col gap-1.5 overscroll-contain">
                {categories.map((cat) => {
                    const isActive = activeCategory === cat;
                    return (
                        <button
                            key={cat}
                            onClick={() => scrollToCategory(cat)}
                            className={`group relative flex items-center rounded-xl transition-all duration-300 shrink-0 ${isExpanded ? 'px-4 py-3 bg-white/0 hover:bg-white/5' : 'justify-center w-10 h-10 hover:bg-white/5'}`}
                        >
                            {/* INDICATOR DOT / LINE */}
                            <div className={`relative z-10 transition-all duration-300 ${isActive ? 'bg-brand-gold shadow-[0_0_10px_rgba(197,160,89,0.5)]' : 'bg-white/20 group-hover:bg-white/50'} ${isExpanded ? 'w-1.5 h-1.5 rounded-full mr-4' : 'w-1.5 h-1.5 rounded-full'}`} />
                            
                            {/* TEXT LABEL (Expanded Only) */}
                            {isExpanded && (
                                <motion.span 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`text-[10px] uppercase font-bold tracking-widest truncate text-left ${isActive ? 'text-brand-gold' : 'text-slate-400 group-hover:text-slate-200'}`}
                                >
                                    {cat}
                                </motion.span>
                            )}

                            {/* TOOLTIP (Collapsed Only) */}
                            {!isExpanded && (
                                <div className="absolute right-full mr-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 translate-x-2 group-hover:translate-x-0 z-50">
                                    <div className="bg-black border border-brand-gold/30 text-brand-gold text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
                                        {cat}
                                    </div>
                                    {/* Arrow */}
                                    <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-black border-t border-r border-brand-gold/30 rotate-45 transform" />
                                </div>
                            )}

                            {/* ACTIVE GLOW BACKGROUND (Expanded) */}
                            {isActive && isExpanded && (
                                <motion.div 
                                    layoutId="activeNavGlow"
                                    className="absolute inset-0 bg-gradient-to-r from-brand-gold/10 to-transparent rounded-xl border-l-2 border-brand-gold"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* FADE BOTTOM (Visual Cue for scrolling) */}
            <div className="h-6 shrink-0 bg-gradient-to-t from-[#050505]/90 to-transparent pointer-events-none -mt-6 z-10" />

        </motion.div>
      </motion.div>

      {/* --- MOBILE/TABLET HORIZONTAL NAV (Unchanged but ensuring sticky z-index) --- */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="2xl:hidden sticky top-[8.5rem] md:top-[10.5rem] z-30 w-full overflow-x-auto hide-scrollbar py-2 bg-gradient-to-b from-brand-black/90 to-transparent pointer-events-auto"
      >
          <div className="flex px-4 md:px-8 gap-2 min-w-max">
              {categories.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                        key={cat}
                        onClick={() => scrollToCategory(cat)}
                        className={`px-4 py-1.5 rounded-full border backdrop-blur-md text-[9px] md:text-[10px] uppercase font-bold tracking-widest transition-all active:scale-95 ${isActive ? 'bg-brand-gold text-black border-brand-gold shadow-lg' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
                    >
                        {cat}
                    </button>
                  );
              })}
          </div>
      </motion.div>
    </>
  );
};
