import React from 'react'
import { View, Text, type ViewProps } from 'react-native'
import { cn } from '../shared/utils'

interface CardProps extends ViewProps {
  className?: string
}

export function Card({ className, ...props }: CardProps) {
  return (
    <View
      className={cn('rounded-lg border border-border bg-card shadow-sm', className)}
      {...props}
    />
  )
}

interface CardHeaderProps extends ViewProps {
  className?: string
}

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return <View className={cn('p-4', className)} {...props} />
}

interface CardTitleProps {
  children: React.ReactNode
  className?: string
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <Text className={cn('text-xl font-semibold text-card-foreground', className)}>{children}</Text>
  )
}

interface CardDescriptionProps {
  children: React.ReactNode
  className?: string
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return <Text className={cn('text-sm text-muted-foreground', className)}>{children}</Text>
}

interface CardContentProps extends ViewProps {
  className?: string
}

export function CardContent({ className, ...props }: CardContentProps) {
  return <View className={cn('p-4 pt-0', className)} {...props} />
}

interface CardFooterProps extends ViewProps {
  className?: string
}

export function CardFooter({ className, ...props }: CardFooterProps) {
  return <View className={cn('flex-row items-center p-4 pt-0', className)} {...props} />
}
