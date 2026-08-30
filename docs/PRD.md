# Nutmeg — Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** 2026-08-28  
**Status:** Draft — pending review  
**Repository:** `docs/PRD.md`

---

## 1. Product Overview

Nutmeg is a 60-day personal football training PWA for beginners, extensible to small teams. It combines a researched football curriculum (skills, fitness, tactics, nutrition, mental game), a guided workout timer, an AI Coach with adaptive planning, and live co-op training with friends — all on a zero-budget stack (free tiers only, no credit card).

**Primary use case:** One person (and their friend group) trains for 60 calendar days, following a daily session that adapts to their age, skill level, position, available time, and equipment.

**Non-goal:** Nutmeg is not a public app, not a SaaS, not a social network, and not a coaching certification tool. It is a personal development tool that happens to be shareable with friends.

---

## 2. Target Users

### 2.1 Primary User Profile

- **Age:** Open to all ages (no hard gate). Coaching adapts to exact age.
- **Location:** Pakistan primary (nutrition uses local bazaar staples, halal omnivore). Curriculum is researchable globally.
- **Language:** UI and coach voice are Roman Urdu / Hinglish. Timer voice cues are English ("3, 2, 1, go" / "rest") via browser SpeechSynthesis.
- **Training space:** Fully flexible — home room, wall/corridor, park, or open ground. Onboarding captures what's available; session generation adapts.
- **Equipment:** Full checklist in onboarding (ball, shoes, cones, wall access, stairs, open ground, goal, resistance band, etc.). Plan adapts to what they have.
- **Fitness level:** Self-selects Beginner / Intermediate / Advanced. Each level has a fully researched, distinct curriculum (not just intensity scaling).
- **Position:** Striker / Midfielder / Defender / Goalkeeper. Days are fully position-specific.
- **Diet:** Halal omnivore. Accessible, cheap foods common in Pakistani bazaars (roti, daal, chicken, eggs, dahi, seasonal fruit).

### 2.2 Team Members

- Anyone can sign up and create a team via invite link.
- One team per account at a time (joining a second team leaves the first).
- Teammates see almost everything: streaks, completion %, milestone progress, self-ratings (1–10), session summaries, and journal entries.
- Position subgroups exist within a team (e.g. "Strikers" can compare themselves).
- No public profiles, no open discovery, no social feed.

---

## 3. Core Concepts

### 3.1 The 60-Day Plan

- The curriculum is structured as **8 milestones**, each containing sections, phases, and daily tasks.
- A "Day" is a single mixed session (~60–90 min for most users, but scales down to whatever time they selected in onboarding).
- Each training day contains: technical skills, home fitness, and light touches of tactics/nutrition/mental game (delivered as short checklist items, not timed drills).
- Days are **fully position-specific** (a GK's Day 12 is different from a striker's Day 12).
- The plan **pauses on Day N** until that session is fully completed (no leftover skips). The calendar does not advance.
- The 60-day label is branding; the coach may extend the plan past 60 days via auto-rewrites.

### 3.2 Training Day Completion

A training day is only **complete** when:
- Every exercise in the session has been completed (no skipped drills remain).
- The session summary has been submitted, including the 1–10 self-rating.
- The session ran to completion (no mid-session abandon).

**Skip behavior:** The Skip button exists on every exercise. If you skip a drill, the session remains incomplete until you resume and finish that drill (without skipping). Skipped drills do not count toward the day's completion.

### 3.3 Calendar Streak

- Streak = **consecutive calendar days** with at least one completed training session.
- A rest day (no session completed) **breaks the streak**.
- There are no official built-in rest days in v1. If you want a rest day, you simply don't complete a session — the streak resets.
- One training day per calendar date is the maximum. You cannot complete two training days on the same date.

### 3.4 Success Criteria (End of 60)

A "successful 60-day run" requires **both**:

1. **Habit:** ≥80% of training days completed fully (no leftover skips). For a 60-day plan, that means at least 48 completed days. If the coach rewrites and extends the plan past 60 days, the 80% bar applies to the final plan length.
2. **Fitness:** Improvement on at least **2 of 3** baseline retest measures (push-ups count, sit-ups count, optional 12-minute run). The run is optional — if skipped during onboarding, it's ignored at the end. Only the tests you recorded at onboarding count.

