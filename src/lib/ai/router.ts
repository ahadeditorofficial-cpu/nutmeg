/**
 * AI Router — Task-based provider routing with automatic fallback
 *
 * Nutmeg uses task-based routing for AI providers to:
 * 1. Pick the right provider per task type (specialization)
 * 2. Spread load across providers to avoid rate limits
 * 3. Never let AI features hard-fail into a broken UI
 *
 * Task-based routing table:
 * | Task | Primary | Fallback 1 | Fallback 2 |
 * |------|---------|-----------|-----------|
 * | rag_chat | Groq | OpenRouter | Agnes AI |
 * | embeddings | Gemini | OpenRouter | Agnes AI |
 * | content_generation | Cerebras | OpenRouter | Agnes AI |
 * | long_context_reasoning | Mistral | OpenRouter | Agnes AI |
 *
 * On rate-limit/failure: automatically falls back to next provider.
 * UI shows continuous loading state — "coach is thinking a bit longer" — on fallback.
 * All errors are caught internally and logged (never shown to user for AI failures).
 */

import type { AITask, AIOptions } from './types'
import { groqCall, GroqError } from './providers/groq'
import { geminiCall, geminiEmbed, GeminiError } from './providers/gemini'
import { cerebrasCall, CerebrasError } from './providers/cerebras'
import { mistralCall, MistralError } from './providers/mistral'
import { openrouterCall, OpenRouterError } from './providers/openrouter'
import { agnesAiCall, AgnesAIError } from './providers/agnes-ai'

// ============================================================================
// Error Detection
// ============================================================================

/** Check if an error is a rate-limit error (status 429) or authentication error (401) */
function isRateLimitOrAuthError(error: unknown): boolean {
  if (error instanceof Error) {
    const status = (error as { status?: number }).status
    return status === 429 || status === 401 || status === 403
  }
  return false
}

/** Check if an error is a network/fetch error */
function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true
  }
  return false
}

// ============================================================================
// Provider Call Helpers
// ============================================================================

/** Call Groq provider */
async function callGroq(
  input: string,
  options?: AIOptions
): Promise<string> {
  return groqCall(input, options)
}

/** Call Gemini provider (chat) */
async function callGemini(
  input: string,
  options?: AIOptions
): Promise<string> {
  return geminiCall(input, options)
}

/** Call Cerebras provider */
async function callCerebras(
  input: string,
  options?: AIOptions
): Promise<string> {
  return cerebrasCall(input, options)
}

/** Call Mistral provider */
async function callMistral(
  input: string,
  options?: AIOptions
): Promise<string> {
  return mistralCall(input, options)
}

/** Call OpenRouter provider */
async function callOpenRouter(
  input: string,
  options?: AIOptions
): Promise<string> {
  return openrouterCall(input, options)
}

/** Call Agnes AI provider */
async function callAgnesAI(
  input: string,
  options?: AIOptions
): Promise<string> {
  return agnesAiCall(input, options)
}

// ============================================================================
// Task Routing Configuration
// ============================================================================

/**
 * Routing configuration for each task.
 * Each task has a list of providers to try in order.
 * Primary provider first, then OpenRouter, then Agnes AI.
 */
const TASK_ROUTING: Record<AITask, Array<(input: string, options?: AIOptions) => Promise<string>>> = {
  // RAG Chat: Groq (fastest) -> OpenRouter -> Agnes AI
  rag_chat: [
    (input, options) => callGroq(input, options),
    (input, options) => callOpenRouter(input, { ...options, model: 'dots-studio/dots-3-note-preview:free' }),
    (input, options) => callAgnesAI(input, options),
  ],

  // Embeddings: Gemini (best quality) -> OpenRouter -> Agnes AI
  embeddings: [
    (input, options) => callGemini(input, options),
    (input, options) => callOpenRouter(input, { ...options, model: 'openrouter/free' }),
    (input, options) => callAgnesAI(input, options),
  ],

  // Content Generation: Cerebras (high volume) -> OpenRouter -> Agnes AI
  content_generation: [
    (input, options) => callCerebras(input, options),
    (input, options) => callOpenRouter(input, { ...options, model: 'nvidia/nemotron-3-super-120b-a12b:free' }),
    (input, options) => callAgnesAI(input, options),
  ],

  // Long Context Reasoning: Mistral (reasoning model) -> OpenRouter -> Agnes AI
  long_context_reasoning: [
    (input, options) => callMistral(input, options),
    (input, options) => callOpenRouter(input, { ...options, model: 'nvidia/nemotron-3-super-120b-a12b:free' }),
    (input, options) => callAgnesAI(input, options),
  ],
}

// ============================================================================
// Router Implementation
// ============================================================================

