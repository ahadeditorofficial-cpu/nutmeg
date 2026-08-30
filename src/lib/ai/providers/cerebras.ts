/**
 * Cerebras Provider Client
 * Primary for: content_generation
 * High daily token volume, good for bulk generation (adaptive planning, personalized notes)
 *
 * Uses fetch to Cerebras OpenAI-compatible API.
 * Docs: https://inference-docs.cerebras.ai/api-reference/chat-completions
 */

import type { AIOptions, AIProvider } from '../types'

const CEREBRAS_API_URL = 'https://api.cerebras.ai/v1/chat/completions'

const DEFAULT_MODEL = 'llama-3.3-70b'

function getApiKey(): string {
  const key = process.env.CEREBRAS_API_KEY
  if (!key) {
    throw new Error('CEREBRAS_API_KEY is not set in environment')
  }
  return key
}

export class CerebrasError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'CerebrasError'
    this.status = status
  }
}

export async function cerebrasCall(
  input: string,
  options?: AIOptions
): Promise<string> {
  const apiKey = getApiKey()
  const model = options?.model ?? DEFAULT_MODEL

  const response = await fetch(CEREBRAS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
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
    throw new CerebrasError(
      `Cerebras API error ${response.status}: ${errorBody}`,
      response.status
    )
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }

  const content = data.choices?.[0]?.message?.content
  if (!content) {
    throw new CerebrasError('Cerebras returned empty response', response.status)
  }

  return content
}

export const cerebras: AIProvider = {
  call: cerebrasCall,
}

export function createCerebras(config?: { apiKey?: string }): AIProvider {
  return {
    call: async (input: string, options?: AIOptions) => {
      if (config?.apiKey) {
        process.env.CEREBRAS_API_KEY = config.apiKey
      }
      return cerebrasCall(input, options)
    },
  }
}
