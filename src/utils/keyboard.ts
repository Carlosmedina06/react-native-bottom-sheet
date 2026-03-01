import { Keyboard, type EmitterSubscription } from 'react-native'

export type KeyboardHandler = (height: number) => void

export function subscribeToKeyboard(onShow: KeyboardHandler, onHide: KeyboardHandler): () => void {
  const showSub: EmitterSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
    onShow(e.endCoordinates?.height ?? 0)
  })
  const hideSub: EmitterSubscription = Keyboard.addListener('keyboardDidHide', () => {
    onHide(0)
  })

  return () => {
    showSub.remove()
    hideSub.remove()
  }
}
