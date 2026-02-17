import React, { useRef } from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { 
  ArrowLeft, Crown, BookOpen, Key, Hash, Gavel, 
  Flag, Globe, RefreshCw, Lightbulb, Star, Check, Sparkles, ChevronRight, Fingerprint
} from 'lucide-react';

interface VIPPageProps {
  onBack: () => void;
}

const benefits = [
  {
    id: "01",
    icon: <BookOpen className="w-5 h-5" />,
    title: "Catalogue Souverain",
    desc: "Accès aux véhicules 'Off-Market'. Prototypes & One-of-One."
  },
  {
    id: "02",
    icon: <Key className="w-5 h-5" />,
    title: "Mobilité Absolue",
    desc: "Testez l'intégralité de la flotte. Sans délai, sans contrainte."
  },
  {
    id: "03",
    icon: <Hash className="w-5 h-5" />,
    title: "Signature Unique",
    desc: "Plaque personnalisée offerte pour marquer votre identité."
  },
  {
    id: "04",
    icon: <Gavel className="w-5 h-5" />,
    title: "Cercle des Enchères",
    desc: "Accès prioritaire Rang 1 lors des ventes privées."
  },
  {
    id: "05",
    icon: <Flag className="w-5 h-5" />,
    title: "Racing Team",
    desc: "Track days, coaching pilote et accès paddock illimité."
  },
  {
    id: "06",
    icon: <Globe className="w-5 h-5" />,
    title: "Prime Import",
    desc: "Accès 'Day-One' aux imports internationaux exclusifs."
  },
  {
    id: "07",
    icon: <RefreshCw className="w-5 h-5" />,
    title: "Sérénité Totale",
    desc: "Véhicule de courtoisie premium garanti en cas d'entretien."
  },
  {
    id: "08",
    icon: <Lightbulb className="w-5 h-5" />,
    title: "Architecte",
    desc: "Influencez directement les prochains modèles importés."
  }
];

// --- ANIMATION VARIANTS (High-End Feel) ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.05, staggerDirection: -1 }
  }
};

const itemVariants: Variants = {
  hidden: { y: 40, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 60,
      damping: 20, // "Heavy" luxury feel
      mass: 1.2
    },
  },
};

const cardHoverVariants: Variants = {
    hover: { 
        y: -8,
        transition: { type: "spring", stiffness: 300, damping: 20 }
    }
};

