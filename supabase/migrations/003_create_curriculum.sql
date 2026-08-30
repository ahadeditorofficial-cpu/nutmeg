-- Migration: 003_create_curriculum.sql
-- Creates curriculum tables (milestone, section, phase, day, exercise) and RLS policies

-- Curriculum master (read-only, populated by Phase 2 research)
CREATE TABLE IF NOT EXISTS curriculum_milestone (
  id SERIAL PRIMARY KEY,
  number INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS curriculum_section (
  id SERIAL PRIMARY KEY,
  milestone_id INTEGER REFERENCES curriculum_milestone(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS curriculum_phase (
  id SERIAL PRIMARY KEY,
  section_id INTEGER REFERENCES curriculum_section(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS curriculum_day (
  id SERIAL PRIMARY KEY,
  phase_id INTEGER REFERENCES curriculum_phase(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  position TEXT CHECK (position IN ('striker', 'midfielder', 'defender', 'goalkeeper')),
  skill_level TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  title TEXT NOT NULL,
  description TEXT,
  estimated_duration_minutes INTEGER,
  theme TEXT,
  UNIQUE(day_number, position, skill_level)
);

CREATE TABLE IF NOT EXISTS curriculum_exercise (
  id SERIAL PRIMARY KEY,
  day_id INTEGER REFERENCES curriculum_day(id) ON DELETE CASCADE,
  exercise_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  diagram_url TEXT,
  duration_seconds INTEGER NOT NULL,
  met_value DECIMAL,
  equipment_required TEXT[],
  position_specific BOOLEAN DEFAULT FALSE,
  phase_type TEXT CHECK (phase_type IN ('skill', 'fitness', 'tactics', 'nutrition', 'mental')),
  UNIQUE(day_id, exercise_number)
);

-- Indexes for curriculum
CREATE INDEX IF NOT EXISTS idx_curriculum_section_milestone ON curriculum_section(milestone_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_phase_section ON curriculum_phase(section_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_day_phase ON curriculum_day(phase_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_day_lookup ON curriculum_day(day_number, position, skill_level);
CREATE INDEX IF NOT EXISTS idx_curriculum_exercise_day ON curriculum_exercise(day_id);

-- Enable RLS on all curriculum tables (read-only for users)
ALTER TABLE curriculum_milestone ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_phase ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_day ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_exercise ENABLE ROW LEVEL SECURITY;

-- RLS Policies for curriculum (all authenticated users can read)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can view curriculum milestones' AND tablename = 'curriculum_milestone') THEN
    CREATE POLICY "Authenticated users can view curriculum milestones" ON curriculum_milestone
      FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can view curriculum sections' AND tablename = 'curriculum_section') THEN
    CREATE POLICY "Authenticated users can view curriculum sections" ON curriculum_section
      FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can view curriculum phases' AND tablename = 'curriculum_phase') THEN
    CREATE POLICY "Authenticated users can view curriculum phases" ON curriculum_phase
      FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can view curriculum days' AND tablename = 'curriculum_day') THEN
    CREATE POLICY "Authenticated users can view curriculum days" ON curriculum_day
      FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can view curriculum exercises' AND tablename = 'curriculum_exercise') THEN
    CREATE POLICY "Authenticated users can view curriculum exercises" ON curriculum_exercise
      FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
END $$;
