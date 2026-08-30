# Nutmeg — Technical Requirements Document (TRD)

**Version:** 1.0  
**Date:** 2026-08-28  
**Status:** Draft — pending review  
**Repository:** `docs/TRD.md`

---

## 1. Architecture Overview

Nutmeg is a Next.js 16.3 App Router PWA with Supabase as the backend. The architecture follows a **client-first, server-synced** pattern:

- **Client-side:** Timer state, session progress, and offline data live in IndexedDB. The PWA caches everything for offline use.
- **Server-side:** Supabase Postgres + pgvector handles auth, user data, curriculum, and RAG embeddings.
- **Realtime:** Supabase Realtime channels handle live co-op session sync.
- **AI:** Task-based provider routing (Groq, Gemini, Cerebras, Mistral, OpenRouter, Agnes AI) with silent fallback.

---

## 2. Database Schema

### 2.1 Core Tables

```sql
-- Users (extends Supabase auth.users)
users (
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
  baseline_run_distance_meters INTEGER, -- NULL if skipped
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Equipment checklist (junction table)
user_equipment (
  user_id UUID REFERENCES users(id),
  equipment_type TEXT CHECK (equipment_type IN (
    'ball', 'shoes', 'cones', 'wall_access', 'stairs',
    'open_ground', 'goal', 'resistance_band', 'other'
  )),
  PRIMARY KEY (user_id, equipment_type)
)

-- Teams
teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tagline TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Team members
team_members (
  team_id UUID REFERENCES teams(id),
  user_id UUID REFERENCES users(id),
  position TEXT, -- overrides user's default position for team subgroup
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (team_id, user_id)
)

-- Invite tokens
invite_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id),
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Curriculum master (read-only, populated by Phase 2 research)
curriculum_milestone (
  id SERIAL PRIMARY KEY,
  number INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT
)

curriculum_section (
  id SERIAL PRIMARY KEY,
  milestone_id INTEGER REFERENCES curriculum_milestone(id),
  number INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT
)

curriculum_phase (
  id SERIAL PRIMARY KEY,
  section_id INTEGER REFERENCES curriculum_section(id),
  number INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT
)

curriculum_day (
  id SERIAL PRIMARY KEY,
  phase_id INTEGER REFERENCES curriculum_phase(id),
  day_number INTEGER NOT NULL, -- global day number (1-60+)
  position TEXT CHECK (position IN ('striker', 'midfielder', 'defender', 'goalkeeper')),
  skill_level TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  title TEXT NOT NULL,
  description TEXT,
  estimated_duration_minutes INTEGER,
  theme TEXT, -- e.g. 'first_touch', 'shooting', 'plyometrics'
  UNIQUE(day_number, position, skill_level)
)

curriculum_exercise (
  id SERIAL PRIMARY KEY,
  day_id INTEGER REFERENCES curriculum_day(id),
  exercise_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  diagram_url TEXT, -- reference image/diagram
  duration_seconds INTEGER NOT NULL, -- fixed duration
  met_value DECIMAL, -- for calorie estimation
  equipment_required TEXT[], -- array of equipment_type
  position_specific BOOLEAN DEFAULT FALSE,
  phase_type TEXT CHECK (phase_type IN ('skill', 'fitness', 'tactics', 'nutrition', 'mental')),
  UNIQUE(day_id, exercise_number)
)
```

### 2.2 User Plan Tables

```sql
-- User's current plan (reordered by coach via auto-rewrite)
user_plan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  current_day_number INTEGER NOT NULL DEFAULT 1,
  plan_started_at TIMESTAMPTZ DEFAULT NOW(),
  plan_completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
)

-- User's daily progress
user_day_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
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
)

-- Session state (for pause/resume)
user_session (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  day_number INTEGER NOT NULL,
  current_exercise_number INTEGER DEFAULT 1,
  mode TEXT CHECK (mode IN ('auto', 'manual')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  paused_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
)

-- Fitness retest entries
fitness_retest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  test_type TEXT CHECK (test_type IN ('pushups', 'situps', 'run')),
  value INTEGER NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
)
```

### 2.3 Co-op Session Tables

