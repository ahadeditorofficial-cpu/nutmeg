/**
 * Agnes AI Provider Client
 * Universal fallback (second backup) for all tasks
 * Free model: agnes/agnes-2.0-flash
 *
 * Uses fetch to Agnes AI OpenAI-compatible API.
 * Docs: https://agnes-ai.com
 */

import type { AIOptions, AIProvider } from '../types'

const AGNES_AI_API_URL = 'https://api.agnes-ai.com/v1/chat/completions'

const DEFAULT_MODEL = 'agnes-2.0-flash'

function getApiKey(): string {
  const key = process.env.AGNES_AI_API_KEY
  if (!key) {
    throw new Error('AGNES_AI_API_KEY is not set in environment')
  }
  return key
}

export class AgnesAIError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'AgnesAIError'
    this.status = status
  }
}

export async function agnesAiCall(
  input: string,
  options?: AIOptions
): Promise<string> {
  const apiKey = getApiKey()
  const model = options?.model ?? DEFAULT_MODEL

  const response = await fetch(AGNES_AI_API_URL, {
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
    throw new AgnesAIError(
      `Agnes AI API error ${response.status}: ${errorBody}`,
      response.status
    )
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }

  const content = data.choices?.[0]?.message?.content
  if (!content) {
    throw new AgnesAIError(
      'Agnes AI returned empty response',
      response.status
    )
  }

  return content
}

export const agnesAi: AIProvider = {
  call: agnesAiCall,
}

export function createAgnesAI(config?: { apiKey?: string }): AIProvider {
  return {
    call: async (input: string, options?: AIOptions) => {
      if (config?.apiKey) {
        process.env.AGNES_AI_API_KEY = config.apiKey
      }
      return agnesAiCall(input, options)
    },
  }
}
