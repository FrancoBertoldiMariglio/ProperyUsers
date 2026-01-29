'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import Supercluster from 'supercluster'
import type { Property, Neighborhood, NeighborhoodStats } from '@propery/api-client'
import {
  type MapViewState,
  type MapBounds,
  type MapLayerType,
  type DrawPolygon,
  PRICE_COLORS,
} from './types'
import { MapControls } from './map-controls'
import { MapLegend } from './map-legend'
import { PropertyPopup } from './property-popup'
import { DrawControl } from './draw-control'
import { IsochroneControl, fetchIsochrone, type TravelMode } from './isochrone-control'
import type { MapPOI } from './types'

import 'mapbox-gl/dist/mapbox-gl.css'

// Buenos Aires center coordinates
const BA_CENTER: [number, number] = [-58.4370, -34.6037]
const DEFAULT_ZOOM = 12

interface PropertyMapProps {
  properties: Property[]
  neighborhoods?: Neighborhood[]
  neighborhoodStats?: Record<string, NeighborhoodStats>
  pois?: MapPOI[]
  comparingIds?: string[]
  favoriteIds?: string[]
  selectedId?: string
  activeLayers?: MapLayerType[]
  showHeatmap?: boolean
  showNeighborhoodPolygons?: boolean
  onPropertyClick?: (property: Property) => void
  onPropertyHover?: (property: Property | null) => void
  onBoundsChange?: (bounds: MapBounds) => void
  onDrawComplete?: (polygon: DrawPolygon) => void
  className?: string
}

