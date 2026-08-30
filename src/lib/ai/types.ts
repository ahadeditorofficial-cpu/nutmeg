/**
 * AI Provider Types — Nutmeg
 * Shared types for all AI provider clients and router
 */

export type AITask =
  | 'rag_chat'
  | 'embeddings'
  | 'content_generation'
  | 'long_context_reasoning'

export interface AIOptions {
  model?: string
  temperature?: number
  maxTokens?: number
}

export interface AIProvider {
  /** Call the AI provider with input and options, returning the response text */
  call(input: string, options?: AIOptions): Promise<string>

  /** Optional: Generate embeddings for the embeddings task */
  embed?(input: string): Promise<EmbeddingResult>
}

export interface EmbeddingResult {
  vector: number[]
  dimensions: number
  model: string
}

export interface ProviderConfig {
  provider: string
  model: string
  apiKey: string
}

export type ProviderName =
  | 'groq'
  | 'gemini'
  | 'cerebras'
  | 'mistral'
  | 'openrouter'
  | 'agnes-ai'

export interface RoutingEntry {
  provider: ProviderName
  model: string
}

export type TaskRouting = Record<AITask, RoutingEntry[]>