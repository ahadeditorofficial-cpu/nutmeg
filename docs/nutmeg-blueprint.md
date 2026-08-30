# Nutmeg — 60-Day Football Training Platform
### Master Blueprint for Claude Code (GitHub Codespaces Build)
### FINAL VERSION — v2 (researched Aug 22, 2026)

> **Naming:** App name = **Nutmeg** (alt: Pitchcraft, Onside). Football slang for a skill move — short, premium, one-word brand like Notion/Linear.

---

## 0. Latest Stack Versions (verified Aug 22, 2026)

| Tech | Current stable | Notes |
|---|---|---|
| Next.js | **16.3** (16.2.6 patch line active) | App Router, Turbopack is now the **default bundler** (not webpack). Ships Instant Navigations: client state preserved across routes, optimistic updates with Server Components — perfect for the guided workout screen not losing timer state on nav. |
| React | **19.x** (19.2.6 latest patch) | Required by Next 16 |
| Supabase Free Tier | 500MB DB storage, 500MB shared RAM, 1GB file storage, 5GB egress, 50K MAU, 500K Edge Function calls/mo, **unlimited API requests**, pgvector included free | ⚠️ **Free projects auto-pause after 7 days of inactivity** — need a scheduled keep-alive ping (GitHub Actions cron hitting the project every few days) so it doesn't sleep between your training sessions |
| Vector DB approach | pgvector on Supabase (zero extra infra/cost) | Fine for this scale — a personal + small-team curriculum knowledge base is nowhere near the 500MB limit |
| Security note | Next.js has an active coordinated security release cadence in 2026 (patches for 15.5.x/16.2.x/16.3.x covering middleware bypass, SSRF, cache poisoning) | Claude Code should pin to latest patch version and re-check before final deploy, since patches ship frequently |

**Action for Claude Code:** scaffold with `npx create-next-app@latest` (will pull 16.3+ automatically), confirm React 19, and set up a lightweight cron (GitHub Actions, free) that pings the Supabase project every 5-6 days to prevent the free-tier pause.

---

## 1. Vision & Positioning

A personal (extensible to friends/team) 60-day interactive football development platform — beginner-level entry point, following the training philosophy of elite players (Ronaldo-style discipline: skills + home fitness + nutrition + mental game), built with zero budget, no paid tools, fully self-hosted on free tiers.

This is a **personal-use tool first**, not a market-validated SaaS — so no competitor gap analysis is needed. All football content must be researched live (not hallucinated) from authentic coaching sources.

---

## 2. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router) | PWA support, installable on tablet/phone/laptop |
| Styling | Tailwind CSS + Framer Motion | Apple-inspired dark glassmorphism |
| Database | Supabase (Postgres) | Free tier |
| Vector store (RAG) | Supabase `pgvector` extension | Store football knowledge base as embeddings |
| Auth | Supabase Auth (email) | Simple login, multi-user ready |
| Storage | Supabase Storage | Profile photos |
| Notifications | Web Push API (PWA) | "Aaj ka training time" daily reminder |
| Dev Environment | GitHub Codespaces + Claude Code | OmniRoute free-tier model routing already configured |
| Hosting | Vercel (free tier) | |

---

## 3. Core User Flow

### 3.1 Onboarding (Full Profile)
On first signup, interactive step-by-step questionnaire:
- Name, Age, Height, Weight, Profile Photo
- Skill level (Beginner/Intermediate/Advanced) — default beginner
- Position preference (Striker / Midfielder / Defender / Goalkeeper)
- Dominant foot (Left/Right/Both)
- Baseline fitness test: push-ups count, sit-ups count, (optional: 12-min run distance)
- Available daily training time (target: 1–1.5 hrs/day)
- Equipment available (default: ball + shoes only, no cones/gear)
- Training context: solo, with friends, or both

