jest.mock('react-native-reanimated', () => {
  const React = require('react')
  const { View } = require('react-native')
  const AnimatedView = React.forwardRef((props: unknown, ref: unknown) => (
    <View ref={ref as never} {...(props as object)} />
  ))
  AnimatedView.displayName = 'Animated.View'
  const createSharedValue = (init: number) => ({ value: init })
  return {
    default: { View: AnimatedView },
    useSharedValue: jest.fn(createSharedValue),
    useAnimatedStyle: jest.fn(() => ({})),
    withSpring: jest.fn((v: number) => v),
    withTiming: jest.fn((v: number) => v),
    runOnJS: jest.fn((fn: () => void) => fn),
  }
})

jest.mock('react-native-safe-area-context', () => {
  const React = require('react')
  const { View } = require('react-native')
  return {
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
    useSafeAreaInsetsBottom: () => 0,
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
  }
})

jest.mock('react-native-gesture-handler', () => {
  const React = require('react')
  const { View } = require('react-native')
  const chain = { onStart: () => chain, onUpdate: () => chain, onEnd: () => chain }

  return {
    GestureDetector: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
    Gesture: {
      Pan: () => chain,
    },
    GestureHandlerRootView: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
  }
})

import React from 'react'
import { Text } from 'react-native'
import { fireEvent, render, screen } from '@testing-library/react-native'
import BottomSheet from '../src/BottomSheet'

describe('BottomSheet', () => {
  it('does not render sheet content when open is false', () => {
    render(
      <BottomSheet open={false} onClose={jest.fn()}>
        <Text>Content</Text>
      </BottomSheet>,
    )
    expect(screen.queryByText('Content')).toBeNull()
  })

  it.skip('renders sheet content when open is true', () => {
    render(
      <BottomSheet open onClose={jest.fn()}>
        <Text>Content</Text>
      </BottomSheet>,
    )
    expect(screen.getByText('Content')).toBeTruthy()
  })

  it.skip('calls onClose when backdrop is pressed', () => {
    const onClose = jest.fn()
    render(
      <BottomSheet open onClose={onClose} testID="sheet">
        <Text>Content</Text>
      </BottomSheet>,
    )
    const backdrop = screen.getByTestId('sheet-backdrop')
    fireEvent.press(backdrop)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it.skip('renders title when provided', () => {
    render(
      <BottomSheet open onClose={jest.fn()} title="My Title">
        <Text>Content</Text>
      </BottomSheet>,
    )
    expect(screen.getByText('My Title')).toBeTruthy()
    expect(screen.getByText('Content')).toBeTruthy()
  })

  it.skip('applies testID to the sheet container', () => {
    render(
      <BottomSheet open onClose={jest.fn()} testID="custom-bottom-sheet">
        <Text>Content</Text>
      </BottomSheet>,
    )
    expect(screen.getByTestId('custom-bottom-sheet')).toBeTruthy()
  })
})
