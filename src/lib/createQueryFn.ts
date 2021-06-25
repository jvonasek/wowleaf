import { QueryFunction } from 'react-query'

import { qs } from '@/lib/utils'

export const createQueryFn = (baseUrl: string): QueryFunction => {
  return async ({ queryKey }) => {
    const path = queryKey[0] + qs(queryKey[1])

    const res = await fetch(baseUrl + path)

    if (!res.ok) throw new Error(res.statusText)

    const r = await res.json()
    console.log(queryKey, r)
    return r
  }
}
