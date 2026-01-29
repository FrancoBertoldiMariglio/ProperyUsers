import { useState, useRef, useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  Dimensions,
  Share,
  FlatList,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, router } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { useComparisonStore } from '@propery/core'
import { getPropertiesByIds, type Property } from '@propery/api-client'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CARD_WIDTH = SCREEN_WIDTH - 32

export default function CompareScreen() {
  const { ids } = useLocalSearchParams<{ ids: string }>()
  const propertyIds = ids?.split(',').filter(Boolean) ?? []
  const [activeIndex, setActiveIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)
  const { removeProperty } = useComparisonStore()

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['compare-properties', propertyIds],
    queryFn: () => getPropertiesByIds(propertyIds),
    enabled: propertyIds.length > 0,
  })

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Mira esta comparación de ${properties.length} propiedades en Propery: https://propery.app/compare?ids=${propertyIds.join(',')}`,
      })
    } catch {
      // User cancelled share
    }
  }

  const handleRemove = (id: string) => {
    removeProperty(id)
    const newIds = propertyIds.filter((i) => i !== id)
    if (newIds.length < 2) {
      router.replace('/search')
    } else {
      router.replace(`/compare?ids=${newIds.join(',')}`)
    }
  }

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index)
      }
    },
    []
  )

  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 }

  if (propertyIds.length < 2) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-xl font-bold text-foreground">
            Selecciona al menos 2 propiedades
          </Text>
          <Pressable
            className="mt-4 rounded-lg bg-primary px-6 py-3"
            onPress={() => router.replace('/search')}
          >
            <Text className="font-semibold text-primary-foreground">
              Volver a búsqueda
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted-foreground">Cargando...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-border px-4 py-3">
        <Pressable onPress={() => router.back()}>
          <Text className="text-primary">← Volver</Text>
        </Pressable>
        <Text className="font-semibold text-foreground">
          Comparando {properties.length}
        </Text>
        <Pressable onPress={handleShare}>
          <Text className="text-primary">Compartir</Text>
        </Pressable>
      </View>

      {/* Pagination dots */}
      <View className="flex-row justify-center gap-2 py-3">
        {properties.map((_, index) => (
          <Pressable
            key={index}
            onPress={() => {
              flatListRef.current?.scrollToIndex({ index, animated: true })
            }}
          >
            <View
              className={`h-2 w-2 rounded-full ${
                index === activeIndex ? 'bg-primary' : 'bg-muted'
              }`}
            />
          </Pressable>
        ))}
      </View>

      {/* Property Cards Carousel */}
      <FlatList
        ref={flatListRef}
        data={properties}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={SCREEN_WIDTH}
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        keyExtractor={(item) => item.id}
        renderItem={({ item: property }) => (
          <PropertyComparisonCard
            property={property}
            onRemove={() => handleRemove(property.id)}
          />
        )}
      />

      {/* Comparison hint */}
      <View className="border-t border-border px-4 py-3">
        <Text className="text-center text-sm text-muted-foreground">
          Desliza horizontalmente para comparar propiedades
        </Text>
      </View>
    </SafeAreaView>
  )
}

interface PropertyComparisonCardProps {
  property: Property
  onRemove: () => void
}

