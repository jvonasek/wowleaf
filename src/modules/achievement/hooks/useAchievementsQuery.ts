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

const fetchWoWAchievements = async ({
  factionId,
  category,
}: AchievementHookParams) => {
  console.log('fetch achs')
  const slug = (category && category.join('/')) || ''
  const params = factionId ? new URLSearchParams({ factionId }) : ''
  return fetch(`/api/wow/achievements/${slug}?${params}`).then((res) =>
    res.json()
  )
}

export const useAchievementsQuery = (
  { category, factionId }: AchievementHookParams = { factionId: null },
  options?: UseQueryOptions<Achievement[]>
): AchievementsHookResult => {
  const { set } = useAchievementsStore()

  const { isSuccess, isLoading, data } = useQuery<Achievement[]>(
    ['WoWAchievements', category || 'index'],
    () => fetchWoWAchievements({ category, factionId }),
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
