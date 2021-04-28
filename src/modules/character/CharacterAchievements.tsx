import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { clamp, groupBy, prop, head, compose, map, evolve } from 'ramda'
import { percentage, round } from '@/lib/utils'
import { CRITERIA_OPERATOR_MAP } from '@/lib/constants'
import { LocalizedCharacterAchievement } from 'battlenet-api'

import {
  AchievementCard,
  AchievementCardProps,
} from '@/modules/achievement/AchievementCard'
import {
  AchievementWithProgress,
  AchievementWithCriteria,
  Criterion,
} from '@/types'

import { useCharacterStore } from './store/useCharacterStore'
import { CharacterAchievementsRecord } from './types'
import { useCharacterAchievementsStore } from './store/useCharacterAchievementsStore'
import { useWowheadLinks } from '@/hooks/useWowheadLinks'

const useCharacterAchievements = ({ region, realm, name }) => {
  const { set } = useCharacterAchievementsStore()
  const [status, setStatus] = useState({ isSet: false })

  const queryOptions = {
    enabled: !!(region && realm && name),
  }

  const { data, isLoading, isSuccess } = useQuery<CharacterAchievementsRecord>(
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
    queryOptions
  )

  useEffect(() => {
    if (isSuccess) {
      set(data)
      setStatus({ isSet: true })
    }
  }, [data, set, isSuccess])

  return {
    isLoading: isLoading && !status.isSet,
    isSuccess: isSuccess && status.isSet,
  }
}

export const CharacterAchievements: React.FC = () => {
  const { region, realm, name } = useCharacterStore()
  const {
    //isLoading: isAchievementsLoading,
    isSuccess: isAchievementsSuccess,
    data: achievements,
  } = useQuery<AchievementCardProps[]>('WoWAchievements', () =>
    fetch(`/api/wow/achievements`).then((res) => res.json())
  )

  const {
    isSuccess: isCharacterAchievementsSuccess,
  } = useCharacterAchievements({ region, realm, name })

  useWowheadLinks({
    refresh: isAchievementsSuccess,
  })

  const isSuccess = isAchievementsSuccess && isCharacterAchievementsSuccess

  return (
    <div className="space-y-7">
      {isSuccess &&
        achievements.map((achievement) => (
          <AchievementCard key={achievement.id} {...achievement} />
        ))}
    </div>
  )
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

  const group = groupBy((a) => Number(a.id).toString(), achievements)
  return map<typeof group, CharacterAchievementsRecord>(head, group)

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
