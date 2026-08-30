'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Users } from 'lucide-react';
import { LuxuryButton } from './LuxuryButton';
import { animation } from '@/lib/animations/tokens';

interface TeamQuickActionProps {
  teamName?: string;
  isLoading?: boolean;
}

export function TeamQuickAction({ teamName, isLoading = false }: TeamQuickActionProps) {
  if (isLoading) {
    return (
      <motion.div
        className="h-12 bg-white/10 rounded-lg animate-pulse"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
    );
  }

  const hasTeam = !!teamName;

  return (
    <motion.div
      initial={animation.variants.fadeInUp.initial}
      animate={animation.variants.fadeInUp.animate}
      transition={{ delay: 0.2 }}
    >
      {hasTeam ? (
        <Link href="/team" className="block">
          <LuxuryButton variant="secondary" className="w-full">
            <Users className="w-4 h-4 mr-2" />
            {teamName}
          </LuxuryButton>
        </Link>
      ) : (
        <Link href="/team/create" className="block">
          <LuxuryButton variant="secondary" className="w-full">
            <Users className="w-4 h-4 mr-2" />
            Create Team
          </LuxuryButton>
        </Link>
      )}
    </motion.div>
  );
}