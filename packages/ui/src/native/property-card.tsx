import React from 'react'
import { View, Text, Image, Pressable, Share } from 'react-native'
import type { Property } from '@propery/api-client'
import { cn } from '../shared/utils'
import { Badge } from './badge'
import { Card, CardContent } from './card'

interface PropertyCardProps {
  property: Property
  isComparing?: boolean
  isFavorite?: boolean
  onCompare?: (property: Property) => void
  onFavorite?: (property: Property) => void
  onShare?: (property: Property) => void
  onPress?: (property: Property) => void
  className?: string
}

const sourceLabels: Record<string, string> = {
  zonaprop: 'ZonaProp',
  mercadolibre: 'MercadoLibre',
  argenprop: 'Argenprop',
  properati: 'Properati',
  direct: 'Directo',
}

const priceCategoryLabels: Record<string, string> = {
  opportunity: 'Oportunidad',
  fair: 'Precio justo',
  expensive: 'Elevado',
  overpriced: 'Sobrevalorado',
}

export function PropertyCard({
  property,
  isComparing = false,
  isFavorite = false,
  onCompare,
  onFavorite,
  onShare,
  onPress,
  className,
}: PropertyCardProps) {
  const priceFormatted = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: property.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(property.price)

  const handlePress = () => {
    onPress?.(property)
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${property.title}\n${priceFormatted}\n${property.location.address}, ${property.location.neighborhood}`,
        title: property.title,
      })
      onShare?.(property)
    } catch {
      // Share cancelled or failed
    }
  }

  return (
    <Pressable onPress={handlePress}>
      <Card className={cn('overflow-hidden', isComparing && 'border-2 border-primary', className)}>
        {/* Image Section */}
        <View className="relative aspect-[4/3]">
          <Image
            source={{ uri: property.images[0] || 'https://via.placeholder.com/400x300' }}
            className="h-full w-full"
            resizeMode="cover"
          />

          {/* Source Badge */}
          <View className="absolute left-2 top-2">
            <Badge variant="secondary" className="bg-white/90">
              {sourceLabels[property.source] || property.source}
            </Badge>
          </View>

          {/* Price Category Badge */}
          {property.prediction?.priceCategory && (
            <View className="absolute right-2 top-2">
              <Badge variant={property.prediction.priceCategory as 'opportunity' | 'fair' | 'expensive' | 'overpriced'}>
                {priceCategoryLabels[property.prediction.priceCategory]}
              </Badge>
            </View>
          )}

          {/* Image Count */}
          {property.images.length > 1 && (
            <View className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5">
              <Text className="text-xs text-white">1/{property.images.length}</Text>
            </View>
          )}
        </View>

        <CardContent className="p-3">
          {/* Price */}
          <View className="mb-1 flex-row items-baseline justify-between">
            <Text className="text-lg font-bold text-foreground">{priceFormatted}</Text>
            {property.expenses && (
              <Text className="text-xs text-muted-foreground">
                + ${property.expenses.toLocaleString('es-AR')} exp.
              </Text>
            )}
          </View>

          {/* Title */}
          <Text className="mb-1 text-sm font-medium text-foreground" numberOfLines={1}>
            {property.title}
          </Text>

          {/* Location */}
          <View className="mb-2 flex-row items-center gap-1">
            <Text className="text-xs text-muted-foreground" numberOfLines={1}>
              {property.location.neighborhood}, {property.location.city}
            </Text>
          </View>

          {/* Features */}
          <View className="flex-row gap-3">
            <Text className="text-xs text-muted-foreground">
              {property.features.bedrooms} hab
            </Text>
            <Text className="text-xs text-muted-foreground">
              {property.features.bathrooms} bano
            </Text>
            <Text className="text-xs text-muted-foreground">
              {property.features.totalArea} m²
            </Text>
            {property.features.parking > 0 && (
              <Text className="text-xs text-muted-foreground">
                {property.features.parking} coch
              </Text>
            )}
          </View>

          {/* Quick Actions */}
          <View className="mt-3 flex-row justify-end gap-2">
            <Pressable
              onPress={() => onCompare?.(property)}
              className={cn(
                'rounded-full p-2',
                isComparing ? 'bg-primary' : 'bg-secondary'
              )}
            >
              <Text className={isComparing ? 'text-primary-foreground' : 'text-secondary-foreground'}>
                Comparar
              </Text>
            </Pressable>
            <Pressable
              onPress={() => onFavorite?.(property)}
              className={cn(
                'rounded-full p-2',
                isFavorite ? 'bg-red-500' : 'bg-secondary'
              )}
            >
              <Text className={isFavorite ? 'text-white' : 'text-secondary-foreground'}>
                {isFavorite ? 'Guardado' : 'Guardar'}
              </Text>
            </Pressable>
            <Pressable onPress={handleShare} className="rounded-full bg-secondary p-2">
              <Text className="text-secondary-foreground">Compartir</Text>
            </Pressable>
          </View>
        </CardContent>
      </Card>
    </Pressable>
  )
}
