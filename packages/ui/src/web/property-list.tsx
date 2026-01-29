'use client'

import * as React from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { Property } from '@propery/api-client'
import { cn } from '../shared/utils'
import { PropertyCard } from './property-card'
import { PropertyListSkeleton } from './skeleton'
import { EmptyState } from './empty-state'

interface PropertyListProps {
  properties: Property[]
  isLoading?: boolean
  isError?: boolean
  hasMore?: boolean
  comparingIds?: string[]
  favoriteIds?: string[]
  onLoadMore?: () => void
  onCompare?: (property: Property) => void
  onFavorite?: (property: Property) => void
  onShare?: (property: Property) => void
  onPropertyClick?: (property: Property) => void
  onReset?: () => void
  onRetry?: () => void
  className?: string
}

export function PropertyList({
  properties,
  isLoading = false,
  isError = false,
  hasMore = false,
  comparingIds = [],
  favoriteIds = [],
  onLoadMore,
  onCompare,
  onFavorite,
  onShare,
  onPropertyClick,
  onReset,
  onRetry,
  className,
}: PropertyListProps) {
  const parentRef = React.useRef<HTMLDivElement>(null)
  const [columns, setColumns] = React.useState(3)

  // Responsive columns
  React.useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth
      if (width < 640) setColumns(1)
      else if (width < 1024) setColumns(2)
      else setColumns(3)
    }

    updateColumns()
    window.addEventListener('resize', updateColumns)
    return () => window.removeEventListener('resize', updateColumns)
  }, [])

  // Calculate rows for virtualization
  const rowCount = Math.ceil(properties.length / columns)

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 380, // Estimated row height
    overscan: 2,
  })

  // Infinite scroll trigger
  React.useEffect(() => {
    const lastItem = virtualizer.getVirtualItems().at(-1)
    if (!lastItem) return

    if (lastItem.index >= rowCount - 1 && hasMore && !isLoading && onLoadMore) {
      onLoadMore()
    }
  }, [virtualizer.getVirtualItems(), rowCount, hasMore, isLoading, onLoadMore])

  // Loading state
  if (isLoading && properties.length === 0) {
    return <PropertyListSkeleton count={6} />
  }

  // Error state
  if (isError) {
    return <EmptyState variant="error" onRetry={onRetry} />
  }

  // Empty state
  if (properties.length === 0) {
    return <EmptyState variant="no-results" onReset={onReset} />
  }

  return (
    <div
      ref={parentRef}
      className={cn('h-full overflow-auto', className)}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const startIndex = virtualRow.index * columns
          const rowProperties = properties.slice(startIndex, startIndex + columns)

          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                }}
              >
                {rowProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    isComparing={comparingIds.includes(property.id)}
                    isFavorite={favoriteIds.includes(property.id)}
                    onCompare={onCompare}
                    onFavorite={onFavorite}
                    onShare={onShare}
                    onClick={onPropertyClick}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Loading more indicator */}
      {isLoading && properties.length > 0 && (
        <div className="py-4">
          <PropertyListSkeleton count={columns} />
        </div>
      )}
    </div>
  )
}
