'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { LuxuryButton } from '@/components/LuxuryButton';
import { Trophy, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { animation } from '@/lib/animations/tokens';

interface SuccessStepProps {
  formData: {
    name?: string;
    skill_level?: string;
    position?: string;
    equipment?: string[];
    training_time?: number;
  };
  onUpdate: (data: Partial<Record<string, unknown>>) => void;
  onNext: () => void;
  onBack?: () => void;
  isSubmitting?: boolean;
  isLastStep?: boolean;
}

const confettiParticles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: (i * 37) % 100,
  delay: (i % 5) * 0.1,
  duration: 1.5 + (i % 10) * 0.15,
  color: i % 3 === 0 ? '#F7E7CE' : i % 3 === 1 ? '#D4AF37' : '#C9B037',
  size: 4 + (i % 4) * 2,
}));

export function SuccessStep({
  formData,
  isSubmitting,
}: SuccessStepProps) {
  return (
    <div className="space-y-8">
      {/* Animated celebration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative flex flex-col items-center justify-center py-8"
      >
        {/* Background glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="w-64 h-64 rounded-full opacity-20"
            style={{
              background: 'radial-gradient(circle, #F7E7CE 0%, transparent 70%)',
            }}
          />
        </motion.div>

        {/* Trophy with sparkle animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.68, -0.55, 0.265, 1.55],
            delay: 0.2,
          }}
          className="relative z-10"
        >
          <div className="relative">
            {/* Sparkle effects */}
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-[#F7E7CE] rounded-full"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  x: [0, (i % 2 === 0 ? 1 : -1) * 30, 0],
                  y: [0, -30, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeOut',
                }}
                style={{
                  top: '50%',
                  left: '50%',
                  marginTop: '-4px',
                  marginLeft: '-4px',
                }}
              />
            ))}

            <div
              className="w-32 h-32 rounded-3xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(247, 231, 206, 0.15) 0%, rgba(212, 175, 55, 0.1) 100%)',
                border: '2px solid rgba(247, 231, 206, 0.3)',
                boxShadow: '0 0 60px rgba(247, 231, 206, 0.2), inset 0 0 30px rgba(247, 231, 206, 0.05)',
              }}
            >
              <Trophy className="w-16 h-16 text-[#F7E7CE]" />
            </div>
          </div>
        </motion.div>

        {/* Confetti */}
        <AnimatePresence>
          {confettiParticles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute pointer-events-none"
              initial={{
                opacity: 0,
                x: particle.x,
                y: -20,
                rotate: 0,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: [0, 100, 200, 300],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                width: particle.size,
                height: particle.size,
                background: particle.color,
                borderRadius: particle.id % 2 === 0 ? '50%' : '2px',
                top: '20%',
              }}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Success message */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: animation.duration.slow / 1000 }}
        className="text-center space-y-4"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white text-tight mb-4">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-[#F7E7CE] via-[#D4AF37] to-[#C9B037] bg-clip-text text-transparent">
              Nutmeg
            </span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: animation.duration.normal / 1000 }}
          className="text-xl text-gray-300 mb-2"
        >
          Hi, {formData.name || 'Champion'}! 🎉
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: animation.duration.normal / 1000 }}
          className="space-y-2"
        >
          <p className="text-gray-400">
            Your personalized{' '}
            <span className="text-[#F7E7CE] font-semibold">60-day training plan</span> is ready.
          </p>
          <p className="text-gray-400">
            {formData.position
              ? `${formData.position.charAt(0).toUpperCase() + formData.position.slice(1)}`
              : 'You'} ready to level up?
          </p>
        </motion.div>
      </motion.div>

      {/* Stats summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: animation.duration.normal / 1000 }}
        className="grid grid-cols-3 gap-4 py-6"
      >
        {[
          { label: 'Days', value: '60', icon: <Sparkles className="w-5 h-5" /> },
          { label: 'Daily', value: `${formData.training_time || 60}min`, icon: <Sparkles className="w-5 h-5" /> },
          { label: 'Goal', value: 'Elite', icon: <Sparkles className="w-5 h-5" /> },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 + index * 0.1, duration: animation.duration.normal / 1000 }}
            className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10"
          >
            <div className="flex justify-center mb-2 text-[#F7E7CE]">{stat.icon}</div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Start Training Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: animation.duration.normal / 1000 }}
        className="pt-4"
      >
        <LuxuryButton
          variant="primary"
          fullWidth
          size="lg"
          loading={isSubmitting}
          onClick={/* triggers in parent */ undefined}
          className="w-full"
        >
          <span className="flex items-center justify-center gap-2 text-black">
            <Sparkles className="w-5 h-5" />
            Start Your 60 Days
            <ArrowRight className="w-5 h-5" />
          </span>
        </LuxuryButton>
      </motion.div>

      {/* Encouragement */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: animation.duration.normal / 1000 }}
        className="text-center text-gray-500 text-sm pt-4"
      >
        Your journey begins now. Get ready to nutmeg your goals. ⚽
      </motion.p>
    </div>
  );
}