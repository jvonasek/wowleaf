import { useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/client'

import { Button } from '@/components/Button'
import { SessionProviders } from '@/types'

export type AuthProvidersProps = {
  providers: SessionProviders
}

export const AuthProviders: React.FC<AuthProvidersProps> = ({ providers }) => {
  const [session] = useSession()
  const [availableProviders, setAvailableProviders] = useState([])

  useEffect(() => {
    const isLoggedIn = Boolean(session)
    const providerList = Object.values(providers).map((provider) => provider)
    if (!isLoggedIn) {
      setAvailableProviders(providerList)
    } else {
      const { region } = session?.battlenet
      setAvailableProviders(
        providerList.filter(({ id }) => id.includes(region))
      )
    }
  }, [session, providers])

  return (
    <div>
      {availableProviders.map((provider) => (
        <div key={provider.name}>
          <Button
            onClick={() =>
              signIn(provider.id, {
                callbackUrl: `${process.env.NEXTAUTH_URL}/settings`,
              })
            }
          >
            {session
              ? `Refresh ${provider.name} account data`
              : `Sign in with ${provider.name}`}
          </Button>
        </div>
      ))}
    </div>
  )
}
