'use client';

import { motion } from 'framer-motion';
import { animation } from '@/lib/animations/tokens';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export function ProgressRing({
  progress,
  size = 256,
  strokeWidth = 8,
  showLabel = true,
  label,
  className = '',
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  const center = size / 2;

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
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
          strokeWidth={strokeWidth}
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
          <linearGradient id="luxuryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F7E7CE" />
            <stop offset="33%" stopColor="#D4AF37" />
            <stop offset="66%" stopColor="#C9B037" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>
        </defs>
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#luxuryGradient)"
          strokeWidth={strokeWidth}
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
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-white">
            {Math.round(progress)}%
          </span>
          {label && (
            <span className="text-sm text-gray-400 mt-1">{label}</span>
          )}
        </div>
      )}
    </div>
  );
}
