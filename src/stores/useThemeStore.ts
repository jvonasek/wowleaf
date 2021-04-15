import { createPersistedStore } from './createStore'
import { combine } from 'zustand/middleware'

export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

export function getUserThemePreference(): Theme {
  if (typeof window === 'undefined') {
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
  }
)

useThemeStore.subscribe(
  (theme: Theme) => {
    const body = window.document.body
    body.classList.remove(...Object.values(Theme))
    body.classList.add(theme)
  },
  (state) => state.theme
)
