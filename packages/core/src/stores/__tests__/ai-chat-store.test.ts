import { describe, it, expect, beforeEach } from 'vitest'
import { useAIChatStore } from '../ai-chat-store'

describe('AI Chat Store', () => {
  beforeEach(() => {
    useAIChatStore.setState({
      isOpen: false,
      isMinimized: false,
      isLoading: false,
      streamingContent: '',
      context: {
        currentPage: '/',
        currentProperty: null,
        comparedProperties: [],
      },
      currentSession: null,
      sessions: [],
      inputValue: '',
      isListening: false,
      requestCount: 0,
      lastRequestTime: null,
    })
  })

  describe('panel state', () => {
    it('should start closed', () => {
      expect(useAIChatStore.getState().isOpen).toBe(false)
    })

    it('should open panel and create session', () => {
      useAIChatStore.getState().openChat()
      expect(useAIChatStore.getState().isOpen).toBe(true)
      expect(useAIChatStore.getState().currentSession).not.toBeNull()
    })

    it('should close panel', () => {
      useAIChatStore.getState().openChat()
      useAIChatStore.getState().closeChat()
      expect(useAIChatStore.getState().isOpen).toBe(false)
    })

    it('should toggle minimize', () => {
      expect(useAIChatStore.getState().isMinimized).toBe(false)
      useAIChatStore.getState().toggleMinimize()
      expect(useAIChatStore.getState().isMinimized).toBe(true)
    })
  })

  describe('sessions', () => {
    it('should start with no session', () => {
      expect(useAIChatStore.getState().currentSession).toBeNull()
      expect(useAIChatStore.getState().sessions).toEqual([])
    })

    it('should start new session', () => {
      useAIChatStore.getState().startNewSession()

      const { currentSession } = useAIChatStore.getState()
      expect(currentSession).not.toBeNull()
      expect(currentSession?.id).toBeTruthy()
      expect(currentSession?.messages).toEqual([])
    })

    it('should delete session', () => {
      useAIChatStore.getState().startNewSession()
      const sessionId = useAIChatStore.getState().currentSession?.id

      useAIChatStore.getState().deleteSession(sessionId!)

      expect(useAIChatStore.getState().currentSession).toBeNull()
    })
  })

  describe('messages', () => {
    beforeEach(() => {
      useAIChatStore.getState().startNewSession()
    })

    it('should add message to current session', () => {
      useAIChatStore.getState().addMessage({
        role: 'user',
        content: 'Hello!',
      })

      const { currentSession } = useAIChatStore.getState()
      expect(currentSession?.messages).toHaveLength(1)
      expect(currentSession?.messages[0].role).toBe('user')
      expect(currentSession?.messages[0].content).toBe('Hello!')
    })

    it('should update session title based on first user message', () => {
      useAIChatStore.getState().addMessage({
        role: 'user',
        content: 'Busco departamento en Palermo',
      })

      const { currentSession } = useAIChatStore.getState()
      expect(currentSession?.title).toBe('Busco departamento en Palermo')
    })

    it('should truncate long titles', () => {
      useAIChatStore.getState().addMessage({
        role: 'user',
        content: 'This is a very long message that should be truncated in the session title to keep things manageable',
      })

      const { currentSession } = useAIChatStore.getState()
      expect(currentSession?.title.length).toBeLessThanOrEqual(43) // 40 + '...'
    })

    it('should clear current session messages', () => {
      useAIChatStore.getState().addMessage({ role: 'user', content: 'Hi' })
      useAIChatStore.getState().addMessage({ role: 'assistant', content: 'Hello!' })
      useAIChatStore.getState().clearCurrentSession()

      expect(useAIChatStore.getState().currentSession?.messages).toEqual([])
    })
  })

  describe('loading state', () => {
    it('should start not loading', () => {
      expect(useAIChatStore.getState().isLoading).toBe(false)
    })

    it('should set loading state', () => {
      useAIChatStore.getState().setLoading(true)
      expect(useAIChatStore.getState().isLoading).toBe(true)

      useAIChatStore.getState().setLoading(false)
      expect(useAIChatStore.getState().isLoading).toBe(false)
    })
  })

  describe('streaming', () => {
    it('should set streaming content', () => {
      useAIChatStore.getState().setStreamingContent('Starting...')
      expect(useAIChatStore.getState().streamingContent).toBe('Starting...')
    })

    it('should append to streaming content', () => {
      useAIChatStore.getState().setStreamingContent('Hello')
      useAIChatStore.getState().appendStreamingContent(' world')
      expect(useAIChatStore.getState().streamingContent).toBe('Hello world')
    })
  })

  describe('context', () => {
    it('should set current page', () => {
      useAIChatStore.getState().setCurrentPage('/search')
      expect(useAIChatStore.getState().context.currentPage).toBe('/search')
    })

    it('should set current property', () => {
      const mockProperty = { id: '123', title: 'Test Property' } as any
      useAIChatStore.getState().setCurrentProperty(mockProperty)
      expect(useAIChatStore.getState().context.currentProperty).toEqual(mockProperty)
    })

    it('should set compared properties', () => {
      const mockProperties = [{ id: '1' }, { id: '2' }] as any[]
      useAIChatStore.getState().setComparedProperties(mockProperties)
      expect(useAIChatStore.getState().context.comparedProperties).toEqual(mockProperties)
    })

    it('should clear property context', () => {
      useAIChatStore.getState().setCurrentProperty({ id: '123' } as any)
      useAIChatStore.getState().setCurrentProperty(null)
      expect(useAIChatStore.getState().context.currentProperty).toBeNull()
    })
  })

  describe('voice input', () => {
    it('should start not listening', () => {
      expect(useAIChatStore.getState().isListening).toBe(false)
    })

    it('should set listening state', () => {
      useAIChatStore.getState().setListening(true)
      expect(useAIChatStore.getState().isListening).toBe(true)
    })
  })

  describe('rate limiting', () => {
    it('should allow request when under limit', () => {
      expect(useAIChatStore.getState().canMakeRequest()).toBe(true)
    })

    it('should track requests', () => {
      useAIChatStore.getState().trackRequest()
      expect(useAIChatStore.getState().requestCount).toBe(1)

      useAIChatStore.getState().trackRequest()
      expect(useAIChatStore.getState().requestCount).toBe(2)
    })

    it('should respect rate limit', () => {
      // Make 10 requests (the limit)
      for (let i = 0; i < 10; i++) {
        useAIChatStore.getState().trackRequest()
      }

      expect(useAIChatStore.getState().canMakeRequest()).toBe(false)
    })
  })

  describe('suggestion count', () => {
    it('should return 0 with no context', () => {
      expect(useAIChatStore.getState().getSuggestionCount()).toBe(0)
    })

    it('should increase with property context', () => {
      useAIChatStore.getState().setCurrentProperty({ id: '123' } as any)
      expect(useAIChatStore.getState().getSuggestionCount()).toBe(2)
    })

    it('should increase with compared properties', () => {
      useAIChatStore.getState().setComparedProperties([{ id: '1' }, { id: '2' }] as any[])
      expect(useAIChatStore.getState().getSuggestionCount()).toBe(1)
    })
  })
})
