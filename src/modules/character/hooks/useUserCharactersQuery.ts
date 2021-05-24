import { prop, uniq } from 'ramda'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery, UseQueryOptions } from 'react-query'

import { createCharacterKey } from '@/lib/createCharacterKey'
import { mergeByHighestValue } from '@/lib/utils'
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
        characters.map((character) => ({
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
      const allIds = uniq(
        charactersProgress.reduce((prev, character) => {
          return [...prev, ...character.ids]
        }, [])
      )

      const aggregatedProgress = charactersProgress.map(({ byId }) => byId)

      const mergedProgress = allIds.map((id) => {
        return mergeByHighestValue(aggregatedProgress, id, 'percent')
      })

      set({
        aggregated: {
          character: null,
          byId: groupById(mergedProgress),
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
