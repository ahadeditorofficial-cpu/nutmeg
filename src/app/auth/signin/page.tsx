'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { GlassCard } from '@/components/GlassCard';
import { LuxuryButton } from '@/components/LuxuryButton';
import { Eye, EyeOff, Mail, Lock, Send } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  const [error, setError] = useState('');
  const [magicLinkError, setMagicLinkError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setMagicLinkError('');

    if (!email.trim()) {
      setMagicLinkError('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMagicLinkError('Please enter a valid email address');
      return;
    }

    setMagicLinkLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      setMagicLinkError(error.message);
      setMagicLinkLoading(false);
      return;
    }

    // Show success state
    setMagicLinkError('');
    setError('Check your email for the magic link!');
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
      <GlassCard variant="elevated" className="w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F7E7CE] to-[#D4AF37] flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-black">N</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-400 mt-1 text-sm">Sign in to continue your 60-day journey</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form - Email/Password */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F7E7CE]/50 focus:ring-1 focus:ring-[#F7E7CE]/30 transition-all"
                placeholder="your@email.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F7E7CE]/50 focus:ring-1 focus:ring-[#F7E7CE]/30 transition-all"
                placeholder="Your password"
                required
                minLength={6}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <LuxuryButton
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            className="mt-6"
          >
            Sign In
          </LuxuryButton>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[#18181b] text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Magic Link Option */}
        <form onSubmit={handleMagicLink} className="space-y-4">
          <div>
            <label htmlFor="magicEmail" className="block text-sm font-medium text-gray-300 mb-1.5">
              Email for Magic Link
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                id="magicEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F7E7CE]/50 focus:ring-1 focus:ring-[#F7E7CE]/30 transition-all"
                placeholder="your@email.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          {magicLinkError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
              {magicLinkError}
            </div>
          )}

          <LuxuryButton
            type="submit"
            variant="secondary"
            fullWidth
            loading={magicLinkLoading}
            className="mt-2"
          >
            <Send className="w-5 h-5 mr-2" />
            Send Magic Link
          </LuxuryButton>

          <p className="text-center text-gray-500 text-xs">
            We&apos;ll send a sign-in link to your email — no password needed.
          </p>
        </form>

        {/* Sign up link */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Don&apos;t have an account?{' '}
          <a href="/auth/signup" className="text-[#F7E7CE] hover:underline font-medium">
            Sign up
          </a>
        </p>
      </GlassCard>
    </div>
  );
}