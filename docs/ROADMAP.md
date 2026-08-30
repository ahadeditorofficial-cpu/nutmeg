# Nutmeg — Build Roadmap

**Version:** 1.1  
**Date:** 2026-08-28  
**Status:** Active  
**Repository:** `docs/ROADMAP.md`

---

## How to Execute

**Trigger phrase:** Say `"execute ROADMAP.md"` or `"execute milestone N"`.

**Agent behavior when triggered:**
1. Read ALL docs: `docs/PRD.md`, `docs/TRD.md`, `docs/design-system.md`, `docs/ROADMAP.md`, `AGENTS.md`
2. Check git status to find the current milestone (first incomplete one)
3. Break the milestone into atomic tasks
4. Dispatch parallel agents for independent tasks
5. Agents with dependencies wait for upstream outputs
6. **Stop after the milestone is complete** — do NOT proceed to the next milestone until told

**Milestone tracking:** Each milestone has a `COMPLETED` marker. Agents must update this after finishing.

---

## Current State

Fresh Next.js 16.3 skeleton. Zero custom code. No Supabase, no auth, no components, no PWA. All 8 milestones plus infra must be built from scratch.

---

## Pre-Flight: Environment Setup (DO THIS BEFORE "execute")

**Read `.env.local` and fill in all values before running any milestone.**

### Required API Keys (Free Tiers Only — No Credit Card)