function PropertyComparisonCard({ property, onRemove }: PropertyComparisonCardProps) {
  const formatPrice = (price: number, currency: string) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(price)

  const priceCategoryColors: Record<string, string> = {
    opportunity: 'bg-green-500',
    fair: 'bg-blue-500',
    expensive: 'bg-yellow-500',
    overpriced: 'bg-red-500',
  }

  const priceCategoryLabels: Record<string, string> = {
    opportunity: 'Oportunidad',
    fair: 'Precio justo',
    expensive: 'Elevado',
    overpriced: 'Sobrevalorado',
  }

  return (
    <View style={{ width: SCREEN_WIDTH }} className="px-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image */}
        <View className="relative aspect-[16/10] overflow-hidden rounded-xl">
          <Image
            source={{
              uri: property.images[0] || 'https://via.placeholder.com/400x250',
            }}
            className="h-full w-full"
            resizeMode="cover"
          />
          {property.prediction && (
            <View
              className={`absolute bottom-2 left-2 rounded-full px-3 py-1 ${priceCategoryColors[property.prediction.priceCategory]}`}
            >
              <Text className="text-xs font-medium text-white">
                {priceCategoryLabels[property.prediction.priceCategory]}
              </Text>
            </View>
          )}
          <Pressable
            className="absolute right-2 top-2 rounded-full bg-black/50 p-2"
            onPress={onRemove}
          >
            <Text className="text-white">✕</Text>
          </Pressable>
        </View>

        {/* Content */}
        <View className="mt-4">
          <Text className="text-xl font-bold text-foreground">
            {formatPrice(property.price, property.currency)}
          </Text>
          {property.expenses && (
            <Text className="text-sm text-muted-foreground">
              + {formatPrice(property.expenses, 'ARS')} expensas
            </Text>
          )}
          <Text className="mt-1 text-base text-foreground" numberOfLines={2}>
            {property.title}
          </Text>
          <Text className="text-sm text-muted-foreground">
            {property.location.neighborhood}, {property.location.city}
          </Text>
        </View>

        {/* Features */}
        <View className="mt-4 flex-row flex-wrap gap-3">
          <FeatureChip label={`${property.features.bedrooms} hab`} />
          <FeatureChip label={`${property.features.bathrooms} baños`} />
          <FeatureChip label={`${property.features.totalArea} m²`} />
          {property.features.parking > 0 && (
            <FeatureChip label={`${property.features.parking} cochera`} />
          )}
        </View>

        {/* Characteristics Table */}
        <View className="mt-4 rounded-lg border border-border">
          <CharacteristicRow label="Superficie cubierta" value={`${property.features.coveredArea} m²`} />
          <CharacteristicRow
            label="Antigüedad"
            value={property.features.age === null ? 'N/D' : property.features.age === 0 ? 'A estrenar' : `${property.features.age} años`}
          />
          <CharacteristicRow label="Tipo" value={getPropertyTypeLabel(property.propertyType)} />
          <CharacteristicRow label="Operación" value={property.operationType === 'sale' ? 'Venta' : 'Alquiler'} />
          {property.features.floor !== undefined && (
            <CharacteristicRow label="Piso" value={`${property.features.floor}`} />
          )}
        </View>

        {/* Amenities */}
        <View className="mt-4">
          <Text className="mb-2 font-semibold text-foreground">Amenities</Text>
          <View className="flex-row flex-wrap gap-2">
            {Object.entries(property.amenities)
              .filter(([, value]) => value)
              .map(([key]) => (
                <View key={key} className="rounded-full bg-green-100 px-3 py-1">
                  <Text className="text-xs text-green-800">{getAmenityLabel(key)}</Text>
                </View>
              ))}
          </View>
        </View>

        {/* Investment score (if prediction available) */}
        {property.prediction && (
          <View className="my-4 rounded-lg bg-muted p-4">
            <Text className="font-semibold text-foreground">Análisis de precio</Text>
            <Text className="mt-1 text-sm text-muted-foreground">
              {property.prediction.percentageDiff > 0 ? '+' : ''}
              {property.prediction.percentageDiff}% vs precio estimado
            </Text>
            <Text className="text-sm text-muted-foreground">
              Confianza: {Math.round(property.prediction.confidence * 100)}%
            </Text>
          </View>
        )}

        {/* Spacer for scroll */}
        <View className="h-20" />
      </ScrollView>
    </View>
  )
}

function FeatureChip({ label }: { label: string }) {
  return (
    <View className="rounded-full border border-border px-3 py-1">
      <Text className="text-sm text-foreground">{label}</Text>
    </View>
  )
}

function CharacteristicRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between border-b border-border px-4 py-3 last:border-b-0">
      <Text className="text-muted-foreground">{label}</Text>
      <Text className="font-medium text-foreground">{value}</Text>
    </View>
  )
}

function getPropertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    apartment: 'Departamento',
    house: 'Casa',
    ph: 'PH',
    land: 'Terreno',
    office: 'Oficina',
    local: 'Local',
  }
  return labels[type] || type
}

function getAmenityLabel(key: string): string {
  const labels: Record<string, string> = {
    pool: 'Pileta',
    gym: 'Gimnasio',
    laundry: 'Lavadero',
    rooftop: 'Rooftop',
    security: 'Seguridad',
    balcony: 'Balcón',
    terrace: 'Terraza',
    garden: 'Jardín',
    storage: 'Baulera',
    petFriendly: 'Mascotas',
  }
  return labels[key] || key
}
