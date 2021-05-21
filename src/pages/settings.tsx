import { useState, useCallback } from 'react'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { useQuery, useMutation } from 'react-query'
import { useSession, getSession, providers } from 'next-auth/client'
import { BattleNetRegion } from 'battlenet-api'

import { CharacterCard } from '@/components/CharacterCard'
import { DateTime } from '@/components/DateTime'
import { AuthProviders } from '@/components/AuthProviders'
import { SessionProviders } from '@/types'

type CharacterSelectionProps = {
  region: BattleNetRegion
  realmSlug: string
  name: string
}

export type SettingsProps = {
  providers: SessionProviders
}

const createCharacter = ({
  region,
  realmSlug,
  name,
}: CharacterSelectionProps) =>
  fetch(`/api/bnet/character/${region}/${realmSlug}/${name}`, {
    method: 'PUT',
  })

const Settings: React.FC<SettingsProps> = ({ providers }) => {
  const [session] = useSession()
  const [selection, setSelection] = useState<Array<CharacterSelectionProps>>([])

  const { mutate } = useMutation(createCharacter)
  const { isLoading, error, data: characters } = useQuery('/api/bnet/user')

  const submitCharacters = useCallback(() => {
    for (const character of selection) {
      mutate(character)
    }
  }, [selection, mutate])

  return (
    <>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <pre>{JSON.stringify(selection, null, 2)}</pre>
      <div className="bold text-lg">
        Expiration: <DateTime date={session?.battlenet?.expires} relative /> (
        <DateTime date={session?.battlenet?.expires} />)
        <AuthProviders providers={providers} />
      </div>
      <div className="grid grid-cols-4 gap-2">
        <button onClick={submitCharacters}>submit</button>
        {isLoading || error ? (
          <span>{JSON.stringify(error)} LOADING</span>
        ) : (
          Array.isArray(characters) &&
          characters.map((character) => (
            <CharacterCard
              key={character.id}
              {...character}
              onClick={(realmSlug: string, name: string) =>
                setSelection([
                  ...selection,
                  {
                    region: session?.battlenet?.region,
                    realmSlug,
                    name: name.toLowerCase(),
                  },
                ])
              }
            />
          ))
        )}
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession(context)

  if (!session) {
    const { res } = context
    res.setHeader('location', '/')
    res.statusCode = 302
    res.end()
    return { props: {} }
  }

  return {
    props: { session, providers: await providers() },
  }
}

export default Settings
