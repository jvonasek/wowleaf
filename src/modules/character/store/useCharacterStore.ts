import { createStore } from '@/lib/createStore'
import { combine } from 'zustand/middleware'

import { CharacterParams } from '../types'

type CharacterStoreProps = CharacterParams & {
  characterKey: string
}

export const useCharacterStore = createStore(
  combine(
    {
      region: 'eu',
      realm: '',
      name: '',
      characterKey: '',
    } as CharacterStoreProps,
    (set) => ({ set })
  )
)
