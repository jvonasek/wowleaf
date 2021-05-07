import { createStore } from '@/lib/createStore'
import { combine } from 'zustand/middleware'

import { CharacterParams } from '../types'

export const useCharacterStore = createStore(
  combine(
    {
      region: 'eu',
      realm: '',
      name: '',
      characterKey: '',
    } as CharacterParams,
    (set) => ({ set })
  )
)
