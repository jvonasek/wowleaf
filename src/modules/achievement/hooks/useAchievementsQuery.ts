import { useEffect } from 'react'
import { UseQueryOptions, useQuery } from 'react-query'
import { pluck } from 'ramda'

import { groupById } from '@/lib/utils'
import { useAchievementsStore } from '../store/useAchievementsStore'

import { Achievement } from '../types'
import { Faction } from '@/types'

type AchievementHookParams = {
  factionId: Faction
  category?: string[]
}

type AchievementsHookResult = {
  isLoading: boolean
  isSuccess: boolean
}

export const useAchievementsQuery = (
  { category, factionId }: AchievementHookParams = { factionId: null },
  options?: UseQueryOptions<Achievement[]>
): AchievementsHookResult => {
  const { set } = useAchievementsStore()

  const slug = (category && category.join('/')) || ''
  const { isSuccess, isLoading, data } = useQuery<Achievement[]>(
    [`/api/wow/achievements/${slug}`, { factionId }],
    options
  )

  useEffect(() => {
    if (isLoading) {
      set({
        isLoading,
        isSuccess,
      })
    }

    if (isSuccess) {
      set({
        isSuccess,
        isLoading,
        byId: groupById(data),
        ids: pluck('id', data),
      })
    }
  }, [isSuccess, isLoading, data, set])

  return {
    isLoading: isLoading,
    isSuccess: isSuccess,
  }
}
