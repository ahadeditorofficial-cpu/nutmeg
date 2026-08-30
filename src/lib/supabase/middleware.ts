import { createServerClient, type CookieMethodsServer } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export function createClient(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  })

  const cookieMethods: CookieMethodsServer = {
    getAll: () => request.cookies.getAll(),
    setAll: (cookiesToSet, headers) => {
      for (const { name, value, options } of cookiesToSet) {
        response.cookies.set(name, value, options)
      }
      for (const [key, value] of Object.entries(headers)) {
        response.headers.set(key, value)
      }
    },
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieMethods }
  )

  return { supabase, response }
}

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)

  // Refresh the session if it exists, ensuring cookies are updated on the response.
  // Calling this before any response is committed is critical — see @supabase/ssr docs.
  await supabase.auth.getSession()

  return response
}