import type { TelemetrySample } from '@/data/types'
import { toMercator, splitAntiMeridian, MAX_MERC_Y } from './mercatorMath'

const GRID_STEP = 30

export function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save()
  ctx.strokeStyle = 'rgba(255,255,255,0.1)'
  ctx.lineWidth = 1

  const latMax = MAX_MERC_Y
  const latMin = -MAX_MERC_Y

  for (let lon = -180; lon <= 180; lon += GRID_STEP) {
    const x = ((lon + 180) / 360) * width
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }

  for (let yLat = -80; yLat <= 80; yLat += GRID_STEP) {
    const { y } = toMercator(yLat, 0)
    const normY = 1 - (y - latMin) / (latMax - latMin)
    const yPix = normY * height
    ctx.beginPath()
    ctx.moveTo(0, yPix)
    ctx.lineTo(width, yPix)
    ctx.stroke()
  }

  ctx.restore()
}

export function drawTrajectory(ctx: CanvasRenderingContext2D, samples: TelemetrySample[], width: number, height: number, color = '#7ef3ff') {
  if (samples.length < 2) return
  ctx.save()
  ctx.lineWidth = 2
  ctx.strokeStyle = color

  const projected = samples.map((s) => toMercator(s.latDeg, s.lonDeg))
  const segments = splitAntiMeridian(projected)

  const latMax = MAX_MERC_Y
  const latMin = -MAX_MERC_Y

  segments.forEach((seg) => {
    if (seg.length < 2) return
    ctx.beginPath()
    seg.forEach((p, idx) => {
      const normX = (p.x + Math.PI) / (2 * Math.PI)
      const normY = 1 - (p.y - latMin) / (latMax - latMin)
      const x = normX * width
      const y = normY * height
      if (idx === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()
  })

  ctx.restore()
}

export function drawMarker(ctx: CanvasRenderingContext2D, sample: TelemetrySample | null, width: number, height: number, color = '#7ef3ff') {
  if (!sample) return
  ctx.save()
  ctx.fillStyle = color
  ctx.strokeStyle = 'rgba(0,0,0,0.4)'
  ctx.lineWidth = 2

  const { x, y } = toMercator(sample.latDeg, sample.lonDeg)
  const latMax = MAX_MERC_Y
  const latMin = -MAX_MERC_Y
  const normX = (x + Math.PI) / (2 * Math.PI)
  const normY = 1 - (y - latMin) / (latMax - latMin)
  const cx = normX * width
  const cy = normY * height

  ctx.beginPath()
  ctx.arc(cx, cy, 6, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  ctx.restore()
}
