import { combine } from 'zustand/middleware'

import { isServer } from '@/lib/utils'
import { createPersistedStore } from '@/lib/createStore'
import { cookieStorage } from '@/lib/cookieStorage'

export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

export function getUserThemePreference(): Theme {
  if (isServer) {
    return Theme.Light
  }

  const prefersDark =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches

  return prefersDark ? Theme.Dark : Theme.Light
}

export const useThemeStore = createPersistedStore(
  combine(
    {
      theme: getUserThemePreference() as Theme,
    },
    (set) => ({
      setTheme: (theme: Theme) => set({ theme }),
    })
  ),
  {
    name: 'theme',
    version: 1,
    getStorage: cookieStorage,
  }
)
