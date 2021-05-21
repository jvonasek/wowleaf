import { LocalizedCharacterAchievement } from 'battlenet-api';
import { pluck } from 'ramda';
import { useEffect, useState } from 'react';
import { UseQueryOptions } from 'react-query';

import { useTypeSafeQueries } from '@/hooks/useTypeSafeQueries';
import { AchievementProgressFactory } from '@/lib/AchievementProgressFactory';
import { groupById } from '@/lib/utils';
import { useAchievementsStore } from '@/modules/achievement/store/useAchievementsStore';

import { useAchievementsFilterStore } from '../store/useAchievementsFilterStore';
import { useCharacterAchievementsStore } from '../store/useCharacterAchievementsStore';
import { CharacterAchievement, CharacterParams } from '../types';

type AchievementCriteria = LocalizedCharacterAchievement['criteria']
type AchievementChildCriteria = LocalizedCharacterAchievement['criteria']['child_criteria']

type CharacterAchievementsHookProps = {
  isLoading: boolean
  isSuccess: boolean
}

type CharacterProps = CharacterParams & {
  characterKey: string
}

export const useCharacterAchievementsQuery = (
  characters: CharacterProps[],
  { enabled = false }: UseQueryOptions = {}
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
        queryKey: `/api/bnet/character/${region}/${realmSlug}/${name}/achievements`,
        enabled: queryEnabled,
        select: transformCharacterAchievementsData,
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
