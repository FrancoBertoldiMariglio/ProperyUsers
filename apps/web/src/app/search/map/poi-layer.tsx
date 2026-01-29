'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import { type MapLayerType, type MapPOI, MAP_LAYERS } from './types'

interface POILayerProps {
  map: mapboxgl.Map | null
  pois: MapPOI[]
  activeLayers: MapLayerType[]
}

const POI_ICONS: Record<MapLayerType, string> = {
  transport: '🚇',
  schools: '🏫',
  hospitals: '🏥',
  parks: '🌳',
  security: '👮',
}

export function usePOILayer({ map, pois, activeLayers }: POILayerProps) {
  const markers = useRef<Map<string, mapboxgl.Marker>>(new Map())

  useEffect(() => {
    if (!map) return

    // Remove all existing POI markers
    markers.current.forEach((marker) => marker.remove())
    markers.current.clear()

    // Only show POIs for active layers
    const activePOIs = pois.filter((poi) => activeLayers.includes(poi.type as MapLayerType))

    // Add markers for active POIs
    activePOIs.forEach((poi) => {
      const layer = MAP_LAYERS.find((l) => l.id === poi.type)
      if (!layer) return

      const el = createPOIMarkerElement({
        icon: POI_ICONS[poi.type],
        color: layer.color,
        name: poi.name,
      })

      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'center',
      })
        .setLngLat(poi.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<strong>${poi.name}</strong>${poi.details ? `<br/><span style="color:#666">${poi.details}</span>` : ''}`
          )
        )
        .addTo(map)

      markers.current.set(poi.id, marker)
    })

    return () => {
      markers.current.forEach((marker) => marker.remove())
      markers.current.clear()
    }
  }, [map, pois, activeLayers])
}

function createPOIMarkerElement({
  icon,
  color,
  name,
}: {
  icon: string
  color: string
  name: string
}): HTMLDivElement {
  const el = document.createElement('div')
  el.className = 'poi-marker'
  el.title = name

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
  return el
}
