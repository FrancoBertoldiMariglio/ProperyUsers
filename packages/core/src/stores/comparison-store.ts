import { create } from 'zustand'
import type { Property } from '@propery/api-client'

interface ComparisonState {
  properties: Property[]
  maxProperties: number
  addProperty: (property: Property) => boolean
  removeProperty: (propertyId: string) => void
  clearAll: () => void
  isInComparison: (propertyId: string) => boolean
  canAdd: () => boolean
}

export const useComparisonStore = create<ComparisonState>()((set, get) => ({
  properties: [],
  maxProperties: 4,
  addProperty: (property) => {
    const state = get()
    if (state.properties.length >= state.maxProperties) {
      return false
    }
    if (state.properties.some((p) => p.id === property.id)) {
      return false
    }
    set((s) => ({ properties: [...s.properties, property] }))
    return true
  },
  removeProperty: (propertyId) =>
    set((state) => ({
      properties: state.properties.filter((p) => p.id !== propertyId),
    })),
  clearAll: () => set({ properties: [] }),
  isInComparison: (propertyId) => get().properties.some((p) => p.id === propertyId),
  canAdd: () => get().properties.length < get().maxProperties,
}))
