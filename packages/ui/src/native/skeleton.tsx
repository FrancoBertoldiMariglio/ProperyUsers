import React, { useEffect, useRef } from 'react'
import { View, Animated } from 'react-native'
import { cn } from '../shared/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    )
    animation.start()
    return () => animation.stop()
  }, [opacity])

  return (
    <Animated.View
      style={{ opacity }}
      className={cn('rounded-md bg-muted', className)}
    />
  )
}

export function PropertyCardSkeleton({ className }: { className?: string }) {
  return (
    <View className={cn('overflow-hidden rounded-lg border border-border bg-card', className)}>
      {/* Image skeleton */}
      <Skeleton className="aspect-[4/3] w-full rounded-none" />

      <View className="p-3">
        {/* Price skeleton */}
        <View className="mb-1 flex-row items-baseline justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-16" />
        </View>

        {/* Title skeleton */}
        <Skeleton className="mb-1 h-5 w-full" />

        {/* Location skeleton */}
        <Skeleton className="mb-2 h-4 w-3/4" />

        {/* Features skeleton */}
        <View className="flex-row gap-3">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-14" />
        </View>
      </View>
    </View>
  )
}

export function PropertyListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <View className="gap-4 px-4">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </View>
  )
}
