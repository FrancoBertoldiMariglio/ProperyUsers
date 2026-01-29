import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type MapLayerType = 'transport' | 'schools' | 'hospitals' | 'parks' | 'security'

interface MapBounds {
  north: number
  south: number
  east: number
  west: number
}

interface DrawPolygon {
  coordinates: [number, number][]
}

interface MapState {
  // View state
  center: [number, number]
  zoom: number
  bounds: MapBounds | null

  // Toggles
  activeLayers: MapLayerType[]
  showHeatmap: boolean
  showNeighborhoodPolygons: boolean

  // Drawing
  drawnPolygon: DrawPolygon | null
  isDrawing: boolean

  // Selected property on map
  hoveredPropertyId: string | null
  selectedPropertyId: string | null

  // Actions
  setCenter: (center: [number, number]) => void
  setZoom: (zoom: number) => void
  setBounds: (bounds: MapBounds | null) => void
  toggleLayer: (layer: MapLayerType) => void
  setShowHeatmap: (show: boolean) => void
  toggleHeatmap: () => void
  setShowNeighborhoodPolygons: (show: boolean) => void
  toggleNeighborhoodPolygons: () => void
  setDrawnPolygon: (polygon: DrawPolygon | null) => void
  setIsDrawing: (drawing: boolean) => void
  setHoveredPropertyId: (id: string | null) => void
  setSelectedPropertyId: (id: string | null) => void
  reset: () => void
}

const initialState = {
  // Buenos Aires center
  center: [-58.4370, -34.6037] as [number, number],
  zoom: 12,
  bounds: null,
  activeLayers: [] as MapLayerType[],
  showHeatmap: false,
  showNeighborhoodPolygons: false,
  drawnPolygon: null,
  isDrawing: false,
  hoveredPropertyId: null,
  selectedPropertyId: null,
}

export const useMapStore = create<MapState>()(
  persist(
    (set) => ({
      ...initialState,

      setCenter: (center) => set({ center }),

      setZoom: (zoom) => set({ zoom }),

      setBounds: (bounds) => set({ bounds }),

      toggleLayer: (layer) =>
        set((state) => ({
          activeLayers: state.activeLayers.includes(layer)
            ? state.activeLayers.filter((l) => l !== layer)
            : [...state.activeLayers, layer],
        })),

      setShowHeatmap: (show) => set({ showHeatmap: show }),

      toggleHeatmap: () =>
        set((state) => ({ showHeatmap: !state.showHeatmap })),

      setShowNeighborhoodPolygons: (show) =>
        set({ showNeighborhoodPolygons: show }),

      toggleNeighborhoodPolygons: () =>
        set((state) => ({
          showNeighborhoodPolygons: !state.showNeighborhoodPolygons,
        })),

      setDrawnPolygon: (polygon) => set({ drawnPolygon: polygon }),

      setIsDrawing: (drawing) => set({ isDrawing: drawing }),

      setHoveredPropertyId: (id) => set({ hoveredPropertyId: id }),

      setSelectedPropertyId: (id) => set({ selectedPropertyId: id }),

      reset: () => set(initialState),
    }),
    {
      name: 'propery-map',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist user preferences, not ephemeral state
        activeLayers: state.activeLayers,
        showHeatmap: state.showHeatmap,
        showNeighborhoodPolygons: state.showNeighborhoodPolygons,
      }),
    }
  )
)
