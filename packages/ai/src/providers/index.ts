import type { AIConfig, ChatMessage, AIResponse, AIContext } from '../types'
import { mockChat, mockStream } from './mock'

export async function chat(
  config: AIConfig,
  messages: ChatMessage[],
  context?: AIContext
): Promise<AIResponse> {
  switch (config.provider) {
    case 'mock':
      return mockChat(messages, context)

    case 'openai':
      // OpenAI implementation would go here
      // For now, fall back to mock
      console.warn('OpenAI provider not implemented, using mock')
      return mockChat(messages, context)

    case 'anthropic':
      // Anthropic implementation would go here
      // For now, fall back to mock
      console.warn('Anthropic provider not implemented, using mock')
      return mockChat(messages, context)

    default:
      throw new Error(`Unknown AI provider: ${config.provider}`)
  }
}

export async function streamChat(
  config: AIConfig,
  messages: ChatMessage[],
  context?: AIContext,
  onChunk?: (chunk: string) => void
): Promise<AIResponse> {
  switch (config.provider) {
    case 'mock':
      return mockStream(messages, context, onChunk)

    case 'openai':
    case 'anthropic':
      console.warn(`${config.provider} streaming not implemented, using mock`)
      return mockStream(messages, context, onChunk)

    default:
      throw new Error(`Unknown AI provider: ${config.provider}`)
  }
}
