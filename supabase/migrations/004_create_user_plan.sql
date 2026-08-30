-- Migration: 004_create_user_plan.sql
-- Creates user_plan, user_day_progress, user_session, fitness_retest tables and RLS policies

-- User's current plan (reordered by coach via auto-rewrite)
CREATE TABLE IF NOT EXISTS user_plan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  current_day_number INTEGER NOT NULL DEFAULT 1,
  plan_started_at TIMESTAMPTZ DEFAULT NOW(),
  plan_completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User's daily progress
CREATE TABLE IF NOT EXISTS user_day_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  curriculum_day_id INTEGER REFERENCES curriculum_day(id),
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
  completed_at TIMESTAMPTZ,
  self_rating INTEGER CHECK (self_rating BETWEEN 1 AND 10),
  exercises_skipped INTEGER DEFAULT 0,
  session_duration_seconds INTEGER,
  calories_estimated DECIMAL,
  notes TEXT,
  UNIQUE(user_id, day_number)
);

-- Session state (for pause/resume)
CREATE TABLE IF NOT EXISTS user_session (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  current_exercise_number INTEGER DEFAULT 1,
  mode TEXT CHECK (mode IN ('auto', 'manual')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  paused_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);

-- Fitness retest entries
CREATE TABLE IF NOT EXISTS fitness_retest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  test_type TEXT CHECK (test_type IN ('pushups', 'situps', 'run')),
  value INTEGER NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for user plan
CREATE INDEX IF NOT EXISTS idx_user_plan_user ON user_plan(user_id);
CREATE INDEX IF NOT EXISTS idx_user_day_progress_user ON user_day_progress(user_id, day_number);
CREATE INDEX IF NOT EXISTS idx_user_session_user ON user_session(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_fitness_retest_user ON fitness_retest(user_id, test_type);

-- Enable RLS on all tables
ALTER TABLE user_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_day_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_session ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitness_retest ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_plan
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own plan' AND tablename = 'user_plan') THEN
    CREATE POLICY "Users can view own plan" ON user_plan
      FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- RLS Policies for user_day_progress
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own progress' AND tablename = 'user_day_progress') THEN
    CREATE POLICY "Users can view own progress" ON user_day_progress
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own progress' AND tablename = 'user_day_progress') THEN
    CREATE POLICY "Users can manage own progress" ON user_day_progress
      FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Team members can view team progress' AND tablename = 'user_day_progress') THEN
    CREATE POLICY "Team members can view team progress" ON user_day_progress
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM team_members tm
          JOIN user_plan up ON up.user_id = tm.user_id
          WHERE tm.user_id = auth.uid()
          AND up.user_id = user_day_progress.user_id
        )
      );
  END IF;
END $$;

-- RLS Policies for user_session
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own sessions' AND tablename = 'user_session') THEN
    CREATE POLICY "Users can view own sessions" ON user_session
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own sessions' AND tablename = 'user_session') THEN
    CREATE POLICY "Users can manage own sessions" ON user_session
      FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- RLS Policies for fitness_retest
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own retests' AND tablename = 'fitness_retest') THEN
    CREATE POLICY "Users can view own retests" ON fitness_retest
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own retests' AND tablename = 'fitness_retest') THEN
    CREATE POLICY "Users can manage own retests" ON fitness_retest
      FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;
