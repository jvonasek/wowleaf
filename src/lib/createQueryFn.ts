import { QueryFunction } from 'react-query';

import { qs } from './qs';

export const createQueryFn = (baseUrl: string): QueryFunction => {
  return async ({ queryKey }) => {
    const path = queryKey[0] + qs(queryKey[1])

    const res = await fetch(baseUrl + path)

    if (!res.ok) throw new Error(await res.json())

    return res.json()
  }
}