This data drives **personalized exercise calculation** (reps/sets/intensity scaled to age, weight, fitness baseline) — modeled on real elite home-training regimens (e.g. Ronaldo's core/plyometric/football-specific routines), researched live and adapted for equipment-free home settings.

### 3.2 Teams
- "Add Team" → create team → add members one by one (each gets own profile/onboarding)
- Team dashboard: collective stats + individual stats side-by-side
- Sub-groups by position within a team
- Team leaderboard (streaks, completion %, self-rating averages)

---

## 4. Curriculum Structure (60 Days)

```
8 Milestones (≈7–8 days each)
  └── Sections (skill category per milestone)
        └── Phases (progressive difficulty within section)
              └── Daily Tasks (drills, checklist items)
```

**Knowledge domains covered (Full Package):**
1. Technical skills (first touch, dribbling, passing, shooting)
2. Fitness/conditioning (home-based, no-equipment plyometrics & strength)
3. Tactics & game-reading
4. Nutrition (zero-budget, accessible foods)
5. Mental game (focus, confidence, match psychology)

Each day's task includes: text + diagram/image instructions (no video hosting), estimated duration, difficulty, and a **self-rating journal entry (1–10) + streak tracker** on completion.

**Milestone content must be researched by Claude Code from authentic coaching sources** (e.g. UEFA coaching methodology, professional academy curricula) — not invented.

---

## 5. Guided Workout / Timer System (Play Store home-workout-app style)

This is the core interactive execution layer — how a day's tasks actually get *done*, not just checked off.

**5.1 Two session modes (user picks at start of each day's session):**
- **Auto-guided mode:** exercise runs on a fixed pre-set timer (from curriculum data, e.g. 30–60 sec) → auto-transitions to rest timer → auto-advances to next exercise. Zero taps needed mid-session.
- **Manual mode:** user taps start/pause/next themselves per exercise, same content, self-paced.

**5.2 Audio cues:** Text-to-speech (free, browser-native `SpeechSynthesis` API — no paid TTS service needed) voice countdown "3, 2, 1, go" at exercise start and a spoken "rest" cue at transition — same pattern as Nike Training Club-style apps.

**5.3 Screen layout during a guided exercise:**
Full-screen exercise reference image/diagram as the background, with the countdown timer (numeric + progress ring) overlaid on top — both visible together, not separate screens.

**5.4 Duration model:** Every drill/exercise has a **fixed, pre-set duration** baked into the curriculum data at content-creation time (Phase 2 research), not user-customizable — keeps sessions consistent and true to the researched training methodology.

**5.5 Interruption handling:** If the screen locks or the app is minimized mid-session, the session **pauses** (does not silently keep running in the background) and resumes from the paused point when reopened — avoids losing track of reps/state, simpler to implement reliably as a PWA than true background execution.

**5.6 Skip control:** A **Skip** button is always available on every exercise (not just rest) — no forced completion, keeps it low-friction for a personal tool.

**5.7 Session summary screen:** On completing all exercises in a day's session, show:
- Exercises completed count
- Total session time
- Estimated calories burned (simple MET-based formula using user's weight from profile — no external API needed)
- Self-rating prompt (1–10) — this rating feeds the streak/journal AND the RAG adaptive-planning signal

**Implementation notes for Claude Code:**
- Timer state should live in React state/context, not localStorage (per artifact/PWA constraints) — but since this is a real installed PWA (not a Claude-artifact preview), standard browser `localStorage`/`IndexedDB` *is* fine here for persisting an in-progress session across a pause.
- Use Next.js 16.3's Instant Navigations + preserved client state so navigating to/from the timer screen (e.g. checking the AI Coach chat mid-session) doesn't reset the timer.
- Circular progress ring: simple SVG stroke-dashoffset animation, no extra library needed — keeps bundle light for the Lenovo tablet.

---

## 6. RAG System

- **Purpose (dual):**
  1. AI Coach chatbot — answer football questions from the ingested knowledge base
  2. Adaptive planning — adjust upcoming days based on user's self-ratings/progress/missed sessions
- **UI placement:** floating chat bubble (bottom-right, always accessible) + dedicated full "AI Coach" page for deeper sessions
- **Pipeline:** research content → chunk → embed (free-tier embedding model via OmniRoute fallback chain) → store in Supabase pgvector → retrieve + generate via Claude Code's configured model routing

---

## 7. Gamification & Engagement

- Daily checklist per task
- Streak counter (consecutive days)
- Self-rating journal (1–10 daily performance reflection)
- Progress % per milestone/section
- Badges/achievements on milestone completion
- Browser push notifications: daily training reminder

---

## 8. UI/UX Direction

**Apple-inspired premium/minimal** — dark theme, glassmorphism cards, spatial depth, smooth scroll-based motion (Framer Motion), restrained accent color (single signature color against neutral dark palette), generous whitespace, large confident typography. Reference: Apple's product pages, Linear, Notion — not a "sports app" bright/loud aesthetic.

---

## 9. Build Phases (for Claude Code / Agent Teams)

**Phase 1 — Foundation**
- Repo setup in Codespaces (`create-next-app@latest` → Next.js 16.3, React 19), Tailwind + Supabase init
- GitHub Actions cron for Supabase keep-alive ping (prevents 7-day free-tier pause)
- Auth (signup/login) + full onboarding flow (name, age, height, weight, photo, position, dominant foot, fitness test, available time, equipment, training context)
- Database schema: users, profiles, teams, team_members, milestones, sections, phases, daily_tasks, exercises (with fixed durations), user_progress, journal_entries, session_summaries

**Phase 2 — Curriculum Engine**
- Claude Code researches authentic 60-day football curriculum (live web research, cite methodology sources — skills, fitness, tactics, nutrition, mental game)
- Populate milestones → sections → phases → daily tasks → individual exercises (each with a fixed duration) in DB
- Personalization logic: exercise scaling by age/weight/fitness baseline, home-training-inspired (Ronaldo-style discipline, adapted to no-equipment/ball-and-shoes-only context)

**Phase 3 — Core UI**
- Dashboard (today's tasks, streak, progress ring)
- Milestone/Section/Phase drill-down navigation
- Daily task detail view (text+diagram, checklist, self-rating)

**Phase 4 — Guided Workout / Timer Engine**
- Session mode picker (auto-guided vs manual)
- Full-screen exercise view: image/diagram + overlaid numeric+ring timer
- TTS audio cues (browser-native SpeechSynthesis: "3,2,1,go" / "rest")
- Pause-on-interrupt + resume logic (IndexedDB/localStorage persisted session state)
- Skip button on every exercise
- Session summary screen (exercises completed, total time, calorie estimate via MET formula, 1–10 self-rating capture)

**Phase 5 — RAG Integration**
- Ingest curriculum + supplementary football knowledge into pgvector
- Floating chat bubble + full AI Coach page
- Adaptive planning logic based on progress/session-summary/self-rating data

**Phase 6 — Teams**
- Create/join team, add members (each with own full onboarding)
- Team dashboard: collective + individual stats, sub-groups by position

**Phase 7 — Engagement Layer**
- Badges/achievements
- Web push notifications setup (daily training reminder)
- Polish streaks/journal UI

**Phase 8 — Polish & PWA**
- PWA manifest + installability (Lenovo tablet target)
- Apple-style visual pass (glassmorphism, motion, typography, Next.js 16.3 Instant Navigations for snappy transitions)
- Testing across devices, bug fixes
- Confirm Next.js/React on latest patched versions before final deploy (security releases ship frequently in 2026 — re-check before shipping)

---

## 10. Suggested Folder Structure

```
nutmeg/
├── app/                    # Next.js App Router pages
├── components/
├── lib/
│   ├── supabase/
│   ├── rag/                # embedding + retrieval logic
│   └── curriculum/         # personalization calculators
├── content/
│   └── curriculum/         # researched drill data (JSON/MD)
├── docs/
│   └── nutmeg-blueprint.md # this file
└── supabase/
    └── migrations/
```

---

## 11. Instructions for Claude Code

- Professional mode only. Follow this blueprint phase-by-phase — do not skip ahead.
- All football/fitness/nutrition content must be **researched live from the web**, not generated from memory (accuracy matters — this is a real personal training plan).
- Ask before major architectural decisions not covered in this doc.
- Use the configured experimental agent teams for parallelizing Phase 2 (research) and Phase 3 (UI) where useful.
- No paid services, no credit-card-required tiers anywhere in the stack.
- Always scaffold/install with `@latest` so the project picks up current Next.js/React patch versions automatically rather than a version pinned in this doc — versions move fast in 2026, re-verify at build time.