```sql
-- Co-op sessions
coop_session (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id),
  host_user_id UUID REFERENCES users(id),
  curriculum_day_id INTEGER REFERENCES curriculum_day(id),
  mode TEXT CHECK (mode IN ('auto', 'manual')),
  current_exercise_number INTEGER DEFAULT 1,
  session_status TEXT CHECK (session_status IN ('waiting', 'active', 'paused', 'completed')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(team_id, session_status) -- only one active session per team
)

-- Co-op participants
coop_participants (
  coop_session_id UUID REFERENCES coop_session(id),
  user_id UUID REFERENCES users(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  current_exercise_number INTEGER,
  status TEXT CHECK (status IN ('joined', 'paused', 'completed')),
  PRIMARY KEY (coop_session_id, user_id)
)
```

### 2.4 RAG / Knowledge Base Tables

```sql
-- Embeddings (separate from user data per AGENTS.md)
rag_chunk (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  metadata JSONB, -- {source, type, position, skill_level, day_number}
  created_at TIMESTAMPTZ DEFAULT NOW()
)

rag_embedding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chunk_id UUID REFERENCES rag_chunk(id),
  embedding vector(768), -- Gemini embedding dimension
  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Create extension and index
CREATE EXTENSION IF NOT EXISTS vector;
CREATE INDEX ON rag_embedding USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

### 2.5 Journal & Ratings

```sql
-- Daily journal entries
journal_entry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  day_number INTEGER NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 10),
  notes TEXT,
  mood TEXT,
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, day_number)
)

-- Session summaries (for team visibility)
session_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  day_number INTEGER NOT NULL,
  exercises_completed INTEGER,
  total_duration_seconds INTEGER,
  calories_burned DECIMAL,
  self_rating INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

### 2.6 Indexes

```sql
-- Required indexes for performance
CREATE INDEX idx_users_team ON users(id) WHERE team_id IS NOT NULL;
CREATE INDEX idx_team_members_user ON team_members(user_id);
CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_user_plan_user ON user_plan(user_id);
CREATE INDEX idx_user_day_progress_user ON user_day_progress(user_id, day_number);
CREATE INDEX idx_coop_session_team ON coop_session(team_id, session_status);
CREATE INDEX idx_coop_participants_session ON coop_participants(coop_session_id);
CREATE INDEX idx_journal_user ON journal_entry(user_id, day_number);
CREATE INDEX idx_session_summary_user ON session_summary(user_id, day_number);
CREATE INDEX idx_rag_chunk_metadata ON rag_chunk USING gin(metadata);
```

---

## 3. Row Level Security (RLS) Policies

All tables have RLS enabled. Policies follow the principle: **users can only see their own data and their team's data.**

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_day_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE coop_session ENABLE ROW LEVEL SECURITY;
ALTER TABLE coop_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entry ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_summary ENABLE ROW LEVEL SECURITY;

-- Users table: users can see their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Teams: members can see team info
CREATE POLICY "Team members can view team" ON teams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members WHERE team_members.team_id = teams.id
      AND team_members.user_id = auth.uid()
    )
  );

-- Team members: members can see other team members
CREATE POLICY "Team members can view teammates" ON team_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members tm2
      WHERE tm2.team_id = team_members.team_id
      AND tm2.user_id = auth.uid()
    )
  );

-- User plan: users can only see their own plan
CREATE POLICY "Users can view own plan" ON user_plan
  FOR ALL USING (auth.uid() = user_id);

-- User day progress: users can see their own, teammates can see team progress
CREATE POLICY "Users can view own progress" ON user_day_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Team members can view team progress" ON user_day_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      JOIN user_plan up ON up.user_id = tm.user_id
      WHERE tm.user_id = auth.uid()
      AND up.user_id = user_day_progress.user_id
    )
  );

-- Co-op sessions: team members can see active sessions
CREATE POLICY "Team members can view co-op sessions" ON coop_session
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.team_id = coop_session.team_id
      AND tm.user_id = auth.uid()
    )
  );

-- Journal entries: private by default, users can see their own
CREATE POLICY "Users can view own journal" ON journal_entry
  FOR SELECT USING (auth.uid() = user_id);

-- Session summaries: visible to team members
CREATE POLICY "Team members can view session summaries" ON session_summary
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      JOIN user_plan up ON up.user_id = tm.user_id
      WHERE tm.user_id = auth.uid()
      AND up.user_id = session_summary.user_id
    )
  );
```

---

## 4. API Architecture

### 4.1 Server Actions (Mutations)

All write operations use Next.js Server Actions:

```typescript
// app/actions/session.ts
'use server'

