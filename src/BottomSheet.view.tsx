import type { ReactNode } from 'react'
import type { BottomSheetControllerModel } from './BottomSheet.controller'

import React from 'react'
import {
  type AccessibilityRole,
  type ModalProps,
  Modal as RNModal,
  type PressableProps,
  Pressable as RNPressable,
  type ScrollViewProps,
  ScrollView as RNScrollView,
  Text as RNText,
  type TextProps,
  type ViewProps,
  View as RNView,
} from 'react-native'
import Animated from 'react-native-reanimated'
import { GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'

const Modal = RNModal as React.ComponentType<ModalProps>
const View = RNView as unknown as React.ComponentType<ViewProps>
const Text = RNText as unknown as React.ComponentType<TextProps>
const Pressable = RNPressable as unknown as React.ComponentType<PressableProps>
const ScrollView = RNScrollView as unknown as React.ComponentType<ScrollViewProps>
const AnimatedView = Animated.View as unknown as React.ComponentType<ViewProps>

const HANDLE_PILL_WIDTH = 42
const HANDLE_PILL_HEIGHT = 5

const TITLE_STYLE_H1 = {
  fontSize: 24,
  lineHeight: 32,
  fontWeight: '600' as const,
  color: '#1f2937',
  fontFamily: 'Inter-SemiBold',
}

const DEFAULT_BACKDROP_COLOR = 'rgba(0,0,0,0.4)'
const DEFAULT_HANDLE_COLOR = '#D1D5DB'
const DEFAULT_SHEET_BACKGROUND_COLOR = '#fff'
const DEFAULT_BORDER_TOP_RADIUS = 12

interface BottomSheetViewProps extends BottomSheetControllerModel {
  testID?: string
  title?: ReactNode
  renderHeader?: () => ReactNode
  renderFooter?: () => ReactNode
  accessibilityLabel?: string
  accessibilityRole?: AccessibilityRole
  handleAccessibilityLabel?: string
  backdropColor?: string
  handleColor?: string
  sheetBackgroundColor?: string
  borderTopRadius?: number
  renderHandle?: () => ReactNode
  children: ReactNode
}

function BottomSheetView({
  open,
  fitContent,
  isRendered,
  shouldMeasureHiddenContent,
  hasInternalScroll,
  safeBottom,
  resolvedMin,
  resolvedMax,
  effectiveOpenHeight,
  handleTouchHeight,
  backdropStyle,
  sheetStyle,
  sheetBackgroundStyle,
  extendSheetBehindKeyboardOnIos,
  panGesture,
  handleClose,
  onMeasureContent,
  onMeasureBody,
  testID,
  title,
  renderHeader,
  renderFooter,
  accessibilityLabel,
  accessibilityRole,
  handleAccessibilityLabel,
  backdropColor = DEFAULT_BACKDROP_COLOR,
  handleColor = DEFAULT_HANDLE_COLOR,
  sheetBackgroundColor = DEFAULT_SHEET_BACKGROUND_COLOR,
  borderTopRadius = DEFAULT_BORDER_TOP_RADIUS,
  renderHandle,
  children,
}: Readonly<BottomSheetViewProps>) {
  if (!isRendered) return null

  if (shouldMeasureHiddenContent) {
    return (
      <Modal animationType="none" transparent visible={open} statusBarTranslucent>
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0,
          }}
          pointerEvents="none"
        >
          <View
            onLayout={(e) => {
              onMeasureContent(e.nativeEvent.layout.height)
            }}
            collapsable={false}
          >
            {renderHeader ? renderHeader() : null}
            {title == null ? null : (
              <View style={{ paddingHorizontal: 16, paddingBottom: 8, alignSelf: 'flex-start' }}>
                {typeof title === 'string' ? (
                  <Text style={TITLE_STYLE_H1}>{title}</Text>
                ) : (
                  title
                )}
              </View>
            )}
            {children}
            {renderFooter ? renderFooter() : null}
          </View>
        </View>
      </Modal>
    )
  }

  const bodyLayout = (e: { nativeEvent: { layout: { height: number } } }) =>
    onMeasureBody(e.nativeEvent.layout.height)

  const fitContentBody = hasInternalScroll ? (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: safeBottom }}>
      <View onLayout={bodyLayout} collapsable={false}>
        {children}
      </View>
    </ScrollView>
  ) : (
    <View onLayout={bodyLayout} collapsable={false}>
      {children}
    </View>
  )

  return (
    <Modal animationType="none" transparent visible={isRendered} statusBarTranslucent>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View
          style={{ flex: 1 }}
          pointerEvents="box-none"
          testID={testID}
          accessibilityLabel={accessibilityLabel}
          accessibilityRole={accessibilityRole}
        >
          <AnimatedView
            style={[
              {
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                backgroundColor: backdropColor,
              },
              backdropStyle,
            ]}
            pointerEvents="auto"
          >
            <Pressable
              style={{ flex: 1 }}
              onPress={handleClose}
              testID={testID ? `${testID}-backdrop` : undefined}
            />
          </AnimatedView>

          {/*
           * iOS + keyboard: two layers so white extends behind keyboard while content
           * translates up. Android / no keyboard: single layer (background + content
           * together) so the whole sheet moves up with the keyboard.
           */}
          {extendSheetBehindKeyboardOnIos && (
            <AnimatedView
              style={[
                {
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: effectiveOpenHeight + safeBottom,
                  backgroundColor: sheetBackgroundColor,
                  borderTopLeftRadius: borderTopRadius,
                  borderTopRightRadius: borderTopRadius,
                  minHeight: fitContent ? undefined : resolvedMin,
                  maxHeight: resolvedMax + safeBottom,
                },
                sheetBackgroundStyle,
              ]}
            />
          )}
          <AnimatedView
            style={[
              {
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: effectiveOpenHeight + safeBottom,
                backgroundColor: extendSheetBehindKeyboardOnIos ? undefined : sheetBackgroundColor,
                borderTopLeftRadius: borderTopRadius,
                borderTopRightRadius: borderTopRadius,
                minHeight: fitContent ? undefined : resolvedMin,
                maxHeight: resolvedMax + safeBottom,
              },
              sheetStyle,
            ]}
            pointerEvents="box-none"
          >
            <GestureDetector gesture={panGesture}>
              <View
                style={{
                  height: handleTouchHeight,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                accessibilityLabel={handleAccessibilityLabel ?? 'Arrastrar para cerrar'}
                accessibilityRole="button"
              >
                {renderHandle ? renderHandle() : (
                  <View
                    style={{
                      width: HANDLE_PILL_WIDTH,
                      height: HANDLE_PILL_HEIGHT,
                      borderRadius: HANDLE_PILL_HEIGHT / 2,
                      backgroundColor: handleColor,
                    }}
                  />
                )}
              </View>
            </GestureDetector>
            {renderHeader ? renderHeader() : null}
            {title == null ? null : (
              <View style={{ paddingHorizontal: 16, paddingBottom: 8, alignSelf: 'flex-start' }}>
                {typeof title === 'string' ? (
                  <Text style={TITLE_STYLE_H1}>{title}</Text>
                ) : (
                  title
                )}
              </View>
            )}
            {fitContent ? (
              fitContentBody
            ) : (
              <View style={{ flex: 1, minHeight: resolvedMin, paddingBottom: safeBottom }}>
                <View style={{ flex: 1 }}>{children}</View>
              </View>
            )}
            {renderFooter ? (
              <View style={{ paddingBottom: safeBottom }}>{renderFooter()}</View>
            ) : null}
          </AnimatedView>
        </View>
      </GestureHandlerRootView>
    </Modal>
  )
}

export default BottomSheetView
