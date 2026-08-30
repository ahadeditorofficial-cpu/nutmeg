/**
 * Groq Provider Client
 * Primary for: rag_chat
 * Free models: groq/openai/gpt-oss-120b, groq/openai/gpt-oss-20b, groq/qwen/qwen3.6-27b
 *
 * Uses fetch to Groq's OpenAI-compatible API.
 * Docs: https://console.groq.com/docs/api-reference
 */

import type { AIOptions, AIProvider } from '../types'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

const DEFAULT_MODEL = 'openai/gpt-oss-120b'

function getApiKey(): string {
  const key = process.env.GROQ_API_KEY
  if (!key) {
    throw new Error('GROQ_API_KEY is not set in environment')
  }
  return key
}

export async function groqCall(
  input: string,
  options?: AIOptions
): Promise<string> {
  const apiKey = getApiKey()
  const model = options?.model ?? DEFAULT_MODEL

  const response = await fetch(GROQ_API_URL, {
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
    throw new GroqError(
      `Groq API error ${response.status}: ${errorBody}`,
      response.status
    )
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }

  const content = data.choices?.[0]?.message?.content
  if (!content) {
    throw new GroqError('Groq returned empty response', response.status)
  }

  return content
}

export class GroqError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'GroqError'
    this.status = status
  }
}

export const groq: AIProvider = {
  call: groqCall,
}

export function createGroq(config?: { apiKey?: string }): AIProvider {
  return {
    call: async (input: string, options?: AIOptions) => {
      if (config?.apiKey) {
        process.env.GROQ_API_KEY = config.apiKey
      }
      return groqCall(input, options)
    },
  }
}
