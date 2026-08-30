'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OnboardingLayout from './layout';
import { BasicsStep } from './steps/BasicsStep';
import { FitnessProfileStep } from './steps/FitnessProfileStep';
import { EquipmentStep } from './steps/EquipmentStep';
import { BaselineTestStep } from './steps/BaselineTestStep';
import { PreferencesStep } from './steps/PreferencesStep';
import { SuccessStep } from './steps/SuccessStep';
import { completeOnboarding, type OnboardingFormData } from './actions';
import { animation } from '@/lib/animations/tokens';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';

const TOTAL_STEPS = 6;
const stepLabels = [
  'Basic Info',
  'Fitness Profile',
  'Equipment',
  'Baseline Test',
  'Preferences',
  'Complete',
];

const stepComponents = [
  BasicsStep,
  FitnessProfileStep,
  EquipmentStep,
  BaselineTestStep,
  PreferencesStep,
  SuccessStep,
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<OnboardingFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState(1);

  const updateFormData = (data: Partial<OnboardingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const goNext = async () => {
    if (currentStep === TOTAL_STEPS) {
      setIsSubmitting(true);
      try {
        await completeOnboarding(formData as OnboardingFormData);
      } catch (error) {
        console.error('Onboarding error:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goBack = () => {
    setDirection(-1);
    setCurrentStep((prev) => prev - 1);
  };

  const CurrentStepComponent = stepComponents[currentStep - 1];

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={TOTAL_STEPS}
      stepLabels={stepLabels}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: direction > 0 ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -20 : 20 }}
          transition={{ duration: animation.duration.normal / 1000 }}
          className="w-full"
        >
          <CurrentStepComponent
            formData={formData}
            onUpdate={updateFormData}
            onNext={goNext}
            onBack={currentStep > 1 ? goBack : undefined}
            isSubmitting={isSubmitting}
            isLastStep={currentStep === TOTAL_STEPS}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation hint */}
      {currentStep < TOTAL_STEPS && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: animation.duration.normal / 1000 }}
          className="mt-6 text-center text-sm text-gray-500"
        >
          Swipe or use buttons to navigate
        </motion.div>
      )}
    </OnboardingLayout>
  );
}