| Key | Service | Free Tier | How to Get |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Database + Auth + Storage | 500MB DB, 500MB RAM, 1GB storage, unlimited API | [supabase.com](https://supabase.com/dashboard) → New Project → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same as above | — | Same page as URL above |
| `SUPABASE_SERVICE_ROLE_KEY` | Same as above (server-side) | — | Same page, "service_role" key |
| `GEMINI_API_KEY` | Embeddings (gemini-1.5-flash-lite) | 15 RPM, 1M tokens/min | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) |
| `GROQ_API_KEY` | RAG chat (gpt-oss-120b, qwen-27b) | 5,000 RPM free | [console.groq.com/keys](https://console.groq.com/keys) |
| `CEREBRAS_API_KEY` | Content generation | 250K tokens/day free | [cloud.cerebras.ai](https://cloud.cerebras.ai/) → API Keys |
| `MISTRAL_API_KEY` | Long-context reasoning | 250K tokens/month free | [console.mistral.ai/api-keys](https://console.mistral.ai/api-keys) |
| `OPENROUTER_API_KEY` | Universal fallback | $5 free credit (enough for personal use) | [openrouter.ai/keys](https://openrouter.ai/keys) |
| `AGNES_AI_API_KEY` | Final fallback | Free omni-modal gateway | [agnes-ai.com](https://agnes-ai.com) → Sign up → API Keys |
| `FIRECRAWL_API_KEY` | Web scraping (curriculum research) | 500 credits/month free | [firecrawl.dev/app/api-keys](https://www.firecrawl.dev/app/api-keys) |
| `EXA_API_KEY` | Semantic search (curriculum) | 1,000 queries/month free | [dashboard.exa.ai](https://dashboard.exa.ai/) → API Keys |
| `TAVILY_API_KEY` | Multi-step research with citations | 1,000 requests/month free | [tavily.com/dashboard](https://tavily.com/dashboard) |
| `YOUTUBE_DATA_API_KEY` | Optional (video references in research) | 10,000 quota units/day free | [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials) |
| `VERCEL_TOKEN` | GitHub Actions deployment | Free | [vercel.com/account/tokens](https://vercel.com/account/tokens) → Create Token |
| `GITHUB_TOKEN` | GitHub Actions (push migrations, keep-alive) | Free | [github.com/settings/tokens](https://github.com/settings/tokens) → Classic → `repo` scope |

### MCP Servers (Already Configured in `.mcp.json`)

| Server | Command | Status | Needs Key? |
|---|---|---|---|
| `firecrawl` | `firecrawl-mcp` (v3.24.0) | ✅ Installed globally | Yes → `FIRECRAWL_API_KEY` |
| `tavily` | `tavily-mcp` (v0.2.22) | ✅ Installed globally | Yes → `TAVILY_API_KEY` |
| `exa` | `exa-mcp-server` (v3.4.1) | ✅ Installed globally | Yes → `EXA_API_KEY` |

**To verify MCP servers are working after filling `.env.local`:**
```bash
# In a new Claude Code session, these should appear as available tools:
# firecrawl_scrape, firecrawl_crawl (Firecrawl)
# tavily_search, tavily_extract (Tavily)
# exa_search, exa_get_text (Exa)
```

### Supabase Project Setup (One-Time)

After filling `.env.local` with Supabase keys, run these migrations **once** against your Supabase project:
```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project (run in project root)
supabase link --project-ref <your-project-ref>

# Apply all migrations
supabase db push
```
Or run manually via Supabase Dashboard → SQL Editor — each migration file is in `supabase/migrations/`.

**Also enable pgvector extension in Supabase Dashboard:**
SQL Editor → Run:
```sql=
CREATE EXTENSION IF NOT EXISTS vector;
```

### What NOT to Fill (Leave Empty for Now)

- `YOUTUBE_DATA_API_KEY` — optional, only needed if you want video references in research
- `VERCEL_TOKEN` — can fill after M0 is complete (needed for M8 deployment)
- `GITHUB_TOKEN` — can fill after M0 is complete (needed for M8 GitHub Actions)

### Quick Checklist Before "execute"

- [ ] All15 keys filled in `.env.local` (or at minimum: Supabase ×3, Gemini, Groq, OpenRouter, Firecrawl, Exa, Tavily)
- [ ] `supabase db push` run against your project
- [ ] pgvector extension enabled
- [ ] MCP servers showing as available in Claude Code (new session)

---

## Milestone 0 — Foundation & Infrastructure

**Goal:** Project scaffolding, auth, onboarding, AI routing, database, PWA shell.  
**Phase:** Pre-curriculum (Phase1 from blueprint).  
**Prerequisite for:** All other milestones.  
**COMPLETED:** ✅ DONE

---

### Task Group A — Project Setup (Parallel: All Independent)

| Task ID | Description | Output Files | Depends On |
|---|---|---|---|
| 0.A.1 | Install dependencies: supabase, @supabase/ssr, framer-motion, lucide-react, next-pwa, idb, tailwindcss v4 | `package.json`, `package-lock.json` | — |
| 0.A.2 | Configure Tailwind CSS with design-system tokens | `tailwind.config.ts` | — |
| 0.A.3 | Set up `src/lib/supabase/` (client + server instances) | `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/middleware.ts` | 0.A.1 |
| 0.A.4 | Set up `src/lib/ai/` provider clients + router | `src/lib/ai/providers/groq.ts`, `src/lib/ai/providers/gemini.ts`, `src/lib/ai/providers/cerebras.ts`, `src/lib/ai/providers/mistral.ts`, `src/lib/ai/providers/openrouter.ts`, `src/lib/ai/providers/agnes-ai.ts`, `src/lib/ai/router.ts`, `src/lib/ai/types.ts` | 0.A.1 |
| 0.A.5 | Create PWA assets: manifest, icons, service worker | `public/manifest.json`, `public/icons/icon-192.png`, `public/icons/icon-512.png`, `public/service-worker.ts`, `public/offline.html` | 0.A.1 |
| 0.A.6 | Configure `next.config.ts` for PWA (next-pwa) | `next.config.ts` | 0.A.1, 0.A.5 |
| 0.A.7 | Set up GitHub Actions: deploy workflow + Supabase keep-alive cron | `.github/workflows/deploy.yml`, `.github/workflows/supabase-keepalive.yml` | — |
| 0.A.8 | Update `src/app/layout.tsx` with Inter font + design tokens | `src/app/layout.tsx`, `src/app/globals.css` | 0.A.2 |

### Task Group B — Database Schema & Migrations (Parallel: Migrations Independent)

| Task ID | Description | Output Files | Depends On |
|---|---|---|---|
| 0.B.1 | Create `supabase/migrations/` directory structure | `supabase/migrations/001_*.sql` through `008_*.sql` | — |
| 0.B.2 | Migration 001: users profile table + RLS | `supabase/migrations/001_create_users.sql` | — |
| 0.B.3 | Migration 002: teams, team_members, invite_tokens + RLS | `supabase/migrations/002_create_teams.sql` | — |
| 0.B.4 | Migration 003: curriculum master tables + RLS | `supabase/migrations/003_create_curriculum.sql` | — |
| 0.B.5 | Migration 004: user_plan, user_day_progress, user_session + RLS | `supabase/migrations/004_create_user_plan.sql` | — |
| 0.B.6 | Migration 005: coop_session, coop_participants + Realtime + RLS | `supabase/migrations/005_create_coop.sql` | — |
| 0.B.7 | Migration 006: rag_chunk, rag_embedding (pgvector) + IVFFlat index + RLS | `supabase/migrations/006_create_rag.sql` | — |
| 0.B.8 | Migration 007: journal_entry, session_summary, fitness_retest + RLS | `supabase/migrations/007_create_journal.sql` | — |
| 0.B.9 | Migration 008: error_logs, analytics_events + RLS | `supabase/migrations/008_create_analytics.sql` | — |
| 0.B.10 | Create `supabase/functions/` for Edge Functions | `supabase/functions/ingest-rag/index.ts`, `supabase/functions/rewrite-plan/index.ts` | 0.B.3, 0.B.4 |

### Task Group C — Authentication (Parallel: Pages + Guards)

| Task ID | Description | Output Files | Depends On |
|---|---|---|---|
| 0.C.1 | Auth provider setup + middleware | `src/middleware.ts`, `src/lib/supabase/middleware.ts` | 0.A.3 |
| 0.C.2 | Sign in page | `src/app/auth/signin/page.tsx` | 0.C.1 |
| 0.C.3 | Sign up page | `src/app/auth/signup/page.tsx` | 0.C.1 |
| 0.C.4 | Auth callbacks (on create user → insert into profiles) | `src/app/api/auth/callback/route.ts` | 0.C.1, 0.B.2 |
| 0.C.5 | Profile photo upload component + signed URL helper | `src/components/ProfilePhoto.tsx`, `src/lib/supabase/storage.ts` | 0.C.1 |
| 0.C.6 | Auth context/provider for client-side auth state | `src/contexts/AuthContext.tsx` | 0.C.1 |

### Task Group D — Design System Components (Parallel: Components Independent)

| Task ID | Description | Output Files | Depends On |
|---|---|---|---|
| 0.D.1 | globals.css with all CSS custom properties (colors, spacing, radius, shadows, glassmorphism) | `src/app/globals.css` | — |
| 0.D.2 | GlassCard component | `src/components/GlassCard.tsx` | 0.D.1 |
| 0.D.3 | LuxuryButton component | `src/components/LuxuryButton.tsx` | 0.D.1 |
| 0.D.4 | ProgressRing component (circular, gradient) | `src/components/ProgressRing.tsx` | 0.D.1 |
| 0.D.5 | Skeleton loading component | `src/components/Skeleton.tsx` | 0.D.1 |
| 0.D.6 | EmptyState component | `src/components/EmptyState.tsx` | 0.D.1 |
| 0.D.7 | Animation tokens (Framer Motion) | `src/lib/animations/tokens.ts` | — |
| 0.D.8 | Tailwind config with design-system extension | `tailwind.config.ts` | 0.D.1 |

### Task Group E — Onboarding Flow (Parallel: Pages by Step)

| Task ID | Description | Output Files | Depends On |
|---|---|---|---|
| 0.E.1 | Onboarding layout + progress stepper | `src/app/onboarding/layout.tsx`, `src/components/OnboardingStepper.tsx` | 0.C.6, 0.D.1 |
| 0.E.2 | Page 1: Basic info (name, age slider, height/weight) | `src/app/onboarding/page.tsx` (Page 1) | 0.E.1 |
| 0.E.3 | Page 2: Fitness profile (skill level, position, dominant foot) | `src/app/onboarding/page.tsx` (Page 2) | 0.E.1 |
| 0.E.4 | Page 3: Baseline fitness test (push-ups, sit-ups, run) | `src/app/onboarding/page.tsx` (Page 3) | 0.E.1 |
| 0.E.5 | Page 4: Preferences (time slider, equipment toggles, team decision) | `src/app/onboarding/page.tsx` (Page 4) | 0.E.1 |
| 0.E.6 | Onboarding completion handler (creates user_plan) | `src/app/onboarding/actions.ts` | 0.E.2, 0.E.3, 0.E.4, 0.E.5, 0.B.4 |
| 0.E.7 | Redirect logic: post-onboarding → /dashboard | (in 0.E.6) | — |

---

## Milestone 1 — Dashboard & Daily Task View

**Goal:** User lands on dashboard, sees today's session, streak, progress, upcoming days.  
**Prerequisite for:** Milestone 2 (timer), Milestone 4 (teams).  
**COMPLETED:** ✅ DONE

---

### Task Group A — Dashboard (Parallel: Components)

| Task ID | Description | Output Files | Depends On |
|---|---|---|---|
| 1.A.1 | Dashboard layout + data fetching | `src/app/dashboard/page.tsx` | 0.C.6, 0.B.4, 0.B.5 |
| 1.A.2 | Today's session card component | `src/components/TodaySessionCard.tsx` | 0.D.2, 0.D.4 |
| 1.A.3 | Streak counter component | `src/components/StreakCounter.tsx` | 0.D.2 |
| 1.A.4 | Progress ring (dashboard size) | `src/components/ProgressRing.tsx` | 0.D.4 |
| 1.A.5 | Upcoming days list component | `src/components/UpcomingDays.tsx` | 0.D.2 |
| 1.A.6 | AI Coach floating bubble | `src/components/AICoachBubble.tsx` | 0.D.2 |
| 1.A.7 | Team quick-action button | `src/components/TeamQuickAction.tsx` | 0.D.3 |
| 1.A.8 | Dashboard data hooks (useDashboardData) | `src/lib/hooks/useDashboardData.ts` | 0.B.4, 0.B.5 |

### Task Group B — Day Detail View (Parallel: Pages)

| Task ID | Description | Output Files | Depends On |
|---|---|---|---|
| 1.B.1 | Day detail page | `src/app/dashboard/day/[dayNumber]/page.tsx` | 1.A.8 |
| 1.B.2 | Exercise list component | `src/components/ExerciseList.tsx` | 0.D.2 |
| 1.B.3 | Exercise card component | `src/components/ExerciseCard.tsx` | 0.D.2 |
| 1.B.4 | Phase type badge component | `src/components/PhaseBadge.tsx` | 0.D.2 |
| 1.B.5 | Resume session button logic | (in 1.B.1) | 0.B.5 |
| 1.B.6 | Self-rating input component | `src/components/SelfRatingInput.tsx` | 0.D.2, 0.D.3 |

### Task Group C — Navigation (Parallel: Pages)

| Task ID | Description | Output Files | Depends On |
|---|---|---|---|
| 1.C.1 | Milestone list page | `src/app/milestones/page.tsx` | 1.A.8 |
| 1.C.2 | Milestone/section drill-down | `src/app/milestones/[milestoneId]/page.tsx` | 1.C.1 |
| 1.C.3 | Calendar view page | `src/app/calendar/page.tsx` | 1.A.8 |
| 1.C.4 | Navigation header component | `src/components/NavHeader.tsx` | 0.D.2, 0.D.3 |

---

## Milestone 2 — Guided Workout Timer Engine

**Goal:** Core interactive training loop — auto/manual modes, full-screen timer, TTS, pause/resume, session summary.  
**Prerequisite for:** Milestone 3 (RAG), Milestone 4 (co-op), Milestone 6 (gamification).  
**COMPLETED:** ❌ PENDING

---

### Task Group A — Timer Core (Parallel: Components)

| Task ID | Description | Output Files | Depends On |
|---|---|---|---|
| 2.A.1 | Timer screen page | `src/app/session/[sessionId]/page.tsx` | 1.B.1 |
| 2.A.2 | Timer display component (numeric + ring) | `src/components/TimerDisplay.tsx` | 0.D.4 |
| 2.A.3 | Exercise background component (full-screen image) | `src/components/ExerciseBackground.tsx` | 0.D.1 |
| 2.A.4 | TTS voice cues hook (SpeechSynthesis) | `src/lib/hooks/useTTSCues.ts` | — |
| 2.A.5 | Timer control buttons (skip, pause, next) | `src/components/TimerControls.tsx` | 0.D.3 |
| 2.A.6 | Dual progress ring (exercise + rest) | `src/components/DualProgressRing.tsx` | 0.D.4 |

### Task Group B — Session State (Parallel: Store + Hooks)

| Task ID | Description | Output Files | Depends On |
|---|---|---|---|
| 2.B.1 | IndexedDB session store | `src/lib/session/store.ts` | — |
| 2.B.2 | Session state hook | `src/lib/hooks/useSessionState.ts` | 2.B.1 |
| 2.B.3 | Session persistence (auto-save, resume) | (in 2.B.2) | 2.B.1 |
| 2.B.4 | Session sync to Supabase | `src/lib/session/sync.ts` | 0.B.5 |
| 2.B.5 | Offline support layer | `src/lib/session/offline.ts` | 2.B.1 |

### Task Group C — Session Modes (Parallel: Logic)

| Task ID | Description | Output Files | Depends On |
|---|---|---|---|
| 2.C.1 | Auto-guided mode logic | `src/lib/session/autoMode.ts` | 2.B.2 |
| 2.C.2 | Manual mode logic | `src/lib/session/manualMode.ts` | 2.B.2 |
| 2.C.3 | Duration scaling calculator | `src/lib/curriculum/scale.ts` | 0.B.4 |

### Task Group D — Session Summary (Parallel: Page + Logic)

| Task ID | Description | Output Files | Depends On |
|---|---|---|---|
| 2.D.1 | Session summary page | `src/app/session/[sessionId]/summary/page.tsx` | 2.A.1 |
| 2.D.2 | Calorie estimation (MET formula) | `src/lib/session/calories.ts` | — |
| 2.D.3 | Summary data submission (Server Action) | `src/app/session/[sessionId]/summary/actions.ts` | 0.B.5, 0.B.7 |
| 2.D.4 | Streak update logic | `src/lib/session/streak.ts` | 0.B.5 |

---

## Milestone 3 — AI Coach (RAG Chat)

**Goal:** Floating chat bubble + full AI Coach page, RAG knowledge base, adaptive planning.  
**Prerequisite for:** Milestone 4 (co-op), Milestone 6 (gamification).  
**COMPLETED:** ❌ PENDING

---

### Task Group A — RAG Pipeline (Parallel: Components)

| Task ID | Description | Output Files | Depends On |
|---|---|---|---|
| 3.A.1 | RAG ingestion pipeline | `src/lib/rag/ingest.ts` | 0.B.6, 0.A.4 |
| 3.A.2 | Embedding generation helper | `src/lib/rag/embed.ts` | 0.A.4 |
| 3.A.3 | Vector search helper | `src/lib/rag/search.ts` | 0.B.6 |
| 3.A.4 | Admin ingest endpoint | `src/app/api/admin/ingest/route.ts` | 3.A.1 |

### Task Group B — Chat UI (Parallel: Components)

| Task ID | Description | Output Files | Depends On |
|---|---|---|---|
| 3.B.1 | AI Coach floating bubble | `src/components/AICoachBubble.tsx` | 0.D.2 |
| 3.B.2 | Chat slide-over panel | `src/components/ChatPanel.tsx` | 0.D.1, 0.D.2 |
| 3.B.3 | Chat message bubble component | `src/components/ChatMessage.tsx` | 0.D.2 |
| 3.B.4 | Typing indicator component | `src/components/TypingIndicator.tsx` | 0.D.7 |
| 3.B.5 | Full coach page | `src/app/coach/page.tsx` | 3.B.2 |
| 3.B.6 | Chat history persistence | `src/lib/rag/chatHistory.ts` | 0.B.6 |

### Task Group C — AI Logic (Parallel: API Routes)

| Task ID | Description | Output Files | Depends On |
|---|---|---|---|
| 3.C.1 | Coach chat API (streaming) | `src/app/api/ai/coach/route.ts` | 0.A.4, 3.A.3 |
| 3.C.2 | Adaptive planning trigger | `src/lib/ai/adaptivePlanning.ts` | 0.A.4, 0.B.5 |
| 3.C.3 | Plan rewrite API | `src/app/api/ai/rewrite/route.ts` | 0.A.4, 0.B.4 |
| 3.C.4 | System prompt builder (Ronaldo-discipline tone) | `src/lib/ai/prompts.ts` | — |

---

## Milestone 4 — Teams & Live Co-Op

**Goal:** Create/join teams, team dashboard, live co-op sessions with shared timer.  
**Prerequisite for:** Milestone 6 (gamification), Milestone 7 (polish).  
**COMPLETED:** ❌ PENDING

---

### Task Group A — Team Management (Parallel: Pages + Logic)

| Task ID | Description | Output Files | Depends On |
|---|---|---|---|
| 4.A.1 | Create team page | `src/app/team/create/page.tsx` | 0.C.6, 0.B.3 |
| 4.A.2 | Join team via token | `src/app/join/page.tsx` | 0.B.3 |
| 4.A.3 | Team settings page | `src/app/team/[teamId]/settings/page.tsx` | 4.A.1 |
| 4.A.4 | Invite token generation logic | `src/lib/teams/invites.ts` | 0.B.3 |
| 4.A.5 | Team membership enforcement (one team) | `src/lib/teams/membership.ts` | 0.B.3 |

### Task Group B — Team Dashboard (Parallel: Components)

| Task ID | Description | Output Files | Depends On |
|---|---|---|---|
| 4.B.1 | Team dashboard page | `src/app/team/[teamId]/page.tsx` | 4.A.1, 0.B.3 |
| 4.B.2 | Team member card component | `src/components/TeamMemberCard.tsx` | 0.D.2, 0.D.4 |
| 4.B.3 | Position subgroup filter | `src/components/PositionFilter.tsx` | 0.D.3 |
| 4.B.4 | Team collective stats | `src/components/TeamStats.tsx` | 0.B.3 |

### Task Group C — Live Co-Op (Parallel: Core + Realtime)

| Task ID | Description | Output Files | Depends On |
|---|---|---|---|
| 4.C.1 | Co-op session create page | `src/app/coop/create/page.tsx` | 4.B.1 |
| 4.C.2 | Co-op session page | `src/app/coop/[sessionId]/page.tsx` | 2.A.1, 4.C.1 |
| 4.C.3 | Realtime channel setup | `src/lib/realtime/coop.ts` | 0.B.5 |
| 4.C.4 | Co-op session state management | `src/lib/coop/state.ts` | 4.C.3 |
| 4.C.5 | Participant presence tracking | `src/lib/coop/presence.ts` | 4.C.3 |
| 4.C.6 | Co-op broadcast actions (pause/skip/next) | `src/lib/coop/actions.ts` | 4.C.3 |

---

## Milestone 5 — Curriculum Engine (Phase 2 Research)

**Goal:** Populate database with researched 60-day football curriculum.  
**Prerequisite for:** All user-facing features.  
**Note:** Content/research phase — runs in parallel with M0-M4 code work.  
**COMPLETED:** ❌ PENDING

---

### Task Group A — Research (Sequential: Research → Validate)

| Task ID | Description | Output Files | Depends On |
|---|---|---|---|
| 5.A.1 | Research 8 milestones of football curriculum | `content/curriculum/research-notes.md` | — |
| 5.A.2 | Research position-specific variations (4 positions × 3 levels) | `content/curriculum/position-variants.md` | 5.A.1 |
| 5.A.3 | Research age-scaling guidelines | `content/curriculum/age-scaling.md` | — |
| 5.A.4 | Research nutrition (Pakistani staples, halal) | `content/curriculum/nutrition.md` | — |
| 5.A.5 | Research mental game content | `content/curriculum/mental-game.md` | — |

### Task Group B — Database Population (Parallel: Per Milestone)

| Task ID | Description | Output Files | Depends On |
|---|---|---|---|
| 5.B.1 | Insert Milestone 1 curriculum data | (migration or seed script) | 5.A.1 |
| 5.B.2 | Insert Milestone 2 curriculum data | (migration or seed script) | 5.A.1 |
| 5.B.3 | Insert Milestone 3 curriculum data | (migration or seed script) | 5.A.1 |
| 5.B.4 | Insert Milestone 4 curriculum data | (migration or seed script) | 5.A.1 |
| 5.B.5 | Insert Milestone 5 curriculum data | (migration or seed script) | 5.A.1 |
| 5.B.6 | Insert Milestone 6 curriculum data | (migration or seed script) | 5.A.1 |
| 5.B.7 | Insert Milestone 7 curriculum data | (migration or seed script) | 5.A.1 |
| 5.B.8 | Insert Milestone 8 curriculum data | (migration or seed script) | 5.A.1 |
| 5.B.9 | Generate embeddings for all exercises | (run ingest pipeline) | 5.B.1-8 |
| 5.B.10 | Validate all 12 tracks have 60-day coverage | `docs/validation-report.md` | 5.B.9 |

### Task Group C — Personalization (Parallel: Logic)

| Task ID | Description | Output Files | Depends On |
|---|---|---|---|
| 5.C.1 | Age-based scaling logic | `src/lib/curriculum/ageScale.ts` | 5.A.3 |
| 5.C.2 | Weight/intensity scaling | `src/lib/curriculum/intensityScale.ts` | 5.A.2 |
| 5.C.3 | Equipment filtering | `src/lib/curriculum/equipmentFilter.ts` | — |
| 5.C.4 | Time scaling (from onboarding) | `src/lib/curriculum/timeScale.ts` | 5.A.1 |

---

## Milestone 6 — Gamification & Engagement

**Goal:** Badges, achievements, streaks, self-rating journal, progress tracking.  
**Prerequisite for:** Milestone 7 (polish).  
**COMPLETED:** ❌ PENDING

---

### Task Group A — Streak System (Parallel: Logic + UI)

| Task ID | Description | Output Files | Depends On |
|---|---|---|---|
| 6.A.1 | Streak calculation logic | `src/lib/streaks/calculate.ts` | 0.B.5 |
| 6.A.2 | Streak display components | `src/components/StreakDisplay.tsx` | 6.A.1 |
| 6.A.3 | Streak animation (confetti on milestone) | `src/components/StreakAnimation.tsx` | 6.A.1, 0.D.7 |

### Task Group B — Journal (Parallel: Page + Charts)

| Task ID | Description | Output Files | Depends On |
|---|---|---|---|
| 6.B.1 | Journal page | `src/app/journal/page.tsx` | 0.B.7 |
| 6.B.2 | Rating trends chart component | `src/components/RatingTrendsChart.tsx` | 0.D.2 |
| 6.B.3 | Journal data hook | `src/lib/hooks/useJournal.ts` | 0.B.7 |

### Task Group C — Badges (Parallel: Data + UI)

| Task ID | Description | Output Files | Depends On |
|---|---|---|---|
| 6.C.1 | Badge definitions (data) | `src/lib/badges/definitions.ts` | — |
| 6.C.2 | Badge earning logic | `src/lib/badges/earn.ts` | 0.B.5 |
| 6.C.3 | Badge display component | `src/components/BadgeDisplay.tsx` | 6.C.1 |
| 6.C.4 | Badge collection page | `src/app/badges/page.tsx` | 6.C.3 |

### Task Group D — Progress Tracking (Parallel: Components)

| Task ID | Description | Output Files | Depends On |
|---|---|---|---|
| 6.D.1 | Progress ring (overall) | `src/components/ProgressRing.tsx` | 0.D.4 |
| 6.D.2 | Milestone progress bars | `src/components/MilestoneProgress.tsx` | 0.D.2 |
| 6.D.3 | Fitness progress (baseline vs retest) | `src/components/FitnessProgress.tsx` | 0.B.7 |
| 6.D.4 | Team leaderboard component | `src/components/TeamLeaderboard.tsx` | 0.B.3 |

---

## Milestone 7 — Polish & PWA Enhancement

**Goal:** Visual polish, animation refinement, cross-device testing, bug fixes.  
**Prerequisite for:** Launch.  
**COMPLETED:** ❌ PENDING

---

### Task Group A — Visual Polish (Parallel: By Screen)

| Task ID | Description | Output Files | Depends On |
|---|---|---|---|
| 7.A.1 | Dashboard polish (spacing, shadows, glassmorphism) | `src/app/dashboard/page.tsx` | 1.A.1 |
| 7.A.2 | Timer screen polish | `src/app/session/[sessionId]/page.tsx` | 2.A.1 |
| 7.A.3 | Onboarding polish | `src/app/onboarding/page.tsx` | 0.E.2-5 |
| 7.A.4 | Team dashboard polish | `src/app/team/[teamId]/page.tsx` | 4.B.1 |
| 7.A.5 | Coach chat polish | `src/app/coach/page.tsx` | 3.B.5 |
| 7.A.6 | Empty states with illustrations | `src/components/EmptyState.tsx` | 0.D.6 |
| 7.A.7 | Error states with recovery | `src/components/ErrorBoundary.tsx` | — |
| 7.A.8 | Toast notification system | `src/components/Toast.tsx`, `src/lib/toasts.ts` | — |

### Task Group B — Animations (Parallel: By Type)

| Task ID | Description | Output Files | Depends On |
|---|---|---|---|
| 7.B.1 | Page transition animations | `src/app/layout.tsx` | 0.D.7 |
| 7.B.2 | List stagger animations | `src/components/AnimatedList.tsx` | 0.D.7 |
| 7.B.3 | Progress ring fill animation | `src/components/ProgressRing.tsx` | 0.D.4 |
| 7.B.4 | Button micro-interactions | `src/components/LuxuryButton.tsx` | 0.D.3 |
| 7.B.5 | Session completion celebration | `src/components/CompletionAnimation.tsx` | 0.D.7 |
| 7.B.6 | Reduced motion support | `src/app/globals.css` | 0.D.1 |

### Task Group C — PWA Enhancement (Parallel: Assets + Config)

| Task ID | Description | Output Files | Depends On |
|---|---|---|---|
| 7.C.1 | Optimized icons (192px, 512px, Apple touch) | `public/icons/` | — |
| 7.C.2 | Splash screens | `public/splash/` | — |
| 7.C.3 | Install prompt handling | `src/components/InstallPrompt.tsx` | — |
| 7.C.4 | Offline fallback page polish | `public/offline.html` | 0.A.5 |

### Task Group D — Testing (Sequential: Test → Fix)

| Task ID | Description | Output Files | Depends On |
|---|---|---|---|
| 7.D.1 | Responsive layout testing (mobile/tablet/desktop) | (manual verification) | All previous |
| 7.D.2 | Touch target validation (min 44×44px) | (manual verification) | 7.D.1 |
| 7.D.3 | Performance profiling (Lighthouse) | `docs/performance-report.md` | 7.D.1 |
| 7.D.4 | Cross-device testing report | `docs/testing-report.md` | 7.D.3 |

---

## Milestone 8 — Launch Prep

**Goal:** Production readiness, security audit, monitoring, deployment.  
**Prerequisite for:** Go-live.  
**COMPLETED:** ❌ PENDING

---

### Task Group A — Security Audit (Sequential: Audit → Fix → Verify)

| Task ID | Description | Output Files | Depends On |
|---|---|---|---|
| 8.A.1 | RLS policy audit (all tables) | `docs/security/rls-audit.md` | 0.B.2-9 |
| 8.A.2 | API key exposure check | (grep .env* in codebase) | — |
| 8.A.3 | XSS/CSRF check on all inputs | `docs/security/xss-audit.md` | — |
| 8.A.4 | Fix any security findings | (code changes) | 8.A.1, 8.A.3 |
| 8.A.5 | Rate limiting on AI endpoints | `src/app/api/ai/*/route.ts` | 3.C.1, 3.C.3 |

### Task Group B — Monitoring (Parallel: Setup)

| Task ID | Description | Output Files | Depends On |
|---|---|---|---|
| 8.B.1 | Error logging setup | `src/lib/errors/logger.ts` | 0.B.8 |
| 8.B.2 | Analytics event tracking | `src/lib/analytics/track.ts` | 0.B.8 |
| 8.B.3 | Supabase dashboard monitoring setup | (manual: Supabase dashboard) | — |

### Task Group C — Deployment (Sequential: Config → Deploy → Verify)

| Task ID | Description | Output Files | Depends On |
|---|---|---|---|
| 8.C.1 | Vercel project configuration | (Vercel dashboard) | 0.A.7 |
| 8.C.2 | Environment variables setup | `.env.example` | — |
| 8.C.3 | GitHub Actions deploy verification | `.github/workflows/deploy.yml` | 0.A.7 |
| 8.C.4 | Supabase keep-alive cron verification | `.github/workflows/supabase-keepalive.yml` | 0.A.7 |
| 8.C.5 | Production URL end-to-end test | `docs/deployment-report.md` | 8.C.3 |

### Task Group D — Documentation (Parallel: Docs)

| Task ID | Description | Output Files | Depends On |
|---|---|---|---|
| 8.D.1 | README.md update | `README.md` | — |
| 8.D.2 | Finalize all docs | `docs/PRD.md`, `docs/TRD.md`, `docs/design-system.md`, `docs/ROADMAP.md` | — |
| 8.D.3 | About/help page | `src/app/about/page.tsx` | — |

---

## Build Order & Dependencies

```
Milestone 0 (Foundation)
    │
    ├──→ Milestone 1 (Dashboard) ──→ Milestone 6 (Gamification)
    │           │                           │
    ├──→ Milestone 2 (Timer) ───→ Milestone 3 (AI Coach) ──→ Milestone 7 (Polish)
    │           │                           │
    └──→ Milestone 4 (Teams/Co-op) ──────────┘
                │
                └──→ Milestone 5 (Curriculum) — parallel with M0-M4
                            │
                            └──→ Milestone 8 (Launch)
```

**Critical path:** M0 → M1 → M2 → M3 → M4 → M6 → M7 → M8  
**Parallelizable:** M5 (curriculum research) runs alongside M0-M4.

---

## Key Technical Decisions (Locked)

| Decision | Value | Source |
|---|---|---|
| Accent color | Champagne Gold (#F7E7CE) | Design-system Q1 |
| Dark palette | True black (#000000) + graphite (#111827) | Design-system Q2 |
| Font | Inter | Design-system Q3 |
| Glassmorphism | Subtle (8px blur, 3% opacity) | Design-system Q4 |
| Plan schema | Fixed hierarchy + day_number | TRD Q1 |
| Co-op state | Supabase Realtime, one channel per session | TRD Q2 |
| RAG chunking | One embedding per exercise | TRD Q3 |
| Session state | IndexedDB (offline-first) | TRD Q4 |
| Embedding model | gemini-1.5-flash-lite | TRD (user spec) |
| Free models | OpenRouter/Groq/Mistral/Agnes/Gemini verified | TRD §6.3 |
| Deployment | Vercel free + Supabase free + GitHub cron | TRD |
| PWA cache | Everything (full offline support) | TRD |

---

## Execution Instructions for Agents

**When triggered with "execute ROADMAP.md" or "execute milestone N":**

1. Read all docs: `docs/PRD.md`, `docs/TRD.md`, `docs/design-system.md`, `docs/ROADMAP.md`, `AGENTS.md`
2. Check git status to determine current milestone (first with `COMPLETED: ❌`)
3. For the current milestone:
   a. Group tasks by dependency level (no dependencies → dispatch first)
   b. Dispatch parallel agents for all independent tasks in the first group
   c. Wait for each agent to complete and report outputs
   d. Check if any dependent tasks are now unblocked
   e. Dispatch newly-unblocked tasks
   f. Repeat until all tasks in the milestone are complete
4. Mark milestone as `COMPLETED: ✅` in ROADMAP.md
5. **STOP** — do NOT proceed to the next milestone until explicitly told

**Agent dispatch rules:**
- Each agent gets ONE task (one atomic deliverable)
- Agents report: files created, any issues, any outputs other agents need
- If an agent needs output from another agent, it reports the dependency and waits
- Use `subagent_type: "fork"` for agents that need the full conversation context
- Use `subagent_type: "general-purpose"` for independent tasks

**Parallel execution limits:**
- Max 4 agents dispatching at once (to avoid context overload)
- Queue remaining tasks and dispatch as slots free up
- Track all agent IDs for status reporting
