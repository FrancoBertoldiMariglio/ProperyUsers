import React from 'react'
import { View, Text } from 'react-native'
import { cn } from '../shared/utils'

type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'opportunity'
  | 'fair'
  | 'expensive'
  | 'overpriced'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-primary',
  secondary: 'bg-secondary',
  destructive: 'bg-destructive',
  outline: 'border border-border bg-transparent',
  opportunity: 'bg-opportunity',
  fair: 'bg-fair',
  expensive: 'bg-expensive',
  overpriced: 'bg-overpriced',
}

const variantTextStyles: Record<BadgeVariant, string> = {
  default: 'text-primary-foreground',
  secondary: 'text-secondary-foreground',
  destructive: 'text-destructive-foreground',
  outline: 'text-foreground',
  opportunity: 'text-white',
  fair: 'text-white',
  expensive: 'text-white',
  overpriced: 'text-white',
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <View className={cn('rounded-full px-2.5 py-0.5', variantStyles[variant], className)}>
      <Text className={cn('text-xs font-semibold', variantTextStyles[variant])}>{children}</Text>
    </View>
  )
}
