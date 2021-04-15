import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { groupBy, prop } from 'ramda'

import { AchievementCard } from '@/components/AchievementCard'
import { useCharacterStore } from './store/useCharacterStore'
import { Achievement } from '@/types'

export type CharacterAchievementsProps = {}

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
    'BnetCharacterAchievements',
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
  } = useQuery<Achievement[]>(
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

  if (status.isSuccess) {
    const characterAchievementsById = groupBy(
      prop('id'),
      characterAchievements.achievements
    )
    return {
      ...status,
      data: achievements.map((achievement) => {
        const characterAchievement =
          characterAchievementsById[achievement.id]?.[0]
        return {
          ...achievement,
          isCompleted: !!characterAchievement?.completed_timestamp,
          merged: characterAchievement,
        }
      }),
    }
  }

  return {
    ...status,
    data: [],
  }
}

export const CharacterAchievements: React.FC<CharacterAchievementsProps> = () => {
  const { isLoading, isSuccess, data } = useCharacterAchievements()
  return (
    <div className="space-y-4">
      {isSuccess &&
        data.map((achievement) => (
          <AchievementCard key={achievement.id} {...achievement} />
        ))}
    </div>
  )
}
