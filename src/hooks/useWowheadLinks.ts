import { useEffect } from 'react'
import { isServer } from '@/lib/utils'

const wh = !isServer && window.$WowheadPower

const options = {
  refresh: false,
}

export const useWowheadLinks = ({ refresh } = options): void => {
  useEffect(() => {
    if (refresh && wh && typeof wh.refreshLinks === 'function') {
      wh.refreshLinks()
    }
  }, [refresh])
}
