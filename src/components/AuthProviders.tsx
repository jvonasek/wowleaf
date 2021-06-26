import { signIn, useSession } from 'next-auth/client'
import { useEffect, useState } from 'react'

import { Button, ButtonProps } from '@/components/Button'
import { SessionProviders } from '@/types'

import { FaBattleNet } from 'react-icons/fa'

export type AuthProvidersProps = {
  providers: SessionProviders
  size?: ButtonProps['size']
  className?: string
  onClick?: () => void
}

export const AuthProviders: React.FC<AuthProvidersProps> = ({
  providers,
  size,
  onClick,
  className,
}) => {
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
            size={size}
            className={className}
            variant="battlenet"
            onClick={() => {
              signIn(provider.id, {
                callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/settings`,
              })
              onClick?.()
            }}
          >
            <FaBattleNet className="h-6 w-6 mr-4" />
            {session
              ? `Refresh ${provider.name}`
              : `Sign in with ${provider.name}`}
          </Button>
        </div>
      ))}
    </div>
  )
}
