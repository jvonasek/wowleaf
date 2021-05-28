import { combine } from 'zustand/middleware'

import { createPersistedStore } from '@/lib/createStore'

import { AchievementFilterProps } from '../types'

type AchievementFilterStore = {
  filter: AchievementFilterProps
}

export const useAchievementsFilterStore = createPersistedStore(
  combine(
    {
      filter: {
        incomplete: false,
        reward: false,
        includeAccountWide: true,
        points: 1,
      },
    } as AchievementFilterStore,
    (set) => ({
      setFilter: (filter: AchievementFilterProps) => {
        set({ filter })
      },
    })
  ),
  {
    name: 'achievementsFilter',
    version: 9,
  }
)
