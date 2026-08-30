import { AppShell } from '@/components/AppShell';
import { AICoachBubble } from '@/components/AICoachBubble';
import { motion } from 'framer-motion';
import { animation } from '@/lib/animations/tokens';
import { MessageSquare } from 'lucide-react';

export default function CoachPage() {
  return (
    <AppShell userName="User" streak={0}>
      <motion.div
        initial={animation.variants.fadeInUp.initial}
        animate={animation.variants.fadeInUp.animate}
        transition={{ duration: animation.duration.normal / 1000 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">AI Coach</h1>
          <p className="text-gray-400 text-sm mt-1">Ask me anything about your training</p>
        </div>

        {/* Coach Content */}
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <motion.div
            className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F7E7CE]/20 to-[#D4AF37]/20 flex items-center justify-center mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: animation.duration.normal / 1000 }}
          >
            <MessageSquare className="w-10 h-10 text-[#F7E7CE]" />
          </motion.div>

          <h2 className="text-xl font-bold text-white mb-3">Your AI Coach is ready</h2>
          <p className="text-gray-400 text-sm max-w-sm mb-8">
            Get personalized advice on training techniques, tactics, nutrition, and mental game.
            I&apos;m here to help you reach your football goals.
          </p>

          <div className="grid grid-cols-2 gap-3 w-full max-w-md">
            {[
              { icon: '⚽', title: 'Technique', desc: 'Improve your skills' },
              { icon: '🎯', title: 'Tactics', desc: 'Master the game' },
              { icon: '💪', title: 'Fitness', desc: 'Build your engine' },
              { icon: '🧠', title: 'Mindset', desc: 'Stay focused' },
            ].map((topic, i) => (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="glass p-4 rounded-xl text-left hover:border-white/20 transition-colors cursor-pointer"
              >
                <span className="text-2xl mb-2 block">{topic.icon}</span>
                <h3 className="font-semibold text-white text-sm">{topic.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{topic.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Floating Coach Bubble */}
      <AICoachBubble />
    </AppShell>
  );
}