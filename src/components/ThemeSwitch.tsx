import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef } from 'react'

import { Button } from '@/components/Button'

import { Theme, useThemeStore } from '../stores/useThemeStore'

const useThemeUpdate = (currentTheme: Theme) => {
  const currentThemeRef = useRef(currentTheme)

  // subscribe to theme change
  useEffect(() => {
    const body = window.document.body
    body.classList.remove(...Object.values(Theme))
    body.classList.add(currentTheme)
  }, [currentTheme])

  // set initial theme on mount
  useEffect(() => {
    if (currentThemeRef.current) {
      useThemeStore.setState({
        theme: currentThemeRef.current,
      })
    }
  }, [])
}

const ThemeSwitch: React.FC = () => {
  const { theme: currentTheme, setTheme } = useThemeStore()

  const setLight = useCallback(() => setTheme(Theme.Light), [setTheme])
  const setDark = useCallback(() => setTheme(Theme.Dark), [setTheme])

  useThemeUpdate(currentTheme)

  return (
    <>
      <div className="space-x-4 flex">
        {Object.values(Theme).map((theme) => (
          <Button
            key={theme}
            variant={theme === currentTheme ? 'primary' : 'secondary'}
            onClick={theme === Theme.Light ? setLight : setDark}
            size="small"
          >
            {theme}
          </Button>
        ))}
      </div>
    </>
  )
}

export default dynamic(() => Promise.resolve(ThemeSwitch), {
  ssr: false,
})
