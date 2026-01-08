import { useEffect, useMemo, useRef } from 'react'
import { buildAltitudePlot } from './altitudePlot'
import { useActiveSamples, usePlayState } from '@/state/selectors'
import './altitudeTimeInset.css'

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

export function AltitudeTimeInset() {
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
      const plot = buildAltitudePlot(samples, width, height)

      // axes
      ctx.save()
      ctx.strokeStyle = 'rgba(255,255,255,0.15)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, height - 1)
      ctx.lineTo(width, height - 1)
      ctx.moveTo(1, 0)
      ctx.lineTo(1, height)
      ctx.stroke()
      ctx.restore()

      // path
      ctx.save()
      ctx.strokeStyle = '#7ef3ff'
      ctx.lineWidth = 2
      ctx.beginPath()
      plot.points.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.x, p.y)
        else ctx.lineTo(p.x, p.y)
      })
      ctx.stroke()
      ctx.restore()

      // cursor
      if (currentSample) {
        const x = plot.scale.xForTime(currentSample.t)
        ctx.save()
        ctx.strokeStyle = 'rgba(255,255,255,0.4)'
        ctx.setLineDash([4, 4])
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
        ctx.restore()
      }
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [samples, currentSample])

  return (
    <div className="altitude-inset">
      <canvas ref={canvasRef} aria-label="Altitude vs time" />
      <div className="inset-label">Altitude</div>
    </div>
  )
}

export default AltitudeTimeInset
