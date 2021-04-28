import { useEffect, useState } from 'react'
import { clamp } from 'ramda'

import { useCharacterAchievementsStore } from '@/modules/character/store/useCharacterAchievementsStore'

import {
  Achievement,
  AchievementProgress,
  AchievementCriterionProgress,
} from '../types'

import { percentage, round, groupById } from '@/lib/utils'
import { CRITERIA_OPERATOR_MAP } from '@/lib/constants'

const initialProgress: AchievementProgress = {
  id: undefined,
  completedTimestamp: undefined,
  criteria: {},
  isCompleted: false,
  percent: 0,
}

export const useAchievementProgress = ({
  id,
  criteria,
  criteriaOperator,
  requiredCriteriaAmount,
}: Achievement): AchievementProgress => {
  const [progress, setProgress] = useState(initialProgress)
  const { get } = useCharacterAchievementsStore()

  useEffect(() => {
    const ach = get(id?.toString())
    if (!ach) return
    const { isCompleted, completedTimestamp } = ach

    const childCriteriaById = groupById(ach?.criteria?.childCriteria)

    const criteriaProgress = criteria.map(
      ({ id, amount: totalAmount, ...criterion }) => {
        const { amount, isCompleted } = childCriteriaById[id]

        const showProgressBar =
          totalAmount <= 0 ? false : !!criterion.showProgressBar

        let partial: number
        let total: number

        if (showProgressBar) {
          partial = amount
          total = totalAmount
        } else {
          partial = isCompleted ? 1 : 0
          total = 1
        }

        return {
          id,
          showProgressBar,
          total,
          partial,
          percent: percentage(clamp(0, total, partial), total, 1),
          isCompleted,
        }
      }
    )

    const achievementPartialAmount = ach?.criteria?.amount || 0
    const achievementRequiredAmount = requiredCriteriaAmount || 1

    const overallCriteriaProgress = calculateOverallCriteriaProgress(
      criteriaProgress,
      {
        required: achievementRequiredAmount,
        operator: criteriaOperator,
      }
    )

    const percent =
      criteriaProgress.length > 0
        ? overallCriteriaProgress
        : percentage(
            clamp(0, achievementRequiredAmount, achievementPartialAmount),
            achievementRequiredAmount,
            1
          )

    setProgress({
      id,
      percent,
      isCompleted,
      completedTimestamp,
      criteria: groupById<AchievementCriterionProgress>(criteriaProgress),
    })
  }, [id, criteria, requiredCriteriaAmount, criteriaOperator, get])

  return progress
}

function calculateOverallCriteriaProgress(
  criteria: AchievementCriterionProgress[],
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

  //const partialClamped = clamp(0, required, partial)
  return average || 0
}
