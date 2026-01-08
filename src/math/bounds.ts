import type { TelemetryBounds, TelemetrySample } from '@/data/types'

export type FitResult = {
  center: [number, number, number]
  radius: number
}

export function computeBounds(samples: TelemetrySample[]): TelemetryBounds {
  let minLat = Number.POSITIVE_INFINITY
  let maxLat = Number.NEGATIVE_INFINITY
  let minLon = Number.POSITIVE_INFINITY
  let maxLon = Number.NEGATIVE_INFINITY
  let minAlt = Number.POSITIVE_INFINITY
  let maxAlt = Number.NEGATIVE_INFINITY

  for (const s of samples) {
    minLat = Math.min(minLat, s.latDeg)
    maxLat = Math.max(maxLat, s.latDeg)
    minLon = Math.min(minLon, s.lonDeg)
    maxLon = Math.max(maxLon, s.lonDeg)
    minAlt = Math.min(minAlt, s.altMeters ?? 0)
    maxAlt = Math.max(maxAlt, s.altMeters ?? 0)
  }

  return { minLat, maxLat, minLon, maxLon, minAlt, maxAlt }
}

export function computeBoundingSphere(samples: TelemetrySample[], exaggeration = 1): FitResult {
  if (!samples.length) {
    return { center: [0, 0, 0], radius: 1 }
  }
  const center: [number, number, number] = [0, 0, 0]
  samples.forEach((s) => {
    center[0] += s.latDeg
    center[1] += s.lonDeg
    center[2] += (s.altMeters ?? 0) * exaggeration
  })
  center[0] /= samples.length
  center[1] /= samples.length
  center[2] /= samples.length

  let maxR2 = 0
  samples.forEach((s) => {
    const dx = s.latDeg - center[0]
    const dy = s.lonDeg - center[1]
    const dz = (s.altMeters ?? 0) * exaggeration - center[2]
    const r2 = dx * dx + dy * dy + dz * dz
    maxR2 = Math.max(maxR2, r2)
  })

  return { center, radius: Math.sqrt(maxR2) }
}
