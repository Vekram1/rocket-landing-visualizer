import type { TelemetrySample } from '@/data/types'

export function findSegment(samples: TelemetrySample[], time: number): { a: TelemetrySample; b: TelemetrySample } | null {
  if (samples.length < 2) return null
  if (time <= samples[0].t) return { a: samples[0], b: samples[1] }
  for (let i = 0; i < samples.length - 1; i += 1) {
    const a = samples[i]
    const b = samples[i + 1]
    if (time >= a.t && time <= b.t) {
      return { a, b }
    }
  }
  return { a: samples[samples.length - 2], b: samples[samples.length - 1] }
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function interpolateSample(samples: TelemetrySample[], time: number): TelemetrySample | null {
  const segment = findSegment(samples, time)
  if (!segment) return null
  const { a, b } = segment
  const span = b.t - a.t || 1
  const alpha = Math.max(0, Math.min(1, (time - a.t) / span))

  return {
    t: time,
    latDeg: lerp(a.latDeg, b.latDeg, alpha),
    lonDeg: lerp(a.lonDeg, b.lonDeg, alpha),
    altMeters: lerp(a.altMeters ?? 0, b.altMeters ?? 0, alpha),
    speedMps: lerp(a.speedMps ?? 0, b.speedMps ?? 0, alpha),
  }
}
