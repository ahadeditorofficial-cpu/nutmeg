'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';

interface AICoachBubbleProps {
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
  onChatStart?: () => void;
}

export function AICoachBubble({
  isOpen = false,
  onToggle,
  onChatStart,
}: AICoachBubbleProps) {
  const handleToggle = () => {
    const newState = !isOpen;
    onToggle?.(newState);
    if (!isOpen) {
      onChatStart?.();
    }
  };

  return (
    <>
      {/* Chat Panel (slide-over) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={handleToggle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Panel */}
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#111827] border-l border-white/10 shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F7E7CE] to-[#D4AF37] flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-white">AI Coach</h2>
                    <p className="text-xs text-gray-400">Ask me anything</p>
                  </div>
                </div>
                <button
                  onClick={handleToggle}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Chat content placeholder */}
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <motion.div
                  className="w-16 h-16 rounded-full bg-[#F7E7CE]/10 flex items-center justify-center mb-4"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <MessageSquare className="w-8 h-8 text-[#F7E7CE]" />
                </motion.div>
                <p className="text-white font-medium mb-2">Coach is here to help</p>
                <p className="text-sm text-gray-400 max-w-xs">
                  Ask me about training techniques, tactics, nutrition, or anything related to your football journey.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bubble */}
      <motion.button
        className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-[#F7E7CE] to-[#D4AF37] shadow-lg shadow-[#F7E7CE]/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 10 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggle}
        aria-label="Open AI Coach chat"
      >
        <motion.div
          animate={isOpen ? { scale: [1, 1.1, 1] } : undefined}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <MessageSquare className="w-6 h-6 text-black" />
        </motion.div>
      </motion.button>
    </>
  );
}