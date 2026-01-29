import type { Property } from '@propery/api-client'

export interface MapBounds {
  north: number
  south: number
  east: number
  west: number
}

export interface MapViewState {
  center: [number, number]
  zoom: number
  bounds?: MapBounds
}

export interface PropertyMarkerData {
  property: Property
  isSelected: boolean
  isComparing: boolean
  isFavorite: boolean
}

export interface ClusterData {
  id: string
  coordinates: [number, number]
  properties: Property[]
  priceRange: { min: number; max: number }
  count: number
}

export type MapLayerType =
  | 'transport'
  | 'schools'
  | 'hospitals'
  | 'parks'
  | 'security'

export interface MapLayer {
  id: MapLayerType
  name: string
  icon: string
  color: string
  visible: boolean
}

export interface MapPOI {
  id: string
  type: MapLayerType | string
  name: string
  coordinates: [number, number]
  details?: string
}

export interface NeighborhoodPolygon {
  id: string
  name: string
  coordinates: [number, number][][]
  stats?: {
    avgPrice: number
    trend: number
    listings: number
  }
}

export interface DrawPolygon {
  coordinates: [number, number][]
}

export type PriceColorCategory = 'opportunity' | 'fair' | 'expensive' | 'overpriced'

export const PRICE_COLORS: Record<PriceColorCategory, string> = {
  opportunity: '#10b981', // green-500
  fair: '#3b82f6', // blue-500
  expensive: '#f59e0b', // amber-500
  overpriced: '#ef4444', // red-500
}

export const PROPERTY_TYPE_ICONS: Record<string, string> = {
  apartment: '🏢',
  house: '🏠',
  ph: '🏘️',
  land: '🏞️',
  office: '🏛️',
  local: '🏪',
}

export const MAP_LAYERS: MapLayer[] = [
  { id: 'transport', name: 'Transporte', icon: '🚇', color: '#3b82f6', visible: false },
  { id: 'schools', name: 'Escuelas', icon: '🏫', color: '#22c55e', visible: false },
  { id: 'hospitals', name: 'Hospitales', icon: '🏥', color: '#ef4444', visible: false },
  { id: 'parks', name: 'Parques', icon: '🌳', color: '#84cc16', visible: false },
  { id: 'security', name: 'Comisarías', icon: '👮', color: '#6366f1', visible: false },
]
