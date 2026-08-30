-- Migration: 001_create_users.sql
-- Creates users table, user_equipment junction table, and RLS policies

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  name TEXT,
  age INTEGER,
  height_cm INTEGER,
  weight_kg DECIMAL,
  profile_photo_url TEXT,
  skill_level TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  position TEXT CHECK (position IN ('striker', 'midfielder', 'defender', 'goalkeeper')),
  dominant_foot TEXT CHECK (dominant_foot IN ('left', 'right', 'both')),
  available_time_minutes INTEGER,
  training_context TEXT CHECK (training_context IN ('solo', 'with_friends', 'both')),
  baseline_pushups INTEGER,
  baseline_situps INTEGER,
  baseline_run_distance_meters INTEGER,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipment checklist (junction table)
CREATE TABLE IF NOT EXISTS user_equipment (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  equipment_type TEXT CHECK (equipment_type IN (
    'ball', 'shoes', 'cones', 'wall_access', 'stairs',
    'open_ground', 'goal', 'resistance_band', 'other'
  )),
  PRIMARY KEY (user_id, equipment_type)
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_equipment ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own profile' AND tablename = 'users') THEN
    CREATE POLICY "Users can view own profile" ON users
      FOR SELECT USING (auth.uid() = id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile' AND tablename = 'users') THEN
    CREATE POLICY "Users can update own profile" ON users
      FOR UPDATE USING (auth.uid() = id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own profile' AND tablename = 'users') THEN
    CREATE POLICY "Users can insert own profile" ON users
      FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- RLS Policies for user_equipment
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own equipment' AND tablename = 'user_equipment') THEN
    CREATE POLICY "Users can view own equipment" ON user_equipment
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own equipment' AND tablename = 'user_equipment') THEN
    CREATE POLICY "Users can manage own equipment" ON user_equipment
      FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;
