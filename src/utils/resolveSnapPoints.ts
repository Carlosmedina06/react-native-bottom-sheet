import { Dimensions } from 'react-native'

const WINDOW_HEIGHT = Dimensions.get('window').height

export function resolveSnapPoint(value: number | string): number {
  if (typeof value === 'number') return value
  const match = value.trim().match(/^(\d+(?:\.\d+)?)\s*%$/)

  if (match) {
    const pct = Number(match[1]) / 100

    return Math.round(WINDOW_HEIGHT * pct)
  }

  return 0
}

export function resolveSnapPoints(snapPoints: (number | string)[]): number[] {
  return snapPoints.map(resolveSnapPoint).filter((n) => n > 0)
}

export function getDefaultMaxHeight(): number {
  return Math.round(WINDOW_HEIGHT * 0.85)
}

export function resolveHeight(value: number | string | undefined, fallback: number): number {
  if (value === undefined) return fallback
  if (typeof value === 'number') return value

  return resolveSnapPoint(value)
}
