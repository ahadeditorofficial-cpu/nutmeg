-- Migration: 007_create_journal.sql
-- Creates journal_entry, session_summary tables and RLS policies

-- Daily journal entries
CREATE TABLE IF NOT EXISTS journal_entry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 10),
  notes TEXT,
  mood TEXT,
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, day_number)
);

-- Session summaries (for team visibility)
CREATE TABLE IF NOT EXISTS session_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  exercises_completed INTEGER,
  total_duration_seconds INTEGER,
  calories_burned DECIMAL,
  self_rating INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for journal
CREATE INDEX IF NOT EXISTS idx_journal_user ON journal_entry(user_id, day_number);
CREATE INDEX IF NOT EXISTS idx_session_summary_user ON session_summary(user_id, day_number);

-- Enable RLS on all tables
ALTER TABLE journal_entry ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_summary ENABLE ROW LEVEL SECURITY;

-- RLS Policies for journal_entry (private by default)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own journal' AND tablename = 'journal_entry') THEN
    CREATE POLICY "Users can view own journal" ON journal_entry
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own journal' AND tablename = 'journal_entry') THEN
    CREATE POLICY "Users can manage own journal" ON journal_entry
      FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- RLS Policies for session_summary (visible to team members)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own session summaries' AND tablename = 'session_summary') THEN
    CREATE POLICY "Users can view own session summaries" ON session_summary
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own session summaries' AND tablename = 'session_summary') THEN
    CREATE POLICY "Users can manage own session summaries" ON session_summary
      FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Team members can view session summaries' AND tablename = 'session_summary') THEN
    CREATE POLICY "Team members can view session summaries" ON session_summary
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM team_members tm
          JOIN user_plan up ON up.user_id = tm.user_id
          WHERE tm.user_id = auth.uid()
          AND up.user_id = session_summary.user_id
        )
      );
  END IF;
END $$;
