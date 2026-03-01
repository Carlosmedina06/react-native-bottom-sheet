import type { BottomSheetDragEvent, BottomSheetProps } from './BottomSheet.types'

import { useCallback, useEffect, useRef, useState } from 'react'
import { BackHandler, Dimensions, Keyboard, Platform } from 'react-native'
import { Gesture } from 'react-native-gesture-handler'
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

import { subscribeToKeyboard } from './utils/keyboard'
import { getDefaultMaxHeight, resolveHeight, resolveSnapPoints } from './utils/resolveSnapPoints'
import { useSafeAreaInsetsBottom } from './utils/safeArea'

const ANIMATION_DURATION = 280
const CLOSE_VELOCITY_THRESHOLD = 500
const CLOSE_DRAG_THRESHOLD_RATIO = 0.3
const HANDLE_TOUCH_HEIGHT = 28

export interface BottomSheetControllerModel {
  open: boolean
  fitContent: boolean
  isRendered: boolean
  shouldMeasureHiddenContent: boolean
  hasInternalScroll: boolean
  safeBottom: number
  resolvedMin: number
  resolvedMax: number
  effectiveOpenHeight: number
  handleTouchHeight: number
  backdropStyle: ReturnType<typeof useAnimatedStyle>
  sheetStyle: ReturnType<typeof useAnimatedStyle>
  sheetBackgroundStyle: ReturnType<typeof useAnimatedStyle>
  extendSheetBehindKeyboardOnIos: boolean
  panGesture: ReturnType<typeof Gesture.Pan>
  handleClose: () => void
  onMeasureContent: (height: number) => void
  onMeasureBody: (height: number) => void
}

