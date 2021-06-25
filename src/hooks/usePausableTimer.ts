import { useEffect, useRef, useState } from 'react'

type CallbackFn = () => void

export const usePausableTimer = (callback: CallbackFn, delay: number) => {
  const [paused, setPaused] = useState(false)
  const start = useRef(new Date())
  const remaining = useRef(delay)
  const timeoutId = useRef(null)

  const clear = () => clearTimeout(timeoutId.current)

  const pause = () => {
    setPaused(true)
    remaining.current -= new Date().getTime() - start.current.getTime()
    clear()
  }

  const resume = () => {
    start.current = new Date()
    setPaused(false)
  }

  useEffect(() => {
    if (!paused && delay) {
      timeoutId.current = setTimeout(callback, remaining.current)
    }
    return clear
  }, [remaining, paused, delay, callback])

  return [pause, resume]
}
