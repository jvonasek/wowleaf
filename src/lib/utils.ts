import { groupBy, map, head } from 'ramda'

export const isServer = typeof window === 'undefined'

export const noop = (): void => undefined

export const round = (n: number, decimals = 0): number =>
  Number(`${Math.round(parseFloat(`${n}e${decimals}`))}e-${decimals}`)

export const percentage = (
  partial: number,
  total: number,
  precision = 1
): number => round((partial / total) * 100, precision)

export const getHslColorByPercent = (
  percent = 0,
  start = 0,
  end = 100,
  saturation = 65,
  lightness = 50
): string => {
  const proportion = percent / 100
  const hue = start + (end - start) * proportion

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

type ObjectWithId = {
  id: number | string
} & {
  [x: string]: any
}

export function groupById<T extends ObjectWithId>(
  list: T[]
): Record<string, T> {
  if (!list) {
    return {}
  }

  const group = groupBy((item) => Number(item.id).toString(), list)
  return map<typeof group, Record<string, T>>(head, group)
}