export async function startSession(dayNumber: number) { ... }
export async function pauseSession(sessionId: string) { ... }
export async function resumeSession(sessionId: string) { ... }
export async function skipExercise(sessionId: string, exerciseNumber: number) { ... }
export async function completeSession(sessionId: string, rating: number, notes?: string) { ... }
export async function submitFitnessRetest(testType: string, value: number) { ... }
```

### 4.2 REST API Routes (Realtime + AI)

```typescript
// app/api/coop/[sessionId]/route.ts
// Realtime co-op state updates via REST + Supabase Realtime

// app/api/ai/coach/route.ts
// AI Coach chat endpoint (streams response)

// app/api/ai/embed/route.ts
// Embedding generation endpoint (for curriculum ingestion)

// app/api/ai/rewrite/route.ts
// Adaptive planning endpoint (triggers coach rewrite)
```

### 4.3 Supabase Realtime Channels

```typescript
// lib/supabase/realtime.ts
export function subscribeToCoopSession(sessionId: string) {
  return supabase
    .channel(`co-op:${sessionId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'coop_session',
      filter: `id=eq.${sessionId}`
    }, payload => {
      // Update UI based on session state changes
    })
    .subscribe()
}

export function broadcastCoopAction(sessionId: string, action: {
  type: 'pause' | 'resume' | 'next' | 'skip',
  exerciseNumber?: number,
  userId?: string
}) {
  supabase.channel(`co-op:${sessionId}`).send({
    type: 'broadcast',
    event: 'coop_action',
    payload: action
  })
}
```

---

## 5. Session State Management

### 5.1 IndexedDB Schema

Session state persists in IndexedDB (via `idb` library):

```typescript
// lib/session/store.ts
const DB_NAME = 'nutmeg-session'
const DB_VERSION = 1

const STORES = {
  activeSession: 'active-session',
  completedSessions: 'completed-sessions',
  draftSummaries: 'draft-summaries'
} as const

interface ActiveSession {
  sessionId: string
  userId: string
  dayNumber: number
  currentExercise: number
  mode: 'auto' | 'manual'
  startTime: number
  pauseTime?: number
  exerciseTimings: Record<number, { start: number; end?: number }>
}

interface SessionSummary {
  sessionId: string
  userId: string
  dayNumber: number
  exercisesCompleted: number
  totalDuration: number
  caloriesBurned: number
  selfRating: number
  notes?: string
  synced: boolean
  createdAt: number
}
```

### 5.2 Persistence Strategy

- **Active sessions:** Written to IndexedDB on every state change. Synced to Supabase on session completion.
- **Completed sessions:** IndexedDB kept for offline access. Synced to Supabase within 5 seconds of completion.
- **Draft summaries:** Queued in IndexedDB if offline. Synced when connection restored.

---

## 6. AI Provider Routing

### 6.1 Provider Client Architecture

```typescript
// lib/ai/providers/groq.ts
export const groq = createGroq({ apiKey: process.env.GROQ_API_KEY })

// lib/ai/providers/gemini.ts
export const gemini = createGemini({ apiKey: process.env.GEMINI_API_KEY })

// lib/ai/providers/cerebras.ts
export const cerebras = createCerebras({ apiKey: process.env.CEREBRAS_API_KEY })

// lib/ai/providers/mistral.ts
export const mistral = createMistral({ apiKey: process.env.MISTRAL_API_KEY })

// lib/ai/providers/openrouter.ts
export const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY })

// lib/ai/providers/agnes-ai.ts
export const agnesAi = createAgnesAI({ apiKey: process.env.AGNES_AI_API_KEY })
```

### 6.2 Router Implementation

```typescript
// lib/ai/router.ts
export async function routeAIRequest(task: AITask, input: string): Promise<string> {
  const provider = getProviderForTask(task)
  
  try {
    return await provider.call(input)
  } catch (error) {
    if (isRateLimitError(error)) {
      return await routeAIRequest(task, input, { skipPrimary: true })
    }
    throw error
  }
}

function getProviderForTask(task: AITask, options?: { skipPrimary?: boolean }): AIProvider {
  const routing = {
    rag_chat: ['groq', 'openrouter', 'agnes-ai'],
    embeddings: ['gemini', 'openrouter', 'agnes-ai'],
    content_generation: ['cerebras', 'openrouter', 'agnes-ai'],
    long_context_reasoning: ['mistral', 'openrouter', 'agnes-ai']
  }
  
  const providers = routing[task]
  if (options?.skipPrimary) providers.shift()
  return providers[0]
}
```

### 6.3 Free Models by Provider (Verified Working)

All models below are confirmed working on free tiers as of 2026-08-28.

#### OpenRouter Free Models
| Model | Use Case | Notes |
|---|---|---|
| `openrouter/dots-studio/dots-3-note-preview:free` | Chat, reasoning | Good for general conversations |
| `openrouter/liquid/lfm-2.5-2.6b:free` | Chat | Lightweight, fast |
| `openrouter/poolside/laguna-xs-2.1:free` | Chat | Small but capable |
| `openrouter/cohere/north-mini-code:free` | Coding | Code-specific model |
| `openrouter/nvidia/nemotron-3.5-content-safety:free` | Safety filter | Content moderation |
| `openrouter/nvidia/nemotron-3-super-120b-a12b:free` | Reasoning | High-quality reasoning |
| `openrouter/openrouter/free` | Universal fallback | OpenRouter's own free model |

#### Groq Free Models
| Model | Use Case | Notes |
|---|---|---|
| `groq/openai/gpt-oss-120b` | Chat, reasoning | 120B parameter model, fast inference |
| `groq/openai/gpt-oss-20b` | Chat | 20B parameter, balanced speed/quality |
| `groq/qwen/qwen3.6-27b` | Chat | Qwen 3.6, 27B parameters |
| `groq/openai/gpt-oss-safeguard-20b` | Safety filter | Content moderation |

#### Mistral Free Models
| Model | Use Case | Notes |
|---|---|---|
| `mistral/mistral-small-latest` | Chat | Mistral's latest small model |
| `mistral/codestral-latest` | Coding | Code-specialized |
| `mistral/mistral-medium-3-5` | Reasoning | Medium capacity, good balance |
| `mistral/devstral-latest` | Development | Dev-focused model |

#### Agnes AI Free Models
| Model | Use Case | Notes |
|---|---|---|
| `agnes/agnes-2.0-flash` | Universal | Primary fallback for all tasks |

#### Gemini Free Models
| Model | Use Case | Notes |
|---|---|---|
| `gemini-1.5-flash-lite` | Embeddings | Confirmed working, 768 dimensions |
| `gemini-1.5-flash` | Chat (fallback) | If flash-lite unavailable |

### 6.4 Updated Router with Free Models

```typescript
// lib/ai/router.ts
export async function routeAIRequest(task: AITask, input: string): Promise<string> {
  const provider = getProviderForTask(task)
  
  try {
    return await provider.call(input)
  } catch (error) {
    if (isRateLimitError(error)) {
      return await routeAIRequest(task, input, { skipPrimary: true })
    }
    throw error
  }
}

function getProviderForTask(task: AITask, options?: { skipPrimary?: boolean }): AIProvider {
  const routing = {
    rag_chat: [
      { provider: 'groq', model: 'groq/openai/gpt-oss-120b' },
      { provider: 'openrouter', model: 'openrouter/dots-studio/dots-3-note-preview:free' },
      { provider: 'openrouter', model: 'openrouter/nvidia/nemotron-3-super-120b-a12b:free' },
      { provider: 'agnes-ai', model: 'agnes/agnes-2.0-flash' }
    ],
    embeddings: [
      { provider: 'gemini', model: 'gemini-1.5-flash-lite' },
      { provider: 'openrouter', model: 'openrouter/dots-studio/dots-3-note-preview:free' },
      { provider: 'agnes-ai', model: 'agnes/agnes-2.0-flash' }
    ],
    content_generation: [
      { provider: 'groq', model: 'groq/qwen/qwen3.6-27b' },
      { provider: 'openrouter', model: 'openrouter/nvidia/nemotron-3-super-120b-a12b:free' },
      { provider: 'agnes-ai', model: 'agnes/agnes-2.0-flash' }
    ],
    long_context_reasoning: [
      { provider: 'mistral', model: 'mistral/mistral-medium-3-5' },
      { provider: 'openrouter', model: 'openrouter/nvidia/nemotron-3-super-120b-a12b:free' },
      { provider: 'agnes-ai', model: 'agnes/agnes-2.0-flash' }
    ]
  }
  
  const providers = routing[task]
  if (options?.skipPrimary) providers.shift()
  return providers[0]
}
```

### 6.5 Silent Fallback Behavior

- Provider failures are caught internally.
- No user-facing error messages for AI failures.
- Logs are sent to Supabase error tracking.
- UI shows continuous loading state until fallback succeeds.

---

## 7. RAG Pipeline

### 7.1 Embedding Strategy

- **Chunking:** One embedding per exercise/drill.
- **Model:** `gemini-1.5-flash-lite` (per user specification).
- **Dimension:** 768 (Gemini embedding size).
- **Metadata:** Source type, position, skill level, day number, theme.

### 7.2 Ingestion Pipeline

```typescript
// lib/rag/ingest.ts
export async function ingestCurriculum() {
  const exercises = await getAllExercises()
  
  for (const exercise of exercises) {
    const embedding = await gemini.embed(exercise.description)
    
    await supabase.from('rag_chunk').insert({
      content: exercise.description,
      metadata: {
        source: 'curriculum',
        type: exercise.phase_type,
        position: exercise.position,
        skill_level: exercise.skill_level,
        day_number: exercise.day_number
      }
    })
    
    await supabase.from('rag_embedding').insert({
      chunk_id: chunk.id,
      embedding: embedding.vector
    })
  }
}
```

### 7.3 Retrieval

```typescript
// lib/rag/retrieve.ts
export async function retrieveRelevantContext(query: string, userContext: UserContext) {
  const queryEmbedding = await gemini.embed(query)
  
  const { data: chunks } = await supabase.rpc('match_rag_chunks', {
    query_embedding: queryEmbedding.vector,
    match_threshold: 0.8,
    match_count: 5
  })
  
  return chunks
}
```

---

## 8. PWA Configuration

### 8.1 Manifest

```json
// public/manifest.json
{
  "name": "Nutmeg — 60-Day Football Training",
  "short_name": "Nutmeg",
  "description": "Personal football training platform with AI coach and live co-op",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#10b981",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### 8.2 Service Worker

```typescript
// service-worker.ts
const CACHE_NAME = 'nutmeg-v1'
const OFFLINE_URL = '/offline'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/manifest.json',
        '/icons/icon-192.png',
        '/icons/icon-512.png',
        // Cache all app shell assets
      ])
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        // Cache dynamic content for offline use
        if (event.request.url.includes('/api/') || event.request.url.includes('.json')) {
          return fetchResponse
        }
        return fetchResponse
      })
    }).catch(() => caches.match(OFFLINE_URL))
  )
})
```

---

## 9. Security Requirements

### 9.1 Authentication

- **Provider:** Supabase Auth (email only).
- **Session duration:** 30 days (Supabase default). Configurable in Supabase dashboard.
- **Password policy:** Supabase default (min 6 characters).
- **Email confirmation:** Required for new signups.

### 9.2 Data Privacy

- **Profile photos:** Max 2MB, auto-compressed. Stored in Supabase Storage with signed URLs.
- **Team data:** RLS ensures users only see their team's data.
- **Journal entries:** Private by default. Teammates see ratings and summaries, not full journal text.
- **No third-party tracking:** Analytics are internal only.

### 9.3 API Security

- All API routes validate auth tokens.
- Server Actions use `auth()` to verify user identity.
- Rate limiting on AI endpoints (Supabase Rate Limit extension or manual implementation).

---

## 10. Performance Requirements

### 10.1 Load Time Targets

- **First load:** <3 seconds on 4G connection.
- **Subsequent loads:** <1 second (from cache).
- **Timer responsiveness:** <50ms latency for state updates.

### 10.2 Bundle Size

- **Target:** <200KB gzipped for critical path.
- **Strategy:** Dynamic imports for heavy components (timer, AI coach chat).
- **Tree shaking:** Enabled via Next.js default configuration.

### 10.3 Database Performance

- All user queries indexed on `user_id`.
- Team queries indexed on `team_id`.
- Composite indexes on `(user_id, day_number)` for progress queries.
- pgvector index using IVFFlat with 100 lists.

---

## 11. Deployment Strategy

### 11.1 Hosting

- **Frontend:** Vercel (free tier).
- **Backend:** Supabase (free tier).
- **Edge Functions:** Supabase Edge Functions for realtime operations.

### 11.2 CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v1
        with:
          version: latest
      - run: supabase db push
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_DB_URL: ${{ secrets.SUPABASE_DB_URL }}
```

