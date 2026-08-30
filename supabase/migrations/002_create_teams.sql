-- Migration: 002_create_teams.sql
-- Creates teams, team_members, invite_tokens tables and RLS policies

-- Teams
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tagline TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team members
CREATE TABLE IF NOT EXISTS team_members (
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  position TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (team_id, user_id)
);

-- Invite tokens
CREATE TABLE IF NOT EXISTS invite_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for teams
CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);

-- Enable RLS on all tables
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies for teams
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Team members can view team' AND tablename = 'teams') THEN
    CREATE POLICY "Team members can view team" ON teams
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM team_members WHERE team_members.team_id = teams.id
          AND team_members.user_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Team creators can manage team' AND tablename = 'teams') THEN
    CREATE POLICY "Team creators can manage team" ON teams
      FOR ALL USING (auth.uid() = created_by);
  END IF;
END $$;

-- RLS Policies for team_members
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Team members can view teammates' AND tablename = 'team_members') THEN
    CREATE POLICY "Team members can view teammates" ON team_members
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM team_members tm2
          WHERE tm2.team_id = team_members.team_id
          AND tm2.user_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can join teams' AND tablename = 'team_members') THEN
    CREATE POLICY "Users can join teams" ON team_members
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can leave teams' AND tablename = 'team_members') THEN
    CREATE POLICY "Users can leave teams" ON team_members
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- RLS Policies for invite_tokens
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Team creators can manage invite tokens' AND tablename = 'invite_tokens') THEN
    CREATE POLICY "Team creators can manage invite tokens" ON invite_tokens
      FOR ALL USING (auth.uid() = created_by);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view valid invite tokens' AND tablename = 'invite_tokens') THEN
    CREATE POLICY "Anyone can view valid invite tokens" ON invite_tokens
      FOR SELECT USING (expires_at > NOW());
  END IF;
END $$;
