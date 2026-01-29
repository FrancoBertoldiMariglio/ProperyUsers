import React from 'react'
import { View, Text, TextInput, type TextInputProps } from 'react-native'
import { cn } from '../shared/utils'

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  containerClassName?: string
}

export function Input({
  label,
  error,
  containerClassName,
  className,
  ...props
}: InputProps) {
  return (
    <View className={cn('w-full', containerClassName)}>
      {label && (
        <Text className="mb-2 text-sm font-medium text-foreground">{label}</Text>
      )}
      <TextInput
        className={cn(
          'h-12 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground',
          error && 'border-destructive',
          className
        )}
        placeholderTextColor="#9ca3af"
        {...props}
      />
      {error && <Text className="mt-1 text-sm text-destructive">{error}</Text>}
    </View>
  )
}
