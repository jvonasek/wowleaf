import dynamic from 'next/dynamic'
import { useCallback, useEffect } from 'react'

import { Button } from '@/components/Button'

import { Theme, useThemeStore } from '../stores/useThemeStore'

const ThemeSwitch: React.FC = () => {
  const { theme: currentTheme, setTheme } = useThemeStore()

  const setLight = useCallback(() => setTheme(Theme.Light), [setTheme])
  const setDark = useCallback(() => setTheme(Theme.Dark), [setTheme])

  useEffect(() => {
    const body = window.document.body
    body.classList.remove(...Object.values(Theme))
    body.classList.add(currentTheme)
  }, [currentTheme])

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
