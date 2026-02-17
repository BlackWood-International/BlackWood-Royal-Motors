
import React, { useState } from 'react';
import { 
  motion, AnimatePresence, Variants 
} from 'framer-motion';
import { 
  ArrowLeft, Crown, BookOpen, Key, Hash, Gavel, 
  Flag, Globe, RefreshCw, Lightbulb, ChevronRight, ShieldCheck, Star, Sparkles, Fingerprint, X, CheckCircle2, Info, ArrowUpRight
} from 'lucide-react';

interface VIPPageProps {
  onBack: () => void;
}

// --- ANIMATION VARIANTS (Optimized for Snappiness) ---
const pageVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.4 } }
};

const cardItemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
        duration: 0.4, 
        ease: [0.25, 0.46, 0.45, 0.94] // Cubic bezier for snappy feel
    } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Much faster stagger
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
    { name: "Pfister Design", img: "https://static.wikia.nocookie.net/gtawiki/images/5/5b/PfisterDesign-GTAV-Logo.png" },
];

// --- STATIC 3D CARD COMPONENT ---
const VIPCard = () => {
  return (
    <div className="w-full max-w-[480px] aspect-[1.586/1] relative z-20 mx-auto select-none pointer-events-none">
      <div className="w-full h-full rounded-3xl bg-[#080808] border border-white/10 relative overflow-hidden shadow-[0_30px_60px_-10px_rgba(0,0,0,0.9)]">
        
        {/* BASE TEXTURE */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#050505] to-[#000000]" />
        
        {/* GOLD ACCENT */}
        <div className="absolute top-0 right-0 w-[70%] h-full bg-gradient-to-l from-brand-gold/10 to-transparent skew-x-12 opacity-60" />
        
        {/* CARD CONTENT */}
        <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
          <div className="flex justify-between items-start">
             <div className="relative">
                <Crown className="w-10 h-10 text-brand-gold drop-shadow-[0_0_15px_rgba(197,160,89,0.5)]" />
             </div>
             <div className="text-right">
                 <div className="text-[9px] text-brand-gold/60 font-mono tracking-widest uppercase mb-1">MEMBER ID</div>
                 <div className="text-sm text-white font-mono tracking-widest font-bold">1933-2027</div>
             </div>
          </div>
          
          <div className="flex items-end justify-between">
              <div>
                  <div className="text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-widest mb-1 drop-shadow-md">
                      ROYAL ELITE
                  </div>
                  <div className="flex items-center gap-2">
                      <div className="h-[1px] w-8 bg-brand-gold" />
                      <div className="text-[7px] text-brand-gold uppercase tracking-[0.3em]">BlackWood International</div>
                  </div>
              </div>
              <img src="https://i.imgur.com/5QiFb0Y.png" className="h-8 opacity-40 grayscale" alt="chip" />
          </div>
        </div>

        {/* BORDER GLOW */}
        <div className="absolute inset-[1px] rounded-[23px] border border-brand-gold/20 opacity-50" />
        
        {/* SUBTLE STATIC SHEEN (No movement, just aesthetics) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
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
          {/* Subtle Orb */}
          <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-brand-gold/5 blur-[150px] rounded-full mix-blend-screen animate-pulse duration-[5000ms]" />
      </div>

      {/* --- NAVIGATION --- */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-[100] px-6 py-6 flex justify-between items-center pointer-events-none"
      >
        <button 
            onClick={onBack}
            className="pointer-events-auto flex items-center gap-3 group pl-2 pr-6 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/5 hover:border-brand-gold/30 transition-all duration-300 active:scale-95 shadow-2xl cursor-pointer"
        >
            <div className="p-2 rounded-full bg-white/5 group-hover:bg-brand-gold group-hover:text-black transition-colors">
                <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 group-hover:text-white transition-colors">Retour</span>
        </button>
        <img src="https://i.imgur.com/5QiFb0Y.png" alt="Logo" className="h-8 md:h-10 opacity-90" />
      </motion.nav>

      {/* --- SCROLLABLE CONTENT --- */}
      <div className="relative z-10 pt-32 md:pt-48 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto">
        
        {/* HERO SECTION */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-16 md:gap-12 mb-24 md:mb-32">
            
            {/* Left Text */}
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="flex-1 text-center md:text-left z-10"
            >
                <motion.div variants={cardItemVariants} className="flex items-center justify-center md:justify-start gap-4 mb-6">
                    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-brand-gold" />
                    <span className="text-brand-gold text-xs font-bold uppercase tracking-[0.4em]">Membership</span>
                </motion.div>

                <div className="overflow-hidden pb-4">
                    <motion.h1 
                        variants={cardItemVariants}
                        className="text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-serif text-white leading-[0.9] tracking-tight"
                    >
                        Royal <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF8E1] to-[#C5A059] italic pr-2">
                            Elite
                        </span>
                    </motion.h1>
                </div>

                <motion.p 
                    variants={cardItemVariants}
                    className="mt-8 text-sm md:text-base text-slate-400 max-w-lg mx-auto md:mx-0 leading-relaxed font-light pl-6 border-l border-brand-gold/30 text-justify"
                >
                    Rejoindre le cercle Royal Elite, c'est transcender la simple possession automobile pour accéder à un art de vivre sans compromis. L'excellence n'est plus un but, c'est votre standard.
                </motion.p>
            </motion.div>

            {/* Right Card */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="flex-1 w-full flex justify-center md:justify-end"
            >
                <VIPCard />
            </motion.div>
        </div>

        {/* PRIVILEGES GRID */}
        <div className="mb-48">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16 md:mb-24"
            >
                <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Privilèges <span className="italic text-brand-gold">Absolus</span></h2>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent mx-auto" />
            </motion.div>

            <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10%" }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6"
            >
                {benefits.map((b) => (
                    <BenefitCard key={b.id} item={b} onClick={() => setSelectedBenefit(b)} />
                ))}
            </motion.div>
        </div>

        {/* PRICING ALTAR */}
        <div className="flex flex-col items-center justify-center mb-32">
             <PricingAltar onBack={onBack} />
        </div>

        {/* --- PARTNERS SECTION --- */}
        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="border-t border-white/5 pt-16 pb-12"
        >
             <div className="text-center mb-12">
                 <h3 className="text-sm md:text-base font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">Partenaires Officiels</h3>
                 <div className="w-12 h-0.5 bg-brand-gold/30 mx-auto" />
             </div>

             <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 px-4">
                 {partners.map((p) => (
                     <div 
                        key={p.name} 
                        className="group relative cursor-default transition-all duration-500"
                        title={p.name}
                     >
                         <img 
                            src={p.img} 
                            alt={p.name} 
                            // Fallback to cleaner URL logic inside src if needed, but wikia works usually if stripped of params.
                            // We use split to remove revision tokens if present in copied links
                            srcSet={p.img.split('/revision')[0]}
                            className="h-12 md:h-16 w-auto object-contain grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 ease-in-out filter brightness-125 hover:scale-110"
                         />
                     </div>
                 ))}
             </div>
        </motion.div>

        {/* Footer Signature */}
        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           transition={{ delay: 0.1, duration: 0.8 }}
           className="mt-12 text-center opacity-60 hover:opacity-100 transition-opacity duration-500"
        >
           <div className="flex items-center gap-3 justify-center mb-3">
               <div className="h-[1px] w-8 bg-white/20" />
               <Fingerprint className="w-4 h-4 text-brand-gold" />
               <div className="h-[1px] w-8 bg-white/20" />
           </div>
           <p className="text-[9px] uppercase tracking-[0.3em] text-slate-500 font-light">
               Made with Precision by <span className="text-brand-gold font-bold">BlackWood Brand & Design</span>
           </p>
        </motion.div>

      </div>

      {/* --- MODAL (OVERLAY) --- */}
      <AnimatePresence>
        {selectedBenefit && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 md:p-10"
            >
                <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setSelectedBenefit(null)} />
                
                <motion.div 
                    layoutId={`benefit-card-${selectedBenefit.id}`}
                    initial={{ scale: 0.95, y: 30, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.95, y: 30, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    // INCREASED MAX-WIDTH to 5xl
                    className="relative w-full max-w-5xl bg-[#080808] border border-white/10 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl z-[210] flex flex-col md:flex-row h-[80vh] md:h-auto md:max-h-[85vh]"
                >
                        {/* Modal Sidebar/Header (Left 35%) */}
                        <div className="bg-[#0a0a0a] p-8 md:p-12 md:w-[35%] flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-white/5 relative overflow-hidden shrink-0">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-brand-gold/10 via-transparent to-transparent opacity-50" />
                            
                            <motion.div 
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="relative z-10 p-6 rounded-full bg-black/50 border border-brand-gold/30 mb-8 text-brand-gold shadow-[0_0_40px_-10px_rgba(197,160,89,0.4)]"
                            >
                                {React.cloneElement(selectedBenefit.icon, { className: "w-10 h-10 md:w-12 md:h-12" })}
                            </motion.div>
                            
                            <motion.h3 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.15 }}
                                className="text-2xl md:text-4xl font-serif text-white mb-4 leading-tight"
                            >
                                {selectedBenefit.title}
                            </motion.h3>
                            
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-[10px] md:text-xs font-mono text-brand-gold/60 uppercase tracking-[0.2em] border border-brand-gold/20 px-3 py-1 rounded-full"
                            >
                                Privilège N°{selectedBenefit.id}
                            </motion.div>
                        </div>
                        
                        {/* Modal Content (Right 65%) */}
                        <div className="p-8 md:p-14 md:w-[65%] bg-[#050505] relative flex flex-col justify-center overflow-y-auto custom-scrollbar">
                            <button onClick={() => setSelectedBenefit(null)} className="absolute top-6 right-6 md:top-8 md:right-8 p-3 text-slate-500 hover:text-white transition-colors bg-white/5 rounded-full hover:bg-white/10 z-20">
                                <X className="w-6 h-6" />
                            </button>
                            
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <h4 className="text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-slate-500 mb-6 flex items-center gap-3">
                                    <Info className="w-4 h-4 text-brand-gold" />
                                    Description Détaillée
                                </h4>
                                <p className="text-base md:text-lg text-slate-200 leading-relaxed mb-12 font-light">
                                    {selectedBenefit.desc}
                                </p>
                                
                                <h4 className="text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-slate-500 mb-6 flex items-center gap-3">
                                    <Star className="w-4 h-4 text-brand-gold" />
                                    Avantages Clés
                                </h4>
                                <ul className="space-y-4 md:space-y-6">
                                    {selectedBenefit.features?.map((feat, idx) => (
                                        <motion.li 
                                            key={idx} 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.15 + (idx * 0.05) }}
                                            className="flex items-start gap-4 text-sm md:text-base text-white/90 group"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-brand-gold/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-brand-gold/20 transition-colors">
                                                <CheckCircle2 className="w-4 h-4 text-brand-gold" />
                                            </div>
                                            <span className="pt-0.5">{feat}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

// --- SUB-COMPONENTS ---

const BenefitCard = ({ item, onClick }: { item: any, onClick: () => void }) => {
    return (
        <motion.div
            variants={cardItemVariants}
            whileHover={{ y: -5, scale: 1.01 }}
            onClick={onClick}
            className="group relative h-full flex flex-col p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-300"
        >
             {/* Background & Border */}
             <div className="absolute inset-0 bg-gradient-to-b from-[#0e0e0e] to-black border border-white/5 group-hover:border-brand-gold/30 transition-all duration-300 rounded-[inherit]" />
             
             {/* Subtle Inner Glow on Hover */}
             <div className="absolute inset-0 bg-brand-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[inherit] pointer-events-none" />

             <div className="relative z-10 flex flex-col h-full">
                 
                 {/* Header: Icon & ID */}
                 <div className="flex justify-between items-start mb-6">
                     <div className="relative">
                         {/* Icon Container */}
                         <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 group-hover:text-brand-gold group-hover:bg-brand-gold/10 group-hover:border-brand-gold/20 transition-all duration-300 shadow-lg group-hover:shadow-[0_0_15px_rgba(197,160,89,0.2)]">
                             {React.cloneElement(item.icon, { className: "w-5 h-5 transition-transform duration-300 group-hover:scale-110" })}
                         </div>
                     </div>
                     <span className="text-[10px] font-mono font-bold text-white/10 group-hover:text-white/20 transition-colors uppercase tracking-widest">
                         {item.id}
                     </span>
                 </div>

                 {/* Title */}
                 <h3 className="text-xl sm:text-2xl font-serif text-white mb-3 leading-tight group-hover:text-brand-gold transition-colors duration-300">
                     {item.title}
                 </h3>

                 {/* Description */}
                 <p className="text-sm text-slate-500 font-light leading-relaxed group-hover:text-slate-400 transition-colors duration-300 line-clamp-3">
                     {item.short}
                 </p>

                 {/* Footer: Action Line */}
                 <div className="mt-auto pt-6 flex items-center justify-between opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="h-[1px] w-full bg-gradient-to-r from-brand-gold/50 to-transparent max-w-[40px] group-hover:max-w-[80px] transition-all duration-500" />
                    <ArrowUpRight className="w-4 h-4 text-brand-gold transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                 </div>
             </div>
        </motion.div>
    )
}

const PricingAltar = ({ onBack }: { onBack: () => void }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-full max-w-4xl px-4"
        >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none animate-pulse duration-[4000ms]" />
            
            <div className="relative bg-[#080808]/90 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 md:p-16 text-center overflow-hidden shadow-2xl">
                
                {/* Decorative Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50" />
                
                <div className="flex flex-col items-center relative z-10">
                     <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-8 inline-flex items-center gap-3 px-5 py-2 rounded-full border border-brand-gold/30 bg-[#1a1a1a]"
                     >
                         <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-[pulse_2s_infinite]" />
                         <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">Membership Exclusif</span>
                     </motion.div>

                     {/* Price */}
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="mb-2 relative"
                     >
                        <h2 className="text-6xl sm:text-7xl md:text-8xl font-serif text-white tracking-tighter drop-shadow-2xl">
                            50,000
                        </h2>
                        <span className="absolute top-2 -right-8 text-2xl md:text-3xl text-brand-gold font-serif">$</span>
                     </motion.div>
                     
                     <p className="text-slate-500 text-xs uppercase tracking-[0.25em] mb-12 font-medium">Par Semaine / Déductible des impôts</p>
                     
                     {/* BUTTON */}
                     <a 
                        href="https://discord.gg/88peMJRz95" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="group relative block w-full max-w-[320px] mx-auto z-50 cursor-pointer"
                     >
                        <motion.div 
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="relative h-16 w-full rounded-full bg-brand-gold overflow-hidden shadow-[0_0_50px_-10px_rgba(197,160,89,0.5)] transition-shadow duration-500 hover:shadow-[0_0_80px_-5px_rgba(197,160,89,0.8)]"
                        >
                            <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
                            <div className="relative h-full flex items-center justify-between px-8 z-10">
                                <span className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.25em] text-[#050505] group-hover:text-black transition-colors duration-500">
                                    <Crown className="w-5 h-5 fill-[#050505]" />
                                    Devenir Membre
                                </span>
                                <div className="w-9 h-9 rounded-full bg-black/10 group-hover:bg-black/20 flex items-center justify-center transition-colors duration-500">
                                    <ChevronRight className="w-5 h-5 text-[#050505] transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </motion.div>
                     </a>
                     
                     <div className="mt-10 flex items-center justify-center gap-8 opacity-50">
                         <div className="flex items-center gap-2">
                             <ShieldCheck className="w-3.5 h-3.5" />
                             <span className="text-[9px] uppercase tracking-widest font-bold">Paiement Sécurisé</span>
                         </div>
                         <div className="w-1 h-1 bg-white rounded-full opacity-50" />
                         <div className="flex items-center gap-2">
                             <Star className="w-3.5 h-3.5" />
                             <span className="text-[9px] uppercase tracking-widest font-bold">Support 24/7</span>
                         </div>
                     </div>
                </div>
            </div>
            
            {/* BACK BUTTON */}
            <div className="text-center mt-12 relative z-50">
                 <button 
                    onClick={onBack} 
                    className="group relative px-4 py-2"
                 >
                     <span className="relative z-10 text-[10px] uppercase tracking-[0.25em] text-slate-600 group-hover:text-white transition-colors font-bold">
                         Retour au catalogue standard
                     </span>
                     <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-brand-gold group-hover:w-full transition-all duration-300" />
                 </button>
            </div>
        </motion.div>
    )
}
