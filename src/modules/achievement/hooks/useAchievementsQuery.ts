import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { pluck } from 'ramda'

import { groupById } from '@/lib/utils'
import { useAchievementsStore } from '../store/useAchievementsStore'

import { Achievement } from '../types'

const fetchWoWAchievements = () =>
  fetch('/api/wow/achievements').then((res) => res.json())

type AchievementsHookProps = {
  isLoading: boolean
  isSuccess: boolean
}

export const useAchievementsQuery = (): AchievementsHookProps => {
  const { set } = useAchievementsStore()

  const { isSuccess, isLoading, data } = useQuery<Achievement[]>(
    'WoWAchievements',
    fetchWoWAchievements
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
