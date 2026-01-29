'use client'

import * as React from 'react'
import { cn } from '../shared/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  )
}

export function PropertyCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('overflow-hidden rounded-lg border bg-card', className)}>
      {/* Image skeleton */}
      <Skeleton className="aspect-[4/3] w-full rounded-none" />

      <div className="p-4">
        {/* Price skeleton */}
        <div className="mb-2 flex items-baseline justify-between">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Title skeleton */}
        <Skeleton className="mb-2 h-5 w-full" />

        {/* Location skeleton */}
        <Skeleton className="mb-3 h-4 w-3/4" />

        {/* Features skeleton */}
        <div className="flex gap-3">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  )
}

export function PropertyListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  )
}