export function PropertyMap({
  properties,
  neighborhoods = [],
  neighborhoodStats = {},
  pois = [],
  comparingIds = [],
  favoriteIds = [],
  selectedId,
  activeLayers = [],
  showHeatmap = false,
  showNeighborhoodPolygons = false,
  onPropertyClick,
  onPropertyHover,
  onBoundsChange,
  onDrawComplete,
  className,
}: PropertyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<Map<string, mapboxgl.Marker>>(new Map())
  const clusterIndex = useRef<Supercluster | null>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  // Track view state for potential sync with list
  const [_viewState, setViewState] = useState<MapViewState>({
    center: BA_CENTER,
    zoom: DEFAULT_ZOOM,
  })
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null)
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawnPolygon, setDrawnPolygon] = useState<[number, number][]>([])
  const poiMarkers = useRef<Map<string, mapboxgl.Marker>>(new Map())
  const [isochronePoint, setIsochronePoint] = useState<[number, number] | null>(null)
  const [isochroneActive, setIsochroneActive] = useState(false)
  const [isSelectingIsochronePoint, setIsSelectingIsochronePoint] = useState(false)

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    // Use a public demo token - in production, use env var
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: BA_CENTER,
      zoom: DEFAULT_ZOOM,
      minZoom: 10,
      maxZoom: 18,
    })

    map.current.on('load', () => {
      setIsMapLoaded(true)

      // Add neighborhood polygons source
      map.current?.addSource('neighborhoods', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      })

      // Add heatmap source
      map.current?.addSource('heatmap', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      })

      // Add neighborhood fill layer
      map.current?.addLayer({
        id: 'neighborhoods-fill',
        type: 'fill',
        source: 'neighborhoods',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.2,
        },
      })

      // Add neighborhood outline layer
      map.current?.addLayer({
        id: 'neighborhoods-outline',
        type: 'line',
        source: 'neighborhoods',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 2,
        },
      })

      // Add heatmap layer
      map.current?.addLayer({
        id: 'price-heatmap',
        type: 'heatmap',
        source: 'heatmap',
        paint: {
          'heatmap-weight': ['get', 'weight'],
          'heatmap-intensity': 1,
          'heatmap-radius': 30,
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0, 0, 255, 0)',
            0.2, 'rgb(0, 255, 0)',
            0.4, 'rgb(255, 255, 0)',
            0.6, 'rgb(255, 128, 0)',
            1, 'rgb(255, 0, 0)',
          ],
          'heatmap-opacity': 0.6,
        },
        layout: {
          visibility: 'none',
        },
      })

      // Add isochrone source and layer
      map.current?.addSource('isochrone', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      })

      map.current?.addLayer({
        id: 'isochrone-fill',
        type: 'fill',
        source: 'isochrone',
        paint: {
          'fill-color': '#3b82f6',
          'fill-opacity': 0.2,
        },
        layout: {
          visibility: 'none',
        },
      })

      map.current?.addLayer({
        id: 'isochrone-outline',
        type: 'line',
        source: 'isochrone',
        paint: {
          'line-color': '#3b82f6',
          'line-width': 2,
        },
        layout: {
          visibility: 'none',
        },
      })
    })

    // Track map movements
    map.current.on('moveend', () => {
      if (!map.current) return

      const center = map.current.getCenter()
      const zoom = map.current.getZoom()
      const bounds = map.current.getBounds()

      setViewState({
        center: [center.lng, center.lat],
        zoom,
        bounds: bounds ? {
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        } : undefined,
      })

      if (bounds && onBoundsChange) {
        onBoundsChange({
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        })
      }
    })

    return () => {
      markers.current.forEach((marker) => marker.remove())
      markers.current.clear()
      map.current?.remove()
      map.current = null
    }
  }, [onBoundsChange])

  // Initialize cluster index when properties change
  useEffect(() => {
    if (properties.length === 0) {
      clusterIndex.current = null
      return
    }

    // Create GeoJSON points from properties
    const points = properties.map((property) => ({
      type: 'Feature' as const,
      properties: {
        id: property.id,
        price: property.price,
        priceCategory: property.prediction?.priceCategory || 'fair',
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [property.location.lng, property.location.lat],
      },
    }))

    // Initialize Supercluster
    clusterIndex.current = new Supercluster({
      radius: 60,
      maxZoom: 16,
      minPoints: 3,
    })
    clusterIndex.current.load(points)
  }, [properties])

  // Function to render markers based on current zoom
  const renderMarkers = useCallback(() => {
    if (!map.current || !isMapLoaded || !clusterIndex.current) return

    // Remove old markers
    markers.current.forEach((marker) => marker.remove())
    markers.current.clear()

    const bounds = map.current.getBounds()
    const zoom = Math.floor(map.current.getZoom())

    // Get clusters for current view
    const clusters = clusterIndex.current.getClusters(
      [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
      zoom
    )

    clusters.forEach((cluster) => {
      const [lng, lat] = cluster.geometry.coordinates
      const isCluster = cluster.properties.cluster

      if (isCluster) {
        // Render cluster marker
        const count = cluster.properties.point_count
        const clusterId = cluster.properties.cluster_id

        // Get all properties in cluster to calculate price range
        const leaves = clusterIndex.current!.getLeaves(clusterId, Infinity)
        const prices = leaves.map((l) => l.properties.price)
        const minPrice = Math.min(...prices)
        const maxPrice = Math.max(...prices)

        const el = createClusterMarkerElement({
          count,
          minPrice,
          maxPrice,
        })

        const marker = new mapboxgl.Marker({
          element: el,
          anchor: 'center',
        })
          .setLngLat([lng, lat])
          .addTo(map.current!)

        // Click to zoom in
        el.addEventListener('click', () => {
          const expansionZoom = clusterIndex.current!.getClusterExpansionZoom(clusterId)
          map.current?.flyTo({
            center: [lng, lat],
            zoom: Math.min(expansionZoom, 18),
          })
        })

        markers.current.set(`cluster-${clusterId}`, marker)
      } else {
        // Render individual property marker
        const propertyId = cluster.properties.id
        const property = properties.find((p) => p.id === propertyId)
        if (!property) return

        const priceCategory = cluster.properties.priceCategory
        const color = PRICE_COLORS[priceCategory as keyof typeof PRICE_COLORS]

        const el = createMarkerElement({
          price: property.price,
          color,
          isSelected: selectedId === property.id,
          isComparing: comparingIds.includes(property.id),
          isFavorite: favoriteIds.includes(property.id),
        })

        const marker = new mapboxgl.Marker({
          element: el,
          anchor: 'bottom',
        })
          .setLngLat([lng, lat])
          .addTo(map.current!)

        // Event handlers
        el.addEventListener('mouseenter', () => {
          setHoveredProperty(property)
          const point = map.current?.project([lng, lat])
          if (point) {
            setPopupPosition({ x: point.x, y: point.y })
          }
          onPropertyHover?.(property)
        })

        el.addEventListener('mouseleave', () => {
          setHoveredProperty(null)
          setPopupPosition(null)
          onPropertyHover?.(null)
        })

        el.addEventListener('click', () => {
          onPropertyClick?.(property)
        })

        markers.current.set(propertyId, marker)
      }
    })
  }, [properties, selectedId, comparingIds, favoriteIds, isMapLoaded, onPropertyClick, onPropertyHover])

  // Update markers on zoom/move and when properties change
  useEffect(() => {
    if (!map.current || !isMapLoaded) return

    renderMarkers()

    // Re-render on zoom/move
    const handleMoveEnd = () => renderMarkers()
    map.current.on('moveend', handleMoveEnd)
    map.current.on('zoomend', handleMoveEnd)

    return () => {
      map.current?.off('moveend', handleMoveEnd)
      map.current?.off('zoomend', handleMoveEnd)
    }
  }, [renderMarkers, isMapLoaded])

  // Update neighborhood polygons
  useEffect(() => {
    if (!map.current || !isMapLoaded) return

    const features = neighborhoods.map((n) => {
      const stats = neighborhoodStats[n.id]
      const trend = stats?.priceTrend6m || 0
      const color = trend > 5 ? '#ef4444' : trend > 2 ? '#f59e0b' : '#10b981'

      return {
        type: 'Feature' as const,
        properties: {
          id: n.id,
          name: n.name,
          color,
          avgPrice: stats?.avgPricePerM2Sale || 0,
          trend,
          listings: stats?.totalListings || 0,
        },
        geometry: n.polygon,
      }
    })

    const source = map.current.getSource('neighborhoods') as mapboxgl.GeoJSONSource
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features,
      })
    }

    // Toggle visibility
    map.current.setLayoutProperty(
      'neighborhoods-fill',
      'visibility',
      showNeighborhoodPolygons ? 'visible' : 'none'
    )
    map.current.setLayoutProperty(
      'neighborhoods-outline',
      'visibility',
      showNeighborhoodPolygons ? 'visible' : 'none'
    )
  }, [neighborhoods, neighborhoodStats, showNeighborhoodPolygons, isMapLoaded])

  // Update heatmap
  useEffect(() => {
    if (!map.current || !isMapLoaded) return

    const features = properties.map((p) => ({
      type: 'Feature' as const,
      properties: {
        weight: p.price / 500000, // Normalize weight
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [p.location.lng, p.location.lat],
      },
    }))

    const source = map.current.getSource('heatmap') as mapboxgl.GeoJSONSource
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features,
      })
    }

    map.current.setLayoutProperty(
      'price-heatmap',
      'visibility',
      showHeatmap ? 'visible' : 'none'
    )
  }, [properties, showHeatmap, isMapLoaded])

  // Update POI markers when active layers change
  useEffect(() => {
    if (!map.current || !isMapLoaded) return

    // Remove old POI markers
    poiMarkers.current.forEach((marker) => marker.remove())
    poiMarkers.current.clear()

    // Filter POIs by active layers
    const activePOIs = pois.filter((poi) =>
      activeLayers.includes(poi.type as MapLayerType)
    )

    // POI icons and colors
    const POI_ICONS: Record<string, string> = {
      transport: '🚇',
      schools: '🏫',
      hospitals: '🏥',
      parks: '🌳',
      security: '👮',
    }

    const POI_COLORS: Record<string, string> = {
      transport: '#3b82f6',
      schools: '#22c55e',
      hospitals: '#ef4444',
      parks: '#84cc16',
      security: '#6366f1',
    }

    // Add markers for active POIs
    activePOIs.forEach((poi) => {
      const icon = POI_ICONS[poi.type] || '📍'
      const color = POI_COLORS[poi.type] || '#666'

      const el = document.createElement('div')
      el.className = 'poi-marker'
      el.title = poi.name

      const inner = document.createElement('div')
      inner.style.backgroundColor = color
      inner.style.width = '28px'
      inner.style.height = '28px'
      inner.style.borderRadius = '50%'
      inner.style.display = 'flex'
      inner.style.alignItems = 'center'
      inner.style.justifyContent = 'center'
      inner.style.fontSize = '14px'
      inner.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)'
      inner.style.cursor = 'pointer'
      inner.style.border = '2px solid white'
      inner.textContent = icon
      el.appendChild(inner)

      const popupContent = document.createElement('div')
      const title = document.createElement('strong')
      title.textContent = poi.name
      popupContent.appendChild(title)
      if (poi.details) {
        const details = document.createElement('span')
        details.style.color = '#666'
        details.textContent = ` - ${poi.details}`
        popupContent.appendChild(details)
      }

      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'center',
      })
        .setLngLat(poi.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupContent))
        .addTo(map.current!)

      poiMarkers.current.set(poi.id, marker)
    })

    return () => {
      poiMarkers.current.forEach((marker) => marker.remove())
      poiMarkers.current.clear()
    }
  }, [pois, activeLayers, isMapLoaded])

  // Handle zoom controls
  const handleZoomIn = useCallback(() => {
    map.current?.zoomIn()
  }, [])

  const handleZoomOut = useCallback(() => {
    map.current?.zoomOut()
  }, [])

  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      (position) => {
        map.current?.flyTo({
          center: [position.coords.longitude, position.coords.latitude],
          zoom: 15,
        })
      },
      (error) => {
        console.error('Geolocation error:', error)
      }
    )
  }, [])

  const handleFitBounds = useCallback(() => {
    if (properties.length === 0) return

    const bounds = new mapboxgl.LngLatBounds()
    properties.forEach((p) => {
      bounds.extend([p.location.lng, p.location.lat])
    })

    map.current?.fitBounds(bounds, {
      padding: 50,
      maxZoom: 15,
    })
  }, [properties])

  // Drawing mode
  const handleStartDrawing = useCallback(() => {
    setIsDrawing(true)
    setDrawnPolygon([])
  }, [])

  const handleMapClick = useCallback((e: mapboxgl.MapMouseEvent) => {
    if (!isDrawing) return

    const coords: [number, number] = [e.lngLat.lng, e.lngLat.lat]
    setDrawnPolygon((prev) => [...prev, coords])
  }, [isDrawing])

  const handleFinishDrawing = useCallback(() => {
    setIsDrawing(false)
    if (drawnPolygon.length >= 3) {
      onDrawComplete?.({ coordinates: drawnPolygon })
    }
    setDrawnPolygon([])
  }, [drawnPolygon, onDrawComplete])

  const handleCancelDrawing = useCallback(() => {
    setIsDrawing(false)
    setDrawnPolygon([])
  }, [])

  // Isochrone handlers
  const handleIsochroneActivate = useCallback(async (
    center: [number, number],
    minutes: number,
    mode: TravelMode
  ) => {
    if (!map.current || !isMapLoaded) return

    const token = mapboxgl.accessToken
    const polygon = await fetchIsochrone(center, minutes, mode, token)

    if (polygon) {
      const source = map.current.getSource('isochrone') as mapboxgl.GeoJSONSource
      if (source) {
        source.setData({
          type: 'FeatureCollection',
          features: [polygon],
        })
      }

      map.current.setLayoutProperty('isochrone-fill', 'visibility', 'visible')
      map.current.setLayoutProperty('isochrone-outline', 'visibility', 'visible')
      setIsochroneActive(true)
      setIsSelectingIsochronePoint(false)
    }
  }, [isMapLoaded])

  const handleIsochroneDeactivate = useCallback(() => {
    if (!map.current) return

    map.current.setLayoutProperty('isochrone-fill', 'visibility', 'none')
    map.current.setLayoutProperty('isochrone-outline', 'visibility', 'none')
    setIsochroneActive(false)
    setIsochronePoint(null)
  }, [])

  // Handle click for isochrone point selection
  useEffect(() => {
    if (!map.current || !isMapLoaded || !isSelectingIsochronePoint) return

    const handleClick = (e: mapboxgl.MapMouseEvent) => {
      setIsochronePoint([e.lngLat.lng, e.lngLat.lat])
    }

    map.current.on('click', handleClick)
    map.current.getCanvas().style.cursor = 'crosshair'

    return () => {
      map.current?.off('click', handleClick)
      if (!isDrawing) {
        map.current?.getCanvas().style.cursor = ''
      }
    }
  }, [isSelectingIsochronePoint, isMapLoaded, isDrawing])

  // Register click handler for drawing
  useEffect(() => {
    if (!map.current || !isMapLoaded) return

    if (isDrawing) {
      map.current.on('click', handleMapClick)
      map.current.getCanvas().style.cursor = 'crosshair'
    } else {
      map.current.off('click', handleMapClick)
      map.current.getCanvas().style.cursor = ''
    }

    return () => {
      map.current?.off('click', handleMapClick)
    }
  }, [isDrawing, handleMapClick, isMapLoaded])

  return (
    <div className={`relative h-full w-full ${className}`}>
      <div ref={mapContainer} className="h-full w-full" />

      {/* Map Controls */}
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onGeolocate={handleGeolocate}
        onFitBounds={handleFitBounds}
        onStartDrawing={handleStartDrawing}
        isDrawing={isDrawing}
        className="absolute right-4 top-4"
      />

      {/* Draw Control (when drawing) */}
      {isDrawing && (
        <DrawControl
          points={drawnPolygon}
          onFinish={handleFinishDrawing}
          onCancel={handleCancelDrawing}
          className="absolute left-1/2 top-4 -translate-x-1/2"
        />
      )}

      {/* Property Popup */}
      {hoveredProperty && popupPosition && (
        <PropertyPopup
          property={hoveredProperty}
          position={popupPosition}
          isComparing={comparingIds.includes(hoveredProperty.id)}
          isFavorite={favoriteIds.includes(hoveredProperty.id)}
        />
      )}

      {/* Isochrone Control */}
      <IsochroneControl
        isActive={isochroneActive}
        onActivate={handleIsochroneActivate}
        onDeactivate={handleIsochroneDeactivate}
        selectedPoint={isochronePoint}
        className="absolute bottom-4 right-4"
      />

      {/* Legend */}
      <MapLegend className="absolute bottom-4 left-4" />
    </div>
  )
}

