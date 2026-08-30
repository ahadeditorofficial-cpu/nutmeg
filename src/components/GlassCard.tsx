'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { animation } from '@/lib/animations/tokens';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'subtle' | 'elevated' | 'luxury';
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className = '',
  variant = 'subtle',
  hover = false,
  onClick,
}: GlassCardProps) {
  const baseClasses = 'rounded-xl p-6 transition-all duration-300';

  const variantClasses = {
    subtle: 'glass',
    elevated: 'glass-elevated',
    luxury: 'bg-gradient-to-br from-[#111827] to-[#18181b] border border-white/10 relative overflow-hidden',
  };

  const hoverClasses = hover
    ? 'hover:border-white/20 hover:shadow-lg cursor-pointer'
    : '';

  const Component = onClick ? motion.button : motion.div;

  return (
    <Component
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}
      onClick={onClick}
      whileHover={hover ? { scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ duration: animation.duration.fast / 1000 }}
    >
      {variant === 'luxury' && (
        <div className="absolute inset-0 bg-gradient-to-tr from-[#F7E7CE]/5 to-transparent pointer-events-none" />
      )}
      <div className="relative z-10">{children}</div>
    </Component>
  );
}
