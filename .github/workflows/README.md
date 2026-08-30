# GitHub Actions Workflows

## deploy.yml

Deploys the app on every push to `main`:

1. Checks out code
2. Sets up Node.js 20 and installs dependencies
3. Sets up the Supabase CLI and pushes all migrations in `supabase/migrations/`
4. Deploys the Next.js build to Vercel in production mode

**Required secrets:**

| Secret | Purpose |
|---|---|
| `SUPABASE_ACCESS_TOKEN` | Supabase CLI auth token (generate at <https://supabase.com/dashboard/settings/api>) |
| `SUPABASE_DB_URL` | Database connection string (format: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`) |
| `VERCEL_TOKEN` | Vercel personal access token (generate at <https://vercel.com/account/tokens>) |
| `VERCEL_ORG_ID` | Vercel organization ID (from Vercel dashboard settings) |
| `VERCEL_PROJECT_ID` | Vercel project ID (from Vercel dashboard settings) |

## supabase-keepalive.yml

Runs on a cron schedule (every 5 days at 05:00 UTC) to ping the Supabase REST endpoint, preventing the free-tier project from auto-pausing after 7 days of inactivity.

**Required secrets:**

| Secret | Purpose |
|---|---|
| `SUPABASE_API_URL` | Supabase project URL (e.g. `https://<project-ref>.supabase.co`) |
| `SUPABASE_ANON_KEY` | Supabase anon/public key (found in Project Settings > API) |

## Security

Neither workflow reads or commits `.env.local`. All secrets are injected at runtime via GitHub Actions secrets and never appear in logs or the repository.
