import React from 'react'
import { Pressable, Text, ActivityIndicator, type PressableProps, View } from 'react-native'
import { cn } from '../shared/utils'

interface ButtonProps extends PressableProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
  className?: string
  textClassName?: string
}

const variantStyles = {
  default: 'bg-primary',
  secondary: 'bg-secondary',
  destructive: 'bg-destructive',
  outline: 'border border-input bg-transparent',
  ghost: 'bg-transparent',
}

const variantTextStyles = {
  default: 'text-primary-foreground',
  secondary: 'text-secondary-foreground',
  destructive: 'text-destructive-foreground',
  outline: 'text-foreground',
  ghost: 'text-foreground',
}

const sizeStyles = {
  sm: 'px-3 py-2',
  md: 'px-4 py-2.5',
  lg: 'px-6 py-3',
}

const sizeTextStyles = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}

export function Button({
  variant = 'default',
  size = 'md',
  loading,
  disabled,
  children,
  className,
  textClassName,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      disabled={disabled || loading}
      className={cn(
        'flex-row items-center justify-center rounded-lg',
        variantStyles[variant],
        sizeStyles[size],
        (disabled || loading) && 'opacity-50',
        className
      )}
      {...props}
    >
      {loading ? (
        <View className="flex-row items-center gap-2">
          <ActivityIndicator size="small" color="currentColor" />
          <Text className={cn('font-semibold', variantTextStyles[variant], sizeTextStyles[size])}>
            Cargando...
          </Text>
        </View>
      ) : typeof children === 'string' ? (
        <Text
          className={cn(
            'font-semibold',
            variantTextStyles[variant],
            sizeTextStyles[size],
            textClassName
          )}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  )
}
