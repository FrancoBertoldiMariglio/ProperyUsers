import { useEffect } from 'react'
import type { Property } from '@propery/api-client'
import { useAIChatStore } from '../stores/ai-chat-store'
import { useComparisonStore } from '../stores/comparison-store'

/**
 * Hook to sync the AI context with compared properties automatically.
 * Call this in your app's root component or layout.
 */
export function useAIComparisonSync(): void {
  const { setComparedProperties } = useAIChatStore()
  const { properties: comparedProperties } = useComparisonStore()

  useEffect(() => {
    setComparedProperties(comparedProperties)
  }, [comparedProperties, setComparedProperties])
}

/**
 * Hook to set the current property being viewed in AI context.
 * Use in property detail pages.
 */
export function useSetAIProperty(property: Property | null): void {
  const { setCurrentProperty } = useAIChatStore()

  useEffect(() => {
    setCurrentProperty(property)

    // Clean up when unmounting
    return () => {
      setCurrentProperty(null)
    }
  }, [property, setCurrentProperty])
}

/**
 * Hook to set the current page in AI context.
 * Use in layout components.
 */
export function useSetAIPage(page: string): void {
  const { setCurrentPage } = useAIChatStore()

  useEffect(() => {
    setCurrentPage(page)
  }, [page, setCurrentPage])
}
