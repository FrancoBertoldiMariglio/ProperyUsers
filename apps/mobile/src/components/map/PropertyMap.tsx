import React, { useState, useCallback, useMemo } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native'
import MapView, { Marker, Polygon, Callout, PROVIDER_GOOGLE } from 'react-native-maps'
import type { Property, Neighborhood } from '@propery/api-client'

const { width, height } = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

// Buenos Aires center
const BA_CENTER = {
  latitude: -34.6037,
  longitude: -58.4370,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
}

const PRICE_COLORS = {
  opportunity: '#10b981',
  fair: '#3b82f6',
  expensive: '#f59e0b',
  overpriced: '#ef4444',
}

interface PropertyMapProps {
  properties: Property[]
  neighborhoods?: Neighborhood[]
  comparingIds?: string[]
  favoriteIds?: string[]
  selectedId?: string
  showNeighborhoodPolygons?: boolean
  onPropertyPress?: (property: Property) => void
  onRegionChange?: (region: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number }) => void
}

export function PropertyMap({
  properties,
  neighborhoods = [],
  comparingIds = [],
  favoriteIds = [],
  selectedId,
  showNeighborhoodPolygons = false,
  onPropertyPress,
  onRegionChange,
}: PropertyMapProps) {
  const [region, setRegion] = useState(BA_CENTER)

  const handleRegionChange = useCallback((newRegion: typeof region) => {
    setRegion(newRegion)
    onRegionChange?.(newRegion)
  }, [onRegionChange])

  const formatPrice = (price: number) => {
    if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`
    return `$${Math.round(price / 1000)}k`
  }

  const getMarkerColor = (property: Property) => {
    const category = property.prediction?.priceCategory || 'fair'
    return PRICE_COLORS[category as keyof typeof PRICE_COLORS]
  }

  // Convert neighborhood polygons to react-native-maps format
  const neighborhoodPolygons = useMemo(() => {
    if (!showNeighborhoodPolygons) return []

    return neighborhoods.map((n) => {
      const coordinates = n.polygon.coordinates[0].map(([lng, lat]) => ({
        latitude: lat,
        longitude: lng,
      }))

      return {
        id: n.id,
        name: n.name,
        coordinates,
      }
    })
  }, [neighborhoods, showNeighborhoodPolygons])

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={handleRegionChange}
        showsUserLocation
        showsMyLocationButton
        showsCompass
        showsScale
      >
        {/* Neighborhood Polygons */}
        {neighborhoodPolygons.map((polygon) => (
          <Polygon
            key={polygon.id}
            coordinates={polygon.coordinates}
            strokeColor="#3b82f6"
            fillColor="rgba(59, 130, 246, 0.1)"
            strokeWidth={2}
          />
        ))}

        {/* Property Markers */}
        {properties.map((property) => {
          const isSelected = selectedId === property.id
          const isComparing = comparingIds.includes(property.id)
          const isFavorite = favoriteIds.includes(property.id)
          const color = getMarkerColor(property)

          return (
            <Marker
              key={property.id}
              coordinate={{
                latitude: property.location.lat,
                longitude: property.location.lng,
              }}
              onPress={() => onPropertyPress?.(property)}
            >
              <View style={[
                styles.marker,
                { backgroundColor: color },
                isSelected && styles.markerSelected,
                isComparing && styles.markerComparing,
                isFavorite && styles.markerFavorite,
              ]}>
                <Text style={styles.markerText}>
                  {formatPrice(property.price)}
                </Text>
              </View>

              <Callout tooltip>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle} numberOfLines={1}>
                    {property.title}
                  </Text>
                  <Text style={styles.calloutPrice}>
                    {formatPrice(property.price)}
                  </Text>
                  <Text style={styles.calloutDetails}>
                    {property.features.bedrooms} hab · {property.features.bathrooms} banos · {property.features.totalArea}m²
                  </Text>
                  <Text style={styles.calloutNeighborhood}>
                    {property.location.neighborhood}
                  </Text>
                </View>
              </Callout>
            </Marker>
          )
        })}
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  marker: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  markerSelected: {
    borderColor: '#000',
  },
  markerComparing: {
    borderColor: '#3b82f6',
  },
  markerFavorite: {
    borderColor: '#ef4444',
  },
  markerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  callout: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  calloutPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  calloutDetails: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  calloutNeighborhood: {
    fontSize: 12,
    color: '#999',
  },
})

export default PropertyMap
