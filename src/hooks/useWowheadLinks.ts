import { useLayoutEffect } from 'react'
import { isServer } from '@/lib/utils'

const wh = !isServer && window.$WowheadPower

const options = {
  refresh: false,
}

export const useWowheadLinks = (
  { refresh } = options,
  deps: any[] = []
): void => {
  useLayoutEffect(() => {
    if (refresh && wh && typeof wh.refreshLinks === 'function') {
      wh.refreshLinks()
      console.log('refreshed links', deps)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, ...deps])
}
