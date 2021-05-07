import { useEffect } from 'react'
import { isServer } from '@/lib/utils'

declare global {
  interface Window {
    $WowheadPower: any
  }
}

const wh = !isServer && window.$WowheadPower

const options = {
  refresh: false,
}

export const useWowheadLinks = ({ refresh } = options): void => {
  useEffect(() => {
    if (refresh && wh && typeof wh.refreshLinks === 'function') {
      console.log('refreshing wowh')
      wh.refreshLinks()
    }
  }, [refresh])
}
