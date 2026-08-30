import { AppShell } from '@/components/AppShell';
import { motion } from 'framer-motion';
import { animation } from '@/lib/animations/tokens';
import { Users, Plus, UserPlus } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';

export default function TeamPage() {
  return (
    <AppShell userName="User" streak={0}>
      <motion.div
        initial={animation.variants.fadeInUp.initial}
        animate={animation.variants.fadeInUp.animate}
        transition={{ duration: animation.duration.normal / 1000 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Team</h1>
            <p className="text-gray-400 text-sm mt-1">Train together, improve together</p>
          </div>
        </div>

        {/* Team Content */}
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <motion.div
            className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F7E7CE]/20 to-[#D4AF37]/20 flex items-center justify-center mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: animation.duration.normal / 1000 }}
          >
            <Users className="w-10 h-10 text-[#F7E7CE]" />
          </motion.div>

          <h2 className="text-xl font-bold text-white mb-3">No team yet</h2>
          <p className="text-gray-400 text-sm max-w-sm mb-8">
            Create a team to train with friends or join an existing one with an invite link.
          </p>

          <div className="grid grid-cols-2 gap-3 w-full max-w-md">
            <GlassCard variant="elevated" className="p-6 text-center hover:border-white/20 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F7E7CE] to-[#D4AF37] flex items-center justify-center mx-auto mb-3">
                <Plus className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-semibold text-white mb-1">Create Team</h3>
              <p className="text-xs text-gray-400">Start a new team</p>
            </GlassCard>
            <GlassCard variant="elevated" className="p-6 text-center hover:border-white/20 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                <UserPlus className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">Join Team</h3>
              <p className="text-xs text-gray-400">Enter an invite link</p>
            </GlassCard>
          </div>

          <div className="mt-8 w-full max-w-md">
            <div className="glass rounded-xl p-4 text-left">
              <h4 className="font-semibold text-white text-sm mb-3">How team training works</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F7E7CE]" />
                  Create a team or join with an invite code
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F7E7CE]" />
                  Start co-op sessions with your team
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F7E7CE]" />
                  Track progress and compete for the top spot
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </AppShell>
  );
}