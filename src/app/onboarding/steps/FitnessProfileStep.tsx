'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LuxuryButton } from '@/components/LuxuryButton';
import { Zap, Target, Shield, Footprints, HelpCircle } from 'lucide-react';
import { animation } from '@/lib/animations/tokens';

type SkillLevel = 'beginner' | 'intermediate' | 'advanced';
type Position = 'striker' | 'midfielder' | 'defender' | 'goalkeeper';
type DominantFoot = 'left' | 'right' | 'both';

interface FitnessProfileStepProps {
  formData: {
    skill_level?: SkillLevel;
    position?: Position;
    dominant_foot?: DominantFoot;
  };
  onUpdate: (data: Partial<{
    skill_level: SkillLevel;
    position: Position;
    dominant_foot: DominantFoot;
  }>) => void;
  onNext: () => void;
  onBack?: () => void;
  isSubmitting?: boolean;
  isLastStep?: boolean;
}

const skillLevels: { value: SkillLevel; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'beginner',
    label: 'Beginner',
    description: 'New to football, learning basics',
    icon: <Zap className="w-6 h-6" />,
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    description: 'Regular player, improving skills',
    icon: <Target className="w-6 h-6" />,
  },
  {
    value: 'advanced',
    label: 'Advanced',
    description: 'Experienced, competitive level',
    icon: <Shield className="w-6 h-6" />,
  },
];

const positions: { value: Position; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'striker',
    label: 'Striker',
    description: 'Attack, score goals',
    icon: <Zap className="w-6 h-6" />,
  },
  {
    value: 'midfielder',
    label: 'Midfielder',
    description: 'Control tempo, pass',
    icon: <Target className="w-6 h-6" />,
  },
  {
    value: 'defender',
    label: 'Defender',
    description: 'Stop attacks, tackle',
    icon: <Shield className="w-6 h-6" />,
  },
  {
    value: 'goalkeeper',
    label: 'Goalkeeper',
    description: 'Shot stopping',
    icon: <HelpCircle className="w-6 h-6" />,
  },
];

export function FitnessProfileStep({
  formData,
  onUpdate,
  onNext,
  onBack,
  isSubmitting,
}: FitnessProfileStepProps) {
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(formData.skill_level || 'beginner');
  const [position, setPosition] = useState<Position>(formData.position || 'striker');
  const [dominantFoot, setDominantFoot] = useState<DominantFoot>(formData.dominant_foot || 'right');

  const handleNext = () => {
    onUpdate({ skill_level: skillLevel, position, dominant_foot: dominantFoot });
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
            Your Football Profile
          </motion.h3>
          <motion.p
            className="text-gray-400 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Help us tailor your training program
          </motion.p>
        </div>

        {/* Skill Level */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: animation.duration.normal / 1000 }}
          className="space-y-4"
        >
          <div className="text-center">
            <h4 className="text-lg font-semibold text-white mb-2">Skill Level</h4>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {skillLevels.map((level, index) => (
              <motion.button
                key={level.value}
                onClick={() => setSkillLevel(level.value)}
                className={`
                  relative p-4 rounded-xl border-2 transition-all duration-300
                  ${skillLevel === level.value
                    ? 'border-[#F7E7CE] bg-gradient-to-br from-[#F7E7CE]/10 to-[#D4AF37]/5'
                    : 'border-white/10 hover:border-[#F7E7CE]/30 bg-white/5'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div className={`text-center ${skillLevel === level.value ? 'text-black' : 'text-white'}`}>
                  <div className="mb-2 flex justify-center">{level.icon}</div>
                  <div className="font-semibold text-sm">{level.label}</div>
                </div>
                {skillLevel === level.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-[#F7E7CE] to-[#D4AF37] flex items-center justify-center"
                  >
                    <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Position */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: animation.duration.normal / 1000 }}
          className="space-y-4"
        >
          <div className="text-center">
            <h4 className="text-lg font-semibold text-white mb-2">Position</h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {positions.map((pos, index) => (
              <motion.button
                key={pos.value}
                onClick={() => setPosition(pos.value)}
                className={`
                  relative p-4 rounded-xl border-2 transition-all duration-300 text-left
                  ${position === pos.value
                    ? 'border-[#F7E7CE] bg-gradient-to-br from-[#F7E7CE]/10 to-[#D4AF37]/5'
                    : 'border-white/10 hover:border-[#F7E7CE]/30 bg-white/5'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <div className={`flex items-center gap-3 ${position === pos.value ? 'text-black' : 'text-white'}`}>
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#F7E7CE]/20 to-[#D4AF37]/10 flex items-center justify-center">
                    {pos.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{pos.label}</div>
                    <div className="text-xs opacity-70">{pos.description}</div>
                  </div>
                </div>
                {position === pos.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-[#F7E7CE] to-[#D4AF37] flex items-center justify-center"
                  >
                    <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Dominant Foot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: animation.duration.normal / 1000 }}
          className="space-y-4"
        >
          <div className="text-center">
            <h4 className="text-lg font-semibold text-white mb-2">Dominant Foot</h4>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {['left', 'right', 'both'].map((foot, index) => (
              <motion.button
                key={foot}
                onClick={() => setDominantFoot(foot as DominantFoot)}
                className={`
                  relative p-4 rounded-xl border-2 transition-all duration-300
                  ${dominantFoot === foot
                    ? 'border-[#F7E7CE] bg-gradient-to-br from-[#F7E7CE]/10 to-[#D4AF37]/5'
                    : 'border-white/10 hover:border-[#F7E7CE]/30 bg-white/5'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <div className={`text-center ${dominantFoot === foot ? 'text-black' : 'text-white'}`}>
                  <Footprints className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-semibold text-sm capitalize">{foot}</div>
                </div>
                {dominantFoot === foot && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-[#F7E7CE] to-[#D4AF37] flex items-center justify-center"
                  >
                    <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: animation.duration.normal / 1000 }}
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