// Helper function to create marker element using safe DOM methods
function createMarkerElement({
  price,
  color,
  isSelected,
  isComparing,
  isFavorite,
}: {
  price: number
  color: string
  isSelected: boolean
  isComparing: boolean
  isFavorite: boolean
}): HTMLDivElement {
  const formattedPrice = price >= 1000000
    ? `${(price / 1000000).toFixed(1)}M`
    : `${Math.round(price / 1000)}k`

  const borderColor = isSelected
    ? '#000'
    : isComparing
      ? '#3b82f6'
      : isFavorite
        ? '#ef4444'
        : 'transparent'

  const el = document.createElement('div')
  el.className = 'property-marker'

  const innerEl = document.createElement('div')
  innerEl.style.background = color
  innerEl.style.color = 'white'
  innerEl.style.padding = '4px 8px'
  innerEl.style.borderRadius = '4px'
  innerEl.style.fontSize = '12px'
  innerEl.style.fontWeight = '600'
  innerEl.style.cursor = 'pointer'
  innerEl.style.border = `2px solid ${borderColor}`
  innerEl.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)'
  innerEl.style.whiteSpace = 'nowrap'
  innerEl.style.transform = 'translateY(-4px)'
  innerEl.textContent = `$${formattedPrice}`

  el.appendChild(innerEl)
  return el
}