---

## 4. Onboarding Flow

On first signup, a step-by-step questionnaire collects:

1. **Name** (required)
2. **Age** (exact, in years — used for coach scaling, no buckets)
3. **Height & Weight** (for calorie estimation and fitness scaling)
4. **Profile Photo** (optional)
5. **Skill Level:** Beginner / Intermediate / Advanced (each has a distinct curriculum)
6. **Position:** Striker / Midfielder / Defender / Goalkeeper
7. **Dominant Foot:** Left / Right / Both
8. **Baseline Fitness Test:**
   - Push-ups (max reps in 1 min)
   - Sit-ups (max reps in 1 min)
   - 12-minute run distance (optional; if skipped, ignored at end)
9. **Available Daily Training Time:** Slider (e.g. 15 / 30 / 45 / 60 / 90 / 120 min) — session length scales to this
10. **Equipment Available:** Full checklist (ball, shoes, cones, wall access, stairs, open ground, goal, resistance band, etc.) — plan adapts to what they have
11. **Training Context:** Solo / With friends / Both
12. **Team Decision:** Create a team / Join a team (via invite link) / Skip (solo for now)

After onboarding, the coach generates the first 7–10 days of the plan based on all the above.

---

## 5. Feature Requirements

### 5.1 Auth & Profile

- **Auth:** Supabase Auth (email only). No social logins.
- **Profile:** Name, age, height, weight, photo, skill level, position, dominant foot, baseline fitness.
- **Privacy:** Profile photos use signed URLs (never public buckets). Full team data is visible to team members only.

### 5.2 Dashboard

- Shows **today's session** (Day N title, position, estimated duration).
- Shows **streak** (consecutive calendar days with completed sessions).
- Shows **progress ring** (% of plan completed).
- Shows **upcoming days** (next 3–5, collapsible).
- Quick actions: "Start Session" (opens guided timer), "AI Coach", "View Team".

### 5.3 Guided Workout / Timer Engine

**Session modes:**
- **Auto-guided:** Fixed pre-set timer per exercise → auto-advances to rest → auto-advances to next exercise. Zero taps needed mid-session.
- **Manual:** User taps start/pause/next per exercise, same content, self-paced.

**Live co-op mode:**
- Host starts a session → generates a join link (team members only).
- Anyone in the team can pause, skip, or next the shared timer.
- Guest co-op **does not** complete the guest's Day N. Guests follow the host's position plan for that session. Own Day N is still available later that day (co-op is extra, not a substitute).
- Host picks the session mode (Auto or Manual) at start; this applies to the whole group.

**Timer screen:**
- Full-screen exercise reference image/diagram as background.
- Numeric countdown timer + SVG circular progress ring overlaid.
- TTS voice cues: English "3, 2, 1, go" at exercise start, "rest" at transition.
- Skip button always visible (does not complete the exercise).
- Pause on screen lock / app minimization (session state persists via localStorage/IndexedDB).
- Resume from paused point when reopened.

