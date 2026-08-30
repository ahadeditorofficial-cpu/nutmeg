'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { OnboardingStepper } from '@/components/OnboardingStepper';
import { animation } from '@/lib/animations/tokens';

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep?: number;
  totalSteps?: number;
  stepLabels?: string[];
}

export default function OnboardingLayout({
  children,
  currentStep = 1,
  totalSteps = 6,
  stepLabels,
}: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <motion.header
        className="px-6 py-4 border-b border-white/5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: animation.duration.normal / 1000 }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <motion.div
            className="text-xl font-bold bg-gradient-to-r from-[#F7E7CE] to-[#D4AF37] bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            Nutmeg
          </motion.div>
          <div className="text-sm text-gray-500">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-6 py-8">
        <div className="max-w-2xl mx-auto w-full">
          {/* Stepper */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <OnboardingStepper
              currentStep={currentStep}
              totalSteps={totalSteps}
              stepLabels={stepLabels}
            />
          </motion.div>

          {/* Step Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: animation.duration.normal / 1000 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
