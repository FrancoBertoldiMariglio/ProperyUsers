import React, { useRef, useEffect } from 'react'
import {
  View,
  Text,
  Modal,
  Pressable,
  Animated,
  PanResponder,
  Dimensions,
  ScrollView,
} from 'react-native'
import { cn } from '../shared/utils'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  snapPoints?: number[]
  children: React.ReactNode
  className?: string
}

export function BottomSheet({
  open,
  onClose,
  title,
  snapPoints = [0.5, 0.9],
  children,
  className,
}: BottomSheetProps) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current
  const currentSnapIndex = useRef(0)

  const maxHeight = SCREEN_HEIGHT * snapPoints[snapPoints.length - 1]
  const minHeight = SCREEN_HEIGHT * snapPoints[0]

  useEffect(() => {
    if (open) {
      Animated.spring(translateY, {
        toValue: SCREEN_HEIGHT - minHeight,
        useNativeDriver: true,
        damping: 20,
        stiffness: 150,
      }).start()
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      }).start()
    }
  }, [open, translateY, minHeight])

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newY = SCREEN_HEIGHT - minHeight + gestureState.dy
        if (newY >= SCREEN_HEIGHT - maxHeight && newY <= SCREEN_HEIGHT) {
          translateY.setValue(newY)
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const currentY = SCREEN_HEIGHT - minHeight + gestureState.dy
        const velocity = gestureState.vy

        // If swiping down fast, close
        if (velocity > 0.5) {
          onClose()
          return
        }

        // If swiping up fast, expand
        if (velocity < -0.5) {
          Animated.spring(translateY, {
            toValue: SCREEN_HEIGHT - maxHeight,
            useNativeDriver: true,
            damping: 20,
          }).start()
          currentSnapIndex.current = snapPoints.length - 1
          return
        }

        // Find closest snap point
        const snapHeights = snapPoints.map((p) => SCREEN_HEIGHT - SCREEN_HEIGHT * p)
        const closest = snapHeights.reduce((prev, curr) =>
          Math.abs(curr - currentY) < Math.abs(prev - currentY) ? curr : prev
        )

        if (closest === SCREEN_HEIGHT) {
          onClose()
        } else {
          Animated.spring(translateY, {
            toValue: closest,
            useNativeDriver: true,
            damping: 20,
          }).start()
        }
      },
    })
  ).current

  return (
    <Modal
      visible={open}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Pressable
        className="flex-1 bg-black/50"
        onPress={onClose}
      >
        <Animated.View
          style={{
            transform: [{ translateY }],
            height: maxHeight,
          }}
          className={cn(
            'absolute left-0 right-0 rounded-t-3xl bg-background',
            className
          )}
        >
          {/* Handle */}
          <View
            {...panResponder.panHandlers}
            className="items-center py-3"
          >
            <View className="h-1 w-10 rounded-full bg-muted-foreground/30" />
          </View>

          {/* Header */}
          {title && (
            <View className="border-b border-border px-4 pb-3">
              <Text className="text-center text-lg font-semibold text-foreground">
                {title}
              </Text>
            </View>
          )}

          {/* Content */}
          <ScrollView
            className="flex-1 px-4"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </Animated.View>
      </Pressable>
    </Modal>
  )
}
