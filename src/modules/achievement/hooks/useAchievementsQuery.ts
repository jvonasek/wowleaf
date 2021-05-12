import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { pluck } from 'ramda'

import { groupById } from '@/lib/utils'
import { useAchievementsStore } from '../store/useAchievementsStore'

import { Achievement } from '../types'

const fetchWoWAchievements = (category) =>
  fetch(
    `/api/wow/achievements/${(category && category.join('/')) || ''}`
  ).then((res) => res.json())

type AchievementHookOptions = {
  category?: string[]
}

type AchievementsHookResult = {
  isLoading: boolean
  isSuccess: boolean
}

export const useAchievementsQuery = ({
  category,
}: AchievementHookOptions): AchievementsHookResult => {
  const { set } = useAchievementsStore()

  const { isSuccess, isLoading, data } = useQuery<Achievement[]>(
    ['WoWAchievements', category || 'index'],
    () => fetchWoWAchievements(category)
  )

  useEffect(() => {
    if (isSuccess) {
      set({
        byId: groupById(data),
        ids: pluck('id', data),
      })
    }
  }, [isSuccess, data, set])

  return {
    isLoading: isLoading,
    isSuccess: isSuccess,
  }
}
