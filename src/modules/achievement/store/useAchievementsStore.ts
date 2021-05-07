import { createStore } from '@/lib/createStore'
import { combine } from 'zustand/middleware'

import { AchievementsQueryResult } from '../types'

export const useAchievementsStore = createStore(
  combine(
    {
      byId: {},
      ids: [],
    } as AchievementsQueryResult,
    (set, get) => ({
      set,
      get: (id: number | string) => get().byId?.[Number(id).toString()],
    })
  )
)
