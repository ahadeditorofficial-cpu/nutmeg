'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LuxuryButton } from '@/components/LuxuryButton';
import {
  CheckCircle,
  Footprints,
  Triangle,
  Square,
  Target,
  Dumbbell,
  Plus,
  Building2,
  Mountain,
  Flag,
} from 'lucide-react';
import { animation } from '@/lib/animations/tokens';

type EquipmentType =
  | 'ball'
  | 'shoes'
  | 'cones'
  | 'wall_access'
  | 'stairs'
  | 'open_ground'
  | 'goal'
  | 'resistance_band'
  | 'other';

const equipmentOptions: {
  value: EquipmentType;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: 'ball',
    label: 'Football',
    description: 'Standard size 5 ball',
    icon: <Target className="w-6 h-6" />,
  },
  {
    value: 'shoes',
    label: 'Football Boots',
    description: 'Proper footwear for your surface',
    icon: <Footprints className="w-6 h-6" />,
  },
  {
    value: 'cones',
    label: 'Cones/Markers',
    description: 'For dribbling and agility drills',
    icon: <Triangle className="w-6 h-6" />,
  },
  {
    value: 'wall_access',
    label: 'Wall Access',
    description: 'Solid wall for passing/receiving',
    icon: <Building2 className="w-6 h-6" />,
  },
  {
    value: 'stairs',
    label: 'Stairs/Hill',
    description: 'For sprint and conditioning work',
    icon: <Mountain className="w-6 h-6" />,
  },
  {
    value: 'open_ground',
    label: 'Open Ground',
    description: 'Park, pitch, or field space',
    icon: <Square className="w-6 h-6" />,
  },
  {
    value: 'goal',
    label: 'Goal/Target',
    description: 'Full goal or target net',
    icon: <Flag className="w-6 h-6" />,
  },
  {
    value: 'resistance_band',
    label: 'Resistance Band',
    description: 'For strength and mobility work',
    icon: <Dumbbell className="w-6 h-6" />,
  },
  {
    value: 'other',
    label: 'Other Equipment',
    description: 'Additional gear you have',
    icon: <Plus className="w-6 h-6" />,
  },
];

interface EquipmentStepProps {
  formData: {
    equipment?: string[];
  };
  onUpdate: (data: Partial<{ equipment: string[] }>) => void;
  onNext: () => void;
  onBack?: () => void;
  isSubmitting?: boolean;
  isLastStep?: boolean;
}

export function EquipmentStep({
  formData,
  onUpdate,
  onNext,
  onBack,
  isSubmitting,
}: EquipmentStepProps) {
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType[]>(
    (formData.equipment as EquipmentType[]) || []
  );

  const toggleEquipment = (type: EquipmentType) => {
    setSelectedEquipment((prev) =>
      prev.includes(type)
        ? prev.filter((e) => e !== type)
        : [...prev, type]
    );
  };

  const handleNext = () => {
    onUpdate({ equipment: selectedEquipment });
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
        <div className="text-center mb-4">
          <h3 className="text-3xl font-bold text-white text-tight">
            What equipment do you have?
          </h3>
          <p className="text-gray-400 mt-2">
            Select all that apply — we&apos;ll adapt drills to what&apos;s available
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {equipmentOptions.map((item) => {
            const isSelected = selectedEquipment.includes(item.value);
            return (
              <motion.button
                key={item.value}
                onClick={() => toggleEquipment(item.value)}
                className={`
                  relative p-4 rounded-xl border-2 transition-all duration-300
                  ${isSelected
                    ? 'border-[#F7E7CE] bg-gradient-to-br from-[#F7E7CE]/10 to-[#D4AF37]/5'
                    : 'border-white/10 hover:border-[#F7E7CE]/30 bg-white/5'
                  }
                  backdrop-blur-md
                  group
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
              >
                <div className={`flex items-center gap-4 ${isSelected ? 'text-black' : 'text-white'}`}>
                  <div className={`
                    w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300
                    ${isSelected
                      ? 'bg-gradient-to-r from-[#F7E7CE] to-[#D4AF37]'
                      : 'bg-white/5 border border-white/10'
                    }
                  `}>
                    {item.icon}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-semibold text-base truncate">{item.label}</div>
                    <div className="text-sm mt-0.5 opacity-80 truncate">{item.description}</div>
                  </div>
                </div>

                {/* Check indicator */}
                <motion.div
                  initial={isSelected ? { scale: 0 } : { scale: 1 }}
                  animate={isSelected ? { scale: 1 } : { scale: 0 }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    background: isSelected
                      ? 'linear-gradient(135deg, #F7E7CE, #D4AF37)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: isSelected ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {isSelected && (
                    <CheckCircle className="w-4 h-4 text-black" />
                  )}
                </motion.div>

                {/* Selected border glow */}
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                      boxShadow: '0 0 20px rgba(247, 231, 206, 0.3)',
                      border: '1px solid rgba(247, 231, 206, 0.4)',
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {selectedEquipment.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: animation.duration.normal / 1000 }}
            className="p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10"
          >
            <div className="flex items-center gap-2 text-[#F7E7CE] mb-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Great! {selectedEquipment.length} items selected</span>
            </div>
            <p className="text-gray-400 text-sm">
              We&apos;ll customize your sessions based on what you have available.
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: animation.duration.normal / 1000 }}
        className="flex gap-4 pt-4"
      >
        <LuxuryButton
          variant="secondary"
          fullWidth
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1"
        >
          <span className="flex items-center justify-center gap-2">
            <motion.span
              animate={{ x: [0, -2, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.span>
            Back
          </span>
        </LuxuryButton>
        <LuxuryButton
          variant="primary"
          fullWidth
          loading={isSubmitting}
          onClick={handleNext}
          disabled={isSubmitting}
          className="flex-1"
        >
          <span className="flex items-center justify-center gap-2">
            Continue
            <motion.span
              animate={{ x: [0, 2, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.span>
          </span>
        </LuxuryButton>
      </motion.div>
    </div>
  );
}