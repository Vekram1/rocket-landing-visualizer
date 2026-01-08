import type { TelemetrySample } from '@/data/types'

const REQUIRED_ALIASES = {
  t: ['t', 'time', 'seconds', 'sec', 'timestamp'],
  lat: ['lat', 'latdeg', 'latitude', 'lat_deg'],
  lon: ['lon', 'londeg', 'longitude', 'lon_deg'],
}

const OPTIONAL_ALIASES = {
  alt: ['alt', 'altitude', 'altmeters', 'alt_m', 'altitude_m'],
  speed: ['speed', 'speedmps', 'speed_mps', 'velocity', 'vel_mps'],
}

function findHeaderIndex(headers: string[], aliases: string[]): number {
  return headers.findIndex((h) => aliases.includes(h))
}

export type CsvParseResult = {
  samples: TelemetrySample[]
}

export class CsvParseError extends Error {
  line?: number

  constructor(message: string, line?: number) {
    super(message)
    this.line = line
    this.name = 'CsvParseError'
  }
}

export function parseCsv(text: string): CsvParseResult {
  const rows = text.split(/\r?\n/).map((r) => r.trim()).filter(Boolean)
  if (rows.length === 0) {
    throw new CsvParseError('CSV is empty')
  }

  const headers = rows[0].split(',').map((h) => h.trim().toLowerCase())

  const idx = {
    t: findHeaderIndex(headers, REQUIRED_ALIASES.t),
    lat: findHeaderIndex(headers, REQUIRED_ALIASES.lat),
    lon: findHeaderIndex(headers, REQUIRED_ALIASES.lon),
    alt: findHeaderIndex(headers, OPTIONAL_ALIASES.alt),
    speed: findHeaderIndex(headers, OPTIONAL_ALIASES.speed),
  }

  if (idx.t < 0 || idx.lat < 0 || idx.lon < 0) {
    throw new CsvParseError('CSV missing required headers: time, lat, lon')
  }

  const samples: TelemetrySample[] = []

  for (let i = 1; i < rows.length; i += 1) {
    const lineNumber = i + 1
    const cols = rows[i].split(',').map((c) => c.trim())

    const t = Number(cols[idx.t])
    const latDeg = Number(cols[idx.lat])
    const lonDeg = Number(cols[idx.lon])
    const altMeters = idx.alt >= 0 ? Number(cols[idx.alt]) : undefined
    const speedMps = idx.speed >= 0 ? Number(cols[idx.speed]) : undefined

    if ([t, latDeg, lonDeg].some((v) => Number.isNaN(v))) {
      throw new CsvParseError(`Invalid numeric value`, lineNumber)
    }

    samples.push({ t, latDeg, lonDeg, altMeters, speedMps })
  }

  return { samples }
}

export default parseCsv