export default function useBottomSheetController({
  open: openProp,
  onClose,
  onCloseRequest,
  onOpen,
  onOpenStart,
  onOpenEnd,
  onCloseStart,
  onCloseEnd,
  onDrag,
  minHeight,
  maxHeight: maxHeightProp,
  fitContent = false,
  keyboardBehavior = 'none',
  enablePanDownToClose = true,
  snapPoints: snapPointsProp,
}: Readonly<BottomSheetProps>): BottomSheetControllerModel {
  const open = openProp
  const handleClose = useCallback(() => onClose(), [onClose])

  const requestClose = useCallback(async (): Promise<boolean> => {
    if (onCloseRequest) {
      const result = await Promise.resolve(onCloseRequest())

      if (!result) {
        return false
      }
    }

    onClose()

    return true
  }, [onClose, onCloseRequest])
  const [contentHeight, setContentHeight] = useState<number | null>(null)
  const bodyHeightRef = useRef<number | null>(null)
  const [isRendered, setIsRendered] = useState(open)
  const hasEmittedOpenRef = useRef(false)
  const hasEmittedOpenEndRef = useRef(false)
  const hasEmittedCloseEndRef = useRef(false)
  const prevOpenRef = useRef(open)

  const windowHeight = Dimensions.get('window').height
  const safeBottom = useSafeAreaInsetsBottom()
  const defaultMax = getDefaultMaxHeight()
  const resolvedMin = resolveHeight(minHeight, 220)
  const resolvedMax = resolveHeight(maxHeightProp, defaultMax)

  const measuredContentHeight = contentHeight ?? 0
  const hasInternalScroll =
    fitContent &&
    contentHeight !== null &&
    measuredContentHeight + HANDLE_TOUCH_HEIGHT > resolvedMax

  const resolvedSnapPoints =
    !fitContent && snapPointsProp && snapPointsProp.length > 0
      ? [...resolveSnapPoints(snapPointsProp)].sort((a, b) => a - b)
      : null
  const effectiveOpenHeight = (() => {
    if (fitContent) return Math.min(resolvedMax, measuredContentHeight + HANDLE_TOUCH_HEIGHT)
    if (resolvedSnapPoints) return Math.min(resolvedMax, Math.max(...resolvedSnapPoints))

    return resolvedMax
  })()

  // translateY: 0 = panel fully visible at bottom:safeBottom, windowHeight = off-screen below
  const translateY = useSharedValue(windowHeight)
  const backdropOpacity = useSharedValue(0)
  const sheetOpacity = useSharedValue(0)
  const contextY = useSharedValue(0)
  const keyboardOffset = useSharedValue(0)

  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss()
  }, [])

  const performCloseAnimationAndNotify = useCallback(() => {
    translateY.value = withTiming(windowHeight, { duration: ANIMATION_DURATION })
    backdropOpacity.value = withTiming(0, { duration: ANIMATION_DURATION })
    handleClose()
  }, [handleClose, translateY, backdropOpacity, windowHeight])

  const closeByDragRequest = useCallback(async () => {
    const ok = await requestClose()

    if (ok) {
      if (keyboardBehavior !== 'none') dismissKeyboard()

      performCloseAnimationAndNotify()
    } else {
      translateY.value = withSpring(0)
    }
  }, [requestClose, keyboardBehavior, dismissKeyboard, performCloseAnimationAndNotify, translateY])

  const onMeasureContent = useCallback((height: number) => {
    setContentHeight(height)
  }, [])

  const onMeasureBody = useCallback((height: number) => {
    if (bodyHeightRef.current === null) {
      bodyHeightRef.current = height
      return
    }
    const delta = height - bodyHeightRef.current
    if (delta === 0) return
    bodyHeightRef.current = height
    setContentHeight((prev) => (prev ?? 0) + delta)
  }, [])

  const emitOpenEnd = useCallback(() => {
    if (hasEmittedOpenEndRef.current) return
    hasEmittedOpenEndRef.current = true
    onOpenEnd?.()
  }, [onOpenEnd])

  const emitCloseEnd = useCallback(() => {
    if (hasEmittedCloseEndRef.current) return
    hasEmittedCloseEndRef.current = true
    onCloseEnd?.()
  }, [onCloseEnd])

  const emitDrag = useCallback(
    (translateValue: number) => {
      if (!onDrag) return

      // translateValue: 0 = fully open, effectiveOpenHeight = fully closed
      const height = Math.max(0, effectiveOpenHeight - translateValue)
      const progressRaw = effectiveOpenHeight > 0 ? height / effectiveOpenHeight : 0
      const progress = Math.min(1, Math.max(0, progressRaw))
      const payload: BottomSheetDragEvent = {
        translateY: translateValue,
        height,
        progress,
      }

      onDrag(payload)
    },
    [onDrag, effectiveOpenHeight],
  )

  useEffect(() => {
    if (keyboardBehavior === 'none') return

    return subscribeToKeyboard(
      (height) => {
        if (keyboardBehavior === 'height' || keyboardBehavior === 'padding') {
          keyboardOffset.value = withTiming(height, { duration: 250 })
        }
      },
      () => {
        keyboardOffset.value = withTiming(0, { duration: 250 })
      },
    )
  }, [keyboardBehavior, keyboardOffset])

  useEffect(() => {
    if (!open) return
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      requestClose()

      return true
    })

    return () => sub.remove()
  }, [open, requestClose])

  useEffect(() => {
    if (!open) {
      setContentHeight(null)
      bodyHeightRef.current = null
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      hasEmittedOpenRef.current = false
      hasEmittedOpenEndRef.current = false

      return
    }

    if (hasEmittedOpenRef.current) return

    onOpenStart?.()
    onOpen?.()
    hasEmittedOpenRef.current = true
  }, [open, onOpen, onOpenStart])

  useEffect(() => {
    if (open) {
      hasEmittedCloseEndRef.current = false
    }
  }, [open])

  useEffect(() => {
    const wasOpen = prevOpenRef.current

    if (wasOpen && !open) onCloseStart?.()
    prevOpenRef.current = open
  }, [open, onCloseStart])

  useEffect(() => {
    if (open) setIsRendered(true)
  }, [open])

  useEffect(() => {
    if (open) {
      if (fitContent && contentHeight === null) return
      backdropOpacity.value = withTiming(1, { duration: ANIMATION_DURATION })
      sheetOpacity.value = withTiming(1, { duration: ANIMATION_DURATION })
      // 0 = panel rests at bottom:safeBottom, fully visible
      translateY.value = withSpring(0, undefined, (finished?: boolean) => {
        if (finished && onOpenEnd) runOnJS(emitOpenEnd)()
      })
    } else {
      backdropOpacity.value = withTiming(0, { duration: ANIMATION_DURATION })
      sheetOpacity.value = withTiming(0, { duration: ANIMATION_DURATION })
      // windowHeight guarantees the panel is off-screen regardless of coordinate system
      translateY.value = withTiming(windowHeight, { duration: ANIMATION_DURATION }, (finished?: boolean) => {
        if (finished && onCloseEnd) runOnJS(emitCloseEnd)()
      })
    }
  }, [
    open,
    fitContent,
    contentHeight,
    windowHeight,
    emitCloseEnd,
    emitOpenEnd,
    backdropOpacity,
    sheetOpacity,
    translateY,
    onCloseEnd,
    onOpenEnd,
  ])

  useEffect(() => {
    if (open || !isRendered) return

    const timeoutId = setTimeout(() => {
      setIsRendered(false)
    }, ANIMATION_DURATION)

    return () => clearTimeout(timeoutId)
  }, [open, isRendered])

  const panGesture = Gesture.Pan()
    .onStart(() => {
      contextY.value = translateY.value
    })
    .onUpdate((e: { translationY: number }) => {
      const next = contextY.value + e.translationY
      // 0 = fully open; positive = dragged down toward closed
      const minTranslate = 0
      const maxRestTranslate = fitContent ? 0 : Math.max(0, effectiveOpenHeight - resolvedMin)
      const maxTranslate = enablePanDownToClose ? windowHeight : maxRestTranslate
      const nextTranslate = Math.min(maxTranslate, Math.max(minTranslate, next))

      translateY.value = nextTranslate
      if (onDrag) runOnJS(emitDrag)(nextTranslate)
    })
    .onEnd((e: { velocityY: number }) => {
      const currentTranslate = translateY.value
      const visibleHeight = effectiveOpenHeight - currentTranslate
      const shouldCloseByDrag = currentTranslate > effectiveOpenHeight * CLOSE_DRAG_THRESHOLD_RATIO
      const hasCloseVelocity = e.velocityY > CLOSE_VELOCITY_THRESHOLD

      if (resolvedSnapPoints && resolvedSnapPoints.length > 0) {
        let closestIndex = 0
        let minDist = Math.abs(visibleHeight - resolvedSnapPoints[0])
        for (let i = 1; i < resolvedSnapPoints.length; i++) {
          const d = Math.abs(visibleHeight - resolvedSnapPoints[i])
          if (d < minDist) {
            minDist = d
            closestIndex = i
          }
        }
        const targetTranslateY = effectiveOpenHeight - resolvedSnapPoints[closestIndex]
        const shouldClose =
          enablePanDownToClose && closestIndex === 0 && (hasCloseVelocity || shouldCloseByDrag)

        if (shouldClose) {
          runOnJS(closeByDragRequest)()

          return
        }

        translateY.value = withSpring(targetTranslateY)

        return
      }

      if (enablePanDownToClose && hasCloseVelocity && shouldCloseByDrag) {
        runOnJS(closeByDragRequest)()

        return
      }

      const maxRestTranslate = fitContent ? 0 : Math.max(0, effectiveOpenHeight - resolvedMin)
      const nextTranslate = Math.min(maxRestTranslate, Math.max(0, currentTranslate))

      translateY.value = withSpring(nextTranslate)
    })

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }))

  const extendSheetBehindKeyboardOnIos = Platform.OS === 'ios' && keyboardBehavior !== 'none'

  const sheetStyle = useAnimatedStyle(() => ({
    opacity: sheetOpacity.value,
    transform: [{ translateY: translateY.value - keyboardOffset.value }],
  }))

  const sheetBackgroundStyle = useAnimatedStyle(() => {
    'worklet'
    const base = {
      opacity: sheetOpacity.value,
      transform: [{ translateY: translateY.value }],
    }

    if (extendSheetBehindKeyboardOnIos && keyboardOffset.value > 0) {
      return {
        ...base,
        height: effectiveOpenHeight + safeBottom + keyboardOffset.value,
      }
    }

    return base
  })

  return {
    open,
    fitContent,
    isRendered,
    shouldMeasureHiddenContent: open && fitContent && contentHeight === null,
    hasInternalScroll,
    safeBottom,
    resolvedMin,
    resolvedMax,
    effectiveOpenHeight,
    handleTouchHeight: HANDLE_TOUCH_HEIGHT,
    backdropStyle,
    sheetStyle,
    sheetBackgroundStyle,
    extendSheetBehindKeyboardOnIos,
    panGesture,
    handleClose: () => {
      void requestClose()
    },
    onMeasureContent,
    onMeasureBody,
  }
}
