import type { Property } from '@propery/api-client'

export type AIProvider = 'openai' | 'anthropic' | 'mock'

export interface AIConfig {
  provider: AIProvider
  apiKey?: string
  model?: string
  maxTokens?: number
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface AIContext {
  currentProperty?: Property
  comparedProperties?: Property[]
  userPreferences?: {
    searchType: 'buy' | 'rent'
    budget: { min: number; max: number }
    neighborhoods: string[]
  }
}

export interface AIResponse {
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export interface AIFunction {
  name: string
  description: string
  parameters: Record<string, unknown>
}

export interface AIFunctionCall {
  name: string
  arguments: Record<string, unknown>
}
