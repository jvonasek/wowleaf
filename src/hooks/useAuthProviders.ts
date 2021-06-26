import { useEffect, useState } from 'react'
import { getProviders } from 'next-auth/client'

import { SessionProviders } from '@/types'

type AuthProviderHookValue = SessionProviders

export const useAuthProviders = (): AuthProviderHookValue => {
  const [providers, setProviders] = useState({})
  useEffect(() => {
    getProviders().then((providers) => {
      setProviders(providers)
    })
  }, [])

  return providers
}
