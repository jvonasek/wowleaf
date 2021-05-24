import { combine } from 'zustand/middleware'

import { createStore } from '@/lib/createStore'

import { CharacterAchievementProgress } from '../types'
import { CharacterStoreProps } from './useCharacterStore'

export type CharacterAchievementsStoreObject = {
  character: CharacterStoreProps
  characters: Record<
    string,
    Pick<CharacterAchievementProgress, 'percent' | 'characterKey'>[]
  >
  byId: Record<string, CharacterAchievementProgress>
  ids: number[]
}

export type CharacterAchievementsStore = {
  isSuccess: boolean
  isLoading: boolean
  characters: Record<string, CharacterAchievementsStoreObject>
}

export type AggregatedAchievementsStore = {
  aggregated: CharacterAchievementsStoreObject
}

export const initialAchievementProgress: CharacterAchievementProgress = {
  id: null,
  percent: 0,
  partial: 0,
  required: 0,
  criteria: {},
  completedTimestamp: undefined,
  isCompleted: false,
  showOverallProgressBar: false,
  characterKey: '',
}

export const useAggregatedAchievementsStore = createStore(
  combine(
    {
      aggregated: {
        character: null,
        characters: {},
        byId: {},
        ids: [],
      },
    } as AggregatedAchievementsStore,
    (set, get) => ({
      set,
      get,
    })
  )
)

export const useCharacterAchievementsStore = createStore(
  combine(
    {
      isSuccess: false,
      isLoading: false,
      characters: {},
    } as CharacterAchievementsStore,
    (set, get) => ({
      set,
      setCharacters: (
        characters: Record<string, CharacterAchievementsStoreObject>
      ) => {
        return set({
          characters: {
            ...get()?.characters,
            ...characters,
          },
        })
      },
      getCharacterInfo: (key: string) => {
        return getCharacterFromStore(get().characters)(key).character
      },
      getAggregatedProgressOrderById: (id: string | number) => {
        const aggregatedStore = useAggregatedAchievementsStore.getState()
        const characters = aggregatedStore?.aggregated?.characters
        return characters ? characters[Number(id).toString()] : []
      },
      getAggregatedAchievements: () => {
        return useAggregatedAchievementsStore.getState().aggregated
      },
      getCharAchievements: (key: string) => {
        return getCharacterFromStore(get().characters)(key)
      },
      getCharAchievementProgressById: (
        id: number | string,
        characterKey: string
      ) => getProgressFromStore(get())(id, characterKey),
    })
  )
)

function getProgressFromStore(store: CharacterAchievementsStore) {
  return (id: number | string, characterKey: string) => {
    const characters =
      characterKey === 'aggregated'
        ? { aggregated: useAggregatedAchievementsStore.getState().aggregated }
        : store.characters

    const character = getCharacterFromStore(characters)(characterKey)

    if (character) {
      return (
        character?.byId?.[Number(id).toString()] || initialAchievementProgress
      )
    }

    return initialAchievementProgress
  }
}

function getCharacterFromStore(
  characters: Record<string, CharacterAchievementsStoreObject>
) {
  return (characterKey: string) =>
    characters?.[characterKey] || {
      character: null,
      byId: {},
      ids: [],
    }
}
