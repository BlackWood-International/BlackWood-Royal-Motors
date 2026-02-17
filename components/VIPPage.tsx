
import React, { useState, useRef } from 'react';
import { 
  motion, AnimatePresence, Variants, useScroll, useTransform
} from 'framer-motion';
import { 
  ArrowLeft, Crown, BookOpen, Key, Hash, Gavel, 
  Flag, Globe, RefreshCw, Lightbulb, ChevronRight, CheckCircle2, Star, Sparkles, Fingerprint, X, Info, ArrowUpRight, ShieldCheck
} from 'lucide-react';

interface VIPPageProps {
  onBack: () => void;
}

// --- OPTIMIZED ANIMATION VARIANTS ---
const pageVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

const cardItemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
        duration: 0.5, 
        ease: [0.21, 0.47, 0.32, 0.98]
    } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

// --- DATA ---
const benefits = [
  { 
    id: "01", icon: <BookOpen />, title: "Catalogue Souverain", short: "Véhicules rares et de prestige.",
    desc: "Accès à une sélection de véhicules rares et de prestige strictement réservés aux membres VIP, garantissant une exclusivité totale sur la route.",
    features: ["Sélection 'Off-Market'", "Exclusivité totale", "Prestige garanti"]
  },
  { 
    id: "02", icon: <Key />, title: "Conduite sans Frais", short: "Essais libres de la gamme.",
    desc: "Possibilité d'essayer librement et sans frais les derniers modèles routiers de la gamme, permettant de valider chaque acquisition dans des conditions réelles.",
    features: ["Essais illimités", "Aucuns frais de dossier", "Validation en conditions réelles"]
  },
  { 
    id: "03", icon: <Hash />, title: "Signature de Prestige", short: "Plaque personnalisée offerte.",
    desc: "Personnalisation de la plaque d'immatriculation offerte lors de l'achat, transformant le véhicule en une pièce unique dès sa sortie de concession.",
    features: ["Frais offerts", "Pièce unique", "Service immédiat à l'achat"]
  },
  { 
    id: "04", icon: <Gavel />, title: "Cercle des Enchères", short: "Ventes privées prioritaires.",
    desc: "Invitations prioritaires à des ventes aux enchères privées où sont proposés des modèles historiques, des prototypes ou des éditions limitées introuvables sur le marché classique.",
    features: ["Modèles historiques", "Prototypes rares", "Éditions limitées"]
  },
  { 
    id: "05", icon: <Flag />, title: "Immersion Racing", short: "Accès VIP événements & circuit.",
    desc: "Accès VIP aux événements de la BlackWood Racing Team et invitations exclusives pour des essais privés sur circuit, encadrés par des pilotes professionnels.",
    features: ["Essais privés sur circuit", "Encadrement pilote pro", "Accès Paddock"]
  },
  { 
    id: "06", icon: <Globe />, title: "Priorité d'Importation", short: "Accès anticipé aux nouveautés.",
    desc: "Accès anticipé aux nouvelles importations de véhicules (terrestres, maritimes ou aériens), permettant de posséder les dernières innovations avant leur déploiement général en Amérique du Nord.",
    features: ["Avant déploiement NA", "Imports Terrestres/Mer/Air", "Dernières innovations"]
  },
  { 
    id: "07", icon: <RefreshCw />, title: "Sérénité Opérationnelle", short: "Mobilité ininterrompue.",
    desc: "Mise à disposition systématique d'un véhicule de remplacement de gamme équivalente en cas d'entretien ou d'imprévu, assurant une mobilité ininterrompue.",
    features: ["Véhicule de remplacement", "Gamme équivalente", "Service systématique"]
  },
  { 
    id: "08", icon: <Lightbulb />, title: "Droit de Suggestion", short: "Influencez le catalogue.",
    desc: "Capacité pour le membre de proposer l'ajout de nouveaux modèles ou de configurations spécifiques au catalogue de BRM, influençant directement l'offre de la filiale.",
    features: ["Propositions de modèles", "Configurations spécifiques", "Influence directe"]
  }
];

