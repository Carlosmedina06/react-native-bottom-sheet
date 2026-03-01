import type { ReactNode } from 'react'
import type { AccessibilityRole } from 'react-native'

/**
 * Payload emitted on each drag frame when {@link BottomSheetProps.onDrag} is provided.
 */
export interface BottomSheetDragEvent {
  /**
   * Current Y translation in screen coordinates.
   *
   * - Higher values move the sheet closer to closed state.
   * - Lower values move the sheet closer to opened state.
   */
  translateY: number

  /**
   * Visible sheet height in pixels for the current drag frame.
   */
  height: number

  /**
   * Open progress normalized between `0` and `1`.
   *
   * - `0` = fully closed
   * - `1` = fully opened
   */
  progress: number
}

/**
 * Props for the `BottomSheet` component.
 */
export interface BottomSheetProps {
  /**
   * Controls sheet visibility.
   */
  open: boolean

  /**
   * Called when the sheet requests closing.
   *
   * Triggers include:
   * - Backdrop press
   * - Android hardware back press
   * - Drag close gesture (when enabled)
   */
  onClose: () => void

  /**
   * If provided, called before closing. Return false (or a promise resolving to false) to prevent close;
   * return true to allow close. Used for e.g. unsaved form confirmation.
   */
  onCloseRequest?: () => boolean | Promise<boolean>

  /**
   * Called once when opening is triggered.
   *
   * This callback is emitted together with {@link BottomSheetProps.onOpenStart}.
   */
  onOpen?: () => void

  /**
   * Called when an open transition starts.
   */
  onOpenStart?: () => void

  /**
   * Called when open animation completes.
   */
  onOpenEnd?: () => void

  /**
   * Called when a close transition starts.
   */
  onCloseStart?: () => void

  /**
   * Called when close animation completes.
   */
  onCloseEnd?: () => void

  /**
   * Called during drag updates from the top handle.
   */
  onDrag?: (event: BottomSheetDragEvent) => void

  /**
   * Sheet content.
   */
  children: ReactNode

  /**
   * Minimum sheet height.
   *
   * Supports:
   * - Absolute pixels (`220`)
   * - Percent strings (`'30%'`)
   */
  minHeight?: number | string

  /**
   * Maximum sheet height.
   *
   * Supports:
   * - Absolute pixels (`600`)
   * - Percent strings (`'90%'`)
   */
  maxHeight?: number | string

  /**
   * If `true`, sheet height follows content size up to `maxHeight`.
   *
   * When content exceeds `maxHeight`, internal vertical scroll is enabled automatically.
   */
  fitContent?: boolean

  /**
   * Keyboard adjustment behavior.
   *
   * - `'none'`: no keyboard offset
   * - `'height'`: translate by keyboard height
   * - `'padding'`: translate by keyboard height
   */
  keyboardBehavior?: 'padding' | 'height' | 'none'

  /**
   * Enables drag-down-to-close behavior from the top handle.
   */
  enablePanDownToClose?: boolean

  /**
   * Test identifier for E2E and component tests.
   */
  testID?: string

  /**
   * Optional title shown at the top-left of the sheet (below the handle).
   * Accepts string or ReactNode (e.g. styled text or icon). Default rendering uses h1-like styles.
   */
  title?: ReactNode

  /**
   * Optional custom header rendered above the title (or in place of title if no title).
   */
  renderHeader?: () => ReactNode

  /**
   * Optional custom footer rendered below the main content.
   */
  renderFooter?: () => ReactNode

  /**
   * Accessibility label for the sheet container (modal content).
   */
  accessibilityLabel?: string

  /**
   * Accessibility role for the sheet container (e.g. 'dialog').
   */
  accessibilityRole?: AccessibilityRole

  /**
   * Accessibility label for the drag handle. Default: 'Arrastrar para cerrar'.
   */
  handleAccessibilityLabel?: string

  /**
   * Backdrop color (e.g. 'rgba(0,0,0,0.4)').
   */
  backdropColor?: string

  /**
   * Color of the drag handle pill.
   */
  handleColor?: string

  /**
   * Background color of the sheet panel.
   */
  sheetBackgroundColor?: string

  /**
   * Top border radius of the sheet panel.
   */
  borderTopRadius?: number

  /**
   * Custom render for the drag handle. If not provided, the default pill is shown (using handleColor).
   */
  renderHandle?: () => ReactNode

  /**
   * Optional snap points (e.g. ['30%', '60%', '100%']). When set, the sheet can rest at these heights;
   * on drag end it snaps to the nearest. Ignored when fitContent is true.
   */
  snapPoints?: (number | string)[]
}