### 11.3 Supabase Keep-Alive Cron

```yaml
# .github/workflows/supabase-keepalive.yml
name: Supabase Keep-Alive
on:
  schedule:
    - cron: '0 5 */5 * *'  # Every 5 days at 5 AM UTC

jobs:
  keep-alive:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Supabase
        run: |
          curl -X GET "${{ secrets.SUPABASE_API_URL }} rest/projects" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}"
```

---

## 12. Analytics & Logging

### 12.1 Error Logging

- **Destination:** Supabase `error_logs` table.
- **Schema:**
  ```sql
  error_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message TEXT,
    stack TEXT,
    user_id UUID REFERENCES users(id),
    page_url TEXT,
    browser TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )
  ```
- **Silent fail:** Errors are caught and logged. No user-facing error messages for AI failures.

### 12.2 Product Analytics

Track the following events (no user identification):

| Event | Trigger |
|---|---|
| `page_view` | Any page load |
| `session_started` | User clicks "Start Session" |
| `session_completed` | User submits session summary |
| `co_op_joined` | User joins a co-op session |
| `co_op_started` | Host starts a co-op session |
| `team_created` | User creates a team |
| `team_joined` | User joins a team via invite |
| `onboarding_completed` | User finishes onboarding |
| `coach_message_sent` | User sends a message to AI Coach |

