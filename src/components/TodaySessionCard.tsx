'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Timer, Target, User, CheckCircle } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { LuxuryButton } from './LuxuryButton';
// ProgressRing is available for future use
import { animation } from '@/lib/animations/tokens';

interface TodaySessionCardProps {
  day: {
    id: number;
    day_number: number;
    position: string;
    skill_level: string;
    title: string;
    description: string | null;
    estimated_duration_minutes: number | null;
    theme: string | null;
  } | null;
  progress: {
    status: string | null;
    self_rating: number | null;
    exercises_skipped: number;
  } | null;
  plan: {
    current_day_number: number;
  } | null;
  isLoading?: boolean;
}

const positionIcons: Record<string, string> = {
  striker: '⚽',
  midfielder: '🎯',
  defender: '🛡️',
  goalkeeper: '🧤',
};

const positionLabels: Record<string, string> = {
  striker: 'Striker',
  midfielder: 'Midfielder',
  defender: 'Defender',
  goalkeeper: 'Goalkeeper',
};

const skillLevelLabels: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export function TodaySessionCard({
  day,
  progress,
  plan,
  isLoading = false,
}: TodaySessionCardProps) {
  if (isLoading) {
    return (
      <GlassCard variant="elevated" className="w-full">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="h-6 w-48 bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-64 bg-white/10 rounded animate-pulse" />
            </div>
            <div className="h-12 w-12 bg-white/10 rounded-full animate-pulse" />
          </div>
          <div className="h-12 bg-white/10 rounded-lg animate-pulse" />
        </div>
      </GlassCard>
    );
  }

  if (!day) {
    return (
      <GlassCard variant="elevated" className="w-full">
        <div className="flex flex-col items-center justify-center text-center py-12">
          <div className="text-6xl mb-4">⚽</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Session Today</h3>
          <p className="text-gray-400 max-w-sm">
            {'Your training plan has not been generated yet. Complete onboarding to get started.'}
          </p>
        </div>
      </GlassCard>
    );
  }

  const positionIcon = positionIcons[day.position] ?? '⚽';
  const positionLabel = positionLabels[day.position] ?? day.position;
  const skillLabel = skillLevelLabels[day.skill_level] ?? day.skill_level;
  const status = progress?.status ?? 'pending';
  const isCompleted = status === 'completed';
  const isInProgress = status === 'in_progress';

  return (
    <GlassCard variant="elevated" className="w-full">
      <motion.div
        initial={animation.variants.fadeInUp.initial}
        animate={animation.variants.fadeInUp.animate}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs text-[#F7E7CE] font-medium tracking-wider uppercase mb-1 block">
              {'Today&#39;s Session'}
            </span>
            <h3 className="text-2xl font-bold text-white">
              Day {plan?.current_day_number ?? day.day_number}: {day.title}
            </h3>
          </div>
          <motion.div
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {positionIcon}
          </motion.div>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-400">
          <span className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#F7E7CE]" />
            {positionLabel}
          </span>
          <span className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#F7E7CE]" />
            {skillLabel}
          </span>
          {day.estimated_duration_minutes && (
            <span className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-[#F7E7CE]" />
              {day.estimated_duration_minutes} min
            </span>
          )}
        </div>

        {/* Description */}
        {day.description && (
          <p className="text-gray-300 mb-6 line-clamp-2">{day.description}</p>
        )}

        {/* Progress indicator for in-progress sessions */}
        {isInProgress && progress && (
          <motion.div
            className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10"
            initial={animation.variants.slideUp.initial}
            animate={animation.variants.slideUp.animate}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Session Progress</span>
              <span className="text-sm font-medium text-[#F7E7CE]">
                {progress.exercises_skipped > 0
                  ? `${progress.exercises_skipped} skipped`
                  : 'In progress'}
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#F7E7CE] to-[#D4AF37] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '60%' }}
                transition={{ duration: 0.5, delay: 0.3 }}
              />
            </div>
          </motion.div>
        )}

        {/* Completed state */}
        {isCompleted && progress && (
          <motion.div
            className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg"
            initial={animation.variants.fadeInUp.initial}
            animate={animation.variants.fadeInUp.animate}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-emerald-400 font-medium">Session Completed</p>
                {progress.self_rating && (
                  <p className="text-sm text-gray-400">
                    Self-rating: {progress.self_rating}/10
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Start/Resume button */}
        <Link
          href={`/session/${day.day_number}`}
          className="w-full"
        >
          <LuxuryButton
            variant={isCompleted ? 'secondary' : 'primary'}
            size="lg"
            className="w-full"
            disabled={isCompleted}
          >
            {isCompleted
              ? 'View Session Summary'
              : isInProgress
              ? 'Resume Session'
              : 'Start Session'}
          </LuxuryButton>
        </Link>
      </motion.div>
    </GlassCard>
  );
}

// End of component