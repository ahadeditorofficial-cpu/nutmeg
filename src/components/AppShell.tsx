'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { BottomNav } from '@/components/BottomNav';
import { StreakCounter } from '@/components/StreakCounter';
import { animation } from '@/lib/animations/tokens';

interface AppShellProps {
  children: ReactNode;
  streak?: number;
  userName?: string;
  userAvatar?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function AppShell({
  children,
  streak = 0,
  userName = 'User',
  userAvatar,
}: AppShellProps) {
  const { signOut, user } = useAuth();
  const displayName = userName || user?.user_metadata?.name || 'User';
  const initials = userAvatar ? '' : getInitials(displayName);
  const avatarSrc = userAvatar || user?.user_metadata?.avatar_url;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col bg-[var(--color-bg)]"
      initial={animation.variants.fadeIn.initial}
      animate={animation.variants.fadeIn.animate}
      exit={animation.variants.fadeIn.exit}
      transition={{ duration: animation.duration.normal / 1000 }}
    >
      {/* Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-40 glass-elevated px-4 md:px-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: animation.duration.normal / 1000 }}
        style={{
          paddingTop: 'env(safe-area-inset-top)',
        }}
      >
        <div className="mx-auto max-w-2xl flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F7E7CE] to-[#D4AF37] flex items-center justify-center shadow-lg shadow-[#F7E7CE]/30"
              animate={{ rotate: [0, 0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              style={{ animationPlayState: 'paused' }}
              whileHover={{ animationPlayState: 'running' }}
            >
              <span className="text-black font-bold text-xl tracking-tight">N</span>
            </motion.div>
            <span className="text-xl font-bold text-white tracking-tight hidden sm:block">
              Nutmeg
            </span>
          </motion.div>

          {/* Center: Streak Counter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: animation.duration.normal / 1000 }}
          >
            <StreakCounter streak={streak} size={100} showLabel={false} />
          </motion.div>

          {/* Right: User Avatar & Logout */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: animation.duration.normal / 1000 }}
          >
            {/* User Avatar */}
            <motion.button
              className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10 transition-all duration-200 hover:border-white/30 hover:shadow-lg hover:shadow-[#F7E7CE]/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="User profile"
            >
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#F7E7CE]/20 to-[#D4AF37]/20 flex items-center justify-center">
                  <span className="text-sm font-semibold text-[#F7E7CE] tracking-wide">
                    {initials}
                  </span>
                </div>
              )}
              {/* Online indicator */}
              <motion.div
                className="absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-black"
                style={{ backgroundColor: '#34D399' }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>

            {/* Logout Button */}
            <motion.button
              onClick={handleSignOut}
              className="p-2 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Sign out"
            >
              <LogOut className="w-5 h-5" aria-hidden="true" />
            </motion.button>
          </motion.div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main
        className="flex-1 pt-20 pb-28 md:pt-24 md:pb-32 px-4 md:px-6"
        style={{
          paddingBottom: 'calc(80px + env(safe-area-inset-bottom))',
        }}
      >
        <motion.div
          className="mx-auto max-w-2xl"
          initial={animation.variants.slideUp.initial}
          animate={animation.variants.slideUp.animate}
          transition={{ duration: animation.duration.normal / 1000, delay: 0.2 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </motion.div>
  );
}