// Helper function to create cluster marker element
function createClusterMarkerElement({
  count,
  minPrice,
  maxPrice,
}: {
  count: number
  minPrice: number
  maxPrice: number
}): HTMLDivElement {
  const formatPrice = (price: number) =>
    price >= 1000000 ? `${(price / 1000000).toFixed(1)}M` : `${Math.round(price / 1000)}k`

  const el = document.createElement('div')
  el.className = 'cluster-marker'

  const inner = document.createElement('div')
  inner.style.background = 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
  inner.style.color = 'white'
  inner.style.width = '48px'
  inner.style.height = '48px'
  inner.style.borderRadius = '50%'
  inner.style.display = 'flex'
  inner.style.flexDirection = 'column'
  inner.style.alignItems = 'center'
  inner.style.justifyContent = 'center'
  inner.style.cursor = 'pointer'
  inner.style.border = '3px solid white'
  inner.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)'
  inner.style.transition = 'transform 0.2s'

  const countEl = document.createElement('span')
  countEl.style.fontSize = '14px'
  countEl.style.fontWeight = '700'
  countEl.style.lineHeight = '1'
  countEl.textContent = count.toString()
  inner.appendChild(countEl)

  const priceEl = document.createElement('span')
  priceEl.style.fontSize = '9px'
  priceEl.style.opacity = '0.9'
  priceEl.style.lineHeight = '1'
  priceEl.style.marginTop = '2px'
  priceEl.textContent = `$${formatPrice(minPrice)}-${formatPrice(maxPrice)}`
  inner.appendChild(priceEl)

  // Hover effect
  inner.addEventListener('mouseenter', () => {
    inner.style.transform = 'scale(1.1)'
  })
  inner.addEventListener('mouseleave', () => {
    inner.style.transform = 'scale(1)'
  })

  el.appendChild(inner)
  return el
}