export const VIPPage: React.FC<VIPPageProps> = ({ onBack }) => {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: scrollRef });
  
  // Parallax effects
  const yBackground = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div ref={scrollRef} className="min-h-screen bg-[#020202] text-slate-200 font-sans selection:bg-brand-gold selection:text-black relative overflow-x-hidden">
      
      {/* --- AMBIENT BACKGROUND (Parallax) --- */}
      <motion.div style={{ y: yBackground }} className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[90vw] h-[90vw] bg-[radial-gradient(circle,rgba(197,160,89,0.04)_0%,transparent_60%)] blur-[150px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[70vw] h-[70vw] bg-[radial-gradient(circle,rgba(255,255,255,0.015)_0%,transparent_50%)] blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.04]" />
          
          {/* Subtle Vertical Lines */}
          <div className="absolute inset-0 flex justify-around opacity-[0.03]">
              <div className="w-[1px] h-full bg-white" />
              <div className="w-[1px] h-full bg-white" />
              <div className="w-[1px] h-full bg-white" />
          </div>
      </motion.div>

      {/* --- NAVIGATION --- */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center pointer-events-none"
      >
        <button 
            onClick={onBack}
            className="pointer-events-auto flex items-center gap-3 group pl-2 pr-6 py-2 rounded-full bg-black/20 backdrop-blur-md border border-white/5 hover:border-brand-gold/30 transition-all duration-300 active:scale-95"
        >
            <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-brand-gold group-hover:text-black transition-colors">
                <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 group-hover:text-white transition-colors">Retour</span>
        </button>

        <img src="https://i.imgur.com/5QiFb0Y.png" alt="Logo" className="h-8 md:h-10 opacity-80 drop-shadow-2xl" />
      </motion.nav>

      {/* --- CONTENT CONTAINER --- */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative z-10 pt-32 md:pt-48 pb-0 max-w-[1600px] mx-auto px-4 md:px-8"
      >
        
        {/* --- HERO SECTION --- */}
        <motion.div 
            style={{ opacity: opacityHero }}
            className="flex flex-col md:flex-row items-center md:items-end justify-between gap-12 mb-32 md:mb-48"
        >
            <div className="flex-1 text-center md:text-left relative">
                <motion.div variants={itemVariants} className="flex items-center justify-center md:justify-start gap-3 mb-8">
                    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-brand-gold" />
                    <span className="text-brand-gold text-[10px] font-bold uppercase tracking-[0.4em]">Membership</span>
                    <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-brand-gold md:hidden" />
                </motion.div>

                <div className="overflow-hidden">
                    <motion.h1 
                        variants={itemVariants}
                        className="text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-serif text-white leading-[0.85] tracking-tight"
                    >
                        Royal <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F2Eecb] to-[#C5A059] italic pr-2">
                            Elite
                        </span>
                    </motion.h1>
                </div>

                <motion.p 
                    variants={itemVariants}
                    className="mt-10 text-sm text-slate-400 max-w-lg mx-auto md:mx-0 leading-relaxed font-light pl-6 border-l border-brand-gold/20 text-justify"
                >
                    Une invitation à l'excellence. Rejoindre le cercle Royal Elite, c'est transcender la simple possession automobile pour accéder à un art de vivre sans compromis.
                </motion.p>
            </div>

            {/* 3D CARD VISUAL */}
            <motion.div 
                variants={itemVariants}
                className="relative w-full max-w-md aspect-[1.586/1] perspective-1000 group cursor-default"
            >
                {/* Glow behind */}
                <div className="absolute -inset-1 bg-brand-gold/20 blur-[50px] rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
                
                <div className="relative w-full h-full rounded-2xl bg-[#080808] border border-white/10 overflow-hidden shadow-2xl transition-transform duration-700 ease-out group-hover:scale-[1.02] group-hover:rotate-x-2 group-hover:-rotate-y-2">
                    {/* Texture & Shine */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/90" />
                    <div className="absolute -inset-full top-0 block h-[200%] w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 blur-md animate-shine-slow" />
                    
                    <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                        <div className="flex justify-between items-start">
                             <Crown className="w-10 h-10 text-brand-gold drop-shadow-[0_0_10px_rgba(197,160,89,0.5)]" />
                             <div className="text-right">
                                 <div className="text-[9px] text-white/40 font-mono tracking-widest uppercase">Member Since</div>
                                 <div className="text-xs text-white/80 font-mono tracking-widest">2026</div>
                             </div>
                        </div>
                        <div>
                            <div className="text-3xl font-serif text-white tracking-widest mb-1 drop-shadow-md">ROYAL ELITE</div>
                            <div className="flex items-center gap-2">
                                <div className="h-[1px] w-8 bg-brand-gold" />
                                <div className="text-[9px] text-brand-gold uppercase tracking-[0.3em]">BlackWood Intl.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>

        {/* --- PRIVILEGES GRID --- */}
        <div className="mb-48 relative">
            {/* Section Title */}
            <motion.div 
                variants={itemVariants} 
                className="flex items-center justify-center gap-4 mb-16"
            >
                <div className="w-2 h-2 rotate-45 bg-brand-gold" />
                <h2 className="text-2xl md:text-3xl font-serif text-white tracking-wide">Privilèges Exclusifs</h2>
                <div className="w-2 h-2 rotate-45 bg-brand-gold" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 px-2">
                {benefits.map((benefit, index) => (
                    <motion.div
                        key={benefit.id}
                        variants={itemVariants}
                        whileHover="hover"
                        className="group relative bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-brand-gold/30 p-6 md:p-8 rounded-xl transition-colors duration-500 overflow-hidden"
                    >
                        {/* Hover Gradient Background */}
                        <motion.div 
                            className="absolute inset-0 bg-gradient-to-b from-brand-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />
                        
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="text-brand-gold/60 group-hover:text-brand-gold transition-colors duration-300">
                                    {benefit.icon}
                                </div>
                                <span className="text-[10px] font-mono text-white/20 group-hover:text-brand-gold/40 transition-colors">
                                    {benefit.id}
                                </span>
                            </div>

                            <h3 className="text-lg font-serif text-white mb-3 group-hover:translate-x-1 transition-transform duration-300">
                                {benefit.title}
                            </h3>
                            
                            <p className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                                {benefit.desc}
                            </p>
                        </div>
                        
                        {/* Bottom Line Interaction */}
                        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-gold transition-all duration-500 group-hover:w-full" />
                    </motion.div>
                ))}
            </div>
        </div>

        {/* --- NEW PRICING & CTA SECTION (The "Invitation") --- */}
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="pb-32 flex flex-col items-center relative"
        >
            {/* Background God Ray */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-gold/5 blur-[100px] rounded-full pointer-events-none" />

            <motion.div variants={itemVariants} className="text-center mb-16">
                 <div className="inline-flex items-center justify-center p-3 mb-6 rounded-full border border-white/10 bg-white/[0.02]">
                    <Star className="w-5 h-5 text-brand-gold animate-[spin_10s_linear_infinite]" />
                 </div>
                 <h2 className="text-4xl md:text-6xl font-serif text-white mb-4">
                    L'Excellence n'attend pas.
                 </h2>
                 <p className="text-slate-500 text-sm font-light tracking-widest uppercase">
                    Rejoignez l'élite dès aujourd'hui
                 </p>
            </motion.div>

            {/* --- THE MONOLITH (Pricing & Action) --- */}
            <motion.div 
                variants={itemVariants}
                className="w-full max-w-lg mx-auto relative group"
            >
                {/* Border Gradient Line */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[1px] h-10 bg-gradient-to-b from-transparent to-white/20" />

                <div className="relative bg-[#050505] border-y border-white/10 p-10 md:p-14 flex flex-col items-center text-center transition-all duration-500 hover:border-brand-gold/30">
                    
                    {/* Decorative corners */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/20" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/20" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/20" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/20" />

                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-brand-gold mb-2">
                        Droit d'entrée
                    </span>
                    
                    <div className="relative mb-6">
                        <span className="text-6xl md:text-8xl font-serif text-white tracking-tighter">
                            50,000
                        </span>
                        <span className="absolute -top-2 -left-6 text-xl text-slate-500 font-serif">$</span>
                    </div>

                    <div className="flex items-center gap-6 mb-12">
                         <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider">
                            <Check className="w-3 h-3 text-brand-gold" />
                            <span>Hebdomadaire</span>
                         </div>
                         <div className="w-1 h-1 bg-slate-600 rounded-full" />
                         <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider">
                            <Check className="w-3 h-3 text-brand-gold" />
                            <span>100% Déductible</span>
                         </div>
                    </div>

                    {/* THE BUTTON */}
                    <a href="https://discord.gg/88peMJRz95" target="_blank" rel="noopener noreferrer" className="w-full">
                        <button className="relative w-full group/btn overflow-hidden">
                            <div className="absolute inset-0 bg-white transition-all duration-500 ease-out group-hover/btn:scale-x-105 group-hover/btn:scale-y-110" />
                            <div className="absolute inset-0 bg-brand-gold opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                            
                            <div className="relative px-8 py-5 border border-white/20 bg-transparent flex items-center justify-center gap-4 transition-transform duration-300 group-active/btn:scale-[0.98]">
                                <span className="text-xs font-bold uppercase tracking-[0.3em] text-black group-hover/btn:text-black transition-colors">
                                    Demander l'accès
                                </span>
                                <ChevronRight className="w-4 h-4 text-black group-hover/btn:translate-x-1 transition-transform" />
                            </div>
                        </button>
                    </a>

                    <div className="mt-8 flex items-center gap-2 opacity-40">
                         <Fingerprint className="w-8 h-8 text-white" />
                         <div className="h-[1px] w-20 bg-white/50" />
                         <span className="text-[8px] font-mono uppercase tracking-widest text-white">
                             Secure Clearance
                         </span>
                    </div>

                </div>
                
                {/* Border Gradient Line Bottom */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[1px] h-10 bg-gradient-to-t from-transparent to-white/20" />
            </motion.div>
            
            <motion.button 
                variants={itemVariants}
                onClick={onBack}
                className="mt-16 text-[9px] uppercase tracking-[0.25em] text-slate-600 hover:text-white transition-colors"
            >
                Retour au catalogue
            </motion.button>

        </motion.div>

      </motion.div>
    </div>
  );
};
