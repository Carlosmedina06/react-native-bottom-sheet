# React Native Bottom Sheet

[![npm](https://img.shields.io/badge/npm-@carlosmedina06/react--native--bottom--sheet-CB3837?style=flat-square&logo=npm)](https://www.npmjs.com/package/@carlosmedina06/react-native-bottom-sheet) [![license](https://img.shields.io/npm/l/@carlosmedina06/react-native-bottom-sheet?style=flat-square)](https://www.npmjs.com/package/@carlosmedina06/react-native-bottom-sheet) [![types included](https://img.shields.io/badge/types-included-blue?style=flat-square)](https://www.npmjs.com/package/@carlosmedina06/react-native-bottom-sheet) [![Runs with Expo](https://img.shields.io/badge/Runs%20with%20Expo-4630EB.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.io/) [![downloads](https://img.shields.io/npm/dw/@carlosmedina06/react-native-bottom-sheet?style=flat-square)](https://www.npmjs.com/package/@carlosmedina06/react-native-bottom-sheet "View package on npm") [![install size](https://packagephobia.com/badge?p=@carlosmedina06/react-native-bottom-sheet)](https://packagephobia.com/result?p=@carlosmedina06/react-native-bottom-sheet)

[![react-native-reanimated](https://img.shields.io/badge/react--native--reanimated-%3E%3D3.0.0-9E2DD4?style=flat-square)](https://www.npmjs.com/package/react-native-reanimated) [![react-native-gesture-handler](https://img.shields.io/badge/react--native--gesture--handler-%3E%3D2.0.0-3DDC84?style=flat-square)](https://www.npmjs.com/package/react-native-gesture-handler) [![react-native-safe-area-context](https://img.shields.io/badge/react--native--safe--area--context-%3E%3D4.0.0-61DAFB?style=flat-square)](https://www.npmjs.com/package/react-native-safe-area-context) [![react-native-keyboard-controller](https://img.shields.io/badge/react--native--keyboard--controller-%3E%3D1.0.0-FF6B6B?style=flat-square)](https://www.npmjs.com/package/react-native-keyboard-controller)

📱 A draggable bottom sheet for React Native with handle-only drag, fit-content mode, and lifecycle events.

---

## ✨ Features

- 👆 Drag from the top handle only (pill)
- 📐 `fitContent` to size the sheet to content height
- 📜 Internal scroll when content exceeds `maxHeight`
- ❌ Close via backdrop tap, Android back button, or drag
- 🔄 Lifecycle events: `onOpenStart`, `onOpenEnd`, `onCloseStart`, `onCloseEnd`, `onDrag`
- 📍 Optional snap points (e.g. `['25%', '50%', '90%']`)
- ⌨️ Keyboard behavior: `padding`, `height`, or `none`
- 🛡️ Optional `onCloseRequest` to confirm before closing (e.g. unsaved form)
- 🎨 Customizable colors, handle, header, footer, and accessibility
- 📘 Written in TypeScript
- ⚡ Compatible with Reanimated v3
- 📱 Compatible with Expo

## 📦 Installation

```bash
yarn add @carlosmedina06/react-native-bottom-sheet@^1
```

### 📋 Dependencies

This library needs these dependencies to be installed in your project before you can use it:

```bash
yarn add react-native-reanimated react-native-gesture-handler
```

### 🟢 Using Expo?

```bash
npx expo install react-native-reanimated react-native-gesture-handler
```

### ✅ Requirements

| Type | Dependency | Version | Description |
|------|-------------|---------|-------------|
| **Required** | [React](https://www.npmjs.com/package/react) | `>=18.0.0` | Core UI library |
| **Required** | [React Native](https://www.npmjs.com/package/react-native) | `>=0.70.0` | Mobile framework |
| **Required** | [react-native-reanimated](https://www.npmjs.com/package/react-native-reanimated) | `>=3.0.0` | Animations & gestures |
| **Required** | [react-native-gesture-handler](https://www.npmjs.com/package/react-native-gesture-handler) | `>=2.0.0` | Native gesture handling |
| **Optional** | [react-native-safe-area-context](https://www.npmjs.com/package/react-native-safe-area-context) | `>=4.0.0` | Safe area insets (notch, home indicator) |
| **Optional** | [react-native-keyboard-controller](https://www.npmjs.com/package/react-native-keyboard-controller) | `>=1.0.0` | Keyboard behavior (e.g. dismiss on sheet close) |

> **ℹ️ OPTIONAL**
>
> These dependencies are **not required** for the bottom sheet to work. Install them only if you need the behavior they provide.
>
> **react-native-safe-area-context** (`>=4.0.0`) — Use it if you want the sheet to respect safe area insets (notch, home indicator). Follow their [installation instructions](https://github.com/th3rdwave/react-native-safe-area-context#installation).
>
> **react-native-keyboard-controller** (`>=1.0.0`) — Use it for improved keyboard handling (e.g. dismiss keyboard when closing the sheet by drag). Follow their [installation instructions](https://github.com/kirillzyusko/react-native-keyboard-controller#installation).

> **ℹ️ INFO**
>
> **React Native Gesture Handler v2** needs extra steps to finalize its installation. Please follow their [installation instructions](https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/installation).
>
> Please **make sure** to wrap your App with `GestureHandlerRootView` when you've upgraded to React Native Gesture Handler `^2`.
>
> **React Native Reanimated v3** needs extra steps to finalize its installation. Please follow their [installation instructions](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started).

**Example — wrap your app with `GestureHandlerRootView`:**

```tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Your app content */}
    </GestureHandlerRootView>
  )
}
```

## 🚀 Usage

```tsx
import { useState } from 'react'
import { Text, View } from 'react-native'
import BottomSheet from '@carlosmedina06/react-native-bottom-sheet'

export default function Example() {
  const [open, setOpen] = useState(false)

  return (
    <BottomSheet
      open={open}
      onClose={() => setOpen(false)}
      fitContent
      minHeight="20%"
      maxHeight="90%"
      onOpenStart={() => console.log('open:start')}
      onOpenEnd={() => console.log('open:end')}
      onCloseStart={() => console.log('close:start')}
      onCloseEnd={() => console.log('close:end')}
      onDrag={(event) => {
        // event.progress => 0..1
      }}
    >
      <View>
        <Text>Content</Text>
      </View>
    </BottomSheet>
  )
}
```

## 📚 API

### 📤 Exports

- `default` → `BottomSheet`
- `type BottomSheetProps`
- `type BottomSheetDragEvent`

### ⚙️ Props

| Prop | Type | Default | Description |
|------|------|--------|-------------|
| `open` | `boolean` | required | Controls sheet visibility |
| `onClose` | `() => void` | required | Called when close is requested (backdrop, back, or drag) |
| `onOpen` | `() => void` | `undefined` | Called when opening starts |
| `onOpenStart` | `() => void` | `undefined` | Called when open transition starts |
| `onOpenEnd` | `() => void` | `undefined` | Called when open animation ends |
| `onCloseStart` | `() => void` | `undefined` | Called when close transition starts |
| `onCloseEnd` | `() => void` | `undefined` | Called when close animation ends |
| `onDrag` | `(event: BottomSheetDragEvent) => void` | `undefined` | Called on each drag update |
| `children` | `ReactNode` | required | Sheet content |
| `minHeight` | `number \| string` | `220` | Min height (number or `%`) |
| `maxHeight` | `number \| string` | 95% of window | Max height (number or `%`) |
| `fitContent` | `boolean` | `false` | Size to content up to `maxHeight` |
| `keyboardBehavior` | `'padding' \| 'height' \| 'none'` | `'none'` | Keyboard offset behavior |
| `enablePanDownToClose` | `boolean` | `true` | Allow close by dragging down |
| `testID` | `string` | `undefined` | Test identifier |
| `title` | `string \| ReactNode` | `undefined` | Optional title below handle |
| `accessibilityLabel` | `string` | `undefined` | A11y label for sheet container |
| `accessibilityRole` | `AccessibilityRole` | `undefined` | A11y role (e.g. `'dialog'`) |
| `handleAccessibilityLabel` | `string` | `'Drag to close'` | A11y label for handle |
| `backdropColor` | `string` | `'rgba(0,0,0,0.4)'` | Backdrop color |
| `handleColor` | `string` | `'#D1D5DB'` | Handle pill color |
| `sheetBackgroundColor` | `string` | `'#fff'` | Sheet panel background |
| `borderTopRadius` | `number` | `12` | Top corner radius |
| `renderHandle` | `() => ReactNode` | `undefined` | Custom handle; default is pill |
| `renderHeader` | `() => ReactNode` | `undefined` | Custom header above title |
| `renderFooter` | `() => ReactNode` | `undefined` | Custom footer below content |
| `onCloseRequest` | `() => boolean \| Promise<boolean>` | `undefined` | Called before close; return `false` to prevent close |
| `snapPoints` | `(number \| string)[]` | `undefined` | Snap heights (e.g. `['30%', '60%', '100%']`); ignored if `fitContent` is true |

### 📊 BottomSheetDragEvent

| Field | Type | Description |
|-------|------|-------------|
| `translateY` | `number` | Current Y translation of the sheet |
| `height` | `number` | Current visible sheet height |
| `progress` | `number` | Open progress 0..1 |

## 💡 Examples

**🎨 Custom colors and handle:**

```tsx
<BottomSheet
  open={open}
  onClose={() => setOpen(false)}
  sheetBackgroundColor="#f5f5f5"
  handleColor="#6366f1"
  renderHandle={() => <MyCustomHandle />}
>
  {children}
</BottomSheet>
```

**🛡️ Prevent close (onCloseRequest):**

```tsx
<BottomSheet
  open={open}
  onClose={() => setOpen(false)}
  onCloseRequest={async () => {
    if (hasUnsavedChanges) {
      const ok = await Alert.alert('Discard changes?', '...', [...])
      return ok
    }
    return true
  }}
>
  {children}
</BottomSheet>
```

**📍 Snap points (without fitContent):**

```tsx
<BottomSheet
  open={open}
  onClose={() => setOpen(false)}
  snapPoints={['25%', '50%', '90%']}
>
  {children}
</BottomSheet>
```

## 🔀 Event order

- **Open:** `onOpenStart` → `onOpen` → `onOpenEnd`
- **Close:** if `onCloseRequest` is set, it runs first; close only proceeds when it returns `true`. Then `onCloseStart` → `onCloseEnd`. Without `onCloseRequest`, close runs directly.
- **Drag:** `onDrag` fires while dragging from the handle.

## ⌨️ Keyboard (iOS)

With `keyboardBehavior` other than `'none'`:

- **iOS:** The sheet background extends behind the keyboard; content translates up. Closing the sheet by drag also dismisses the keyboard with the close animation.
- **Android:** The whole sheet moves up with the keyboard. Drag-to-close does not specially dismiss the keyboard.

## 📖 Behavior

- With `fitContent=true`, the sheet height follows content. `snapPoints` is ignored when `fitContent` is true.
- With `snapPoints` (and no `fitContent`), the sheet snaps to the nearest point on release; if the nearest is the minimum and threshold/velocity is met, it closes.
- When content is taller than `maxHeight`, internal scroll is enabled.
- Dragging only works from the top handle (or custom `renderHandle`).
- Close by gesture uses distance and/or velocity; `onCloseRequest` is respected before closing.
- Colors and radii for sheet, handle, and backdrop are configurable via props.

## 🤝 Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, workflow, and code expectations.

## 📄 License

[MIT](./LICENSE)
