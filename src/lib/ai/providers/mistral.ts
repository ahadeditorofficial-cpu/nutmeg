/**
 * Mistral Provider Client
 * Primary for: long_context_reasoning
 * Free models: mistral-small-latest, mistral-medium-3-5, codestral-latest, devstral-latest
 *
 * Uses fetch to Mistral API.
 * Docs: https://docs.mistral.ai/api/
 */

import type { AIOptions, AIProvider } from '../types'

const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions'

const DEFAULT_MODEL = 'mistral-medium-latest'

function getApiKey(): string {
  const key = process.env.MISTRAL_API_KEY
  if (!key) {
    throw new Error('MISTRAL_API_KEY is not set in environment')
  }
  return key
}

export class MistralError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'MistralError'
    this.status = status
  }
}

export async function mistralCall(
  input: string,
  options?: AIOptions
): Promise<string> {
  const apiKey = getApiKey()
  const model = options?.model ?? DEFAULT_MODEL

  const response = await fetch(MISTRAL_API_URL, {
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
    throw new MistralError(
      `Mistral API error ${response.status}: ${errorBody}`,
      response.status
    )
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }

  const content = data.choices?.[0]?.message?.content
  if (!content) {
    throw new MistralError('Mistral returned empty response', response.status)
  }

  return content
}

export const mistral: AIProvider = {
  call: mistralCall,
}

export function createMistral(config?: { apiKey?: string }): AIProvider {
  return {
    call: async (input: string, options?: AIOptions) => {
      if (config?.apiKey) {
        process.env.MISTRAL_API_KEY = config.apiKey
      }
      return mistralCall(input, options)
    },
  }
}
