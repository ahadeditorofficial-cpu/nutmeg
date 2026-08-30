import { AppShell } from '@/components/AppShell';
import { motion } from 'framer-motion';
import { animation } from '@/lib/animations/tokens';
import { TrendingUp, CheckCircle, Award, Target } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { ProgressRing } from '@/components/ProgressRing';

export default function ProgressPage() {
  return (
    <AppShell userName="User" streak={0}>
      <motion.div
        initial={animation.variants.fadeInUp.initial}
        animate={animation.variants.fadeInUp.animate}
        transition={{ duration: animation.duration.normal / 1000 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Progress</h1>
          <p className="text-gray-400 text-sm mt-1">Track your 60-day transformation</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <GlassCard variant="subtle" className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F7E7CE] to-[#D4AF37] flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-xs text-gray-400">Sessions Completed</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard variant="subtle" className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#F7E7CE]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-xs text-gray-400">Total Minutes</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Progress Ring */}
        <GlassCard variant="elevated" className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">60-Day Journey</h2>
            <span className="text-sm text-[#F7E7CE]">0%</span>
          </div>
          <div className="flex justify-center">
            <ProgressRing progress={0} size={160} strokeWidth={12} showLabel={false} />
          </div>
          <p className="text-center text-gray-400 text-sm mt-4">Complete 60 sessions to finish the program</p>
        </GlassCard>

        {/* Milestones */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Milestones</h2>
          <div className="space-y-3">
            {[
              { day: 10, title: 'First Week Strong', desc: 'Complete 10 sessions', done: false },
              { day: 30, title: 'Halfway There', desc: 'Complete 30 sessions', done: false },
              { day: 60, title: 'Program Complete', desc: 'Complete all 60 sessions', done: false },
            ].map((milestone) => (
              <GlassCard
                key={milestone.day}
                variant="subtle"
                className={`p-4 flex items-center gap-4 ${milestone.done ? 'border-[#F7E7CE]/30' : 'opacity-60'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${milestone.done ? 'bg-gradient-to-br from-[#F7E7CE] to-[#D4AF37]' : 'bg-white/5'}`}>
                  {milestone.done ? (
                    <CheckCircle className="w-5 h-5 text-black" />
                  ) : (
                    <Award className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">Day {milestone.day}</h3>
                    <span className="text-xs text-gray-500">{milestone.title}</span>
                  </div>
                  <p className="text-sm text-gray-400">{milestone.desc}</p>
                </div>
                <Target className={`w-5 h-5 ${milestone.done ? 'text-[#F7E7CE]' : 'text-gray-600'}`} />
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Statistics Placeholder */}
        <GlassCard variant="elevated" className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Statistics</h2>
          <div className="space-y-4">
            {[
              { label: 'Total Training Time', value: '0 min', sub: 'Start training to see stats' },
              { label: 'Sessions Completed', value: '0', sub: 'Your session count' },
              { label: 'Current Streak', value: '0 days', sub: 'Keep it going!' },
              { label: 'Best Streak', value: '0 days', sub: 'Longest consecutive streak' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-sm font-medium text-white">{stat.label}</p>
                  <p className="text-xs text-gray-400">{stat.sub}</p>
                </div>
                <p className="text-lg font-semibold text-[#F7E7CE]">{stat.value}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </AppShell>
  );
}