import { useEffect, useMemo, useRef } from 'react'
import { drawGrid, drawMarker, drawTrajectory } from './insetRenderer'
import { useActiveSamples, usePlayState } from '@/state/selectors'
import './mercatorInset.css'

function pickSample(samples: ReturnType<typeof useActiveSamples>, t: number) {
  if (!samples.length) return null
  let last = samples[0]
  for (let i = 1; i < samples.length; i += 1) {
    const s = samples[i]
    if (s.t > t) break
    last = s
  }
  return last
}

export function MercatorInset() {
  const samples = useActiveSamples()
  const { currentTime } = usePlayState()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const currentSample = useMemo(() => pickSample(samples, currentTime), [samples, currentTime])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const { clientWidth, clientHeight } = canvas
      canvas.width = clientWidth * dpr
      canvas.height = clientHeight * dpr
      ctx.scale(dpr, dpr)
    }

    resize()
    const handleResize = () => {
      ctx.resetTransform()
      resize()
      render()
    }
    window.addEventListener('resize', handleResize)

    const render = () => {
      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)
      drawGrid(ctx, width, height)
      drawTrajectory(ctx, samples, width, height)
      drawMarker(ctx, currentSample, width, height)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [samples, currentSample])

  return (
    <div className="mercator-inset">
      <canvas ref={canvasRef} aria-label="Mercator inset" />
      <div className="inset-label">Mercator</div>
    </div>
  )
}

export default MercatorInset
