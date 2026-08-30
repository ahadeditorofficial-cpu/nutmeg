'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LuxuryButton } from '@/components/LuxuryButton';
import { User, Calendar, Ruler, Scale } from 'lucide-react';
import { animation } from '@/lib/animations/tokens';

interface BasicsStepProps {
  formData: {
    name?: string;
    age?: number;
    height_cm?: number;
    weight_kg?: number;
  };
  onUpdate: (data: Partial<{
    name: string;
    age: number;
    height_cm: number;
    weight_kg: number;
  }>) => void;
  onNext: () => void;
  onBack?: () => void;
  isSubmitting?: boolean;
  isLastStep?: boolean;
}

export function BasicsStep({
  formData,
  onUpdate,
  onNext,
  onBack,
  isSubmitting,
}: BasicsStepProps) {
  const [name, setName] = useState(formData.name || '');
  const [age, setAge] = useState(formData.age || 25);
  const [height, setHeight] = useState(formData.height_cm || 175);
  const [weight, setWeight] = useState(formData.weight_kg || 70);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (age < 13 || age > 100) newErrors.age = 'Age must be between 13 and 100';
    if (height < 100 || height > 250) newErrors.height = 'Height must be between 100 and 250 cm';
    if (weight < 30 || weight > 200) newErrors.weight = 'Weight must be between 30 and 200 kg';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onUpdate({ name: name.trim(), age, height_cm: height, weight_kg: weight });
      onNext();
    }
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
            Let&apos;s Get to Know You
          </motion.h3>
          <motion.p
            className="text-gray-400 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            This helps us personalize your training program
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: animation.duration.normal / 1000 }}
          className="space-y-6"
        >
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-[#F7E7CE]" />
              Your Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="
                w-full px-4 py-3 rounded-lg
                bg-white/5 backdrop-blur-md
                border border-white/10
                text-white placeholder-gray-500
                focus:outline-none focus:border-[#F7E7CE]/50 focus:ring-1 focus:ring-[#F7E7CE]/30
                transition-all duration-200
              "
              placeholder="Enter your name"
              autoComplete="name"
              disabled={isSubmitting}
            />
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-1"
              >
                {errors.name}
              </motion.p>
            )}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            {/* Age */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#F7E7CE]" />
                Age
              </label>
              <input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(Math.max(13, Math.min(100, parseInt(e.target.value) || 13)))}
                className="
                  w-full px-4 py-3 rounded-lg
                  bg-white/5 backdrop-blur-md
                  border border-white/10
                  text-white placeholder-gray-500
                  focus:outline-none focus:border-[#F7E7CE]/50 focus:ring-1 focus:ring-[#F7E7CE]/30
                  transition-all duration-200
                "
                min={13}
                max={100}
                disabled={isSubmitting}
              />
              {errors.age && <p className="text-red-400 text-sm mt-1">{errors.age}</p>}
            </motion.div>

            {/* Height */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="height" className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Ruler className="w-4 h-4 text-[#F7E7CE]" />
                Height (cm)
              </label>
              <input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(Math.max(100, Math.min(250, parseInt(e.target.value) || 100)))}
                className="
                  w-full px-4 py-3 rounded-lg
                  bg-white/5 backdrop-blur-md
                  border border-white/10
                  text-white placeholder-gray-500
                  focus:outline-none focus:border-[#F7E7CE]/50 focus:ring-1 focus:ring-[#F7E7CE]/30
                  transition-all duration-200
                "
                min={100}
                max={250}
                disabled={isSubmitting}
              />
              {errors.height && <p className="text-red-400 text-sm mt-1">{errors.height}</p>}
            </motion.div>

            {/* Weight */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor="weight" className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#F7E7CE]" />
                Weight (kg)
              </label>
              <input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(Math.max(30, Math.min(200, parseInt(e.target.value) || 30)))}
                className="
                  w-full px-4 py-3 rounded-lg
                  bg-white/5 backdrop-blur-md
                  border border-white/10
                  text-white placeholder-gray-500
                  focus:outline-none focus:border-[#F7E7CE]/50 focus:ring-1 focus:ring-[#F7E7CE]/30
                  transition-all duration-200
                "
                min={30}
                max={200}
                disabled={isSubmitting}
              />
              {errors.weight && <p className="text-red-400 text-sm mt-1">{errors.weight}</p>}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: animation.duration.normal / 1000 }}
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