**Session summary (on completion):**
- Exercises completed count.
- Total session time.
- Estimated calories burned (MET-based formula using user's weight).
- Self-rating prompt (1–10) — required to complete the day.
- Streak update.

**Duration model:** Every drill has a fixed pre-set duration baked into the curriculum data at content-creation time. Duration may scale slightly based on user's available time (from onboarding), but individual exercise durations are not user-customizable mid-session.

### 5.4 AI Coach (RAG)

**Purpose:**
1. Answer football questions from the ingested knowledge base (skills, tactics, fitness, nutrition, mental game).
2. Adaptive planning — rewrite upcoming days based on user's self-ratings, progress, and missed sessions.

**UI placement:**
- Floating chat bubble (bottom-right, always accessible).
- Dedicated full "AI Coach" page for deeper sessions.

**Voice & personality:**
- Ronaldo-discipline energy: obsessed with extras, recovery, professionalism. Motivational but intense.
- Roman Urdu / Hinglish for chat and screens.
- English for TTS cues only.

**Rewrite rules:**
- Coach has **full freedom** to rewrite upcoming days: insert extra days, repeat weeks, reorder milestones, swap exercises, add recovery.
- Changes are **silent and automatic** — no confirmation prompts, no undo button, no detailed change log. The coach just adjusts and the plan continues.
- Dashboard always reflects the current (possibly rewritten) plan.

**Provider routing:**
- RAG Chat (responses): Groq (primary) → OpenRouter → Agnes AI (fallback).
- Embeddings (knowledge base): Gemini (primary) → OpenRouter → Agnes AI (fallback).
- Content generation (adaptive planning): Cerebras (primary) → OpenRouter → Agnes AI (fallback).
- Long-context reasoning (progress analysis): Mistral (primary) → OpenRouter → Agnes AI (fallback).

### 5.5 Teams

- **Create:** Any user can create a team. Team name, optional tagline.
- **Join:** Via invite link. One team per account at a time.
- **Dashboard:** Collective stats + individual stats side-by-side. Sub-groups by position.
- **Leaderboard:** Streaks, completion %, self-rating averages.
- **Live co-op:** Team members only. Host starts, anyone in team joins. Guest co-op does not count as the guest's Day N.
- **Privacy:** Teammates see almost everything — streaks, ratings, journal, session summaries. No public profiles.

### 5.6 Gamification & Engagement

- **Streak counter:** Consecutive calendar days with completed sessions. Breaks on any missed day.
- **Self-rating journal:** 1–10 daily performance reflection. Feeds adaptive planning.
- **Progress %:** Per milestone, per section, overall.
- **Badges / achievements:** On milestone completion (details TBD in design).
- **Push notifications:** **Not in v1.** No Web Push setup. In-app dashboard is the only reminder.

### 5.7 PWA & Offline

- **Installable PWA:** Must install on tablet, phone, and laptop (home screen). Apple-style visual pass (glassmorphism, motion, typography).
- **Offline during workout:** Timer + today's loaded drills work offline. AI Coach chat and team features require network. Session summary queues and syncs when back online.
- **Device parity:** All three devices (tablet, phone, laptop) are equally important. No primary device.

---

## 6. Curriculum & Content Rules

### 6.1 Source of Truth

All football/fitness/nutrition content **must be researched live** from authentic coaching sources (UEFA methodology, professional academy curricula, peer-reviewed sports science). No invented content. Phase 2 (Claude Code research) populates the database.

### 6.2 Structure

```
8 Milestones (≈7–8 days each, but coach may extend)
  └── Sections (skill category per milestone)
        └── Phases (progressive difficulty within section)
              └── Daily Tasks (drills, checklist items)
                    └── Exercises (fixed durations, position-specific)
```

### 6.3 Curriculum Tracks

v1 ships **three full tracks** for Beginner / Intermediate / Advanced, each with **position-specific days** (Striker, Midfielder, Defender, Goalkeeper). Combined with **exact-age scaling**, the curriculum surface area is large; the PRD acknowledges this but does not prescribe the full content matrix — Phase 2 research delivers the actual curriculum.

### 6.4 Duration Model

- Each drill has a **fixed, pre-set duration** baked into the curriculum data.
- Session length scales to the user's onboarding time choice (e.g. 30 min user gets a shorter Day N with fewer drills, same theme).
- Individual exercise durations are **not** user-customizable mid-session.

---

## 7. Non-Goals (Out of Scope for v1)

- **No video hosting.** Diagrams and images only.
- **No YouTube embeds.** (Can be revisited later if needed.)
- **No wearable / heart-rate integration.**
- **No payments, subscriptions, or app-store listing.**
- **No social feed, comments, or public profiles.**
- **No custom drill builder.** Users cannot author their own exercises.
- **No multi-language UI in v1.** Roman Urdu / Hinglish + English TTS only.
- **No human coach dashboard.** No real trainer with admin access.
- **No team discovery.** Invite links only; no public team listing.
- **No live co-op with non-team members.** Guest links are not supported.
- **No Web Push notifications.**
- **No full offline app.** Only today's loaded session works offline.
- **No after-day-60 content.** What happens after Day 60 is undecided; do not build cycle 2 in v1.

---

## 8. Technical Constraints (from AGENTS.md)

- **Stack:** Next.js 16.3 (App Router, Turbopack default), React 19, TypeScript, Tailwind CSS, Supabase (Postgres + pgvector + Auth + Storage), Framer Motion, lucide-react, next-pwa.
- **Zero-budget:** Every service must have a free tier, no credit card.
- **Supabase free-tier caveat:** Auto-pauses after 7 days of inactivity. Must set up a GitHub Actions cron to ping the project every 5–6 days.
- **Security:** Never commit `.env.local`, API keys, or Supabase keys. RLS on every table. Signed URLs for profile photos.
- **Database rules:** Every schema change via migration in `supabase/migrations/`. pgvector embeddings table stays separate from user data tables.

---

## 9. Success Metrics (Internal)

The product is considered a successful v1 release when:

1. A solo user can complete the full onboarding, generate a 60-day plan, run guided sessions (auto and manual), use the AI Coach, and join a live co-op session with a teammate.
2. A team of 2–5 friends can create a team, invite each other, see each other's progress, and run at least one live co-op session together.
3. The end-of-60 retest captures baseline vs. final fitness numbers and displays the delta.
4. The PWA installs on tablet, phone, and laptop and works offline for the timer during a session.
5. All AI providers fall back gracefully (no hard failures visible to the user).

---

## 10. Open Items (To Be Decided Later)

- **After Day 60:** What happens? (New cycle? Open gym? Stats recap only?) Not built in v1.
- **Badge/achievement design:** What badges exist, what they look like, how they're earned. TBD in design phase.
- **Exact nutrition content:** Which Pakistani dishes, which macros, which meal timings. Researched in Phase 2.
- **Mental-game content depth:** How much is read/reflect vs. guided exercise. TBD in research.

---

## 11. Appendix: Decision Log

| Decision | Answer |
|---|---|
| Primary user | Me + friends from day one |
| Schedule model | 60 training days (plan pauses), calendar streak |
| v1 scope | Full blueprint (all 8 phases) |
| Adaptive planning | Auto-rewrite, full freedom, silent |
| Devices | Tablet, phone, laptop — all equal |
| Language | Roman Urdu / Hinglish UI, English TTS cues |
| Success metric | ≥80% habit + improve 2 of 3 fitness tests |
| Team join | Invite link, anyone can create, one team at a time |
| Space & gear | Fully flexible, captured in onboarding |
| Plan ownership | Personal plan, shared calendar |
| Team privacy | Almost everything visible to teammates |
| Diet | Halal omnivore, Pakistan staples |
| Age | Open to all, exact-age scaling, no buckets |
| Reminders | No push notifications in v1 |
| Live co-op | Call-style, anyone can control, host's position plan |
| After Day 60 | Undecided, not built in v1 |
| Day completion | Every exercise finished, no skips, rating submitted |
| Position in plan | Fully position-specific days |
| Skip behavior | Session stays incomplete until skipped drills are finished |
| Mixed-position co-op | Host's position plan is what everyone does |
| Streak rules | Calendar streak (miss a day = reset) |
| Offline | Timer + today's drills; AI Coach and teams need network |
| Rest vs streak | Rest breaks the streak (no official rest days in v1) |
| Co-op Day N | Guest co-op does not complete your Day N |
| Coach voice | Ronaldo-discipline energy |
| Day shape | One mixed session (~60–90 min, scales to available time) |
| Habit bar | ≥80% of training days fully completed |
| Fitness bar | Improve 2 of 3 baseline tests |
| Coach rewrite scope | Full freedom (insert/repeat/reorder days; plan may grow past 60) |
| Age scaling | Exact age, not buckets |
| Time selection | Slider in onboarding (e.g. 15/30/45/60/90/120 min) |
| Equipment model | Full checklist in onboarding |
| Rewrite visibility | Silent smart coach (no prompts, no log) |
| Session length | Scales to user's available time from onboarding |
| 60 vs rewrite | Can grow past 60; 80% bar applies to final length |
| Skill level | Three full tracks (Beginner / Intermediate / Advanced) |
| Co-op eligibility | Same team only |
| TTS voice | English cues only |
| Guest co-op + day | Guest co-op is extra; own Day N still allowed same day |
