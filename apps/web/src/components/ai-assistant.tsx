'use client'

import * as React from 'react'
import { AIChat, AIFloatingButton, AIChatHistory } from '@propery/ui/web'
import { useAIChatStore, useAIComparisonSync } from '@propery/core'
import { streamChat, type AIConfig, type ChatMessage } from '@propery/ai'

// Default AI config - in production, this would come from env/config
const AI_CONFIG: AIConfig = {
  provider: 'mock',
  model: 'gpt-4',
  maxTokens: 1000,
}

interface AIAssistantProps {
  className?: string
}

export function AIAssistant({ className }: AIAssistantProps): JSX.Element {
  const [showHistory, setShowHistory] = React.useState(false)

  // Sync comparison state with AI context
  useAIComparisonSync()

  const {
    isOpen,
    isMinimized,
    isLoading,
    streamingContent,
    inputValue,
    isListening,
    context,
    currentSession,
    sessions,
    openChat,
    closeChat,
    toggleMinimize,
    setLoading,
    setStreamingContent,
    appendStreamingContent,
    setInputValue,
    addMessage,
    startNewSession,
    loadSession,
    deleteSession,
    clearCurrentSession,
    setListening,
    canMakeRequest,
    trackRequest,
    getSuggestionCount,
  } = useAIChatStore()

  // Voice recognition setup
  const recognitionRef = React.useRef<SpeechRecognition | null>(null)

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognitionClass) {
        recognitionRef.current = new SpeechRecognitionClass()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'es-AR'

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let transcript = ''
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript
          }

          setInputValue(transcript)

          // If final result, stop listening
          if (event.results[event.results.length - 1].isFinal) {
            setListening(false)
          }
        }

        recognitionRef.current.onerror = () => {
          setListening(false)
        }

        recognitionRef.current.onend = () => {
          setListening(false)
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [setInputValue, setListening])

  const handleToggleVoice = () => {
    if (!recognitionRef.current) {
      // Voice recognition not supported
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setListening(false)
    } else {
      recognitionRef.current.start()
      setListening(true)
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!canMakeRequest()) {
      addMessage({
        role: 'assistant',
        content:
          'Has alcanzado el límite de mensajes por minuto. Por favor, esperá un momento antes de enviar otro mensaje.',
      })
      return
    }

    // Add user message
    const userMessage: ChatMessage = { role: 'user', content }
    addMessage(userMessage)
    setInputValue('')
    setLoading(true)
    setStreamingContent('')
    trackRequest()

    try {
      // Build messages array including history
      const messages: ChatMessage[] = [
        ...(currentSession?.messages || []),
        userMessage,
      ]

      // Stream the response
      await streamChat(
        AI_CONFIG,
        messages,
        {
          currentProperty: context.currentProperty || undefined,
          comparedProperties:
            context.comparedProperties.length > 0
              ? context.comparedProperties
              : undefined,
        },
        (chunk) => {
          appendStreamingContent(chunk)
        }
      )

      // Add final assistant message
      const finalContent = useAIChatStore.getState().streamingContent
      addMessage({ role: 'assistant', content: finalContent })
      setStreamingContent('')
    } catch (error) {
      addMessage({
        role: 'assistant',
        content:
          'Lo siento, ocurrió un error al procesar tu mensaje. Por favor, intentá de nuevo.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleChat = () => {
    if (isOpen) {
      closeChat()
    } else {
      openChat()
    }
  }

  const handleSelectSession = (sessionId: string) => {
    loadSession(sessionId)
    setShowHistory(false)
  }

  const suggestionCount = getSuggestionCount()

  // Transform sessions for history modal
  const historySessions = sessions.map((s) => ({
    id: s.id,
    title: s.title,
    updatedAt: s.updatedAt,
    messageCount: s.messages.length,
  }))

  return (
    <>
      <AIFloatingButton
        isOpen={isOpen}
        suggestionCount={suggestionCount}
        onClick={handleToggleChat}
        className={className}
      />

      <AIChat
        isOpen={isOpen}
        isMinimized={isMinimized}
        isLoading={isLoading}
        messages={currentSession?.messages || []}
        streamingContent={streamingContent}
        inputValue={inputValue}
        isListening={isListening}
        hasCurrentProperty={context.currentProperty !== null}
        hasComparison={context.comparedProperties.length >= 2}
        currentPropertyTitle={context.currentProperty?.title}
        onClose={closeChat}
        onToggleMinimize={toggleMinimize}
        onSendMessage={handleSendMessage}
        onInputChange={setInputValue}
        onToggleVoice={handleToggleVoice}
        onNewSession={startNewSession}
        onClearSession={clearCurrentSession}
        onShowHistory={() => setShowHistory(true)}
      />

      <AIChatHistory
        isOpen={showHistory}
        sessions={historySessions}
        currentSessionId={currentSession?.id}
        onClose={() => setShowHistory(false)}
        onSelectSession={handleSelectSession}
        onDeleteSession={deleteSession}
      />
    </>
  )
}

// Type declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList
  readonly resultIndex: number
}

interface SpeechRecognitionResultList {
  readonly length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  readonly length: number
  readonly isFinal: boolean
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  readonly transcript: string
  readonly confidence: number
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: Event) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}