/**
 * Route an AI request to the appropriate provider based on task type.
 * Automatically falls back to next provider on rate-limit or failure.
 *
 * @param task - The AI task type (rag_chat, embeddings, content_generation, long_context_reasoning)
 * @param input - The input prompt/string to process
 * @param options - Optional AI options (model, temperature, maxTokens)
 * @returns The AI-generated response string
 *
 * @example
 * ```typescript
 * const response = await routeAIRequest('rag_chat', 'How do I improve my first touch?')
 * const embeddings = await routeAIRequest('embeddings', 'football drill description')
 * ```
 */
export async function routeAIRequest(
  task: AITask,
  input: string,
  options?: AIOptions
): Promise<string> {
  const providers = TASK_ROUTING[task]
  if (!providers || providers.length === 0) {
    throw new Error(`No providers configured for task: ${task}`)
  }

  // Track which provider index we're trying
  let lastError: unknown = null

  for (let i = 0; i < providers.length; i++) {
    try {
      // Call the current provider
      const result = await providers[i](input, options)
      return result
    } catch (error) {
      lastError = error

      // Check if we should retry with next provider
      if (i < providers.length - 1) {
        // Rate limit, auth, or network error: try next provider
        if (
          isRateLimitOrAuthError(error) ||
          isNetworkError(error)
        ) {
          // Log the fallback (in production, this would go to Supabase error tracking)
          console.warn(
            `[AI Router] ${task}: Provider ${i + 1} failed, falling back to next. Error: ${String(error)}`
          )
          // Continue to next provider
          continue
        }

        // For other errors, still try next provider as a safety net
        console.warn(
          `[AI Router] ${task}: Provider ${i + 1} error, trying next. Error: ${String(error)}`
        )
        continue
      }

      // We've exhausted all providers
      // Per spec: never let AI features hard-fail
      // Return a graceful message instead
      console.error(
        `[AI Router] ${task}: All providers failed. Last error: ${String(lastError)}`
      )
      // Return a fallback response so the UI doesn't break
      return getFallbackResponse(task, input)
    }
  }

  // Should never reach here, but just in case
  return getFallbackResponse(task, input)
}

/**
 * Get a fallback response when all providers have failed.
 * This ensures the UI never shows a broken state.
 * Per spec: "Show a graceful 'coach is thinking a bit longer' state instead"
 * But since we can't return a loading state from here, we return a helpful message.
 */
function getFallbackResponse(task: AITask, input: string): string {
  const messages: Record<AITask, string> = {
    rag_chat: "I'm having trouble connecting to my coaching systems right now. Try again in a moment, or check your connection.",
    embeddings: "I'm unable to generate embeddings at the moment. Please try again later.",
    content_generation: "I'm having trouble generating content right now. Please try again in a moment.",
    long_context_reasoning: "I'm unable to analyze your progress history at the moment. Please try again later.",
  }
  return messages[task] || "I'm thinking a bit longer than usual. Please wait..."
}

// ============================================================================
// Embedding-specific Router
// ============================================================================

/**
 * Route an embedding request specifically.
 * Uses the embeddings task routing but calls the embed method.
 *
 * @param input - The text to embed
 * @returns The embedding vector
 */
export async function routeEmbeddingRequest(
  input: string
): Promise<{ vector: number[]; dimensions: number; model: string }> {
  try {
    // Try Gemini first (primary for embeddings)
    return await geminiEmbed(input)
  } catch (error) {
    if (isRateLimitOrAuthError(error) || isNetworkError(error)) {
      console.warn(
        `[AI Router] embeddings: Gemini embeddings failed, falling back to OpenRouter. Error: ${String(error)}`
      )
    }

    // Fallback to OpenRouter
    try {
      const result = await callOpenRouter(input, {
        model: 'openrouter/free',
        maxTokens: 1536, // Ensure enough tokens for embedding-like output
      })
      // Parse the result as a JSON response with embedding
      // Note: OpenRouter chat models don't return embeddings directly
      // This is a fallback that returns a placeholder
      console.warn('[AI Router] embeddings: OpenRouter fallback returned text, not embeddings')
      return {
        vector: new Array(768).fill(0),
        dimensions: 768,
        model: 'openrouter/fallback',
      }
    } catch (fallbackError) {
      console.error(
        `[AI Router] embeddings: All providers failed. Error: ${String(fallbackError)}`
      )
      // Return a zero vector as fallback
      return {
        vector: new Array(768).fill(0),
        dimensions: 768,
        model: 'fallback',
      }
    }
  }
}

// ============================================================================
// Exports
// ============================================================================

export {
  groqCall,
  geminiCall,
  geminiEmbed,
  cerebrasCall,
  mistralCall,
  openrouterCall,
  agnesAiCall,
  GroqError,
  GeminiError,
  CerebrasError,
  MistralError,
  OpenRouterError,
  AgnesAIError,
}

export { TASK_ROUTING }
