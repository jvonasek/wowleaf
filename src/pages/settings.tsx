import { differenceInMinutes, isPast } from 'date-fns'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { NextSeoProps } from 'next-seo'
import { getSession, useSession } from 'next-auth/client'
import { useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'

import { AuthProviders } from '@/components/AuthProviders'
import { DateTime } from '@/components/DateTime'
import { SidebarLayout } from '@/modules/layout/SidebarLayout'
import { useSSR } from '@/hooks/useSSR'
import { useAuthProviders } from '@/hooks/useAuthProviders'
import { CharacterSelectTable } from '@/modules/character-select/CharacterSelectTable'
import { MAX_ALLOWED_CHARACTERS } from '@/lib/constants'
import {
  useBnetCharactersStore,
  BNET_CHARS_STORAGE_KEY,
} from '@/modules/character-select/store/useBnetCharactersStore'
import { SessionProviders, Character } from '@/types'

export type SettingsProps = {
  providers: SessionProviders
}

const clearBnetCharacterStorage = () =>
  window.localStorage.removeItem(BNET_CHARS_STORAGE_KEY)

const SettingsSidebar = () => {
  const providers = useAuthProviders()
  const [session] = useSession()
  const { isBrowser } = useSSR()
  const [refreshButtonVisible, setRefreshButtonVisible] = useState(true)

  const userId = session?.user?.id

  const lastUpdatedAtRef = useRef(
    useBnetCharactersStore.getState().lastUpdatedAt
  )

  const isTokenExpired = isPast(new Date(session?.battlenet?.expires))

  useEffect(() => {
    if (lastUpdatedAtRef.current) {
      const diff = differenceInMinutes(
        new Date(),
        new Date(lastUpdatedAtRef.current)
      )
      setRefreshButtonVisible(isTokenExpired || diff > 60)
    }
  }, [isTokenExpired])

  const { data: userCharacters = [] } = useQuery<Character[]>(
    '/api/user/characters',
    {
      enabled: !!userId,
    }
  )

  return (
    <div className="bold text-lg">
      <div className="grid space-y-4 mb-4">
        <p className="leading-tight">
          <span className="text-sm text-foreground-muted">BattleTag</span>
          <br />
          <span className="font-semibold text-xl">
            {session?.battlenet?.battletag}
          </span>
        </p>
        <p className="leading-tight">
          <span className="text-sm text-foreground-muted">Region</span>
          <br />
          <span className="font-semibold text-xl">
            {session?.battlenet?.region?.toUpperCase()}
          </span>
        </p>
        <p className="leading-tight">
          <span className="text-sm text-foreground-muted">Character Limit</span>
          <br />
          <span className="font-semibold text-xl">
            {userCharacters.length} / {MAX_ALLOWED_CHARACTERS}
          </span>
        </p>
      </div>
      {isBrowser && refreshButtonVisible && (
        <>
          <AuthProviders
            onClick={clearBnetCharacterStorage}
            providers={providers}
            size="large"
            className="w-full"
          />
          <span className="block text-foreground-muted text-sm mt-3">
            Last refreshed <DateTime date={lastUpdatedAtRef.current} relative />
          </span>
        </>
      )}
    </div>
  )
}

const Settings: React.FC<SettingsProps> = () => {
  return (
    <SidebarLayout sidebar={<SettingsSidebar />}>
      <CharacterSelectTable />
    </SidebarLayout>
  )
}

export const getServerSideProps: GetServerSideProps<{ seo?: NextSeoProps }> =
  async (context: GetServerSidePropsContext) => {
    const session = await getSession(context)

    if (!session) {
      return {
        redirect: {
          permanent: false,
          destination: '/',
        },
      }
    }

    return {
      props: {
        meta: { title: 'Characters' },
      },
    }
  }

export default Settings
