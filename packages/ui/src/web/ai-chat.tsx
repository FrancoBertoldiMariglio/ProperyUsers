'use client'

import * as React from 'react'
import {
  Minus,
  Maximize2,
  Send,
  Mic,
  MicOff,
  History,
  Trash2,
  Plus,
  Home,
  GitCompare,
  MessageSquare,
  Share2,
  HelpCircle,
  Sparkles,
} from 'lucide-react'
import { cn } from '../shared/utils'
import { Button } from './button'
import type { ChatMessage as AIChatMessageType } from '@propery/ai'

// Re-export ChatMessage type for consumers
export type ChatMessage = AIChatMessageType

interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  prompt: string
  requiresProperty?: boolean
  requiresComparison?: boolean
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'describe',
    label: 'Describir propiedad',
    icon: <Home className="h-4 w-4" />,
    prompt: 'Describí esta propiedad de forma atractiva',
    requiresProperty: true,
  },
  {
    id: 'compare',
    label: 'Comparar selección',
    icon: <GitCompare className="h-4 w-4" />,
    prompt: 'Compará las propiedades que tengo seleccionadas',
    requiresComparison: true,
  },
  {
    id: 'negotiate',
    label: 'Tips de negociación',
    icon: <MessageSquare className="h-4 w-4" />,
    prompt: 'Dame consejos para negociar esta propiedad',
    requiresProperty: true,
  },
  {
    id: 'whatsapp',
    label: 'Resumen WhatsApp',
    icon: <Share2 className="h-4 w-4" />,
    prompt: 'Generá un resumen corto para compartir por WhatsApp',
    requiresProperty: true,
  },
  {
    id: 'questions',
    label: 'Preguntas sugeridas',
    icon: <HelpCircle className="h-4 w-4" />,
    prompt: '¿Qué preguntas debería hacerle al vendedor?',
    requiresProperty: true,
  },
]

interface AIChatProps {
  isOpen: boolean
  isMinimized: boolean
  isLoading: boolean
  messages: AIChatMessageType[]
  streamingContent: string
  inputValue: string
  isListening: boolean
  hasCurrentProperty: boolean
  hasComparison: boolean
  currentPropertyTitle?: string
  onClose: () => void
  onToggleMinimize: () => void
  onSendMessage: (message: string) => void
  onInputChange: (value: string) => void
  onToggleVoice: () => void
  onNewSession: () => void
  onClearSession: () => void
  onShowHistory: () => void
  className?: string
}

function AIChatMessage({
  message,
  isStreaming = false,
}: {
  message: AIChatMessageType
  isStreaming?: boolean
}): JSX.Element {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm',
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-md'
            : 'bg-muted text-foreground rounded-bl-md'
        )}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        {isStreaming && (
          <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-current" />
        )}
      </div>
    </div>
  )
}

function QuickActionButton({
  action,
  disabled,
  onClick,
}: {
  action: QuickAction
  disabled: boolean
  onClick: () => void
}): JSX.Element {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors',
        disabled
          ? 'cursor-not-allowed opacity-50'
          : 'hover:bg-accent hover:text-accent-foreground'
      )}
    >
      {action.icon}
      {action.label}
    </button>
  )
}

export function AIChat({
  isOpen,
  isMinimized,
  isLoading,
  messages,
  streamingContent,
  inputValue,
  isListening,
  hasCurrentProperty,
  hasComparison,
  currentPropertyTitle,
  onClose: _onClose,
  onToggleMinimize,
  onSendMessage,
  onInputChange,
  onToggleVoice,
  onNewSession,
  onClearSession,
  onShowHistory,
  className,
}: AIChatProps): JSX.Element | null {
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  // Focus input when chat opens
  React.useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim())
    }
  }

  const handleQuickAction = (action: QuickAction) => {
    if (!isLoading) {
      onSendMessage(action.prompt)
    }
  }

  const availableActions = QUICK_ACTIONS.filter((action) => {
    if (action.requiresProperty && !hasCurrentProperty) return false
    if (action.requiresComparison && !hasComparison) return false
    return true
  })

  if (!isOpen) return null

  return (
    <div
      className={cn(
        'fixed bottom-24 right-6 z-50 flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl transition-all duration-300',
        isMinimized ? 'h-14 w-72' : 'h-[32rem] w-96',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="font-semibold">Asistente Propery</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onShowHistory}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Historial"
          >
            <History className="h-4 w-4" />
          </button>
          <button
            onClick={onNewSession}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Nueva conversación"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={onToggleMinimize}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={isMinimized ? 'Expandir' : 'Minimizar'}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Content (hidden when minimized) */}
      {!isMinimized && (
        <>
          {/* Context indicator */}
          {hasCurrentProperty && currentPropertyTitle && (
            <div className="border-b border-border bg-primary/5 px-4 py-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Contexto:</span>{' '}
              {currentPropertyTitle.slice(0, 40)}
              {currentPropertyTitle.length > 40 && '...'}
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 && !streamingContent ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <Sparkles className="mb-3 h-10 w-10 text-muted-foreground/50" />
                <p className="mb-1 font-medium">¿En qué puedo ayudarte?</p>
                <p className="mb-4 text-sm text-muted-foreground">
                  Preguntame sobre propiedades, precios o zonas
                </p>

                {/* Quick actions when no messages */}
                {availableActions.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {availableActions.slice(0, 3).map((action) => (
                      <QuickActionButton
                        key={action.id}
                        action={action}
                        disabled={isLoading}
                        onClick={() => handleQuickAction(action)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {messages.map((msg, idx) => (
                  <AIChatMessage key={idx} message={msg} />
                ))}
                {streamingContent && (
                  <AIChatMessage
                    message={{ role: 'assistant', content: streamingContent }}
                    isStreaming
                  />
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Quick actions bar (shown when messages exist) */}
          {messages.length > 0 && availableActions.length > 0 && (
            <div className="border-t border-border bg-muted/30 px-3 py-2">
              <div className="flex gap-2 overflow-x-auto scrollbar-thin">
                {availableActions.map((action) => (
                  <QuickActionButton
                    key={action.id}
                    action={action}
                    disabled={isLoading}
                    onClick={() => handleQuickAction(action)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <button
              type="button"
              onClick={onToggleVoice}
              className={cn(
                'rounded-full p-2 transition-colors',
                isListening
                  ? 'bg-destructive text-destructive-foreground animate-pulse'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
              aria-label={isListening ? 'Detener grabación' : 'Hablar'}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>

            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder={isListening ? 'Escuchando...' : 'Escribí tu mensaje...'}
              disabled={isLoading || isListening}
              className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
            />

            <Button
              type="submit"
              size="icon"
              disabled={!inputValue.trim() || isLoading}
              className="h-9 w-9 rounded-full"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>

          {/* Clear session button */}
          {messages.length > 0 && (
            <div className="border-t border-border bg-muted/30 px-3 py-2">
              <button
                onClick={onClearSession}
                className="flex w-full items-center justify-center gap-2 rounded-md py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Trash2 className="h-3 w-3" />
                Limpiar conversación
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
