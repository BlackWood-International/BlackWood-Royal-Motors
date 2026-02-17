import React from 'react';
import { ArrowUpRight, Globe, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-black border-t border-white/5 pt-24 pb-16 relative overflow-hidden content-visibility-auto">
      {/* Background decoration - Simplified for performance */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[1px] bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 text-center flex flex-col items-center">
        
        {/* Brand Logo */}
        <div className="mb-16 hover:opacity-90 transition-opacity duration-300">
             <img 
                src="https://i.imgur.com/5QiFb0Y.png" 
                alt="BlackWood Royal Motors" 
                className="h-20 md:h-24 w-auto object-contain opacity-90"
                loading="lazy"
            />
        </div>

        {/* Premium Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mb-20">
            
            {/* Corporate Link */}
            <a 
              href="https://blackwood-international.github.io/BlackWood/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative flex items-center justify-between p-1 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 hover:from-brand-gold/40 hover:to-brand-gold/10 transition-all duration-500 shadow-lg hover:shadow-[0_0_30px_-10px_rgba(197,160,89,0.3)]"
            >
               <div className="absolute inset-[1px] bg-[#080808] rounded-[14px] z-0 transition-colors duration-500 group-hover:bg-[#0c0c0c]" />
               
               <div className="relative z-10 w-full flex items-center justify-between px-6 py-5">
                   <div className="flex items-center gap-4">
                       <div className="p-2.5 rounded-full bg-white/5 border border-white/5 text-slate-400 group-hover:text-brand-gold group-hover:border-brand-gold/30 transition-colors duration-300">
                           <Globe className="w-5 h-5" />
                       </div>
                       <div className="text-left">
                           <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-0.5 group-hover:text-brand-gold/80 transition-colors">Groupe</span>
                           <span className="block text-sm text-slate-200 font-bold tracking-wide group-hover:text-white transition-colors">BlackWood Int. Corp.</span>
                       </div>
                   </div>
                   <ArrowUpRight className="w-5 h-5 text-slate-600 group-hover:text-brand-gold transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
               </div>
            </a>

            {/* Community/Intranet Link */}
            <a 
              href="https://discord.gg/88peMJRz95" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative flex items-center justify-between p-1 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 hover:from-brand-gold/40 hover:to-brand-gold/10 transition-all duration-500 shadow-lg hover:shadow-[0_0_30px_-10px_rgba(197,160,89,0.3)]"
            >
               <div className="absolute inset-[1px] bg-[#080808] rounded-[14px] z-0 transition-colors duration-500 group-hover:bg-[#0c0c0c]" />
               
               <div className="relative z-10 w-full flex items-center justify-between px-6 py-5">
                   <div className="flex items-center gap-4">
                       <div className="p-2.5 rounded-full bg-white/5 border border-white/5 text-slate-400 group-hover:text-brand-gold group-hover:border-brand-gold/30 transition-colors duration-300">
                           <MessageCircle className="w-5 h-5" />
                       </div>
                       <div className="text-left">
                           <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-0.5 group-hover:text-brand-gold/80 transition-colors">Communauté</span>
                           <span className="block text-sm text-slate-200 font-bold tracking-wide group-hover:text-white transition-colors">Service Client & News</span>
                       </div>
                   </div>
                   <ArrowUpRight className="w-5 h-5 text-slate-600 group-hover:text-brand-gold transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
               </div>
            </a>
        </div>
        
        {/* Copyright Section */}
        <div className="border-t border-white/5 pt-10 flex flex-col items-center gap-5 text-[10px] uppercase tracking-widest text-slate-600 w-full max-w-4xl">
            <p className="font-medium text-slate-500 hover:text-slate-400 transition-colors">
              Copyright &copy; 2026 BlackWood Royal Motors. Tous droits réservés.
            </p>
            <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity duration-300">
                <span className="w-1 h-1 rounded-full bg-brand-gold"></span>
                <p>Made with Precision by <span className="text-brand-gold font-bold">BlackWood Brand & Design</span></p>
                <span className="w-1 h-1 rounded-full bg-brand-gold"></span>
            </div>
        </div>
      </div>
    </footer>
  );
};
