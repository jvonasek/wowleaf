import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { clamp, groupBy, prop } from 'ramda'
import { percentage, round } from '@/lib/utils'
import { CRITERIA_OPERATOR_MAP } from '@/lib/constants'

import { AchievementCard } from '@/components/AchievementCard'
import {
  AchievementWithProgress,
  AchievementWithCriteria,
  Criterion,
} from '@/types'

import { useCharacterStore } from './store/useCharacterStore'
import { useWowheadLinks } from '@/hooks/useWowheadLinks'

const useCharacterAchievements = () => {
  const { region, realm, name } = useCharacterStore()
  const [status, setStatus] = useState({
    isLoading: false,
    isSuccess: false,
  })

  const queryOptions = {
    enabled: !!(region && realm && name),
  }

  const {
    isLoading: isCharacterAchievementsLoading,
    isSuccess: isCharacterAchievementsSuccess,
    data: characterAchievements,
  } = useQuery(
    [
      'BnetCharacterAchievements',
      {
        region,
        realm,
        name,
      },
    ],
    () =>
      fetch(
        `/api/bnet/character/${region}/${realm}/${name}/achievements`
      ).then((res) => res.json()),
    queryOptions
  )

  const {
    isLoading: isAchievementsLoading,
    isSuccess: isAchievementsSuccess,
    data: achievements,
  } = useQuery<AchievementWithCriteria[]>(
    'WoWAchievements',
    () => fetch(`/api/wow/achievements`).then((res) => res.json()),
    queryOptions
  )

  useEffect(() => {
    const isLoading = isCharacterAchievementsLoading || isAchievementsLoading
    const isSuccess = isCharacterAchievementsSuccess && isAchievementsSuccess
    setStatus({ isLoading, isSuccess })
  }, [
    isCharacterAchievementsLoading,
    isCharacterAchievementsSuccess,
    isAchievementsLoading,
    isAchievementsSuccess,
  ])

  if (
    status.isSuccess &&
    !!achievements.length &&
    !!characterAchievements.length
  ) {
    const characterAchievementsById = groupBy(prop('id'), characterAchievements)
    return {
      ...status,
      data: achievements
        ?.map<AchievementWithProgress>(
          (achievement: AchievementWithCriteria) => {
            const characterAchievement =
              characterAchievementsById[achievement.id]?.[0]

            const characterCriteriaById = groupBy(
              prop('id'),
              characterAchievement?.criteria?.child_criteria || []
            )

            const operator = CRITERIA_OPERATOR_MAP[achievement.criteriaOperator]

            const childCriteria =
              achievement?.criteria?.map(
                ({ id, amount: totalAmount, ...criterion }) => {
                  const { amount = 0, is_completed: isCompleted = false } =
                    characterCriteriaById[id]?.[0] || {}

                  const showProgressBar =
                    totalAmount <= 0 ? false : criterion.showProgressBar

                  let partialAmount: number

                  if (showProgressBar) {
                    partialAmount = amount
                  } else {
                    partialAmount = isCompleted ? 1 : 0
                  }

                  return {
                    id,
                    ...criterion,
                    showProgressBar,
                    totalAmount: showProgressBar ? totalAmount : 1,
                    partialAmount,
                    isCompleted,
                  }
                }
              ) || []

            const criteria = {
              crit: achievement,
              id: characterAchievement?.criteria?.id,
              partialAmount: characterAchievement?.criteria?.amount || 0,
              totalAmount: achievement.requiredCriteriaAmount || 1,
              childCriteria,
              isCompleted:
                characterAchievement?.criteria?.is_completed || false,
            }

            // overall achievement progress
            const criteriaProgress = childCriteria.reduce(
              (prev, { totalAmount, partialAmount }) =>
                prev +
                percentage(
                  clamp(0, totalAmount, partialAmount),
                  totalAmount,
                  1
                ),
              0
            )

            const criteriaCompleted = childCriteria.reduce(
              (prev, { isCompleted }) => prev + (isCompleted ? 1 : 0),
              0
            )

            // average achievement progress
            const childCriteriaOverallProgress =
              operator === 'ANY' && achievement.requiredCriteriaAmount > 0
                ? round(
                    percentage(
                      clamp(
                        0,
                        achievement.requiredCriteriaAmount,
                        criteriaCompleted
                      ),
                      achievement.requiredCriteriaAmount,
                      1
                    )
                  )
                : round(criteriaProgress / childCriteria.length, 1) || 0

            const progress = childCriteria.length
              ? childCriteriaOverallProgress
              : percentage(
                  clamp(0, criteria.totalAmount, criteria.partialAmount),
                  criteria.totalAmount,
                  1
                )
            const isCompleted = !!characterAchievement?.completed_timestamp

            return {
              ...achievement,
              criteria,
              progress:
                isCompleted && achievement.isAccountWide ? 100 : progress,
              isCompleted,
              completedTimestamp: characterAchievement?.completed_timestamp,
              merged: characterAchievement,
            }
          }
        )
        .filter(({ progress }) => progress !== 100)
        .sort((a, b) => b.progress - a.progress)
        .slice(0, 200),
    }
  }

  return {
    ...status,
    data: [],
  }
}

export const CharacterAchievements: React.FC = () => {
  const { isLoading, isSuccess, data } = useCharacterAchievements()
  useWowheadLinks({
    refresh: isSuccess,
  })
  return (
    <div className="space-y-7">
      {isSuccess &&
        !!data.length &&
        data.map((achievement) => (
          <AchievementCard key={achievement.id} {...achievement} />
        ))}
    </div>
  )
}
