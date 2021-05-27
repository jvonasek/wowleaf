import { prop, uniq } from 'ramda'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery, UseQueryOptions } from 'react-query'

import { createCharacterKey } from '@/lib/createCharacterKey'
import { sortByHighest } from '@/lib/utils'
import { groupById } from '@/lib/utils'
import { useAchievementsQuery } from '@/modules/achievement/hooks/useAchievementsQuery'
import { useCharacterAchievementsQuery } from '@/modules/character/hooks/useCharacterAchievementsQuery'
import {
  useCharacterAchievementsStore,
  useAggregatedAchievementsStore,
} from '@/modules/character/store/useCharacterAchievementsStore'
import { CharacterStoreProps } from '@/modules/character/store/useCharacterStore'
import { Character } from '@/types'

type UserCharacterQueryHookProps = {
  userId: number
}

export const useUserCharactersQuery = (
  { userId }: UserCharacterQueryHookProps,
  { enabled = true }: UseQueryOptions = {}
) => {
  const [characterList, setCharacterList] = useState<CharacterStoreProps[]>([])
  const [isReady, setIsReady] = useState(false)

  const {
    isSuccess: isUserCharsSuccess,
    isLoading: isUserCharsLoading,
    data: characters,
  } = useQuery<Character[]>('/api/user/characters', {
    enabled: enabled && !!userId,
  })

  useEffect(() => {
    if (isUserCharsSuccess && !!characters.length) {
      setCharacterList(
        characters
          .sort((a, b) => a.classId - b.classId)
          .map((character) => ({
            ...character,
            characterKey: createCharacterKey(character),
          }))
      )
    }
  }, [isUserCharsSuccess, characters, setCharacterList])

  const factionId = useMemo(() => {
    const factions = uniq(characterList.map(prop('faction')))
    return factions.length === 1 ? factions[0] : undefined
  }, [characterList])

  const {
    isSuccess: isAchsSuccess,
    isLoading: isAchsLoading,
  } = useAchievementsQuery(
    {
      factionId,
    },
    {
      enabled: !!characterList.length,
    }
  )

  const {
    isSuccess: isCharAchsSuccess,
    isLoading: isCharAchsLoading,
  } = useCharacterAchievementsQuery(characterList, {
    enabled: isAchsSuccess && !!characterList.length,
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

  const { set } = useAggregatedAchievementsStore()

  const isSuccess = isUserCharsSuccess && isAchsSuccess && isCharAchsSuccess
  const isLoading = isUserCharsLoading && isAchsLoading && isCharAchsLoading

  useEffect(() => {
    if (isSuccess) {
      const allIds: number[] = uniq(
        charactersProgress.reduce(
          (prev, character) => prev.concat(character.ids),
          []
        )
      )

      const aggregatedProgressArray = charactersProgress.map(({ byId }) => byId)

      const aggregated = allIds.map((id) => {
        const items = aggregatedProgressArray.map((item) => item[id])
        const sorted = sortByHighest(['percent', 'completedTimestamp'], items)

        const characters = sorted
          .filter(({ percent }) => percent > 0)
          .map(({ characterKey, percent }) => ({
            characterKey,
            percent,
          }))
        return { id, progress: sorted[0], characters }
      })

      const byId = groupById(aggregated.map(prop('progress')))
      const characters = Object.fromEntries(
        aggregated.map(({ id, characters }) => [id, characters])
      )

      set({
        aggregated: {
          character: null,
          characters,
          byId,
          ids: allIds,
        },
      })

      setIsReady(true)
    }
  }, [isSuccess, charactersProgress, set])

  return {
    data: characterList,
    factionId,
    isLoading,
    isSuccess: isSuccess && isReady,
  }
}
