import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Property } from '@propery/api-client'
import type { ChatMessage } from '@propery/ai'

interface AIContext {
  currentPage: string
  currentProperty: Property | null
  comparedProperties: Property[]
}

interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
}

interface AIChatState {
  // UI State
  isOpen: boolean
  isMinimized: boolean
  isLoading: boolean
  streamingContent: string

  // Context
  context: AIContext

  // Chat state
  currentSession: ChatSession | null
  sessions: ChatSession[]
  inputValue: string

  // Voice input
  isListening: boolean

  // Rate limiting
  requestCount: number
  lastRequestTime: number | null

  // Actions - UI
  openChat: () => void
  closeChat: () => void
  toggleMinimize: () => void
  setLoading: (loading: boolean) => void
  setStreamingContent: (content: string) => void
  appendStreamingContent: (chunk: string) => void

  // Actions - Context
  setCurrentPage: (page: string) => void
  setCurrentProperty: (property: Property | null) => void
  setComparedProperties: (properties: Property[]) => void

  // Actions - Chat
  setInputValue: (value: string) => void
  addMessage: (message: ChatMessage) => void
  startNewSession: () => void
  loadSession: (sessionId: string) => void
  deleteSession: (sessionId: string) => void
  clearCurrentSession: () => void

  // Actions - Voice
  setListening: (listening: boolean) => void

  // Actions - Rate limiting
  canMakeRequest: () => boolean
  trackRequest: () => void

  // Computed
  getSuggestionCount: () => number
}

const MAX_REQUESTS_PER_MINUTE = 10
const REQUEST_WINDOW_MS = 60000

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function generateSessionTitle(messages: ChatMessage[]): string {
  const firstUserMessage = messages.find((m) => m.role === 'user')
  if (firstUserMessage) {
    return firstUserMessage.content.slice(0, 40) + (firstUserMessage.content.length > 40 ? '...' : '')
  }
  return 'Nueva conversación'
}

export const useAIChatStore = create<AIChatState>()(
  persist(
    (set, get) => ({
      // Initial UI state
      isOpen: false,
      isMinimized: false,
      isLoading: false,
      streamingContent: '',

      // Initial context
      context: {
        currentPage: '/',
        currentProperty: null,
        comparedProperties: [],
      },

      // Initial chat state
      currentSession: null,
      sessions: [],
      inputValue: '',

      // Initial voice state
      isListening: false,

      // Initial rate limiting
      requestCount: 0,
      lastRequestTime: null,

      // UI Actions
      openChat: () => {
        const state = get()
        if (!state.currentSession) {
          // Start new session when opening for first time
          const newSession: ChatSession = {
            id: generateSessionId(),
            title: 'Nueva conversación',
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          set({ isOpen: true, isMinimized: false, currentSession: newSession })
        } else {
          set({ isOpen: true, isMinimized: false })
        }
      },

      closeChat: () => set({ isOpen: false }),

      toggleMinimize: () => set((state) => ({ isMinimized: !state.isMinimized })),

      setLoading: (loading) => set({ isLoading: loading }),

      setStreamingContent: (content) => set({ streamingContent: content }),

      appendStreamingContent: (chunk) =>
        set((state) => ({ streamingContent: state.streamingContent + chunk })),

      // Context Actions
      setCurrentPage: (page) =>
        set((state) => ({
          context: { ...state.context, currentPage: page },
        })),

      setCurrentProperty: (property) =>
        set((state) => ({
          context: { ...state.context, currentProperty: property },
        })),

      setComparedProperties: (properties) =>
        set((state) => ({
          context: { ...state.context, comparedProperties: properties },
        })),

      // Chat Actions
      setInputValue: (value) => set({ inputValue: value }),

      addMessage: (message) =>
        set((state) => {
          if (!state.currentSession) return state

          const updatedMessages = [...state.currentSession.messages, message]
          const updatedSession: ChatSession = {
            ...state.currentSession,
            messages: updatedMessages,
            title: generateSessionTitle(updatedMessages),
            updatedAt: new Date().toISOString(),
          }

          // Update sessions list
          const sessionExists = state.sessions.some((s) => s.id === updatedSession.id)
          const updatedSessions = sessionExists
            ? state.sessions.map((s) => (s.id === updatedSession.id ? updatedSession : s))
            : [updatedSession, ...state.sessions]

          return {
            currentSession: updatedSession,
            sessions: updatedSessions.slice(0, 50), // Keep last 50 sessions
          }
        }),

      startNewSession: () => {
        const newSession: ChatSession = {
          id: generateSessionId(),
          title: 'Nueva conversación',
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set({ currentSession: newSession, streamingContent: '' })
      },

      loadSession: (sessionId) => {
        const state = get()
        const session = state.sessions.find((s) => s.id === sessionId)
        if (session) {
          set({ currentSession: session, streamingContent: '' })
        }
      },

      deleteSession: (sessionId) =>
        set((state) => {
          const updatedSessions = state.sessions.filter((s) => s.id !== sessionId)
          const shouldClearCurrent = state.currentSession?.id === sessionId

          return {
            sessions: updatedSessions,
            currentSession: shouldClearCurrent ? null : state.currentSession,
          }
        }),

      clearCurrentSession: () =>
        set((state) => {
          if (!state.currentSession) return state

          const clearedSession: ChatSession = {
            ...state.currentSession,
            messages: [],
            updatedAt: new Date().toISOString(),
          }

          return {
            currentSession: clearedSession,
            streamingContent: '',
          }
        }),

      // Voice Actions
      setListening: (listening) => set({ isListening: listening }),

      // Rate Limiting
      canMakeRequest: () => {
        const state = get()
        const now = Date.now()

        // Reset counter if window has passed
        if (!state.lastRequestTime || now - state.lastRequestTime > REQUEST_WINDOW_MS) {
          return true
        }

        return state.requestCount < MAX_REQUESTS_PER_MINUTE
      },

      trackRequest: () =>
        set((state) => {
          const now = Date.now()

          // Reset if window has passed
          if (!state.lastRequestTime || now - state.lastRequestTime > REQUEST_WINDOW_MS) {
            return { requestCount: 1, lastRequestTime: now }
          }

          return { requestCount: state.requestCount + 1 }
        }),

      // Computed
      getSuggestionCount: () => {
        const state = get()
        let count = 0

        // Suggest based on context
        if (state.context.currentProperty) count += 2 // Describe, negotiate
        if (state.context.comparedProperties.length >= 2) count += 1 // Compare

        return count
      },
    }),
    {
      name: 'propery-ai-chat',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sessions: state.sessions,
        // Don't persist UI state or context
      }),
    }
  )
)
