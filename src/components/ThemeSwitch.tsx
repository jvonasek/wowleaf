import dynamic from 'next/dynamic'
import { useCallback } from 'react'

import { useThemeStore, Theme } from '../stores/useThemeStore'

import { Button } from '@/components/Button'

const ThemeSwitch: React.FC = () => {
  const { theme: currentTheme, setTheme } = useThemeStore()

  const setLight = useCallback(() => setTheme(Theme.Light), [setTheme])
  const setDark = useCallback(() => setTheme(Theme.Dark), [setTheme])

  return (
    <>
      <div className="space-x-4 flex">
        {Object.values(Theme).map((theme) => (
          <Button
            key={theme}
            variant={theme === currentTheme ? 'primary' : 'secondary'}
            onClick={theme === Theme.Light ? setLight : setDark}
            size="large"
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
