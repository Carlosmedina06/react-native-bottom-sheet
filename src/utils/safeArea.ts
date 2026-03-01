import { Dimensions } from 'react-native'

// Cache the library reference once at module load to avoid repeated require() calls.
const _safeAreaLib = (() => {
  try {
    return require('react-native-safe-area-context') as {
      initialWindowMetrics: {
        insets: { bottom: number; top: number; left: number; right: number }
      } | null
    }
  } catch {
    return null
  }
})()

/**
 * Returns the device-level bottom inset for positioning the bottom sheet panel
 * above the system navigation UI.
 *
 * Two sources are combined with Math.max to handle every Android nav mode:
 *
 * - `initialWindowMetrics.insets.bottom`: correct for gesture navigation and iOS
 *   home indicator (populated when the window draws edge-to-edge behind the
 *   nav bar).
 *
 * - `screen.height - window.height`: gives the 3-button navigation bar height
 *   on devices where the window does NOT extend behind the nav bar (so
 *   initialWindowMetrics reports 0 for that area).
 *
 * | Scenario                        | insets.bottom | screen-window | result |
 * |---------------------------------|---------------|---------------|--------|
 * | iOS home indicator              | ~34pt         | 0             | 34pt ✓ |
 * | Android gesture nav             | ~24dp         | 0             | 24dp ✓ |
 * | Android 3-btn (edge-to-edge)    | navBarHeight  | 0             | nav  ✓ |
 * | Android 3-btn (no edge-to-edge) | 0             | navBarHeight  | nav  ✓ |
 */
export function useSafeAreaInsetsBottom(): number {
  const nativeInset = _safeAreaLib?.initialWindowMetrics?.insets.bottom ?? 0

  const screen = Dimensions.get('screen')
  const window = Dimensions.get('window')
  const windowNavBarHeight = Math.max(0, screen.height - window.height)

  return Math.max(nativeInset, windowNavBarHeight)
}
