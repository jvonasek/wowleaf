import { createStore } from '@/lib/createStore'
import { combine } from 'zustand/middleware'

import { CharacterProps, BattleNetRegion } from '@/types'

type CharacterStoreProps = CharacterProps & {
  region: BattleNetRegion
  characterKey: string
}

export const initialCharacterState: CharacterStoreProps = {
  id: null,
  region: null,
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
}

export const useCharacterStore = createStore(
  combine(initialCharacterState, (set) => ({ set }))
)
