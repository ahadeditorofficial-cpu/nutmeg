-- Migration: 005_create_coop.sql
-- Creates coop_session, coop_participants tables with Realtime and RLS policies

-- Co-op sessions
CREATE TABLE IF NOT EXISTS coop_session (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  host_user_id UUID REFERENCES users(id),
  curriculum_day_id INTEGER REFERENCES curriculum_day(id),
  mode TEXT CHECK (mode IN ('auto', 'manual')),
  current_exercise_number INTEGER DEFAULT 1,
  session_status TEXT CHECK (session_status IN ('waiting', 'active', 'paused', 'completed')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(team_id, session_status)
);

-- Co-op participants
CREATE TABLE IF NOT EXISTS coop_participants (
  coop_session_id UUID REFERENCES coop_session(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  current_exercise_number INTEGER,
  status TEXT CHECK (status IN ('joined', 'paused', 'completed')),
  PRIMARY KEY (coop_session_id, user_id)
);

-- Indexes for coop
CREATE INDEX IF NOT EXISTS idx_coop_session_team ON coop_session(team_id, session_status);
CREATE INDEX IF NOT EXISTS idx_coop_participants_session ON coop_participants(coop_session_id);

-- Enable RLS on all tables
ALTER TABLE coop_session ENABLE ROW LEVEL SECURITY;
ALTER TABLE coop_participants ENABLE ROW LEVEL SECURITY;

-- Replica identity for Realtime (needed to broadcast old row values)
ALTER TABLE coop_session REPLICA IDENTITY FULL;
ALTER TABLE coop_participants REPLICA IDENTITY FULL;

-- Add tables to supabase_realtime publication for live sync
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime')
    AND NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'coop_session'
    ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE coop_session;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime')
    AND NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'coop_participants'
    ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE coop_participants;
  END IF;
END $$;

-- RLS Policies for coop_session
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Team members can view co-op sessions' AND tablename = 'coop_session') THEN
    CREATE POLICY "Team members can view co-op sessions" ON coop_session
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM team_members tm
          WHERE tm.team_id = coop_session.team_id
          AND tm.user_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Team hosts can manage co-op sessions' AND tablename = 'coop_session') THEN
    CREATE POLICY "Team hosts can manage co-op sessions" ON coop_session
      FOR ALL USING (auth.uid() = host_user_id);
  END IF;
END $$;

-- RLS Policies for coop_participants
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Team members can view co-op participants' AND tablename = 'coop_participants') THEN
    CREATE POLICY "Team members can view co-op participants" ON coop_participants
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM coop_session cs
          JOIN team_members tm ON tm.team_id = cs.team_id
          WHERE cs.id = coop_participants.coop_session_id
          AND tm.user_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own participation' AND tablename = 'coop_participants') THEN
    CREATE POLICY "Users can manage own participation" ON coop_participants
      FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;
