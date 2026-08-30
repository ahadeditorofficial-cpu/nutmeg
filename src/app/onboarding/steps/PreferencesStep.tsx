'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LuxuryButton } from '@/components/LuxuryButton';
import { Clock, Users, User, UsersRound, Plus, Key } from 'lucide-react';
import { animation } from '@/lib/animations/tokens';

type TrainingContext = 'solo' | 'with_friends' | 'both';
type TeamDecision = 'create' | 'join' | 'skip';

interface PreferencesStepProps {
  formData: {
    available_time_minutes?: number;
    training_context?: TrainingContext;
    team_decision?: TeamDecision;
    team_name?: string;
    invite_token?: string;
  };
  onUpdate: (data: Partial<{
    available_time_minutes: number;
    training_context: TrainingContext;
    team_decision: TeamDecision;
    team_name: string;
    invite_token: string;
  }>) => void;
  onNext: () => void;
  onBack?: () => void;
  isSubmitting?: boolean;
  isLastStep?: boolean;
}

const trainingContexts: { value: TrainingContext; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'solo',
    label: 'Solo',
    description: 'I train on my own',
    icon: <User className="w-6 h-6" />,
  },
  {
    value: 'with_friends',
    label: 'With Friends',
    description: 'I train with a group',
    icon: <Users className="w-6 h-6" />,
  },
  {
    value: 'both',
    label: 'Both',
    description: 'Sometimes solo, sometimes with others',
    icon: <UsersRound className="w-6 h-6" />,
  },
];

export function PreferencesStep({
  formData,
  onUpdate,
  onNext,
  onBack,
  isSubmitting,
}: PreferencesStepProps) {
  const [trainingTime, setTrainingTime] = useState(formData.available_time_minutes || 60);
  const [trainingContext, setTrainingContext] = useState<TrainingContext>(
    formData.training_context || 'solo'
  );
  const [teamDecision, setTeamDecision] = useState<TeamDecision>(formData.team_decision || 'skip');
  const [teamName, setTeamName] = useState(formData.team_name || '');
  const [inviteToken, setInviteToken] = useState(formData.invite_token || '');

  const handleNext = () => {
    onUpdate({
      available_time_minutes: trainingTime,
      training_context: trainingContext,
      team_decision: teamDecision,
      team_name: teamDecision === 'create' ? teamName : undefined,
      invite_token: teamDecision === 'join' ? inviteToken : undefined,
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
            Training Preferences
          </motion.h3>
          <motion.p
            className="text-gray-400 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Let&apos;s customize your schedule
          </motion.p>
        </div>

        {/* Training Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-white/5 border border-white/10"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#F7E7CE]/20 to-[#D4AF37]/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-[#F7E7CE]" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Daily Training Time</h4>
              <p className="text-gray-400 text-sm">How long per session?</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>20 min</span>
              <span>120 min</span>
            </div>
            <input
              type="range"
              min={20}
              max={120}
              step={5}
              value={trainingTime}
              onChange={(e) => setTrainingTime(parseInt(e.target.value))}
              className="w-full h-1 rounded-full appearance-none cursor-pointer bg-white/10"
              style={{
                accentColor: '#F7E7CE',
              }}
            />
            <div className="text-center">
              <span className="text-4xl font-bold text-[#F7E7CE]">{trainingTime}</span>
              <span className="text-gray-400 ml-2">minutes</span>
            </div>
          </div>
        </motion.div>

        {/* Training Context */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div className="text-center">
            <h4 className="text-lg font-semibold text-white mb-2">How do you train?</h4>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {trainingContexts.map((ctx, index) => (
              <motion.button
                key={ctx.value}
                onClick={() => setTrainingContext(ctx.value)}
                className={`
                  relative p-4 rounded-xl border-2 transition-all duration-300
                  ${trainingContext === ctx.value
                    ? 'border-[#F7E7CE] bg-gradient-to-br from-[#F7E7CE]/10 to-[#D4AF37]/5'
                    : 'border-white/10 hover:border-[#F7E7CE]/30 bg-white/5'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div className={`text-center ${trainingContext === ctx.value ? 'text-black' : 'text-white'}`}>
                  <div className="mb-2 flex justify-center">{ctx.icon}</div>
                  <div className="font-semibold text-sm">{ctx.label}</div>
                  <div className="text-xs mt-1 opacity-70">{ctx.description}</div>
                </div>
                {trainingContext === ctx.value && (
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

        {/* Team Setup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <div className="text-center">
            <h4 className="text-lg font-semibold text-white mb-2">Team Setup</h4>
            <p className="text-gray-400 text-sm">Create or join a team to train together</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'skip', label: 'Skip', icon: <User className="w-6 h-6" /> },
              { value: 'create', label: 'Create', icon: <Plus className="w-6 h-6" /> },
              { value: 'join', label: 'Join', icon: <Key className="w-6 h-6" /> },
            ].map((option, index) => (
              <motion.button
                key={option.value}
                onClick={() => setTeamDecision(option.value as TeamDecision)}
                className={`
                  relative p-4 rounded-xl border-2 transition-all duration-300
                  ${teamDecision === option.value
                    ? 'border-[#F7E7CE] bg-gradient-to-br from-[#F7E7CE]/10 to-[#D4AF37]/5'
                    : 'border-white/10 hover:border-[#F7E7CE]/30 bg-white/5'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <div className={`text-center ${teamDecision === option.value ? 'text-black' : 'text-white'}`}>
                  <div className="mb-2 flex justify-center">{option.icon}</div>
                  <div className="font-semibold text-sm">{option.label}</div>
                </div>
                {teamDecision === option.value && (
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

          {teamDecision === 'create' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="pt-2"
            >
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Team name (e.g., Sunday Strikers)"
                className="
                  w-full px-4 py-3 rounded-lg
                  bg-white/5 backdrop-blur-md
                  border border-white/10
                  text-white placeholder-gray-500
                  focus:outline-none focus:border-[#F7E7CE]/50 focus:ring-1 focus:ring-[#F7E7CE]/30
                  transition-all duration-200
                "
                maxLength={50}
                disabled={isSubmitting}
              />
            </motion.div>
          )}

          {teamDecision === 'join' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="pt-2"
            >
              <input
                type="text"
                value={inviteToken}
                onChange={(e) => setInviteToken(e.target.value.toUpperCase())}
                placeholder="Enter invite code"
                className="
                  w-full px-4 py-3 rounded-lg
                  bg-white/5 backdrop-blur-md
                  border border-white/10
                  text-white placeholder-gray-500
                  focus:outline-none focus:border-[#F7E7CE]/50 focus:ring-1 focus:ring-[#F7E7CE]/30
                  transition-all duration-200
                  tracking-wider
                "
                maxLength={20}
                disabled={isSubmitting}
              />
              <p className="text-gray-500 text-xs mt-2">
                Ask your friend for their team invite code
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: animation.duration.normal / 1000 }}
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
