// Edge Function: rewrite-plan
// Intended purpose: adapt a user's plan based on progress, ratings, and coach output.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RewritePlanRequest {
  userId: string
  currentDayNumber?: number
  reason?: string
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  })
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  try {
    const authHeader = req.headers.get('Authorization')

    if (!authHeader) {
      return jsonResponse({ error: 'Authorization required' }, 401)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return jsonResponse({ error: 'Invalid token' }, 401)
    }

    const body = (await req.json()) as RewritePlanRequest

    if (body.userId !== user.id) {
      return jsonResponse({ error: 'Unauthorized' }, 403)
    }

    // TODO: Read recent user_day_progress, journal_entry, session_summary,
    //       fitness_retest, and the user's current curriculum context.
    // TODO: Call the app AI router for content_generation with fallback.
    // TODO: Persist the rewritten plan changes to user_plan/user_day_progress.

    return jsonResponse({
      success: true,
      message: 'rewrite-plan stub ready',
      userId: body.userId,
      currentDayNumber: body.currentDayNumber ?? null,
      reason: body.reason ?? null,
    })
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
})
