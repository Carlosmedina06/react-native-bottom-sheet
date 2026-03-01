import type { BottomSheetProps } from './BottomSheet.types'

import useBottomSheetController from './BottomSheet.controller'
import BottomSheetView from './BottomSheet.view'

/**
 * Controlled bottom sheet component.
 *
 * Use `open` to control visibility and `onClose` to react to close requests.
 */
function BottomSheetComponent(props: Readonly<BottomSheetProps>) {
  const controller = useBottomSheetController(props)

  return (
    <BottomSheetView
      {...controller}
      testID={props.testID}
      title={props.title}
      renderHeader={props.renderHeader}
      renderFooter={props.renderFooter}
      accessibilityLabel={props.accessibilityLabel}
      accessibilityRole={props.accessibilityRole}
      handleAccessibilityLabel={props.handleAccessibilityLabel}
      backdropColor={props.backdropColor}
      handleColor={props.handleColor}
      sheetBackgroundColor={props.sheetBackgroundColor}
      borderTopRadius={props.borderTopRadius}
      renderHandle={props.renderHandle}
    >
      {props.children}
    </BottomSheetView>
  )
}

export default BottomSheetComponent
