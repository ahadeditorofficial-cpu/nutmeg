'use client';

import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Timer } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { animation } from '@/lib/animations/tokens';

interface UpcomingDay {
  id: number;
  day_number: number;
  position: string;
  skill_level: string;
  title: string;
  description: string | null;
  estimated_duration_minutes: number | null;
  theme: string | null;
}

interface UpcomingDaysProps {
  days: UpcomingDay[];
  currentDay: number;
  isLoading?: boolean;
}

const positionIcons: Record<string, string> = {
  striker: '⚽',
  midfielder: '🎯',
  defender: '🛡️',
  goalkeeper: '🧤',
};

export function UpcomingDays({ days, currentDay, isLoading = false }: UpcomingDaysProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) {
    return (
      <GlassCard variant="subtle" className="w-full">
        <div className="space-y-4">
          <div className="h-5 w-32 bg-white/10 rounded animate-pulse" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
          ))}
        </div>
      </GlassCard>
    );
  }

  if (!days || days.length === 0) {
    return (
      <GlassCard variant="subtle" className="w-full">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-gray-400">No upcoming days scheduled</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard variant="subtle" className="w-full">
      {/* Header */}
      <motion.button
        className="w-full flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span className="text-sm font-medium text-gray-400 tracking-wider uppercase">
          Upcoming Days
        </span>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </motion.button>

      {/* Days list */}
      <AnimatePresence>
        {isExpanded && (
          <motion.ul
            className="mt-4 space-y-2"
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={animation.variants.stagger as Variants}
          >
            {days.map((day) => {
              const positionIcon = positionIcons[day.position] ?? '⚽';
              const isNext = day.day_number === currentDay + 1;

              return (
                <motion.li
                  key={day.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    isNext
                      ? 'bg-[#F7E7CE]/10 border-[#F7E7CE]/30'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                  variants={animation.variants.slideUp}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Day number badge */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          isNext
                            ? 'bg-[#F7E7CE] text-black'
                            : 'bg-white/10 text-gray-300'
                        }`}
                      >
                        {day.day_number}
                      </div>

                      {/* Position icon */}
                      <span className="text-xl">{positionIcon}</span>

                      {/* Day title */}
                      <div>
                        <p className={`font-medium ${isNext ? 'text-[#F7E7CE]' : 'text-white'}`}>
                          {day.title}
                        </p>
                        {day.estimated_duration_minutes && (
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Timer className="w-3 h-3" />
                            {day.estimated_duration_minutes} min
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Next day badge */}
                    {isNext && (
                      <span className="text-xs px-2 py-1 bg-[#F7E7CE]/20 text-[#F7E7CE] rounded-full font-medium">
                        Next
                      </span>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}