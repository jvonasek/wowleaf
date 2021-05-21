import { createStore } from '@/lib/createStore'
import { combine } from 'zustand/middleware'

import { Character } from '@/types'

export type CharacterStoreProps = Character & {
  characterKey: string
}

export const initialCharacterState: CharacterStoreProps = {
  id: null,
  userId: null,
  region: null,
  realm: '',
  realmSlug: '',
  name: '',
  classId: null,
  raceId: null,
  faction: null,
  gender: null,
  guild: '',
  level: null,
  covenantId: null,
  characterKey: '',
  createdAt: null,
  updatedAt: null,
}

export const useCharacterStore = createStore(
  combine(initialCharacterState, (set) => ({ set }))
)
