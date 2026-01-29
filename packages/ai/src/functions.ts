import type { Property } from '@propery/api-client'
import type { AIConfig, ChatMessage, AIContext, AIResponse } from './types'
import { chat, streamChat } from './providers'
import {
  SYSTEM_PROMPT,
  buildPropertyDescriptionPrompt,
  buildComparisonPrompt,
  buildNegotiationTipsPrompt,
  buildWhatsAppSummaryPrompt,
  buildQuestionsPrompt,
  buildSemanticSearchPrompt,
} from './prompts'

export { streamChat }

export async function describeProperty(config: AIConfig, property: Property): Promise<string> {
  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: buildPropertyDescriptionPrompt(property) },
  ]

  const response = await chat(config, messages, { currentProperty: property })
  return response.content
}

export async function compareProperties(config: AIConfig, properties: Property[]): Promise<string> {
  if (properties.length < 2) {
    throw new Error('Need at least 2 properties to compare')
  }

  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: buildComparisonPrompt(properties) },
  ]

  const response = await chat(config, messages, { comparedProperties: properties })
  return response.content
}

export async function getNegotiationTips(config: AIConfig, property: Property): Promise<string> {
  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: buildNegotiationTipsPrompt(property) },
  ]

  const response = await chat(config, messages, { currentProperty: property })
  return response.content
}

export async function generateWhatsAppSummary(
  config: AIConfig,
  property: Property
): Promise<string> {
  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: buildWhatsAppSummaryPrompt(property) },
  ]

  const response = await chat(config, messages, { currentProperty: property })
  return response.content
}

export async function suggestQuestions(config: AIConfig, property: Property): Promise<string> {
  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: buildQuestionsPrompt(property) },
  ]

  const response = await chat(config, messages, { currentProperty: property })
  return response.content
}

export async function semanticSearch(
  config: AIConfig,
  query: string
): Promise<Record<string, unknown>> {
  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: buildSemanticSearchPrompt(query) },
  ]

  const response = await chat(config, messages)

  try {
    // Try to parse JSON from the response
    const jsonMatch = response.content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch {
    // If parsing fails, return empty filters
  }

  return {}
}

export async function freeformChat(
  config: AIConfig,
  messages: ChatMessage[],
  context?: AIContext
): Promise<string> {
  const systemMessages: ChatMessage[] = [{ role: 'system', content: SYSTEM_PROMPT }]

  const response = await chat(config, [...systemMessages, ...messages], context)
  return response.content
}

export async function freeformStreamChat(
  config: AIConfig,
  messages: ChatMessage[],
  context?: AIContext,
  onChunk?: (chunk: string) => void
): Promise<AIResponse> {
  const systemMessages: ChatMessage[] = [{ role: 'system', content: SYSTEM_PROMPT }]

  return streamChat(config, [...systemMessages, ...messages], context, onChunk)
}
