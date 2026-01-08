import { useEffect, useMemo, useRef } from 'react'
import { buildAltitudePlot } from './altitudePlot'
import { useActiveSamples, usePlayState } from '@/state/selectors'
import { interpolateSample } from '@/math/interpolation'
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

  const currentSample = useMemo(() => interpolateSample(samples, currentTime) ?? pickSample(samples, currentTime), [samples, currentTime])

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
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const render = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      ctx.clearRect(0, 0, width, height)
      const plot = buildAltitudePlot(samples, width, height)

      // grid + axes
      ctx.save()
      ctx.strokeStyle = 'rgba(255,255,255,0.12)'
      ctx.lineWidth = 1
      const gridXTicks = 4
      for (let i = 0; i <= gridXTicks; i += 1) {
        const x = (width * i) / gridXTicks
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      const gridYTicks = 4
      const { altMin, altMax } = plot.domain
      for (let i = 0; i <= gridYTicks; i += 1) {
        const alt = altMin + ((altMax - altMin) * i) / gridYTicks
        const y = plot.scale.yForAlt(alt)
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }
      ctx.restore()

      // below-ground shading
      if (plot.domain.altMin < 0) {
        const yZero = plot.scale.yForAlt(0)
        ctx.save()
        ctx.fillStyle = 'rgba(126, 243, 255, 0.08)'
        ctx.fillRect(0, yZero, width, height - yZero)
        ctx.restore()
      }

      // path
      if (plot.points.length) {
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
      }

      // axis labels
      ctx.save()
      ctx.fillStyle = 'rgba(229,236,255,0.75)'
      ctx.font = '12px "Inter", "Segoe UI", sans-serif'
      ctx.fillText('km', width - 28, 14)
      const altTickStep = (altMax - altMin) / gridYTicks || 1
      for (let i = 0; i <= gridYTicks; i += 1) {
        const alt = altMin + altTickStep * i
        const y = plot.scale.yForAlt(alt)
        ctx.fillText(`${(alt / 1000).toFixed(0)}`, 6, Math.max(12, Math.min(height - 6, y)))
      }
      ctx.restore()

      // cursor + marker
      if (currentSample) {
        const x = plot.scale.xForTime(currentSample.t)
        const y = plot.scale.yForAlt(currentSample.altMeters ?? 0)
        ctx.save()
        ctx.strokeStyle = 'rgba(255,255,255,0.5)'
        ctx.setLineDash([4, 4])
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.fillStyle = '#7ef3ff'
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    resize()
    render()
    const handleResize = () => {
      resize()
      render()
    }
    window.addEventListener('resize', handleResize)

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
