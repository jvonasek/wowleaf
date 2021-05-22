import { useSession } from 'next-auth/client'
import { prop, uniq } from 'ramda'
import { useCallback, useEffect, useState } from 'react'
import { useQuery } from 'react-query'

import { CharacterCard } from '@/components/CharacterCard'
import { createCharacterKey } from '@/lib/createCharacterKey'
import { mergeByHighestValue } from '@/lib/mergeByHighestValue'
import { useAchievementsQuery } from '@/modules/achievement/hooks/useAchievementsQuery'
import { useCharacterAchievementsQuery } from '@/modules/character/hooks/useCharacterAchievementsQuery'
import { CharacterStoreProps } from '@/modules/character/store/useCharacterStore'
import { Character } from '@/types'

import {
  useCharacterAchievementsStore,
  useCombinedAchievementsStore,
} from '../character/store/useCharacterAchievementsStore'
import { groupById } from '@/lib/utils'

export const DashboardPage: React.FC = () => {
  const [session] = useSession()
  const [characterList, setCharacterList] = useState<CharacterStoreProps[]>([])

  const userId = session?.user?.id

  const { isSuccess, data: characters } = useQuery<Character[]>(
    '/api/user/characters',
    { enabled: !!session }
  )

  useEffect(() => {
    if (isSuccess && !!characters.length) {
      setCharacterList(
        characters.map((character) => ({
          ...character,
          characterKey: createCharacterKey(character),
        }))
      )
    }
  }, [isSuccess, characters, setCharacterList])

  const factions = uniq(characterList.map(prop('faction')))

  useAchievementsQuery(
    {
      factionId: factions.length === 1 ? factions[0] : undefined,
    },
    {
      enabled: !!characterList.length,
    }
  )

  useCharacterAchievementsQuery(characterList, {
    enabled: !!characterList.length,
  })

  const charactersProgress = useCharacterAchievementsStore(
    useCallback(
      ({ characters }) => {
        const keys = Object.keys(characters)
        if (keys.length) {
          return keys
            .filter((key) => characters?.[key]?.character?.userId === userId)
            .map((key) => characters[key])
        }

        return []
      },
      [userId]
    )
  )

  const { set } = useCombinedAchievementsStore()

  useEffect(() => {
    if (isSuccess) {
      const allIds = uniq(
        charactersProgress.reduce((prev, character) => {
          return [...prev, ...character.ids]
        }, [])
      )

      const allAchievments = charactersProgress.map(({ byId }) => byId)

      const sortedProgressArray = allIds.map((id) => {
        return mergeByHighestValue(allAchievments, id, 'percent')
      })

      set({
        combined: {
          character: null,
          byId: groupById(sortedProgressArray),
          ids: allIds,
        },
      })
    }
  }, [isSuccess, charactersProgress, set])

  return (
    <div>
      Dashboard
      <div className="grid grid-cols-4 gap-3">
        {isSuccess &&
          characters.map((char) => <CharacterCard key={char.id} {...char} />)}
      </div>
    </div>
  )
}
