/**
 * AI Module Index — Nutmeg
 * Main exports for the AI provider system
 */

// Types
export type {
  AITask,
  AIOptions,
  AIProvider,
  EmbeddingResult,
  ProviderConfig,
  ProviderName,
  RoutingEntry,
  TaskRouting,
} from './types'

// Providers
export { groq, createGroq, GroqError, groqCall } from './providers/groq'
export { gemini, createGemini, GeminiError, geminiCall, geminiEmbed } from './providers/gemini'
export { cerebras, createCerebras, CerebrasError, cerebrasCall } from './providers/cerebras'
export { mistral, createMistral, MistralError, mistralCall } from './providers/mistral'
export { openrouter, createOpenRouter, OpenRouterError, openrouterCall } from './providers/openrouter'
export { agnesAi, createAgnesAI, AgnesAIError, agnesAiCall } from './providers/agnes-ai'

// Router
export {
  routeAIRequest,
  routeEmbeddingRequest,
  TASK_ROUTING,
} from './router'