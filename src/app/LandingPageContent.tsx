'use client';

import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Brain, TrendingUp, Users, Target, Zap, Shield, ArrowRight, Play, Sparkles } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { LuxuryButton } from '@/components/LuxuryButton';
import { ProgressRing } from '@/components/ProgressRing';
import { animation } from '@/lib/animations/tokens';

const features = [
  {
    icon: Brain,
    title: 'AI Coach',
    description: 'Personalized guidance powered by RAG. Your coach knows the curriculum, your progress, and adapts in real-time.',
  },
  {
    icon: Users,
    title: 'Live Co-op Sessions',
    description: 'Train with friends in real-time. Synced timers, shared progress, and team accountability — no lag.',
  },
  {
    icon: Target,
    title: '60-Day Curriculum',
    description: '8 milestones across skills, fitness, tactics, nutrition & mental game. Research-backed, position-specific.',
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description: 'Dual-ring progress, streak counters, fitness retests, and session summaries. Visual proof of growth.',
  },
];

const stats = [
  { value: 60, label: 'Days', suffix: '' },
  { value: 8, label: 'Milestones', suffix: '' },
  { value: 100, label: 'Live Co-op', suffix: '%' },
];

export function LandingPageContent() {
  const router = useRouter();
  const go = (href: string) => () => router.push(href);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 border-b border-white/5 backdrop-blur-md bg-black/40"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            className="text-2xl font-bold bg-gradient-to-r from-[#F7E7CE] to-[#D4AF37] bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Nutmeg
          </motion.div>
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/auth/signin" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
              Sign In
            </Link>
            <LuxuryButton size="sm" onClick={go('/auth/signup')}>
              Get Started
            </LuxuryButton>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <motion.div
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-[#F7E7CE]/10 to-transparent rounded-full blur-3xl"
            animate={{ scale: [1, 1.1, 1], x: [0, 50, 0], y: [0, -30, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-r from-[#D4AF37]/10 to-transparent rounded-full blur-3xl"
            animate={{ scale: [1, 1.15, 1], x: [0, -40, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#F7E7CE]/30 rounded-full"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 100}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0.1, 0.4, 0.1],
                scale: [0.5, 1, 0.5],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 15 + (i % 10) * 1.7,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: (i % 5) * 1.3,
              }}
            />
          ))}
        </div>

        {/* Hero content with parallax */}
        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <motion.div
            variants={animation.variants.stagger}
            initial="initial"
            animate="animate"
          >
            {/* Animated badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.span
                className="w-2 h-2 bg-[#F7E7CE] rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sm text-gray-300 font-medium">60-Day Football Training Program</span>
            </motion.div>

            {/* Main Title with shimmer */}
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-6"
              style={{ letterSpacing: '-0.03em' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-white via-[#F7E7CE] to-white bg-clip-text text-transparent">
                Nutmeg
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-xl md:text-2xl lg:text-3xl text-gray-200 max-w-3xl mx-auto mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Master football in 60 days. Solo or with friends. AI-powered coaching,
              live co-op sessions, and a curriculum built from real coaching science.
            </motion.p>

            {/* Tagline with typing effect */}
            <motion.p
              className="text-lg text-gray-400 max-w-2xl mx-auto mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Train like a pro. Progress like a champion.{' '}
              <motion.span
                className="text-[#F7E7CE] font-medium"
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Your journey starts now.
              </motion.span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <LuxuryButton size="lg" onClick={go('/auth/signup')} className="w-full sm:w-auto group">
                <span className="flex items-center gap-2">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </LuxuryButton>
              <LuxuryButton size="lg" variant="secondary" onClick={go('/auth/signup')} className="w-full sm:w-auto group">
                <span className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Join a Team
                </span>
              </LuxuryButton>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="mt-16 flex flex-wrap items-center justify-center gap-8 text-gray-500 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#F7E7CE]" aria-hidden="true" />
                Free forever — no credit card
              </span>
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#F7E7CE]" aria-hidden="true" />
                Works offline
              </span>
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F7E7CE]" aria-hidden="true" />
                AI Coach included
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 relative" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.span
              className="text-[#F7E7CE] text-sm font-medium uppercase tracking-wider"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Features
            </motion.span>
            <motion.h2
              id="features-heading"
              className="text-3xl md:text-4xl font-bold mt-2 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Everything you need to{' '}
              <span className="bg-gradient-to-r from-[#F7E7CE] to-[#D4AF37] bg-clip-text text-transparent">
                train smarter
              </span>
            </motion.h2>
            <motion.p
              className="text-gray-400 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Four pillars designed for the modern footballer. No fluff, no gimmicks — just what works.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={animation.variants.stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
          >
            {features.map((feature, index) => (
              <GlassCard
                key={feature.title}
                variant="elevated"
                hover
                className="h-full flex flex-col group cursor-pointer"
              >
                <motion.div
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F7E7CE]/20 to-[#D4AF37]/20 flex items-center justify-center mb-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                >
                  <feature.icon className="w-6 h-6 text-[#F7E7CE]" aria-hidden="true" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-[#F7E7CE] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 flex-1 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>
                <motion.div
                  className="mt-4 flex items-center gap-2 text-[#F7E7CE] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ x: -10 }}
                  whileHover={{ x: 0 }}
                >
                  Learn more
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </GlassCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="py-24 px-6 border-y border-white/5 relative" aria-labelledby="stats-heading">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-12 items-center"
            variants={animation.variants.stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="relative w-40 h-40 mx-auto mb-4">
                  <ProgressRing
                    progress={100}
                    size={160}
                    strokeWidth={6}
                    showLabel={false}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      className="text-4xl md:text-5xl font-bold text-white"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.15, duration: 0.5 }}
                    >
                      {stat.value}
                      {stat.suffix && (
                        <span className="text-2xl font-medium text-[#F7E7CE]">{stat.suffix}</span>
                      )}
                    </motion.span>
                    <span className="text-gray-400 text-sm mt-1">{stat.label}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative" aria-labelledby="cta-heading">
        <div className="max-w-4xl mx-auto text-center relative">
          {/* Animated background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-[#F7E7CE]/5 to-transparent rounded-full blur-3xl"
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.h2
              id="cta-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Ready to start your{' '}
              <span className="bg-gradient-to-r from-[#F7E7CE] to-[#D4AF37] bg-clip-text text-transparent">
                60-day transformation?
              </span>
            </motion.h2>
            <motion.p
              className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Join thousands of footballers training smarter. Free forever. No credit card required.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <LuxuryButton size="lg" onClick={go('/auth/signup')} className="w-full sm:w-auto group">
                <span className="flex items-center gap-2">
                  Create Free Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </LuxuryButton>
              <LuxuryButton size="lg" variant="ghost" onClick={go('/auth/signin')} className="w-full sm:w-auto">
                Already have an account? Sign in
              </LuxuryButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Clean and Minimal */}
      <footer className="py-12 px-6 border-t border-white/5 relative" role="contentinfo">
        <div className="max-w-7xl mx-auto text-center">
          <motion.p
            className="text-gray-500 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Nutmeg. Built for footballers, by footballers.
          </motion.p>
        </div>
      </footer>
    </div>
  );
}