// --- PARTNERS DATA ---
const partners = [
    { name: "Crowex", img: "https://static.wikia.nocookie.net/gtawiki/images/a/a1/Crowex-Logo.svg" },
    { name: "Crastenbourg", img: "https://static.wikia.nocookie.net/degta/images/4/44/Von-Crastenburg-Hotel-Logo.png" },
    { name: "Buckingham", img: "https://static.wikia.nocookie.net/gtawiki/images/3/38/Buckingham-GTAO-Logo.png" },
    { name: "Enus", img: "https://static.wikia.nocookie.net/gtawiki/images/1/1f/Enus-GTAO-Logo.png" },
    { name: "Coil", img: "https://static.wikia.nocookie.net/gtawiki/images/3/3f/Coil-GTAO-Logo.png" },
    { name: "Grotti", img: "https://static.wikia.nocookie.net/gtawiki/images/3/35/Grotti-GTAV-Logo.png" },
    { name: "Pfister", img: "https://static.wikia.nocookie.net/gtawiki/images/8/88/Pfister-GTAO-Logo.png" },
];

// --- REBUILT 3D CARD COMPONENT ---
const VIPCard = () => {
  return (
    <div className="w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[420px] md:max-w-[500px] aspect-[1.586/1] relative z-20 mx-auto select-none group perspective-1000">
      
      {/* CARD BODY */}
      <div className="w-full h-full rounded-[1.2rem] md:rounded-[2rem] relative bg-[#141414] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.95)] overflow-hidden transform-gpu border border-[#333]/40">
        
        {/* --- MATERIAL LAYERS --- */}
        <div 
            className="absolute inset-0 z-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
        <div 
            className="absolute inset-0 z-0 mix-blend-soft-light pointer-events-none"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='104' viewBox='0 0 60 104' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l28.87 16.67v33.33L30 66.67 1.13 50V16.67z' stroke='%23ffffff' stroke-width='1.5' fill='none' opacity='1'/%3E%3Cpath d='M30 52l28.87 16.67v33.33L30 118.67 1.13 102V68.67z' stroke='%23ffffff' stroke-width='1.5' fill='none' opacity='1'/%3E%3C/svg%3E")`,
                backgroundSize: '40px auto', 
                opacity: 0.03,
                maskImage: 'radial-gradient(circle at 40% 40%, black 30%, transparent 90%)',
                WebkitMaskImage: 'radial-gradient(circle at 40% 40%, black 30%, transparent 90%)'
            }}
        />
        
        {/* 3. LIGHTING & REFLECTION */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/80 z-0 pointer-events-none" />
        <div className="absolute -top-[30%] -left-[30%] w-[80%] h-[80%] bg-[radial-gradient(circle,rgba(197,160,89,0.2)_0%,transparent_60%)] blur-[60px] pointer-events-none z-0 mix-blend-screen" />
        <div className="absolute -top-[20%] -left-[20%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,transparent_70%)] blur-[40px] pointer-events-none z-0 mix-blend-overlay" />
        
        {/* --- CENTRAL EMBOSSED LOGO --- */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <span 
                className="font-serif text-[3.5rem] sm:text-[5rem] md:text-[6rem] font-medium leading-none tracking-tighter text-[#181818]"
                style={{ textShadow: `-1px -1px 2px rgba(255,255,255,0.07), 1px  1px 2px rgba(0,0,0,0.9)` }}
            >
                BW.
            </span>
        </div>

        {/* --- CONTENT LAYER --- */}
        <div className="absolute inset-0 p-5 md:p-8 flex flex-col justify-between z-20">
          <div className="flex justify-between items-start">
             <div className="relative">
                <div className="absolute -inset-4 bg-brand-gold/20 blur-xl rounded-full opacity-60 pointer-events-none" />
                <Crown className="w-6 h-6 md:w-10 md:h-10 text-brand-gold drop-shadow-[0_2px_10px_rgba(197,160,89,0.5)] relative z-10" strokeWidth={1.5} />
             </div>
             <div className="text-right flex flex-col items-end opacity-80">
                 <div className="text-[6px] md:text-[8px] text-[#555] font-mono tracking-[0.2em] uppercase mb-1 font-bold">MEMBER ID</div>
                 <div className="text-[10px] md:text-sm text-brand-gold/90 font-mono tracking-widest font-bold drop-shadow-sm">1933-2027</div>
             </div>
          </div>
          <div className="flex items-end justify-between">
              <div>
                  <div className="text-xl md:text-3xl font-serif text-slate-100 tracking-[0.1em] mb-1.5 md:mb-2 drop-shadow-md">ROYAL ELITE</div>
                  <div className="flex items-center gap-2 md:gap-3">
                      <div className="h-[1px] w-6 md:w-10 bg-brand-gold/60" />
                      <div className="text-[6px] md:text-[8px] text-brand-gold/80 uppercase tracking-[0.3em] font-medium">BlackWood International</div>
                  </div>
              </div>
              <div className="opacity-50 mix-blend-screen">
                  <img src="https://i.imgur.com/5QiFb0Y.png" className="h-5 md:h-8 grayscale contrast-125" alt="logo" />
              </div>
          </div>
        </div>
        <div className="absolute inset-0 rounded-[1.2rem] md:rounded-[2rem] border border-white/5 z-30 pointer-events-none" />
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
export const VIPPage: React.FC<VIPPageProps> = ({ onBack }) => {
  const [selectedBenefit, setSelectedBenefit] = useState<typeof benefits[0] | null>(null);

  return (
    <motion.div 
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen bg-[#020202] text-slate-200 font-sans selection:bg-brand-gold selection:text-black relative overflow-x-hidden"
    >
      
      {/* --- FIXED BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#121212_0%,#000000_100%)]" />
          <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
          <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-brand-gold/5 blur-[150px] rounded-full mix-blend-screen animate-pulse duration-[5000ms]" />
      </div>

      {/* --- NAVIGATION --- */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-[100] px-4 md:px-6 py-4 md:py-6 flex justify-between items-center pointer-events-none"
      >
        <button 
            onClick={onBack}
            className="pointer-events-auto flex items-center gap-2 md:gap-3 group pl-2 pr-2 md:pr-6 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/5 hover:border-brand-gold/30 transition-all duration-300 active:scale-95 shadow-2xl cursor-pointer"
        >
            <div className="p-2 rounded-full bg-white/5 group-hover:bg-brand-gold group-hover:text-black transition-colors">
                <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 group-hover:text-white transition-colors hidden md:inline">Retour</span>
        </button>
        <img src="https://i.imgur.com/5QiFb0Y.png" alt="Logo" className="h-8 md:h-10 opacity-90" />
      </motion.nav>

      {/* --- SCROLLABLE CONTENT --- */}
      <div className="relative z-10 pb-12 overflow-x-hidden">
        
        {/* HERO SECTION - MOBILE OPTIMIZED LAYOUT */}
        <div className="pt-24 md:pt-48 px-4 md:px-8 max-w-[1600px] mx-auto mb-20 md:mb-32">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
                
                {/* 1. Mobile: Card First (Visual Hook) / Desktop: Card Right (Symmetry) */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    // CORRECTION: Increased translate-x to better match reference screenshot
                    className="w-full lg:w-1/2 flex justify-center lg:justify-end lg:order-2 lg:translate-x-28 xl:translate-x-40"
                >
                    <VIPCard />
                </motion.div>

                {/* 2. Text Content */}
                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="w-full lg:w-1/2 text-center lg:text-left z-10 lg:order-1"
                >
                    <motion.div variants={cardItemVariants} className="flex items-center justify-center lg:justify-start gap-4 mb-4 md:mb-6">
                        <div className="h-[1px] w-8 md:w-12 bg-gradient-to-r from-transparent to-brand-gold" />
                        <span className="text-brand-gold text-[10px] md:text-xs font-bold uppercase tracking-[0.4em]">Membership</span>
                    </motion.div>

                    <div className="overflow-visible pb-2">
                        <motion.h1 
                            variants={cardItemVariants}
                            className="text-[3rem] xs:text-[3.5rem] sm:text-7xl md:text-8xl lg:text-[7.5rem] font-serif text-white leading-[0.9] tracking-tight"
                        >
                            Royal <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF8E1] to-[#C5A059] italic pr-2">
                                Elite
                            </span>
                        </motion.h1>
                    </div>

                    <motion.p 
                        variants={cardItemVariants}
                        className="mt-6 md:mt-8 text-sm md:text-base text-slate-400 max-w-md lg:max-w-lg mx-auto lg:mx-0 leading-relaxed font-light pl-0 lg:pl-6 lg:border-l border-brand-gold/30 text-center lg:text-justify px-4 lg:px-0"
                    >
                        Rejoindre le cercle Royal Elite, c'est transcender la simple possession automobile pour accéder à un art de vivre sans compromis. L'excellence n'est plus un but, c'est votre standard.
                    </motion.p>
                </motion.div>
            </div>
        </div>

        {/* PRIVILEGES SECTION - HORIZONTAL SCROLL ON MOBILE */}
        <div className="mb-24 md:mb-48">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-8 md:mb-16 px-4"
            >
                <h2 className="text-2xl md:text-5xl font-serif text-white mb-4">Privilèges <span className="italic text-brand-gold">Absolus</span></h2>
                <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent mx-auto" />
            </motion.div>

            {/* CONTAINER: Grid on Desktop, Horizontal Scroll Snap on Mobile 
                FIX: Added vertical padding (py-10) to prevent clipping of hover effects.
            */}
            <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "50px" }}
                className="
                    flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 py-10 scroll-smooth hide-scrollbar
                    md:grid md:grid-cols-2 xl:grid-cols-4 md:gap-8 md:px-8 max-w-[1600px] mx-auto
                "
            >
                {benefits.map((b) => (
                    <div key={b.id} className="min-w-[85vw] sm:min-w-[300px] snap-center md:min-w-0 h-full">
                        <BenefitCard item={b} onClick={() => setSelectedBenefit(b)} />
                    </div>
                ))}
            </motion.div>
        </div>

        {/* PRICING ALTAR - PIXEL PERFECT GEOMETRY */}
        <div className="flex flex-col items-center justify-center mb-32 px-4">
             <PricingAltar onBack={onBack} />
        </div>

        {/* PARTNERS SECTION */}
        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="border-t border-white/5 pt-12 md:pt-16 pb-12 max-w-[1600px] mx-auto"
        >
             <div className="text-center mb-10 md:mb-12">
                 <h3 className="text-xl md:text-4xl font-serif text-white mb-6 tracking-wide">Partenaires <span className="italic text-brand-gold">Officiels</span></h3>
                 <div className="w-16 md:w-24 h-0.5 bg-brand-gold/30 mx-auto" />
             </div>

             <div className="grid grid-cols-2 md:flex md:flex-wrap justify-center items-center gap-8 md:gap-16 lg:gap-20 px-4">
                 {partners.map((p) => (
                     <div key={p.name} className="flex justify-center group cursor-default transition-all duration-500">
                         <img 
                            src={p.img} 
                            alt={p.name} 
                            className="h-8 md:h-16 w-auto object-contain grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-out" 
                         />
                     </div>
                 ))}
             </div>
        </motion.div>

        {/* FOOTER */}
        <div className="mt-8 md:mt-12 text-center opacity-60 pb-8 px-4">
           <div className="flex items-center gap-3 justify-center mb-3">
               <div className="h-[1px] w-6 md:w-8 bg-white/20" />
               <Fingerprint className="w-4 h-4 text-brand-gold" />
               <div className="h-[1px] w-6 md:w-8 bg-white/20" />
           </div>
           <p className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-slate-500 font-light">
               Made with Precision by <span className="text-brand-gold font-bold">BlackWood Brand & Design</span>
           </p>
        </div>

      </div>

      {/* --- MODAL --- */}
      <AnimatePresence>
        {selectedBenefit && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-end md:items-center justify-center sm:p-6 md:p-10"
            >
                <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setSelectedBenefit(null)} />
                <motion.div 
                    layoutId={`benefit-card-${selectedBenefit.id}`}
                    initial={{ scale: 0.95, y: 50, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.95, y: 50, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    className="relative w-full max-w-5xl h-[85vh] md:h-auto md:max-h-[85vh] bg-[#080808] border border-white/10 rounded-t-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl z-[210] flex flex-col md:flex-row"
                >
                        <div className="bg-[#0a0a0a] p-6 md:p-12 md:w-[35%] flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-white/5 relative shrink-0">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-brand-gold/10 via-transparent to-transparent opacity-50" />
                            <div className="relative z-10 p-5 md:p-6 rounded-full bg-black/50 border border-brand-gold/30 mb-4 md:mb-8 text-brand-gold shadow-[0_0_40px_-10px_rgba(197,160,89,0.4)]">
                                {React.cloneElement(selectedBenefit.icon, { className: "w-8 h-8 md:w-12 md:h-12" })}
                            </div>
                            <h3 className="text-2xl md:text-4xl font-serif text-white mb-2 md:mb-4 leading-tight">{selectedBenefit.title}</h3>
                            <div className="text-[10px] md:text-xs font-mono text-brand-gold/60 uppercase tracking-[0.2em] border border-brand-gold/20 px-3 py-1 rounded-full">Privilège N°{selectedBenefit.id}</div>
                        </div>
                        
                        <div className="p-6 md:p-14 md:w-[65%] bg-[#050505] relative flex flex-col justify-start md:justify-center overflow-y-auto custom-scrollbar">
                            <button onClick={() => setSelectedBenefit(null)} className="absolute top-4 right-4 md:top-8 md:right-8 p-2 md:p-3 text-slate-500 hover:text-white transition-colors bg-white/5 rounded-full hover:bg-white/10 z-20">
                                <X className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                            <div>
                                <h4 className="text-[10px] md:text-sm font-bold uppercase tracking-[0.25em] text-slate-500 mb-4 md:mb-6 flex items-center gap-2 md:gap-3"><Info className="w-4 h-4 text-brand-gold" />Description Détaillée</h4>
                                <p className="text-sm md:text-lg text-slate-200 leading-relaxed mb-8 md:mb-12 font-light">{selectedBenefit.desc}</p>
                                <h4 className="text-[10px] md:text-sm font-bold uppercase tracking-[0.25em] text-slate-500 mb-4 md:mb-6 flex items-center gap-2 md:gap-3"><Star className="w-4 h-4 text-brand-gold" />Avantages Clés</h4>
                                <ul className="space-y-3 md:space-y-6">
                                    {selectedBenefit.features?.map((feat, idx) => (
                                        <li key={idx} className="flex items-start gap-3 md:gap-4 text-sm md:text-base text-white/90">
                                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-brand-gold/10 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand-gold" /></div>
                                            <span className="pt-0.5">{feat}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- SUB-COMPONENTS ---

// REBUILT FROM SCRATCH FOR PERFORMANCE & NO CLIPPING
const BenefitCard = ({ item, onClick }: { item: any, onClick: () => void }) => {
    return (
        <div
            onClick={onClick}
            // Removed overflow-hidden to prevent clipping of icons/borders
            // Used CSS transitions for performant hover state
            className="group relative h-full flex flex-col p-6 sm:p-8 rounded-[2rem] cursor-pointer bg-[#0a0a0a] border border-white/5 transition-all duration-500 ease-out hover:bg-white/[0.02] hover:border-brand-gold/30 hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] active:scale-[0.98]"
        >
             {/* Glow Effect - CSS driven for performance */}
             <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-brand-gold/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

             {/* Content */}
             <div className="relative z-10 flex flex-col h-full">
                 <div className="flex justify-between items-start mb-6">
                     <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 group-hover:text-brand-gold group-hover:bg-brand-gold/10 group-hover:border-brand-gold/20 transition-all duration-500 shadow-sm group-hover:shadow-[0_0_15px_-5px_rgba(197,160,89,0.3)]">
                         {React.cloneElement(item.icon, { className: "w-5 h-5 transition-transform duration-500 group-hover:scale-110" })}
                     </div>
                     <span className="text-[10px] font-mono font-bold text-white/10 group-hover:text-brand-gold/40 transition-colors duration-500 uppercase tracking-widest pt-1">{item.id}</span>
                 </div>
                 
                 <h3 className="text-2xl font-serif text-white mb-3 leading-tight group-hover:text-brand-gold transition-colors duration-300">{item.title}</h3>
                 <p className="text-sm text-slate-500 font-light leading-relaxed line-clamp-3 group-hover:text-slate-400 transition-colors duration-300">{item.short}</p>
                 
                 <div className="mt-auto pt-8 flex items-center justify-between opacity-40 group-hover:opacity-100 transition-all duration-500">
                    <div className="h-[1px] w-12 bg-gradient-to-r from-brand-gold to-transparent group-hover:w-full transition-all duration-700 ease-out" />
                    <ArrowUpRight className="w-4 h-4 text-brand-gold transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
                 </div>
             </div>
        </div>
    )
}

const PricingAltar = ({ onBack }: { onBack: () => void }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-full max-w-[800px]"
        >
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-gold/5 blur-[100px] rounded-full pointer-events-none" />
            
            {/* 
               PERFECT GEOMETRY CONTAINER 
               Outer Radius: 48px (3rem)
               Padding: 2px (Border thickness)
               Inner Radius: 46px (3rem - 2px)
            */}
            <div className="rounded-[3rem] p-[2px] bg-gradient-to-b from-[#333] via-[#111] to-[#000] shadow-[0_20px_60px_-15px_rgba(0,0,0,1)] relative">
                
                {/* Gold Highlight on Top Border */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />

                {/* INNER CONTENT CONTAINER */}
                <div className="bg-[#050505] rounded-[calc(3rem-2px)] p-6 md:p-12 text-center overflow-hidden relative">
                    
                    {/* Inner Texture */}
                    <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(#C5A059 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
                    <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[60%] h-[80%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent blur-3xl pointer-events-none" />

                    <div className="flex flex-col items-center relative z-10">
                        {/* Badge */}
                        <div className="mb-8 md:mb-12 inline-flex items-center gap-2 px-5 py-2 rounded-full border border-brand-gold/30 bg-[#1a1a1a]/80 backdrop-blur-md shadow-[0_0_20px_rgba(197,160,89,0.2)]">
                            <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-gold">Membership Exclusif</span>
                        </div>

                        {/* VISUALLY IMPROVED PRICE */}
                        <div className="mb-6 relative flex items-start justify-center gap-3">
                            <span className="text-4xl md:text-5xl font-serif text-brand-gold/60 mt-4 md:mt-6">$</span>
                            <h2 className="text-7xl xs:text-8xl sm:text-9xl font-serif tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#fff] via-[#ffeebb] to-[#c5a059] drop-shadow-2xl z-10 py-2">
                                50,000
                            </h2>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-10 md:mb-14 opacity-70">
                             <div className="h-[1px] w-8 md:w-16 bg-gradient-to-r from-transparent to-white/30" />
                             <p className="text-slate-400 text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold">Par Semaine</p>
                             <div className="h-[1px] w-8 md:w-16 bg-gradient-to-l from-transparent to-white/30" />
                        </div>
                        
                        {/* PREMIUM BUTTON - Adjusted to fit the curve */}
                        <a 
                            href="https://discord.gg/88peMJRz95" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="group relative block w-full max-w-sm mx-auto z-50 cursor-pointer"
                        >
                            <motion.div 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="relative h-16 md:h-20 w-full rounded-full bg-gradient-to-r from-[#C5A059] via-[#E5C585] to-[#C5A059] shadow-[0_10px_40px_-10px_rgba(197,160,89,0.3)] transition-all duration-500 overflow-hidden"
                            >
                                <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg] translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
                                
                                <div className="relative h-full flex items-center justify-between pl-6 md:pl-10 pr-2 md:pr-3 z-10">
                                    <span className="flex items-center gap-3 text-[10px] md:text-sm font-black uppercase tracking-[0.25em] text-[#050505]">
                                        <Crown className="w-5 h-5 fill-[#050505]" />
                                        Devenir Membre
                                    </span>
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#000000]/10 flex items-center justify-center transition-colors group-hover:bg-[#000000]/20">
                                        <ChevronRight className="w-5 h-5 text-[#050505] group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                </div>
                            </motion.div>
                        </a>
                        
                        {/* Trust Signals */}
                        <div className="mt-8 md:mt-10 flex items-center gap-6 opacity-40 hover:opacity-80 transition-opacity duration-300">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span className="text-[8px] uppercase tracking-widest font-bold">Sécurisé</span>
                            </div>
                            <div className="w-1 h-1 bg-white rounded-full opacity-30" />
                            <div className="flex items-center gap-2">
                                <Star className="w-3.5 h-3.5" />
                                <span className="text-[8px] uppercase tracking-widest font-bold">24/7</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="text-center mt-12 md:mt-16">
                 <button onClick={onBack} className="text-[9px] uppercase tracking-[0.25em] text-slate-500 hover:text-white transition-colors font-bold px-4 py-2 hover:bg-white/5 rounded-full">
                     Retour au catalogue
                 </button>
            </div>
        </motion.div>
    )
}
