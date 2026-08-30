-- Migration: 008_create_analytics.sql
-- Creates error_logs, analytics_events tables and RLS policies

-- Error logs for internal debugging
CREATE TABLE IF NOT EXISTS error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT,
  stack TEXT,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  page_url TEXT,
  browser TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product analytics events (no user identification by design)
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  event_data JSONB,
  session_id TEXT,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for analytics
CREATE INDEX IF NOT EXISTS idx_error_logs_user ON error_logs(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_error_logs_created ON error_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id) WHERE user_id IS NOT NULL;

-- Enable RLS on all tables
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for error_logs (service role only for writes, authenticated for reads)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can manage error logs' AND tablename = 'error_logs') THEN
    CREATE POLICY "Service role can manage error logs" ON error_logs
      FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can view error logs' AND tablename = 'error_logs') THEN
    CREATE POLICY "Authenticated users can view error logs" ON error_logs
      FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- RLS Policies for analytics_events
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can insert analytics' AND tablename = 'analytics_events') THEN
    CREATE POLICY "Anyone can insert analytics" ON analytics_events
      FOR INSERT WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can view analytics' AND tablename = 'analytics_events') THEN
    CREATE POLICY "Service role can view analytics" ON analytics_events
      FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role');
  END IF;
END $$;
