import type { TelemetrySample } from '@/data/types'

export type AltitudeScale = {
  xForTime: (t: number) => number
  yForAlt: (alt: number) => number
  width: number
  height: number
}

export type AltitudePlot = {
  points: Array<{ x: number; y: number }>
  scale: AltitudeScale
  domain: { tMin: number; tMax: number; altMin: number; altMax: number }
}

function createScale(width: number, height: number, tMin: number, tMax: number, altMin: number, altMax: number): AltitudeScale {
  const safeTMin = Number.isFinite(tMin) ? tMin : 0
  const safeTMax = Number.isFinite(tMax) && tMax > safeTMin ? tMax : safeTMin + 1
  const safeAltMin = Number.isFinite(altMin) ? altMin : 0
  const safeAltMax = Number.isFinite(altMax) && altMax > safeAltMin ? altMax : safeAltMin + 1

  const xForTime = (t: number) => {
    const clamped = Math.min(Math.max(t, safeTMin), safeTMax)
    return ((clamped - safeTMin) / (safeTMax - safeTMin)) * width
  }

  const yForAlt = (alt: number) => {
    const clamped = Math.min(Math.max(alt, safeAltMin), safeAltMax)
    // y grows downward in canvas space
    return height - ((clamped - safeAltMin) / (safeAltMax - safeAltMin)) * height
  }

  return { xForTime, yForAlt, width, height }
}

export function buildAltitudePlot(samples: TelemetrySample[], width: number, height: number): AltitudePlot {
  if (!samples.length) {
    const scale = createScale(width, height, 0, 1, 0, 1)
    return { points: [], scale, domain: { tMin: 0, tMax: 1, altMin: 0, altMax: 1 } }
  }

  const tMin = 0
  const tMax = samples[samples.length - 1].t
  const altitudes = samples.map((s) => s.altMeters ?? 0)
  const altMin = Math.min(...altitudes, 0)
  const altMax = Math.max(...altitudes, 1)

  const scale = createScale(width, height, tMin, tMax, altMin, altMax)
  const points = samples.map((s) => ({ x: scale.xForTime(s.t), y: scale.yForAlt(s.altMeters ?? 0) }))

  return { points, scale, domain: { tMin, tMax, altMin, altMax } }
}

export default buildAltitudePlot
