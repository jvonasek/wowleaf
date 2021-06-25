import { differenceInMinutes } from 'date-fns'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import {
  getSession,
  providers as getProviders,
  useSession,
} from 'next-auth/client'
import { useEffect, useRef, useState } from 'react'

import { AuthProviders } from '@/components/AuthProviders'
import { DateTime } from '@/components/DateTime'
import { useSSR } from '@/hooks/useSSR'
import { CharacterSelectTable } from '@/modules/character-select/CharacterSelectTable'
import {
  useBnetCharactersStore,
  BNET_CHARS_STORAGE_KEY,
} from '@/modules/character-select/store/useBnetCharactersStore'
import { SessionProviders } from '@/types'

export type SettingsProps = {
  providers: SessionProviders
}

const clearBnetCharacterStorage = () =>
  window.localStorage.removeItem(BNET_CHARS_STORAGE_KEY)

const Settings: React.FC<SettingsProps> = ({ providers }) => {
  const [session] = useSession()
  const { isBrowser } = useSSR()
  const [refreshButtonVisible, setRefreshButtonVisible] = useState(true)

  const lastUpdatedAtRef = useRef(
    useBnetCharactersStore.getState().lastUpdatedAt
  )

  useEffect(() => {
    if (lastUpdatedAtRef.current) {
      const diff = differenceInMinutes(
        new Date(),
        new Date(lastUpdatedAtRef.current)
      )
      setRefreshButtonVisible(diff > 60)
    }
  }, [])

  return (
    <>
      <h1 className="text-2xl mb-4">Characters</h1>
      <div className="grid grid-cols-12 gap-12">
        <div className="col-span-12 xl:col-span-3">
          <div className="bold text-lg">
            {refreshButtonVisible && (
              <AuthProviders
                onClick={clearBnetCharacterStorage}
                providers={providers}
                size="large"
              />
            )}
            <DateTime date={session?.battlenet?.expires} />
            <br />
            <DateTime date={session?.battlenet?.expires} relative />
          </div>
        </div>
        <div className="col-span-12 xl:col-span-9">
          {isBrowser && <CharacterSelectTable />}
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
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
    props: { session, providers: await getProviders() },
  }
}

export default Settings