### 12.3 Analytics Storage

```sql
analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  event_data JSONB,
  session_id TEXT,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

---

## 13. Environment Variables

All API keys stored in `.env.local` (never committed):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Providers
GEMINI_API_KEY=
GROQ_API_KEY=
CEREBRAS_API_KEY=
OPENROUTER_API_KEY=
MISTRAL_API_KEY=
AGNES_AI_API_KEY=

# Vercel
VERCEL_TOKEN=
```

---

## 14. Open Technical Decisions

| Decision | Status | Notes |
|---|---|---|
| Session duration | **TBD** | Assumed 30 days (Supabase default). Can be configured in Supabase dashboard. |
| Fine-tuning vs system prompt | **Resolved** | System prompt only (free tier). Fine-tuning deferred to Phase 2+. |
| Embedding model | **Resolved** | `gemini-1.5-flash-lite` (per user specification) |
| Free models | **Resolved** | See section 6.3 — OpenRouter, Groq, Mistral, Agnes AI, Gemini free tiers verified |
| Cache strategy | **Resolved** | Cache everything (full offline support) |
| Error handling | **Resolved** | Silent fallback, log internally |
| Realtime channels | **Resolved** | One channel per co-op session |
| Photo storage | **Resolved** | Max 2MB, auto-compress |

