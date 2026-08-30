# AGENTS.md — Nutmeg

## Next.js Docs Directive (read first, every session)

Before any Next.js work — routing, data fetching, Server Actions, caching, middleware, or config — find and read the relevant doc in `node_modules/next/dist/docs/`. Training data on Next.js APIs is frequently outdated by the time you're reading this. The bundled docs are the source of truth for this exact installed version. Do the same for Supabase: check `node_modules/@supabase/*` types/docs before assuming an API shape.

---

## Project Overview

Nutmeg — a 60-day personal football training PWA. Solo learner (beginner level) progressing through 8 milestones of skills, fitness, tactics, nutrition, and mental-game content, with guided/manual timed workout sessions, an AI coach (RAG), and team support for training with friends. Zero-budget: every service used must have a free tier, no credit card.

Full product spec: `docs/nutmeg-blueprint.md`. Read it before starting any new phase of work — it has the authoritative feature scope, so don't re-derive requirements from scratch.

---

## Stack

Next.js 16.3 (App Router, Turbopack default), React 19, TypeScript, Tailwind CSS, Supabase (Postgres + pgvector + Auth + Storage), Framer Motion, lucide-react, next-pwa.

---

## Commands

- Dev: `npm run dev` — always use this while iterating. Never run `npm run build` inside an agent session; it swaps `.next` to production output and breaks hot reload / can leave the dev server inconsistent.
- Build (only when explicitly asked to verify a production build): `npm run build`
- Lint: `npm run lint`
- Type check: `npx tsc --noEmit`
- Install a dependency: `npm install <pkg>` — never `--save-dev` for runtime deps, never skip updating `package-lock.json`

---

## Directory Structure

```
src/
  app/                 # routes (App Router). One route = one folder.
  components/          # shared UI components, PascalCase filenames
  lib/
    supabase/          # client/server Supabase instances — import from here, never instantiate elsewhere
    rag/               # embedding + retrieval logic for the AI Coach
    curriculum/         # exercise/duration personalization calculators
content/
  curriculum/          # researched drill data (JSON) — Phase 2 output lives here
supabase/
  migrations/          # every schema change is a migration file, never a manual dashboard edit
docs/
  nutmeg-blueprint.md  # product spec — source of truth for scope
```

Server Components by default. Add `"use client"` only when a component needs interactivity (state, effects, browser APIs like `SpeechSynthesis` for the timer voice cues, or Framer Motion animation triggers).

---

## Code Style (with examples)

**Supabase client — always import, never re-instantiate:**
```ts
// Good
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()

// Bad — do not create a new client inline in a route/component
const supabase = createSupabaseClient(url, key)
```

**Data fetching — Server Components fetch directly, no client-side useEffect fetch for initial page data:**
```tsx
// Good — app/dashboard/page.tsx (Server Component)
const { data: tasks } = await supabase.from('daily_tasks').select('*')

// Bad — client-side fetch for data that's known at render time
useEffect(() => { fetch('/api/tasks').then(...) }, [])
```

**Timer/session state — session state persists across a pause, so use localStorage-backed state, not plain useState alone:**
```ts
// Good
const [session, setSession] = usePersistedState<SessionState>('active-session', initialState)

// Bad — lost on screen lock / tab switch
const [session, setSession] = useState<SessionState>(initialState)
```

**Styling — Tailwind utility classes directly, no separate CSS files per component:**
```tsx
// Good
<div className="rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10">

// Bad
<div className="workout-card">  // + a workout-card.css file
```

---

## Database Rules

- Every schema change goes through a migration in `supabase/migrations/` — never edit tables directly via the Supabase dashboard for anything that should persist.
- Row Level Security (RLS) must be enabled on every table before it's considered done. A table without RLS is not shippable, even in solo/personal use — friends will be added as real accounts later.
- `pgvector` embeddings table (for the RAG knowledge base) stays separate from user data tables — never mix curriculum content vectors with user profile/progress data in the same table.

---

## Security Considerations

- Never commit `.env.local` or any file containing `FIRECRAWL_API_KEY`, `EXA_API_KEY`, `TAVILY_API_KEY`, or Supabase keys. Confirm `.gitignore` covers `.env*.local` before every commit that touches env handling.
- No credit-card-gated services anywhere in the dependency tree — check a service's pricing page before adding it, not after.
- User-uploaded profile photos go through Supabase Storage with a signed-URL access pattern — never a public bucket for personal photos.

---

## AI Provider Routing (runtime AI features — RAG chat, embeddings, content generation)

Nutmeg uses AI at runtime for features that must be dynamically generated per-user, not hardcoded — AI Coach chat responses, curriculum knowledge-base embeddings, and any content generation that isn't part of the static Phase 2 curriculum. This is separate from OmniRoute (which routes Claude Code's own coding-assistant calls) — this section covers the app's own runtime AI calls to Gemini, Groq, Cerebras, OpenRouter, and Mistral.

