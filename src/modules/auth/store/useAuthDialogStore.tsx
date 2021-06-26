import { combine } from 'zustand/middleware'

import { createStore } from '@/lib/createStore'

export const useAuthDialogStore = createStore(
  combine(
    {
      isOpen: false,
    },
    (set) => ({
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    })
  )
)
