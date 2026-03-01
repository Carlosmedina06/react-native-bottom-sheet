# @carlosmedina06/react-native-bottom-sheet

Bottom sheet controlado para React Native con drag desde handle superior, modo `fitContent`, scroll interno automático y eventos de ciclo de vida.

## Características

- Drag del sheet solo desde la pill superior
- `fitContent` para ajustar altura al contenido
- Scroll interno cuando el contenido supera `maxHeight`
- Cierre por backdrop, botón back (Android) y gesto
- Eventos `onOpenStart`, `onOpenEnd`, `onCloseStart`, `onCloseEnd`, `onDrag`

## Instalación

```bash
npm install @carlosmedina06/react-native-bottom-sheet react-native-reanimated react-native-gesture-handler
```

## Requisitos

- `react >= 18`
- `react-native >= 0.70`
- `react-native-reanimated >= 3`
- `react-native-gesture-handler >= 2`

Opcionales:

- `react-native-safe-area-context >= 4`
- `react-native-keyboard-controller >= 1`

## Configuración requerida

- React Native Reanimated: https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started
- React Native Gesture Handler: https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/installation

## Uso rápido

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
        <Text>Contenido</Text>
      </View>
    </BottomSheet>
  )
}
```

## API

### Exportaciones

- `default` -> `BottomSheet`
- `type BottomSheetProps`
- `type BottomSheetDragEvent`

### Props

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `open` | `boolean` | requerido | Controla visibilidad del sheet |
| `onClose` | `() => void` | requerido | Solicitud de cierre (backdrop, back Android o drag close) |
| `onOpen` | `() => void` | `undefined` | Dispara al iniciar apertura |
| `onOpenStart` | `() => void` | `undefined` | Dispara al iniciar transición de apertura |
| `onOpenEnd` | `() => void` | `undefined` | Dispara al finalizar animación de apertura |
| `onCloseStart` | `() => void` | `undefined` | Dispara al iniciar transición de cierre |
| `onCloseEnd` | `() => void` | `undefined` | Dispara al finalizar animación de cierre |
| `onDrag` | `(event: BottomSheetDragEvent) => void` | `undefined` | Dispara en cada update del gesto de drag |
| `children` | `ReactNode` | requerido | Contenido interno del sheet |
| `minHeight` | `number \| string` | `220` | Altura mínima (`number` o `%`) |
| `maxHeight` | `number \| string` | `95%` de la ventana | Altura máxima (`number` o `%`) |
| `fitContent` | `boolean` | `false` | Ajusta altura al contenido hasta `maxHeight` |
| `keyboardBehavior` | `'padding' \| 'height' \| 'none'` | `'none'` | Desplazamiento al abrir teclado; en ambas plataformas desplaza el sheet; en iOS además define el aspecto del fondo (ver Teclado iOS) |
| `enablePanDownToClose` | `boolean` | `true` | Habilita cierre con drag hacia abajo |
| `testID` | `string` | `undefined` | Identificador para testing |
| `title` | `string \| ReactNode` | `undefined` | Título opcional arriba a la izquierda (debajo del handle); string usa estilo h1 |
| `accessibilityLabel` | `string` | `undefined` | Etiqueta de accesibilidad del contenedor del sheet |
| `accessibilityRole` | `AccessibilityRole` | `undefined` | Rol de accesibilidad del contenedor (ej. `'dialog'`) |
| `handleAccessibilityLabel` | `string` | `'Arrastrar para cerrar'` | Etiqueta de accesibilidad del handle |
| `backdropColor` | `string` | `'rgba(0,0,0,0.4)'` | Color del backdrop |
| `handleColor` | `string` | `'#D1D5DB'` | Color de la pill del handle |
| `sheetBackgroundColor` | `string` | `'#fff'` | Color de fondo del panel |
| `borderTopRadius` | `number` | `12` | Radio del borde superior del panel |
| `renderHandle` | `() => ReactNode` | `undefined` | Render custom del handle; si no se pasa, se usa la pill por defecto |
| `renderHeader` | `() => ReactNode` | `undefined` | Header custom encima del título |
| `renderFooter` | `() => ReactNode` | `undefined` | Footer custom debajo del contenido |
| `onCloseRequest` | `() => boolean \| Promise<boolean>` | `undefined` | Llamado antes de cerrar; `false` evita el cierre (ej. formulario sin guardar) |
| `snapPoints` | `(number \| string)[]` | `undefined` | Puntos de anclaje (ej. `['30%', '60%', '100%']`); ignorado si `fitContent` es `true` |

### Tipo `BottomSheetDragEvent`

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `translateY` | `number` | Traslación Y actual del sheet |
| `height` | `number` | Altura visible actual del sheet |
| `progress` | `number` | Progreso de apertura normalizado (0..1) |

## Ejemplos

**Colores y handle custom:**

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

**Evitar cierre (onCloseRequest):**

```tsx
<BottomSheet
  open={open}
  onClose={() => setOpen(false)}
  onCloseRequest={async () => {
    if (hasUnsavedChanges) {
      const ok = await Alert.alert('Descartar cambios?', '...', [...])
      return ok
    }
    return true
  }}
>
  {children}
</BottomSheet>
```

**Snap points (sin fitContent):**

```tsx
<BottomSheet
  open={open}
  onClose={() => setOpen(false)}
  snapPoints={['25%', '50%', '90%']}
>
  {children}
</BottomSheet>
```

## Ciclo de eventos

- Apertura: `onOpenStart` -> `onOpen` -> `onOpenEnd`
- Cierre: si existe `onCloseRequest`, se llama primero; solo si devuelve `true` (o la promesa resuelve a `true`) se ejecuta el cierre y `onCloseStart` -> `onCloseEnd`. Si no hay `onCloseRequest`, el cierre es directo.
- Gesto: `onDrag` durante el arrastre desde el handle

## Teclado (iOS)

Con `keyboardBehavior` distinto de `'none'`:

- **iOS:** El fondo blanco del sheet se extiende detrás del teclado (dos capas: fondo fijo que rellena hasta abajo y contenido que se desplaza). Al cerrar el sheet por drag (soltar tras arrastrar), el teclado se cierra junto con la animación de cierre.
- **Android:** Una sola capa; el sheet completo se desplaza hacia arriba con el teclado. El cierre por drag no dispara el cierre del teclado de forma especial.

## Comportamiento

- Con `fitContent=true`, el sheet crece hasta el tamaño del contenido. No se usa `snapPoints` si `fitContent` está activo.
- Con `snapPoints` (y sin `fitContent`), el sheet puede reposar en esas alturas; al soltar el gesto, hace snap al punto más cercano. Si el más cercano es el mínimo y se cumple umbral/velocidad, se cierra.
- Si el contenido excede `maxHeight`, activa scroll interno.
- El drag del sheet ocurre solo en la zona del handle superior (o la zona de `renderHandle` si se proporciona).
- El cierre por gesto requiere umbral de distancia y/o velocidad descendente; con `onCloseRequest`, además se respeta el valor devuelto antes de cerrar.
- Colores y radios del sheet, handle y backdrop son personalizables mediante props.
