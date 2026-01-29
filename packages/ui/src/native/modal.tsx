import React from 'react'
import {
  Modal as RNModal,
  View,
  Text,
  Pressable,
  type ModalProps as RNModalProps,
} from 'react-native'
import { cn } from '../shared/utils'

interface ModalProps extends Omit<RNModalProps, 'visible'> {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function Modal({ open, onOpenChange, children, ...props }: ModalProps) {
  return (
    <RNModal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}
      {...props}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/50"
        onPress={() => onOpenChange(false)}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>{children}</Pressable>
      </Pressable>
    </RNModal>
  )
}

interface ModalContentProps {
  children: React.ReactNode
  className?: string
}

export function ModalContent({ children, className }: ModalContentProps) {
  return (
    <View className={cn('mx-4 w-full max-w-lg rounded-lg bg-background p-6 shadow-lg', className)}>
      {children}
    </View>
  )
}

interface ModalHeaderProps {
  children: React.ReactNode
  className?: string
}

export function ModalHeader({ children, className }: ModalHeaderProps) {
  return <View className={cn('mb-4', className)}>{children}</View>
}

interface ModalTitleProps {
  children: React.ReactNode
  className?: string
}

export function ModalTitle({ children, className }: ModalTitleProps) {
  return <Text className={cn('text-lg font-semibold text-foreground', className)}>{children}</Text>
}

interface ModalDescriptionProps {
  children: React.ReactNode
  className?: string
}

export function ModalDescription({ children, className }: ModalDescriptionProps) {
  return <Text className={cn('text-sm text-muted-foreground', className)}>{children}</Text>
}

interface ModalFooterProps {
  children: React.ReactNode
  className?: string
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return <View className={cn('mt-4 flex-row justify-end gap-2', className)}>{children}</View>
}

interface ModalCloseProps {
  onPress: () => void
  children: React.ReactNode
}

export function ModalClose({ onPress, children }: ModalCloseProps) {
  return <Pressable onPress={onPress}>{children}</Pressable>
}
