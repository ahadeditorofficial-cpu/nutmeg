'use client';

import { motion } from 'framer-motion';
import { animation } from '@/lib/animations/tokens';

interface OnboardingStepperProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

const defaultLabels = ['Basic Info', 'Fitness Profile', 'Baseline Test', 'Preferences'];

export function OnboardingStepper({
  currentStep,
  totalSteps = 4,
  stepLabels = defaultLabels,
}: OnboardingStepperProps) {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      {/* Step indicator text */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: animation.duration.normal / 1000 }}
        className="text-center"
      >
        <p className="text-sm font-medium text-[#F7E7CE] tracking-wider uppercase">
          Step {currentStep} of {totalSteps}
        </p>
        <h2 className="text-2xl font-bold text-white mt-1">
          {stepLabels[currentStep - 1]}
        </h2>
      </motion.div>

      {/* Visual progress dots/lines */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: animation.duration.normal / 1000, delay: 0.1 }}
        className="flex items-center gap-0"
      >
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNumber = i + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          const isFuture = stepNumber > currentStep;

          return (
            <motion.div
              key={stepNumber}
              className="flex items-center"
              initial={{ opacity: 0, x: i * 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.15 + i * 0.1,
                duration: animation.duration.fast / 1000,
              }}
            >
              {/* Connecting line (except last) */}
              {stepNumber < totalSteps && (
                <motion.div
                  className="w-12 h-0.5"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isCompleted ? 1 : 0 }}
                  transition={{
                    duration: animation.duration.normal / 1000,
                    delay: 0.2 + i * 0.1,
                  }}
                  style={{
                    transformOrigin: 'left center',
                    background: isCompleted
                      ? 'linear-gradient(90deg, #F7E7CE, #D4AF37)'
                      : 'rgba(255, 255, 255, 0.08)',
                  }}
                />
              )}

              {/* Step dot */}
              <motion.div
                className="relative flex-shrink-0"
                whileHover={!isFuture ? { scale: 1.1 } : undefined}
                transition={{ duration: animation.duration.fast / 1000 }}
              >
                {/* Outer ring for active step */}
                {isActive && (
                  <motion.div
                    className="absolute -inset-1 rounded-full border-2"
                    style={{
                      borderColor: 'rgba(247, 231, 206, 0.4)',
                    }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      duration: animation.duration.slow / 1000,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'easeInOut',
                    }}
                  />
                )}

                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: isCompleted
                      ? 'linear-gradient(135deg, #F7E7CE, #D4AF37)'
                      : isActive
                      ? 'linear-gradient(135deg, #F7E7CE, #D4AF37)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: isFuture
                      ? '1px solid rgba(255, 255, 255, 0.1)'
                      : 'none',
                    boxShadow: isActive
                      ? '0 0 20px rgba(247, 231, 206, 0.3)'
                      : isCompleted
                      ? '0 0 10px rgba(247, 231, 206, 0.2)'
                      : 'none',
                  }}
                >
                  {isCompleted ? (
                    <svg
                      className="w-5 h-5 text-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span
                      className={`text-sm font-bold ${
                        isActive || isCompleted ? 'text-black' : 'text-gray-500'
                      }`}
                    >
                      {stepNumber}
                    </span>
                  )}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}