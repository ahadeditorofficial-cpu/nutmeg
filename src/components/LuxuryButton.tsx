'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { animation } from '@/lib/animations/tokens';

interface LuxuryButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function LuxuryButton({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  className = '',
  type = 'button',
}: LuxuryButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-[#F7E7CE] to-[#D4AF37]
      text-black font-semibold
      hover:opacity-90
      shadow-lg shadow-[#F7E7CE]/20
    `,
    secondary: `
      bg-white/5 backdrop-blur-md
      border border-white/10
      text-white font-medium
      hover:bg-white/10 hover:border-white/20
    `,
    ghost: `
      text-gray-400 hover:text-white
      hover:bg-white/5
    `,
  };

  const disabledClasses = disabled || loading
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer';

  return (
    <motion.button
      type={type}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabledClasses}
        ${fullWidth ? 'w-full' : ''}
        rounded-lg
        transition-all duration-200
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
      transition={{ duration: animation.duration.fast / 1000 }}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <motion.span
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}