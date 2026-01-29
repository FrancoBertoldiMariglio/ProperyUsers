import React, { useCallback } from 'react'
import { FlatList, View, RefreshControl, type ListRenderItemInfo } from 'react-native'
import type { Property } from '@propery/api-client'
import { cn } from '../shared/utils'
import { PropertyCard } from './property-card'
import { PropertyCardSkeleton } from './skeleton'
import { EmptyState } from './empty-state'

interface PropertyListProps {
  properties: Property[]
  isLoading?: boolean
  isError?: boolean
  isRefreshing?: boolean
  hasMore?: boolean
  comparingIds?: string[]
  favoriteIds?: string[]
  onLoadMore?: () => void
  onRefresh?: () => void
  onCompare?: (property: Property) => void
  onFavorite?: (property: Property) => void
  onShare?: (property: Property) => void
  onPropertyPress?: (property: Property) => void
  onReset?: () => void
  onRetry?: () => void
  className?: string
}

export function PropertyList({
  properties,
  isLoading = false,
  isError = false,
  isRefreshing = false,
  hasMore = false,
  comparingIds = [],
  favoriteIds = [],
  onLoadMore,
  onRefresh,
  onCompare,
  onFavorite,
  onShare,
  onPropertyPress,
  onReset,
  onRetry,
  className,
}: PropertyListProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Property>) => (
      <View className="px-4 py-2">
        <PropertyCard
          property={item}
          isComparing={comparingIds.includes(item.id)}
          isFavorite={favoriteIds.includes(item.id)}
          onCompare={onCompare}
          onFavorite={onFavorite}
          onShare={onShare}
          onPress={onPropertyPress}
        />
      </View>
    ),
    [comparingIds, favoriteIds, onCompare, onFavorite, onShare, onPropertyPress]
  )

  const keyExtractor = useCallback((item: Property) => item.id, [])

  const handleEndReached = useCallback(() => {
    if (hasMore && !isLoading && onLoadMore) {
      onLoadMore()
    }
  }, [hasMore, isLoading, onLoadMore])

  const ListFooter = useCallback(() => {
    if (!isLoading || properties.length === 0) return null
    return (
      <View className="py-4">
        <PropertyCardSkeleton className="mx-4" />
      </View>
    )
  }, [isLoading, properties.length])

  const ListEmpty = useCallback(() => {
    if (isLoading) {
      return (
        <View className="py-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <View key={i} className="py-2">
              <PropertyCardSkeleton className="mx-4" />
            </View>
          ))}
        </View>
      )
    }

    if (isError) {
      return <EmptyState variant="error" onRetry={onRetry} className="m-4" />
    }

    return <EmptyState variant="no-results" onReset={onReset} className="m-4" />
  }, [isLoading, isError, onReset, onRetry])

  return (
    <FlatList
      data={properties}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={ListFooter}
      ListEmptyComponent={ListEmpty}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        ) : undefined
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
      className={cn('flex-1', className)}
      removeClippedSubviews
      maxToRenderPerBatch={10}
      windowSize={5}
      initialNumToRender={6}
    />
  )
}
