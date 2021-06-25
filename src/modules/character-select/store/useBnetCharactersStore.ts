import { combine } from 'zustand/middleware'

import { createPersistedStore } from '@/lib/createStore'

import { Character } from '@/types'

export const BNET_CHARS_STORAGE_KEY = 'bnet_characters'

type BnetCharactersStore = {
  battletag: string
  lastUpdatedAt: string
  characters: Character[]
}

const initialState = {
  battletag: '',
  lastUpdatedAt: '',
  characters: [],
} as BnetCharactersStore

export const useBnetCharactersStore = createPersistedStore(
  combine(initialState, (set) => ({ set })),
  {
    name: BNET_CHARS_STORAGE_KEY,
    version: 4,
  }
)
