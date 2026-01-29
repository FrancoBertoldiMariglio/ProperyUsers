import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { cn } from '../shared/utils'

interface EmptyStateProps {
  variant?: 'no-results' | 'no-properties' | 'error'
  title?: string
  description?: string
  onReset?: () => void
  onRetry?: () => void
  className?: string
}

const variants = {
  'no-results': {
    emoji: '🔍',
    defaultTitle: 'No encontramos propiedades',
    defaultDescription: 'Intenta ajustar los filtros para ver mas resultados.',
  },
  'no-properties': {
    emoji: '🏠',
    defaultTitle: 'Sin propiedades',
    defaultDescription: 'No hay propiedades disponibles en este momento.',
  },
  error: {
    emoji: '⚠️',
    defaultTitle: 'Error al cargar',
    defaultDescription: 'Hubo un problema al cargar las propiedades. Por favor intenta de nuevo.',
  },
}

export function EmptyState({
  variant = 'no-results',
  title,
  description,
  onReset,
  onRetry,
  className,
}: EmptyStateProps) {
  const config = variants[variant]

  return (
    <View
      className={cn(
        'flex-1 items-center justify-center rounded-lg border border-dashed border-border p-8',
        className
      )}
    >
      <View className="mb-4 rounded-full bg-muted p-4">
        <Text className="text-3xl">{config.emoji}</Text>
      </View>

      <Text className="mb-2 text-center text-lg font-semibold text-foreground">
        {title || config.defaultTitle}
      </Text>

      <Text className="mb-6 max-w-xs text-center text-sm text-muted-foreground">
        {description || config.defaultDescription}
      </Text>

      <View className="flex-row gap-3">
        {onReset && (
          <Pressable
            onPress={onReset}
            className="rounded-lg border border-border bg-background px-4 py-2"
          >
            <Text className="text-sm font-medium text-foreground">Limpiar filtros</Text>
          </Pressable>
        )}
        {onRetry && (
          <Pressable onPress={onRetry} className="rounded-lg bg-primary px-4 py-2">
            <Text className="text-sm font-medium text-primary-foreground">Reintentar</Text>
          </Pressable>
        )}
      </View>
    </View>
  )
}