**Task-based routing (not a single fallback chain — pick the right provider per task type):**

| Task | Primary | Why |
|---|---|---|
| RAG Chat (AI Coach responses) | **Groq** | Fastest inference, real-time chat needs low latency |
| Embeddings (pgvector knowledge base) | **Gemini** | Best embedding quality among free-tier options |
| Content generation (adaptive planning, personalized notes) | **Cerebras** | High daily token volume, good for bulk generation |
| Long-context reasoning (analyzing full progress history) | **Mistral** | Largest stable model catalog, dedicated reasoning model |
| Universal fallback (any task, if its primary provider fails/rate-limits) | **OpenRouter** → **Agnes AI** | OpenRouter routes to many providers as first backup; Agnes AI (agnes-ai.com, free omni-modal gateway) as second backup if OpenRouter also fails/rate-limits |

**Rules:**
- Every AI call must catch rate-limit/failure and fall back to OpenRouter first, then Agnes AI, automatically — never let a runtime AI feature hard-fail into a broken UI. Show a graceful "coach is thinking a bit longer" state instead.
- Keep provider clients in `lib/ai/` (mirrors the `lib/supabase/` pattern) — one client per provider, plus a `router.ts` that implements the task-based selection table above.
- API keys: `GEMINI_API_KEY`, `GROQ_API_KEY`, `CEREBRAS_API_KEY`, `OPENROUTER_API_KEY`, `MISTRAL_API_KEY`, `AGNES_AI_API_KEY` — all in `.env.local`, never committed.
- Free tiers are rate-limited, not unlimited — this task-based split exists specifically to spread load so no single provider's daily cap gets hit by every feature at once.

---

## MCP / Tool Usage Priority

Multiple search MCP servers are connected (Firecrawl, Exa, Tavily). Don't call more than one for the same sub-task:

1. **Firecrawl** — default for curriculum research (Phase 2), scraping coaching sites, full-page content extraction.
2. **Exa** — semantic/similarity search only (conceptual matching, not keyword lookup).
3. **Tavily** — multi-step synthesized research with citations across several sources.
4. **Playwright** — browser automation for testing the running app (timer flows, session UI), not for content research.
5. **Supabase MCP** — all database/migration/auth operations. Prefer this over writing raw SQL by hand outside a migration file.

---

## Things to Avoid

- Don't invent football curriculum content from memory — Phase 2 content must come from live research (Firecrawl/Exa/Tavily), per the blueprint.
- Don't add authentication complexity beyond Supabase Auth email — no custom JWT handling, no third-party auth providers, unless explicitly asked.
- Don't reach for a new npm package if Tailwind/Framer Motion/native browser APIs already cover the need (e.g. use `SpeechSynthesis`, not a paid TTS package, for timer voice cues).
- Don't run database migrations against production without saying so first — flag it and wait for confirmation.
- Don't skip RLS "for now" — it doesn't get retrofitted later in practice.
- Don't call multiple AI providers for the same runtime task "just in case" — follow the task-based routing table; only fall back to OpenRouter on actual failure.

---

## PR / Commit Guidelines

Conventional Commits format: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`. One logical change per commit. Reference the blueprint phase in the commit body when relevant, e.g. `feat: add guided session timer (Phase 4)`.

---

## Roadmap Execution Protocol

**Trigger phrase:** The user says `"execute ROADMAP.md"` or `"execute milestone N"`.

**What happens when triggered:**
1. Read ALL documentation files first:
   - `docs/PRD.md` — product requirements
   - `docs/TRD.md` — technical requirements (schema, API, providers)
   - `docs/design-system.md` — visual system (colors, typography, components)
   - `docs/ROADMAP.md` — build plan with task breakdown
   - `AGENTS.md` — this file
2. **Verify environment:** Check that `.env.local` has all required keys filled in. If any critical keys are missing (Supabase ×3, Gemini, Groq), STOP and tell the user to fill them in first. Do NOT proceed until env is ready.
3. Check `docs/ROADMAP.md` to find the current milestone (first with `COMPLETED: ❌ PENDING`)
3. Break the milestone into atomic tasks per the roadmap table
4. Dispatch parallel agents for independent tasks (max 4 at a time)
5. Agents report back with: files created, issues encountered, dependencies needed
6. Re-evaluate dependencies after each agent completes — dispatch newly unblocked tasks
7. When the milestone is fully complete, update `COMPLETED: ✅` in ROADMAP.md
8. **STOP** — do not proceed to the next milestone until the user says so

**Key rules:**
- Never skip a milestone — build in order
- Never assume a file exists — check first
- Never hard-fail an AI call — follow the provider routing table in TRD §6.3
- Never commit `.env.local` or API keys
- Always enable RLS on every new table
- Every schema change goes through a migration file
- One logical change per commit
- Reference the milestone in commit messages: `feat: add dashboard (Milestone 1)`

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
