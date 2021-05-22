import { sortWith, descend, prop } from 'ramda'

export const mergeByHighestValue = <T extends unknown>(
  arr: Record<string, T>[],
  key: string,
  propName: string
): T => {
  const [head] = sortWith<T>([descend(prop(propName))])(
    arr.map((item) => item && item[key])
  )
  return head
}
