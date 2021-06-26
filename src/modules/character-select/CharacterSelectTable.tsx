import { useSession } from 'next-auth/client'
import dynamic from 'next/dynamic'
import { groupBy } from 'ramda'
import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { Button } from '@/components/Button'
import { Spinner } from '@/components/Spinner'
import { CharacterSelectRow } from '@/modules/character-select/CharacterSelectRow'
import { useBnetCharactersStore } from '@/modules/character-select/store/useBnetCharactersStore'
import { Character } from '@/types'

const groupByLevelThreshold = groupBy<Character>(({ level }) =>
  level >= 50 ? 'visible' : 'hidden'
)

const _CharacterSelectTable: React.FC = () => {
  const [session] = useSession()
  const [allRowsVisible, setAllRowsVisible] = useState(false)

  const userId = session?.user?.id
  const userBattletag = session?.battlenet?.battletag

  const { characters, battletag, set } = useBnetCharactersStore()

  const shouldRefetch = useMemo(() => {
    return battletag !== userBattletag || characters.length === 0
  }, [battletag, characters.length, userBattletag])

  const {
    data: userCharacterIds,
    isSuccess: isUserCharactersSuccess,
    refetch,
  } = useQuery<Character[], unknown, string[]>('/api/user/characters', {
    enabled: !!userId,
    select: (data) => data.map(({ id }) => id),
  })

  const { isLoading, isSuccess, data } = useQuery<Character[]>(
    '/api/bnet/user',
    {
      enabled: isUserCharactersSuccess && shouldRefetch,
    }
  )

  const characterList = useMemo(() => {
    if (shouldRefetch && isSuccess && data.length) {
      set({
        battletag: userBattletag,
        characters: data,
        lastUpdatedAt: new Date().toISOString(),
      })
    }

    if (characters.length) {
      const byLevel = groupByLevelThreshold(characters)
      return allRowsVisible ? characters : byLevel.visible
    }

    return []
  }, [
    shouldRefetch,
    isSuccess,
    data,
    userBattletag,
    allRowsVisible,
    characters,
    set,
  ])

  if (isLoading) {
    return <Spinner />
  }

  if (!characterList.length) {
    return null
  }

  return (
    isUserCharactersSuccess && (
      <div>
        <table className="table-fixed">
          <thead>
            <tr>
              <th className="w-3/12">Name</th>
              <th>Level</th>
              <th>Realm</th>
              <th>Region</th>
              <th className="text-right w-2/12">Active</th>
            </tr>
          </thead>
          <tbody>
            {characterList.map((character) => (
              <CharacterSelectRow
                key={character.id}
                {...character}
                isActive={userCharacterIds.includes(character.id)}
                onMutate={refetch}
              />
            ))}
          </tbody>
        </table>

        {!allRowsVisible && (
          <div className="text-center mt-7">
            <Button size="large" onClick={() => setAllRowsVisible(true)}>
              Show All
            </Button>
          </div>
        )}
      </div>
    )
  )
}

export const CharacterSelectTable = dynamic(
  () => Promise.resolve(_CharacterSelectTable),
  {
    ssr: false,
  }
)
