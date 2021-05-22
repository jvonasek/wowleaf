import { combine } from 'zustand/middleware'

import { createStore } from '@/lib/createStore'

import { CharacterAchievementProgress } from '../types'
import { CharacterStoreProps } from './useCharacterStore'

export type CharacterAchievementsStoreObject = {
  character: CharacterStoreProps
  byId: Record<string, CharacterAchievementProgress>
  ids: number[]
}

export type CharacterAchievementsStore = {
  isSuccess: boolean
  isLoading: boolean
  characters: Record<string, CharacterAchievementsStoreObject>
}

export type CombinedAchievementsStore = {
  combined: CharacterAchievementsStoreObject
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

export const useCombinedAchievementsStore = createStore(
  combine(
    {
      combined: {},
    } as CombinedAchievementsStore,
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
      getCharacter: (key: string) =>
        getCharacterFromStore(get().characters)(key),
      getProgress: (
        id: number | string,
        characterKey: string,
        isPremium = false
      ) => getProgressFromStore(get(), isPremium)(id, characterKey),
    })
  )
)

function getProgressFromStore(
  store: CharacterAchievementsStore,
  isPremium = false
) {
  const characters = isPremium
    ? { combined: useCombinedAchievementsStore.getState().combined }
    : store.characters

  return (id: number | string, characterKey?: string) => {
    const character = getCharacterFromStore(characters)(
      isPremium ? 'combined' : characterKey
    )
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
      byId: {},
      ids: [],
    }
}
