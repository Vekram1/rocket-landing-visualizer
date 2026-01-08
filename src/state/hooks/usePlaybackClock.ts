import { useEffect, useRef } from 'react'
import { usePlayState, usePlaybackActions, useActiveSamples } from '@/state/selectors'

export function usePlaybackClock() {
  const { playing, speed, currentTime } = usePlayState()
  const { setCurrentTime, resetPlayback } = usePlaybackActions()
  const samples = useActiveSamples()
  const rafRef = useRef<number | null>(null)
  const lastTsRef = useRef<number | null>(null)

  useEffect(() => {
    const step = (ts: number) => {
      if (!playing) return
      const last = lastTsRef.current ?? ts
      const deltaSec = (ts - last) / 1000
      lastTsRef.current = ts

      const duration = samples.length ? samples[samples.length - 1].t : 0
      const nextTime = currentTime + deltaSec * speed
      if (duration && nextTime >= duration) {
        setCurrentTime(duration)
        resetPlayback()
        lastTsRef.current = null
        return
      }
      setCurrentTime(nextTime)
      rafRef.current = requestAnimationFrame(step)
    }

    if (playing) {
      rafRef.current = requestAnimationFrame(step)
    }

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      lastTsRef.current = null
    }
  }, [playing, speed, currentTime, samples, setCurrentTime, resetPlayback])
}

export default usePlaybackClock
