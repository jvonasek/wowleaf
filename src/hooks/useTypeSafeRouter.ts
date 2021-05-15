import { NextRouter, useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Struct, Infer, create } from 'superstruct'

type RouterQueryValue<T extends Struct> = NextRouter & {
  query: Infer<T>
}

export const useTypeSafeRouter = <T extends Struct>(
  struct: T
): RouterQueryValue<T> => {
  const [query, setQuery] = useState({})
  const [isReady, setIsReady] = useState(false)

  const { isReady: isRouterReady, query: routerQuery, ...router } = useRouter()

  useEffect(() => {
    if (isRouterReady) {
      setQuery(create(routerQuery, struct))
      setIsReady(true)
    }
  }, [isRouterReady, routerQuery, struct])

  return {
    ...router,
    isReady,
    query,
  }
}
