import { LocalizedCharacterAchievement } from 'battlenet-api'
import { pluck } from 'ramda'
import { useEffect, useState } from 'react'
import { UseQueryOptions } from 'react-query'

import { useTypeSafeQueries } from '@/hooks/useTypeSafeQueries'
import { AchievementProgressFactory } from '@/lib/AchievementProgressFactory'
import { groupById } from '@/lib/utils'
import { useAchievementsStore } from '@/modules/achievement/store/useAchievementsStore'

import { useCharacterAchievementsStore } from '../store/useCharacterAchievementsStore'
import { CharacterStoreProps } from '../store/useCharacterStore'
import { CharacterAchievement } from '../types'

type AchievementCriteria = LocalizedCharacterAchievement['criteria']
type AchievementChildCriteria =
  LocalizedCharacterAchievement['criteria']['child_criteria']

type CharacterAchievementsHookProps = {
  isLoading: boolean
  isSuccess: boolean
}

export const useCharacterAchievementsQuery = (
  characters: CharacterStoreProps[],
  { enabled = false }: UseQueryOptions = {}
): CharacterAchievementsHookProps => {
  const achievementsData = useAchievementsStore()

  const { set, setCharacters } = useCharacterAchievementsStore()
  const [isReady, setIsReady] = useState(false)

  const queries = useTypeSafeQueries(
    characters.map(({ characterKey }) => {
      const queryEnabled =
        enabled && !!characterKey && achievementsData.isSuccess
      return {
        queryKey: `/api/bnet/character/${characterKey}/achievements`,
        enabled: queryEnabled,
        select: transformCharacterAchievementsData,
      }
    })
  )

  const isSuccess = queries.length ? queries.every((q) => q.isSuccess) : false
  const isLoading = queries.length ? queries.some((q) => q.isLoading) : false

  useEffect(() => {
    if (isSuccess && achievementsData.isSuccess) {
      const characterData = queries.map(
        (
          {
            data: {
              achievements: characterAchievements,
              categories: characterCategories,
            },
          },
          index
        ) => ({
          characterAchievements,
          characterCategories,
          character: characters[index],
        })
      )

      const progress = new AchievementProgressFactory({
        achievements: achievementsData,
        characters: characterData,
      })

      const charactersAchievements = progress.get()

      set({ isSuccess, isLoading })
      setCharacters(charactersAchievements)
      setIsReady(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, achievementsData, achievementsData.isSuccess, set])

  return {
    isLoading: isLoading && !isReady,
    isSuccess: isSuccess && isReady,
  }
}

function transformCharacterAchievementsData({
  achievements,
  categories,
}: {
  achievements: LocalizedCharacterAchievement[]
  categories: any
}) {
  const characterAchievements = achievements.map(
    ({ id, completed_timestamp, criteria }) => ({
      id,
      isCompleted: !!completed_timestamp || !!criteria?.is_completed,
      completedTimestamp: completed_timestamp,
      criteria: transformCriteriaObject(criteria),
    })
  )

  const byId = groupById<CharacterAchievement>(characterAchievements)
  const ids = pluck('id', characterAchievements)

  return {
    categories,
    achievements: {
      byId,
      ids,
    },
  }

  function flattenChildCriteria(
    data: AchievementChildCriteria = []
  ): AchievementChildCriteria {
    return data.flatMap(({ id, child_criteria, ...rest }: any) => [
      { id, ...rest },
      ...flattenChildCriteria(child_criteria),
    ])
  }

  function transformCriteriaObject(criteria: AchievementCriteria) {
    if (criteria) {
      const { id, amount, is_completed, child_criteria } = criteria
      const criterion = {
        id,
        amount: amount || 0,
        isCompleted: !!is_completed,
      }

      const childCriteria = flattenChildCriteria(child_criteria)

      if (childCriteria.length) {
        return {
          ...criterion,
          childCriteria: childCriteria?.map(transformCriteriaObject),
        }
      }

      return criterion
    }
  }
}