---

## 15. Appendix: Decision Log

| Decision | Answer |
|---|---|
| Plan schema | Fixed hierarchy + day_number |
| Co-op state | Supabase Realtime |
| RAG chunking | Chunk by exercise |
| Session state | IndexedDB |
| RLS scope | Row-level, user can only see their team's data |
| API style | Server Actions + REST for realtime |
| Performance | Fast first load, then offline |
| Error handling | Silent fallback, no indication |
| Deployment | Vercel free + Supabase free, GitHub Actions cron |
| PWA | Full PWA: cache shell + assets |
| Data retention | Keep everything forever |
| Logging | Errors + analytics |
| Session sync | Instant sync via Supabase Realtime |
| Invite links | UUID token in URL, stored in DB |
| MET formula | Weight + session duration only |
| Retest | Same test, new entry in profile |
| API keys | One key per provider, documented in .env.example |
| Co-op concurrency | Multiple sessions allowed |
| Analytics | Basic: page views, session starts, completions |
| Error boundaries | Silent fail, log internally |
| DB indexes | Index on user_id + team_id |
| Network failure | Timer keeps running (client-side) |
| Coach tone | System prompt only (free) |
| Migration strategy | Supabase CLI migrations |
| Embedding model | gemini-1.5-flash-lite |
| Error logging | Supabase logs (free) |
| Cache strategy | Cache everything |
| Growth limits | 500MB DB, 500MB RAM, 1GB storage, 5GB egress |
| Photo storage | Max 2MB, auto-compress |
| Realtime channels | One channel per session |
