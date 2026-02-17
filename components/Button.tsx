import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'outline' | 'ghost';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className = '', ...props }) => {
  const baseStyles = "px-8 py-3 uppercase tracking-[0.2em] text-xs font-bold transition-all duration-300 ease-out relative overflow-hidden group rounded-full flex items-center justify-center";
  
  const variants = {
    primary: "bg-white text-brand-black hover:bg-brand-gold hover:text-brand-black border border-white hover:border-brand-gold shadow-[0_0_20px_-10px_rgba(255,255,255,0.5)] hover:shadow-[0_0_30px_-5px_rgba(197,160,89,0.6)]",
    outline: "bg-transparent text-white border border-white/20 hover:border-brand-gold hover:text-brand-gold backdrop-blur-sm",
    ghost: "bg-transparent text-slate-400 hover:text-white"
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {/* Shine Effect Overlay */}
      <motion.span 
        className="absolute top-0 left-0 w-[150%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
        initial={{ x: "-150%" }}
        whileHover={{ x: "150%" }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      />
      
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  );
};
