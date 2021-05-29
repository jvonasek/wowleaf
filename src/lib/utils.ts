import { groupBy, head, map, sortWith, descend, prop } from 'ramda'

export const isServer = typeof window === 'undefined'

export const noop = (): void => undefined

export const num = Intl.NumberFormat('en-US')

export const round = (n: number, decimals = 0): number =>
  Number(`${Math.round(parseFloat(`${n}e${decimals}`))}e-${decimals}`)

export const percentage = (
  partial: number,
  total: number,
  precision = 1
): number => round((partial / total) * 100, precision)

export const getHslColorByPercent = (
  percent = 0,
  saturation = 55,
  lightness = 55,
  start = 0,
  end = 135
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

export const qs = (
  data: Record<string, any>,
  { preppendPrefix = true } = {}
): string => {
  if (!data) {
    return ''
  }

  const params = new URLSearchParams()

  Object.keys(data).map((key) => {
    const value = data[key]

    if (typeof value === 'undefined') {
      return
    }

    if (Array.isArray(value)) {
      value.map((item) => params.append(key, item))
    } else {
      params.append(key, value)
    }
  })

  const querystring = params.toString()

  return preppendPrefix ? `?${querystring}` : querystring
}

export const paginateArray = (array: any[], perPage: number, page: number) => {
  const start = (page - 1) * perPage
  const end = Math.min(page * perPage, array.length)
  return array.slice(start, end)
}

export const sortByHighest = <T extends unknown>(
  props: string[],
  arr: T[]
): T[] => {
  const sorters = props.map((propName) => descend<T>(prop(propName)))
  return sortWith<T>(sorters)(arr)
}
