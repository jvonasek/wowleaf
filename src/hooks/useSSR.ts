import { useState, useEffect } from 'react'

export function useSSR() {
  const [isServer, setIsServer] = useState(true)
  useEffect(() => {
    setIsServer(false)
  }, [])
  return {
    isServer,
    isBrowser: !isServer,
  }
}
