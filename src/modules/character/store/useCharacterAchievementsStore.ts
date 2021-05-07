import { createStore } from '@/lib/createStore'
import { combine } from 'zustand/middleware'

import { CharacterAchievementProgress } from '../types'

export type CharacterAchievementsState = {
  [x: string]: {
    byId: Record<string, CharacterAchievementProgress>
    ids: number[]
  }
}

export const initialAchievementProgress: CharacterAchievementProgress = {
  id: -1,
  name: '',
  percent: 0,
  partial: 0,
  required: 0,
  criteria: {},
  completedTimestamp: undefined,
  isCompleted: false,
  showOverallProgressBar: false,
}

export const useCharacterAchievementsStore = createStore(
  combine({} as CharacterAchievementsState, (set, get) => ({
    set,
    get: (id: number | string, characterKey: string) => {
      const state = get()
      return (
        state?.[characterKey]?.byId?.[Number(id).toString()] ||
        initialAchievementProgress
      )
    },
  }))
)
