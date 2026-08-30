'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LuxuryButton } from '@/components/LuxuryButton';
import { Dumbbell, Heart, TrendingUp, SkipForward } from 'lucide-react';
import { animation } from '@/lib/animations/tokens';

interface BaselineTestStepProps {
  formData: {
    baseline_pushups?: number;
    baseline_situps?: number;
    baseline_run_distance_meters?: number;
  };
  onUpdate: (data: Partial<{
    baseline_pushups: number;
    baseline_situps: number;
    baseline_run_distance_meters?: number;
  }>) => void;
  onNext: () => void;
  onBack?: () => void;
  isSubmitting?: boolean;
  isLastStep?: boolean;
}

export function BaselineTestStep({
  formData,
  onUpdate,
  onNext,
  onBack,
  isSubmitting,
}: BaselineTestStepProps) {
  const [pushups, setPushups] = useState(formData.baseline_pushups || 20);
  const [situps, setSitups] = useState(formData.baseline_situps || 25);
  const [runMeters, setRunMeters] = useState<number | null>(
    formData.baseline_run_distance_meters || null
  );
  const [skipRun, setSkipRun] = useState(!formData.baseline_run_distance_meters);

  const handleNext = () => {
    onUpdate({
      baseline_pushups: pushups,
      baseline_situps: situps,
      baseline_run_distance_meters: skipRun ? undefined : runMeters || undefined,
    });
    onNext();
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: animation.duration.normal / 1000 }}
        className="space-y-6"
      >
        <div className="text-center mb-6">
          <motion.h3
            className="text-3xl font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Baseline Fitness
          </motion.h3>
          <motion.p
            className="text-gray-400 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Let&apos;s establish your starting point
          </motion.p>
        </div>

        {/* Push-ups */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-white/5 border border-white/10"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#F7E7CE]/20 to-[#D4AF37]/10 flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-[#F7E7CE]" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Push-ups</h4>
              <p className="text-gray-400 text-sm">Maximum in 1 minute</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>0</span>
              <span>100</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={pushups}
              onChange={(e) => setPushups(parseInt(e.target.value))}
              className="w-full h-1 rounded-full appearance-none cursor-pointer bg-white/10"
              style={{
                accentColor: '#F7E7CE',
              }}
            />
            <div className="text-center">
              <span className="text-4xl font-bold text-[#F7E7CE]">{pushups}</span>
              <span className="text-gray-400 ml-2">reps</span>
            </div>
          </div>
        </motion.div>

        {/* Sit-ups */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl bg-white/5 border border-white/10"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#F7E7CE]/20 to-[#D4AF37]/10 flex items-center justify-center">
              <Heart className="w-6 h-6 text-[#F7E7CE]" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Sit-ups</h4>
              <p className="text-gray-400 text-sm">Maximum in 1 minute</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>0</span>
              <span>100</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={situps}
              onChange={(e) => setSitups(parseInt(e.target.value))}
              className="w-full h-1 rounded-full appearance-none cursor-pointer bg-white/10"
              style={{
                accentColor: '#F7E7CE',
              }}
            />
            <div className="text-center">
              <span className="text-4xl font-bold text-[#F7E7CE]">{situps}</span>
              <span className="text-gray-400 ml-2">reps</span>
            </div>
          </div>
        </motion.div>

        {/* 12-min run */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl bg-white/5 border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#F7E7CE]/20 to-[#D4AF37]/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#F7E7CE]" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">12-Minute Run</h4>
                <p className="text-gray-400 text-sm">Optional — distance in meters</p>
              </div>
            </div>
            <motion.button
              onClick={() => setSkipRun(!skipRun)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
                ${skipRun
                  ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SkipForward className="w-4 h-4" />
              {skipRun ? 'Remove' : 'Skip'}
            </motion.button>
          </div>

          {!skipRun && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>0m</span>
                <span>5000m</span>
              </div>
              <input
                type="range"
                min={0}
                max={5000}
                step={100}
                value={runMeters || 0}
                onChange={(e) => setRunMeters(parseInt(e.target.value))}
                className="w-full h-1 rounded-full appearance-none cursor-pointer bg-white/10"
                style={{
                  accentColor: '#F7E7CE',
                }}
              />
              <div className="text-center">
                <span className="text-4xl font-bold text-[#F7E7CE]">
                  {runMeters ? Math.round(runMeters / 100) * 100 : 0}
                </span>
                <span className="text-gray-400 ml-2">meters</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: animation.duration.normal / 1000 }}
        className="flex gap-4 pt-4"
      >
        <LuxuryButton
          variant="secondary"
          fullWidth
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1"
        >
          Back
        </LuxuryButton>
        <LuxuryButton
          variant="primary"
          fullWidth
          loading={isSubmitting}
          onClick={handleNext}
          disabled={isSubmitting}
          className="flex-1"
        >
          Continue
        </LuxuryButton>
      </motion.div>
    </div>
  );
}
