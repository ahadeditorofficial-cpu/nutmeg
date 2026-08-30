import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import 'server-only'

export async function createClient() {
  const cookieStore = await cookies()

  const cookieMethods = {
    getAll: () => cookieStore.getAll(),
    setAll: (cookiesToSet: Array<{ name: string; value: string; options?: object }>) => {
      for (const { name, value, options } of cookiesToSet) {
        cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
      }
    },
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieMethods }
  )
}

export async function auth() {
  const supabase = await createClient()
  return supabase.auth.getUser()
}
