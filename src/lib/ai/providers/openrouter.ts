/**
 * OpenRouter Provider Client
 * Universal fallback (first backup) for all tasks
 * Free models: dots-studio/dots-3-note-preview:free, nvidia/nemotron-3-super-120b-a12b:free, openrouter/free
 *
 * Uses fetch to OpenRouter OpenAI-compatible API.
 * Docs: https://openrouter.ai/docs/api-reference/overview
 */

import type { AIOptions, AIProvider } from '../types'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

const DEFAULT_MODEL = 'openrouter/free'

function getApiKey(): string {
  const key = process.env.OPENROUTER_API_KEY
  if (!key) {
    throw new Error('OPENROUTER_API_KEY is not set in environment')
  }
  return key
}

export class OpenRouterError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'OpenRouterError'
    this.status = status
  }
}

export async function openrouterCall(
  input: string,
  options?: AIOptions
): Promise<string> {
  const apiKey = getApiKey()
  const model = options?.model ?? DEFAULT_MODEL

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://nutmeg.app',
      'X-Title': 'Nutmeg Football Training',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: input }],
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2048,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '')
    throw new OpenRouterError(
      `OpenRouter API error ${response.status}: ${errorBody}`,
      response.status
    )
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }

  const content = data.choices?.[0]?.message?.content
  if (!content) {
    throw new OpenRouterError(
      'OpenRouter returned empty response',
      response.status
    )
  }

  return content
}

export const openrouter: AIProvider = {
  call: openrouterCall,
}

export function createOpenRouter(config?: { apiKey?: string }): AIProvider {
  return {
    call: async (input: string, options?: AIOptions) => {
      if (config?.apiKey) {
        process.env.OPENROUTER_API_KEY = config.apiKey
      }
      return openrouterCall(input, options)
    },
  }
}
