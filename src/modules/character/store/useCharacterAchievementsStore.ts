import { createStore } from '@/lib/createStore'
import { combine } from 'zustand/middleware'

import { CharacterAchievementsRecord } from '../types'

export const useCharacterAchievementsStore = createStore(
  combine({} as CharacterAchievementsRecord, (set, get) => ({
    set,
    get: (id: string) => get()?.[id],
  }))
)
