import React from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldCheck, Globe, Zap, MousePointer2 } from 'lucide-react';

// --- COMPOSANT BUTTON INTÉGRÉ (Pour éviter les erreurs de résolution) ---
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'outline';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary', className = '' }) => {
  const baseStyles = "relative inline-flex items-center justify-center px-8 py-4 font-bold uppercase tracking-[0.2em] text-[10px] rounded-full transition-all duration-500 overflow-hidden group";
  
  const variants = {
    primary: "bg-brand-gold text-black hover:shadow-[0_0_30px_rgba(197,160,89,0.4)]",
    outline: "bg-transparent border border-white/20 text-white hover:border-brand-gold hover:text-brand-gold"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      {variant === 'primary' && (
        <motion.div 
          className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"
        />
      )}
    </motion.button>
  );
};

// --- COMPOSANT HERO ---
interface HeroProps {
  onEnterCatalog?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onEnterCatalog }) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black selection:bg-brand-gold/30">
      
      {/* 1. ARRIÈRE-PLAN LUXE (Glows & Textures) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Lueurs dynamiques avec animation lente */}
        <motion.div 
            animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.15, 0.25, 0.15],
                x: [-20, 20, -20],
                y: [0, -30, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[15%] -left-[10%] w-[80%] h-[80%] bg-brand-gold/10 rounded-full blur-[150px]" 
        />
        <motion.div 
            animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.1, 0.2, 0.1],
                x: [30, -30, 30],
                y: [20, 0, 20]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-[20%] -right-[15%] w-[80%] h-[80%] bg-brand-slate/20 rounded-full blur-[150px]" 
        />
        
        {/* Grille de fond subtile */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #C5A059 1px, transparent 0)`,
            backgroundSize: '60px 60px'
        }}></div>

        {/* Lignes verticales de structure */}
        <div className="absolute left-[10%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        <div className="absolute right-[10%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      </div>

      {/* 2. CONTENU PRINCIPAL */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-6 text-center flex flex-col items-center"
      >
        {/* Badge d'introduction */}
        <motion.div variants={itemVariants} className="mb-10">
            <span className="inline-flex items-center gap-3 py-2 px-8 border border-brand-gold/20 text-brand-gold text-[10px] uppercase tracking-[0.5em] rounded-full bg-brand-gold/5 backdrop-blur-xl shadow-[0_0_40px_-10px_rgba(197,160,89,0.1)]">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold"></span>
                </span>
                Est. Delaware • New York Headquarters
            </span>
        </motion.div>

        {/* LOGO (Effet de lueur et ombre) */}
        <motion.div variants={itemVariants} className="mb-12 md:mb-16 relative">
            <div className="absolute inset-0 bg-brand-gold/5 blur-[80px] rounded-full -z-10" />
            <img 
                src="https://i.imgur.com/5QiFb0Y.png" 
                alt="BlackWood Royal Motors" 
                className="w-full max-w-[320px] md:max-w-[550px] lg:max-w-[800px] h-auto object-contain mx-auto drop-shadow-[0_25px_40px_rgba(0,0,0,0.8)]"
            />
        </motion.div>

        {/* Séparateur Minimaliste */}
        <motion.div 
            variants={itemVariants}
            className="w-40 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent mb-12"
        />

        {/* Paragraphe descriptif */}
        <motion.p 
          variants={itemVariants}
          className="text-slate-400 max-w-2xl mx-auto text-base md:text-xl leading-relaxed font-light tracking-wide mb-16 mix-blend-plus-lighter px-4"
        >
          L'incarnation de l'ingénierie de pointe et de l'élégance intemporelle. 
          Entrez dans un univers où chaque véhicule est une œuvre d'art 
          conçue pour l'élite mondiale.
        </motion.p>

        {/* CTAs (Call to Actions) */}
        <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-24"
        >
            <Button 
                onClick={onEnterCatalog}
                className="px-12 py-5 text-sm group"
            >
                Accéder au Catalogue
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Button>
            
            <a href="https://blackwood-international.github.io/BlackWood/" target="_blank" rel="noopener noreferrer" className="block w-full sm:w-auto">
                <Button variant="outline" className="px-12 py-5 text-sm w-full">
                    BlackWood Group
                </Button>
            </a>
        </motion.div>

        {/* 3. FEATURES (Bas de page) */}
        <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-12 pt-16 border-t border-white/10 w-full max-w-5xl"
        >
            <div className="flex flex-col items-center gap-3 group">
                <ShieldCheck className="w-6 h-6 text-brand-gold opacity-40 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-110" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500 group-hover:text-slate-300 transition-colors">Vérification Certifiée</span>
            </div>
            <div className="flex flex-col items-center gap-3 group">
                <Globe className="w-6 h-6 text-brand-gold opacity-40 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-110" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500 group-hover:text-slate-300 transition-colors">Réseau International</span>
            </div>
            <div className="flex flex-col items-center gap-3 group">
                <Zap className="w-6 h-6 text-brand-gold opacity-40 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-110" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500 group-hover:text-slate-300 transition-colors">Service Sur-Mesure</span>
            </div>
        </motion.div>
      </motion.div>

      {/* 4. SCROLL INDICATOR (Animation de flux lumineux) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-5 z-20 cursor-pointer group"
        onClick={onEnterCatalog}
      >
        <span className="text-[9px] uppercase tracking-[0.5em] text-brand-gold/40 group-hover:text-brand-gold transition-colors font-bold">Explorer</span>
        <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-white/10 to-transparent relative overflow-hidden">
            <motion.div
                animate={{ y: [-80, 80] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-brand-gold to-transparent"
            />
        </div>
      </motion.div>
    </div>
  );
};
