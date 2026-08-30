// Edge Function: ingest-rag
// Intended purpose: ingest curriculum content into rag_chunk and rag_embedding.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // TODO: Load curriculum_exercise rows with their curriculum_day metadata.
    // TODO: Generate embeddings through the app AI router using Gemini first,
    //       then OpenRouter and Agnes AI fallback.
    // TODO: Insert rag_chunk rows, then matching rag_embedding rows.
    // Keep the client in this stub so deployment validates environment wiring.
    void supabase

    return jsonResponse({
      success: true,
      message: 'ingest-rag stub ready',
      ingested: 0,
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
