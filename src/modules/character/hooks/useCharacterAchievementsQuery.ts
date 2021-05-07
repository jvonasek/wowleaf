import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { LocalizedCharacterAchievement } from 'battlenet-api'
import { pluck, clamp, prop, ascend, descend, sortWith } from 'ramda'
import { groupById, percentage, round } from '@/lib/utils'
import { CRITERIA_OPERATOR_MAP } from '@/lib/constants'

import { useAchievementsStore } from '@/modules/achievement/store/useAchievementsStore'
import {
  useCharacterAchievementsStore,
  initialAchievementProgress,
} from '../store/useCharacterAchievementsStore'

import {
  CharacterAchievementProgress,
  CharacterAchievementCriterionProgress,
  CharacterAchievementsQueryResult,
  CharacterAchievement,
  CharacterParams,
} from '../types'

import { Achievement } from '@/modules/achievement/types'

type CharacterAchievementsHookProps = {
  isLoading: boolean
  isSuccess: boolean
}

type CharacterQueryOptions = {
  enabled: boolean
}

type SortDir = 'DESC' | 'ASC'

const sorter = (propName: string, dir: SortDir) =>
  (dir === 'DESC' ? descend : ascend)(prop(propName))

export const useCharacterAchievementsQuery = (
  { region, realm, name, characterKey }: CharacterParams,
  { enabled = false }: CharacterQueryOptions
): CharacterAchievementsHookProps => {
  const { set } = useCharacterAchievementsStore()
  const [status, setStatus] = useState({ isSet: false })

  const {
    data: characterAchievements,
    isLoading,
    isSuccess,
  } = useQuery<CharacterAchievementsQueryResult>(
    [
      'BnetCharacterAchievements',
      {
        region,
        realm,
        name,
      },
    ],
    () =>
      fetch(`/api/bnet/character/${region}/${realm}/${name}/achievements`).then(
        async (res) => {
          const data = await res.json()
          return transformCharacterAchievementsData(data)
        }
      ),
    {
      enabled,
    }
  )

  const achievements = useAchievementsStore()

  useEffect(() => {
    if (isSuccess) {
      const achievementProgress = achievements.ids.map((id) =>
        createAchievementProgress(
          achievements.byId[id],
          characterAchievements.byId[id]
        )
      )

      const sortProps: Record<string, SortDir>[] = [
        {
          percent: 'DESC',
        },
        {
          name: 'ASC',
        },
      ]

      const filtered = achievementProgress.filter(
        ({ percent }) => percent < 100
      )

      const sorted = sortWith<CharacterAchievementProgress>(
        sortProps.map((s) => {
          return sorter(Object.keys(s)[0], Object.values(s)[0])
        })
      )(filtered)

      set({
        [characterKey]: {
          byId: groupById(achievementProgress),
          ids: pluck('id', sorted),
        },
      })

      setStatus({ isSet: true })
    }
  }, [characterKey, achievements, characterAchievements, set, isSuccess])

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
  { id, name, criteria, criteriaOperator, requiredCriteriaAmount }: Achievement,
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

  const percent = hasChildCriteria
    ? overallCriteriaProgress
    : percentage(clamp(0, requiredAmount, partialAmount), requiredAmount, 1)

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
      criteriaProgress
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
