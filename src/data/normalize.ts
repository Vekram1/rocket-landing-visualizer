import { latLonToCartesian, normalizeLon180 } from '@/math/geo'
import type { TelemetryBounds, TelemetryDataset, TelemetrySample, NormalizedPositions } from '@/data/types'

const MAX_MERCATOR_LAT = 85.05113

function clampLat(lat: number): number {
  return Math.max(-MAX_MERCATOR_LAT, Math.min(MAX_MERCATOR_LAT, lat))
}

function computeBounds(samples: TelemetrySample[]): TelemetryBounds {
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

function buildBuffers(samples: TelemetrySample[]): NormalizedPositions {
  const positions = new Float32Array(samples.length * 3)
  const mercator2d = new Float32Array(samples.length * 2)
  const altSeries = new Float32Array(samples.length)

  samples.forEach((s, i) => {
    const { x, y, z } = latLonToCartesian(s.latDeg, s.lonDeg, 1)
    positions[i * 3 + 0] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z

    const clampedLat = clampLat(s.latDeg)
    const latRad = (clampedLat * Math.PI) / 180
    const lonRad = (normalizeLon180(s.lonDeg) * Math.PI) / 180
    const mercX = lonRad
    const mercY = Math.log(Math.tan(Math.PI / 4 + latRad / 2))
    mercator2d[i * 2 + 0] = mercX
    mercator2d[i * 2 + 1] = mercY

    altSeries[i] = s.altMeters ?? 0
  })

  return { positions, mercator2d, altSeries }
}

export function normalizeTelemetry(dataset: TelemetryDataset): TelemetryDataset & { bounds: TelemetryBounds; normalized: NormalizedPositions } {
  const sortedSamples = [...dataset.samples].sort((a, b) => a.t - b.t)
  const normalizedSamples: TelemetrySample[] = sortedSamples.map((s) => ({
    ...s,
    lonDeg: normalizeLon180(s.lonDeg),
    altMeters: s.altMeters ?? 0,
  }))

  const bounds = computeBounds(normalizedSamples)
  const normalized = buildBuffers(normalizedSamples)

  return {
    ...dataset,
    samples: normalizedSamples,
    bounds,
    normalized,
  }
}

export default normalizeTelemetry
