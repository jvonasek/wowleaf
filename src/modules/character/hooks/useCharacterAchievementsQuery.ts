import { useState, useEffect } from 'react'
import { LocalizedCharacterAchievement } from 'battlenet-api'
import {
  pluck,
  clamp,
  prop,
  ascend,
  descend,
  sortWith,
  filter,
  allPass,
} from 'ramda'
import { groupById, percentage, round } from '@/lib/utils'
import { useTypeSafeQueries } from '@/hooks/useTypeSafeQueries'
import { CRITERIA_OPERATOR_MAP } from '@/lib/constants'

import { useAchievementsStore } from '@/modules/achievement/store/useAchievementsStore'
import {
  useCharacterAchievementsStore,
  initialAchievementProgress,
} from '../store/useCharacterAchievementsStore'

import {
  AchievementFilterProps,
  CharacterAchievementProgress,
  CharacterAchievementCriterionProgress,
  CharacterAchievementsQueryResult,
  CharacterAchievement,
  CharacterParams,
} from '../types'

import {
  Achievement,
  AchievementsQueryResult,
} from '@/modules/achievement/types'

import { useAchievementsFilterStore } from '../store/useAchievementsFilterStore'

type CharacterAchievementsHookProps = {
  isLoading: boolean
  isSuccess: boolean
}

type CharacterQueryOptions = {
  enabled?: boolean
}

type SortDir = 'DESC' | 'ASC'

const sorter = (propName: string, dir: SortDir) =>
  (dir === 'DESC' ? descend : ascend)(prop(propName))

const fetchCharacter = ({ region, realm, name }) =>
  fetch(`/api/bnet/character/${region}/${realm}/${name}/achievements`).then(
    async (res) => {
      const data = await res.json()
      return transformCharacterAchievementsData(data)
    }
  )

