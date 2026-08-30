import { createClient } from '@/lib/supabase/server';
import { AppShell } from '@/components/AppShell';
import { GlassCard } from '@/components/GlassCard';
import { LuxuryButton } from '@/components/LuxuryButton';
import { Timer, Plus, Clock } from 'lucide-react';
import { animation } from '@/lib/animations/tokens';
import { motion } from 'framer-motion';

async function getUserData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('users')
    .select('id, name, position, skill_level')
    .eq('id', user.id)
    .single();

  return { user, profile };
}

export default async function SessionsPage() {
  const userData = await getUserData();

  if (!userData) {
    return (
      <AppShell userName="User" streak={0}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <Timer className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Sign in to view sessions</h1>
          <p className="text-gray-400">Your session history will appear here once you&apos;re signed in.</p>
        </div>
      </AppShell>
    );
  }

  const { user, profile } = userData;

  return (
    <AppShell
      userName={profile?.name ?? user.user_metadata?.name ?? 'User'}
      streak={0}
    >
      <motion.div
        initial={animation.variants.fadeInUp.initial}
        animate={animation.variants.fadeInUp.animate}
        transition={{ duration: animation.duration.normal / 1000 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Sessions</h1>
            <p className="text-gray-400 text-sm mt-1">Your training history and upcoming sessions</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <GlassCard variant="subtle" className="p-4 text-center hover:border-white/20 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F7E7CE] to-[#D4AF37] flex items-center justify-center mx-auto mb-3">
              <Plus className="w-6 h-6 text-black" />
            </div>
            <h3 className="font-semibold text-white mb-1">Start Session</h3>
            <p className="text-xs text-gray-400">Begin a new training session</p>
          </GlassCard>
          <GlassCard variant="subtle" className="p-4 text-center hover:border-white/20 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="font-semibold text-white mb-1">History</h3>
            <p className="text-xs text-gray-400">View past sessions</p>
          </GlassCard>
        </div>

        {/* Session History Placeholder */}
        <GlassCard variant="elevated" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Sessions</h2>
            <span className="text-xs text-gray-400">Last 30 days</span>
          </div>

          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Timer className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No sessions yet</h3>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              Complete your first training session to see your history here.
            </p>
            <LuxuryButton variant="primary" size="md">
              <Plus className="w-4 h-4 mr-2" />
              Start Session
            </LuxuryButton>
          </div>
        </GlassCard>

        {/* Upcoming Sessions */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-4">Upcoming</h2>
          <GlassCard variant="elevated" className="p-6">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                <Clock className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-400 text-sm">No upcoming sessions scheduled</p>
            </div>
          </GlassCard>
        </div>
      </motion.div>
    </AppShell>
  );
}