import { useState, useEffect } from 'react'
import { LocalizedCharacterAchievement } from 'battlenet-api'
import { pluck } from 'ramda'
import { groupById } from '@/lib/utils'
import { useTypeSafeQueries } from '@/hooks/useTypeSafeQueries'

import { useAchievementsStore } from '@/modules/achievement/store/useAchievementsStore'
import { useCharacterAchievementsStore } from '../store/useCharacterAchievementsStore'

import { CharacterAchievement, CharacterParams } from '../types'

import { useAchievementsFilterStore } from '../store/useAchievementsFilterStore'

import { AchievementProgressFactory } from '@/lib/AchievementProgressFactory'

type AchievementCriteria = LocalizedCharacterAchievement['criteria']
type AchievementChildCriteria = LocalizedCharacterAchievement['criteria']['child_criteria']

type CharacterAchievementsHookProps = {
  isLoading: boolean
  isSuccess: boolean
}

type CharacterProps = CharacterParams & {
  characterKey: string
}

type CharacterQueryOptions = {
  enabled?: boolean
}

const fetchCharacter = ({ region, realmSlug, name }) =>
  fetch(`/api/bnet/character/${region}/${realmSlug}/${name}/achievements`).then(
    async (res) => {
      const data = await res.json()
      return transformCharacterAchievementsData(data)
    }
  )

export const useCharacterAchievementsQuery = (
  characters: CharacterProps[],
  { enabled = false }: CharacterQueryOptions = {}
): CharacterAchievementsHookProps => {
  const achievementsData = useAchievementsStore()
  const filterValues = useAchievementsFilterStore((state) => state.filter)

  const { set } = useCharacterAchievementsStore()
  const [status, setStatus] = useState({ isSet: false })

  const queries = useTypeSafeQueries(
    characters.map(({ region, realmSlug, name, characterKey }) => {
      const queryEnabled =
        enabled && !!characterKey && achievementsData.isSuccess
      return {
        queryKey: ['BnetCharacterAchievements', characterKey],
        queryFn: () => fetchCharacter({ region, realmSlug, name }),
        enabled: queryEnabled,
      }
    })
  )

  const isSuccess = queries.every((q) => q.isSuccess)
  const isLoading = queries.some((q) => q.isLoading)

  useEffect(() => {
    if (isSuccess && achievementsData.isSuccess) {
      const characterData = queries.map(
        ({ data: characterAchievements }, index) => ({
          characterAchievements,
          character: characters[index],
        })
      )

      const progress = new AchievementProgressFactory({
        achievements: achievementsData,
        characters: characterData,
      })

      const charactersAchievements = progress.getProggress(filterValues)

      set(charactersAchievements)
      setStatus({ isSet: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isSuccess,
    filterValues,
    achievementsData,
    achievementsData.isSuccess,
    set,
  ])

  return {
    isLoading: isLoading && !status.isSet,
    isSuccess: isSuccess && status.isSet,
  }
}

function transformCharacterAchievementsData(
  data: LocalizedCharacterAchievement[]
) {
  const achievements = data.map(({ id, completed_timestamp, criteria }) => ({
    id,
    isCompleted: !!completed_timestamp,
    completedTimestamp: completed_timestamp,
    criteria: transformCriteriaObject(criteria),
  }))

  const byId = groupById<CharacterAchievement>(achievements)
  const ids = pluck('id', achievements)

  return {
    byId,
    ids,
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
        id: id,
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
