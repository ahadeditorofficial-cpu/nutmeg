'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { animation } from '@/lib/animations/tokens';
import { LuxuryButton } from './LuxuryButton';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <motion.div
      className={`flex flex-col items-center justify-center text-center p-8 ${className}`}
      initial={animation.variants.fadeIn.initial}
      animate={animation.variants.fadeIn.animate}
      transition={{ duration: animation.duration.normal / 1000 }}
    >
      {icon && (
        <motion.div
          className="mb-6 text-[#F7E7CE]"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: animation.duration.normal / 1000 }}
        >
          {icon}
        </motion.div>
      )}

      <motion.h3
        className="text-xl font-semibold text-white mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: animation.duration.fast / 1000 }}
      >
        {title}
      </motion.h3>

      {description && (
        <motion.p
          className="text-gray-400 mb-6 max-w-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: animation.duration.fast / 1000 }}
        >
          {description}
        </motion.p>
      )}

      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: animation.duration.fast / 1000 }}
        >
          <LuxuryButton onClick={action.onClick} variant="primary">
            {action.label}
          </LuxuryButton>
        </motion.div>
      )}
    </motion.div>
  );
}