export const useCharacterAchievementsQuery = (
  characters: CharacterParams[],
  { enabled = false }: CharacterQueryOptions = {}
): CharacterAchievementsHookProps => {
  const achievementsData = useAchievementsStore()
  const filter = useAchievementsFilterStore((state) => state.filter)

  const { set } = useCharacterAchievementsStore()
  const [status, setStatus] = useState({ isSet: false })

  const queries = useTypeSafeQueries(
    characters.map(({ region, realm, name, characterKey }) => {
      const queryEnabled =
        enabled && !!characterKey && achievementsData.isSuccess
      return {
        queryKey: ['BnetCharacterAchievements', characterKey],
        queryFn: () => fetchCharacter({ region, realm, name }),
        enabled: queryEnabled,
      }
    })
  )

  const isSuccess = queries.every((q) => q.isSuccess)
  const isLoading = queries.some((q) => q.isLoading)

  useEffect(() => {
    if (isSuccess && achievementsData.isSuccess) {
      const characterData = queries.map(({ data }, index) => ({
        data,
        character: characters[index],
      }))

      const characterProgressArray = createCharacterProgressArray(
        characterData,
        achievementsData,
        filter
      )

      const charactersAchievements = characterProgressArray.reduce(
        (prev, character) => {
          return {
            ...prev,
            ...character,
          }
        },
        {}
      )

      set(charactersAchievements)
      setStatus({ isSet: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, filter, achievementsData, achievementsData.isSuccess, set])

  return {
    isLoading: isLoading && !status.isSet,
    isSuccess: isSuccess && status.isSet,
  }
}

function createCharacterProgressArray(
  characters: Array<{
    data: CharacterAchievementsQueryResult
    character: CharacterParams
  }>,
  achievements: AchievementsQueryResult,
  filterValues: AchievementFilterProps
) {
  return characters.map(({ data, character: { characterKey } }) => {
    const achievementProgress = achievements.ids.map((id) =>
      createAchievementProgress(achievements.byId[id], data.byId[id])
    )

    const sortProps: Record<string, SortDir>[] = [
      {
        percent: 'DESC',
      },
      {
        name: 'ASC',
      },
    ]

    const isIncompleteFilter = ({ percent, isCompleted }) => {
      if (filterValues.incomplete) {
        return !isCompleted && percent < 100
      }

      return true
    }

    const pointsFilter = ({ id }) => {
      const achievement = achievements?.byId?.[id]
      if (achievement && filterValues.points > 0) {
        return achievement.points >= filterValues.points
      }

      return true
    }

    const rewardFilter = ({ id }) => {
      const achievement = achievements?.byId?.[id]
      if (achievement && filterValues.reward) {
        return !!achievement.rewardDescription
      }

      return true
    }

    const filtered = filter<CharacterAchievementProgress>(
      allPass([isIncompleteFilter, pointsFilter, rewardFilter]),
      achievementProgress
    )

    const sorted = sortWith<CharacterAchievementProgress>(
      sortProps.map((s) => {
        return sorter(Object.keys(s)[0], Object.values(s)[0])
      })
    )(filtered)

    return {
      [characterKey]: {
        byId: groupById(achievementProgress),
        ids: pluck('id', sorted).slice(0, 300),
      },
    }
  })
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

  function transformCriteriaObject(
    criteria: LocalizedCharacterAchievement['criteria']
  ) {
    if (criteria) {
      const { id, amount, is_completed, child_criteria } = criteria
      const criterion = {
        id: id,
        amount: amount || 0,
        isCompleted: !!is_completed,
      }

      if (child_criteria) {
        return {
          ...criterion,
          childCriteria: child_criteria?.map(transformCriteriaObject),
        }
      }

      return criterion
    }
  }
}

function createAchievementProgress(
  {
    id,
    name,
    criteria,
    criteriaOperator,
    requiredCriteriaAmount,
    categoryId,
  }: Achievement,
  characterAchievement?: CharacterAchievement
): CharacterAchievementProgress {
  if (!characterAchievement)
    return {
      ...initialAchievementProgress,
      name,
      id,
    }

  const { isCompleted, completedTimestamp } = characterAchievement

  const childCriteriaById = groupById(
    characterAchievement?.criteria?.childCriteria
  )

  const criteriaProgress = criteria.map(
    ({ id, amount: requiredAmount, ...criterion }) => {
      const { amount = 0, isCompleted = false } = childCriteriaById?.[id] || {}

      const showProgressBar =
        requiredAmount <= 0 ? false : !!criterion.showProgressBar

      let partial: number
      let required: number

      if (showProgressBar) {
        partial = amount
        required = requiredAmount
      } else {
        partial = isCompleted ? 1 : 0
        required = 1
      }

      return {
        id,
        showProgressBar,
        partial,
        required,
        percent: percentage(clamp(0, required, partial), required, 1),
        isCompleted,
      }
    }
  )

  const hasChildCriteria = criteriaProgress.length > 0
  const criteriaAmount = characterAchievement?.criteria?.amount || 0
  const partialAmount = isCompleted && criteriaAmount === 0 ? 1 : criteriaAmount
  const requiredAmount = requiredCriteriaAmount || 1
  const overallCriteriaProgress = calculateOverallCriteriaProgress(
    criteriaProgress,
    {
      required: requiredAmount,
      operator: criteriaOperator,
    }
  )

  let percent = hasChildCriteria
    ? overallCriteriaProgress
    : percentage(clamp(0, requiredAmount, partialAmount), requiredAmount, 1)

  let criteriaProgressArray = criteriaProgress

  // Fix criteria in completed achievements (lich king dungeon),
  // where last criterion is completed, but not previous ones
  const categoriesWithoutMatchingCriteria = [14806]
  if (categoriesWithoutMatchingCriteria.includes(categoryId)) {
    const isCompletedWithoutMatchingCriteria =
      isCompleted &&
      percent > 0 &&
      percent < 100 &&
      criteriaProgress.length >= 3 &&
      criteriaProgress.length <= 5

    if (isCompletedWithoutMatchingCriteria) {
      const completedCriteria = criteriaProgress.filter(
        ({ isCompleted }) => isCompleted
      )

      // force 100% completion on all criteria when only some are completed (usually last boss)
      if (completedCriteria.length > 0) {
        console.log('fixing', name)
        percent = 100
        criteriaProgressArray = criteriaProgress.map((criterion) => ({
          ...criterion,
          isCompleted: true,
          percent: 100,
        }))
      }
    }
  }

  return {
    id,
    name,
    percent,
    isCompleted,
    completedTimestamp,
    partial: partialAmount,
    required: requiredAmount,
    showOverallProgressBar: !hasChildCriteria && requiredAmount >= 5,
    criteria: groupById<CharacterAchievementCriterionProgress>(
      criteriaProgressArray
    ),
  }
}

function calculateOverallCriteriaProgress(
  criteria: CharacterAchievementCriterionProgress[],
  { operator, required }: { operator: number; required: number }
): number {
  const op = CRITERIA_OPERATOR_MAP[operator]

  const total = criteria.length
  const partial = criteria.filter(({ isCompleted }) => isCompleted).length
  const average = round(
    criteria.reduce((prev, { percent }) => prev + percent, 0) / total,
    1
  )

  if (op === 'ANY') {
    const partialClamped = clamp(0, required, partial)
    return percentage(partialClamped, required, 1)
  }

  return average || 0
}
