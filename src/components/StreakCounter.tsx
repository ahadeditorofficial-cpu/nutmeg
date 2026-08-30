'use client';

import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { animation } from '@/lib/animations/tokens';

interface StreakCounterProps {
  streak: number;
  size?: number;
  showLabel?: boolean;
}

export function StreakCounter({
  streak,
  size = 120,
  showLabel = true,
}: StreakCounterProps) {
  // Progress is capped at 30 for visual purposes
  const progressPercent = Math.min(streak, 30);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progressPercent / 30) * circumference;
  const center = size / 2;

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={animation.variants.fadeInUp.initial}
      animate={animation.variants.fadeInUp.animate}
      transition={{ duration: animation.duration.normal / 1000 }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background ring */}
        <svg
          className="w-full h-full transform -rotate-90"
          width={size}
          height={size}
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="6"
            fill="none"
          />
        </svg>

        {/* Progress ring */}
        <svg
          className="absolute inset-0 w-full h-full transform -rotate-90"
          width={size}
          height={size}
        >
          <defs>
            <linearGradient id="streakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F7E7CE" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
          </defs>
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            stroke="url(#streakGradient)"
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: animation.duration.slow / 1000, ease: 'easeOut' }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0.5, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 10 }}
          >
            <Flame
              className="w-8 h-8 text-[#F7E7CE]"
              fill="currentColor"
            />
          </motion.div>
          <motion.span
            className="text-3xl font-bold text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: animation.duration.fast / 1000 }}
          >
            {streak}
          </motion.span>
        </div>
      </div>

      {showLabel && (
        <motion.span
          className="mt-3 text-sm text-gray-400 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {streak === 1 ? 'Day Streak' : 'Day Streak'}
        </motion.span>
      )}
    </motion.div>
  );
}