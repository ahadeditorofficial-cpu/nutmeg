/**
 * Gemini Provider Client
 * Primary for: embeddings
 * Free models: gemini-1.5-flash-lite (embeddings, 768 dims), gemini-1.5-flash (chat fallback)
 *
 * Uses fetch to Google Generative Language API.
 * Docs: https://ai.google.dev/api/rest
 */

import type { AIOptions, AIProvider, EmbeddingResult } from '../types'

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta'

const DEFAULT_CHAT_MODEL = 'gemini-1.5-flash'
const DEFAULT_EMBED_MODEL = 'gemini-1.5-flash-lite'
const EMBEDDING_DIMENSIONS = 768

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY
  if (!key) {
    throw new Error('GEMINI_API_KEY is not set in environment')
  }
  return key
}

export class GeminiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'GeminiError'
    this.status = status
  }
}

export async function geminiCall(
  input: string,
  options?: AIOptions
): Promise<string> {
  const apiKey = getApiKey()
  const model = options?.model ?? DEFAULT_CHAT_MODEL
  const url = `${GEMINI_BASE_URL}/models/${model}:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: input }] }],
      generationConfig: {
        temperature: options?.temperature ?? 0.7,
        maxOutputTokens: options?.maxTokens ?? 2048,
      },
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '')
    throw new GeminiError(
      `Gemini API error ${response.status}: ${errorBody}`,
      response.status
    )
  }

  const data = (await response.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> }
    }>
  }

  const content = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!content) {
    throw new GeminiError('Gemini returned empty response', response.status)
  }

  return content
}

export async function geminiEmbed(input: string): Promise<EmbeddingResult> {
  const apiKey = getApiKey()
  const model = DEFAULT_EMBED_MODEL
  const url = `${GEMINI_BASE_URL}/models/${model}:embedContent?key=${apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: `models/${model}`,
      content: { parts: [{ text: input }] },
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '')
    throw new GeminiError(
      `Gemini embedding error ${response.status}: ${errorBody}`,
      response.status
    )
  }

  const data = (await response.json()) as {
    embedding?: { values?: number[] }
  }

  const vector = data.embedding?.values
  if (!vector || vector.length === 0) {
    throw new GeminiError('Gemini returned empty embedding', response.status)
  }

  return {
    vector,
    dimensions: vector.length || EMBEDDING_DIMENSIONS,
    model,
  }
}

export const gemini: AIProvider = {
  call: geminiCall,
  embed: geminiEmbed,
}

export function createGemini(config?: { apiKey?: string }): AIProvider {
  return {
    call: async (input: string, options?: AIOptions) => {
      if (config?.apiKey) {
        process.env.GEMINI_API_KEY = config.apiKey
      }
      return geminiCall(input, options)
    },
    embed: geminiEmbed,
  }
}
