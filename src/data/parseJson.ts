import type { TelemetrySample } from '@/data/types'

export class JsonParseError extends Error {}

export function parseJson(input: unknown): TelemetrySample[] {
  if (Array.isArray(input)) {
    return coerceSamples(input)
  }
  if (input && typeof input === 'object' && 'samples' in input) {
    const { samples } = input as { samples: unknown }
    return coerceSamples(samples)
  }
  throw new JsonParseError('Invalid JSON telemetry: expected array or object with samples')
}

function coerceSamples(value: unknown): TelemetrySample[] {
  if (!Array.isArray(value)) {
    throw new JsonParseError('Invalid JSON telemetry: samples must be an array')
  }
  return value.map((entry, index) => {
    if (!entry || typeof entry !== 'object') {
      throw new JsonParseError(`Invalid sample at index ${index}: expected object`)
    }
    const sample = entry as Record<string, unknown>
    const t = Number(sample.t)
    const latDeg = Number(sample.latDeg ?? sample.lat ?? sample.latitude)
    const lonDeg = Number(sample.lonDeg ?? sample.lon ?? sample.longitude)
    const altMetersRaw = sample.altMeters ?? sample.alt ?? sample.altitude
    const speedMpsRaw = sample.speedMps ?? sample.speed ?? sample.velocity
    const altMeters = altMetersRaw !== undefined ? Number(altMetersRaw) : undefined
    const speedMps = speedMpsRaw !== undefined ? Number(speedMpsRaw) : undefined

    if ([t, latDeg, lonDeg].some((v) => Number.isNaN(v))) {
      throw new JsonParseError(`Invalid numeric fields in sample at index ${index}`)
    }

    return { t, latDeg, lonDeg, altMeters, speedMps }
  })
}

export default parseJson
