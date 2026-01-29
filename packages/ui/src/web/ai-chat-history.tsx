'use client'

import * as React from 'react'
import { MessageSquare, Trash2, X } from 'lucide-react'
import { cn } from '../shared/utils'
import { Button } from './button'

interface ChatSession {
  id: string
  title: string
  updatedAt: string
  messageCount: number
}

interface AIChatHistoryProps {
  isOpen: boolean
  sessions: ChatSession[]
  currentSessionId?: string
  onClose: () => void
  onSelectSession: (sessionId: string) => void
  onDeleteSession: (sessionId: string) => void
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Ahora'
  if (diffMins < 60) return `Hace ${diffMins} min`
  if (diffHours < 24) return `Hace ${diffHours}h`
  if (diffDays < 7) return `Hace ${diffDays}d`
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}

export function AIChatHistory({
  isOpen,
  sessions,
  currentSessionId,
  onClose,
  onSelectSession,
  onDeleteSession,
}: AIChatHistoryProps): JSX.Element | null {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="font-semibold">Historial de conversaciones</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto p-2">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MessageSquare className="mb-2 h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No hay conversaciones guardadas</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={cn(
                    'group flex items-center justify-between rounded-lg p-3 transition-colors',
                    session.id === currentSessionId
                      ? 'bg-primary/10'
                      : 'hover:bg-muted'
                  )}
                >
                  <button
                    onClick={() => onSelectSession(session.id)}
                    className="flex flex-1 flex-col items-start gap-1 text-left"
                  >
                    <span className="line-clamp-1 text-sm font-medium">
                      {session.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {session.messageCount} mensajes · {formatRelativeTime(session.updatedAt)}
                    </span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteSession(session.id)
                    }}
                    className="ml-2 rounded-md p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                    aria-label="Eliminar conversación"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-3">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
}
