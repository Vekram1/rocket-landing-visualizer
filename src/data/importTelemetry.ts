import type { TelemetryDataset, TelemetrySample } from '@/data/types'

function detectFormat(filename?: string, text?: string): 'json' | 'csv' {
  const lower = filename?.toLowerCase() ?? ''
  if (lower.endsWith('.json')) return 'json'
  if (lower.endsWith('.csv')) return 'csv'
  if (text?.trim().startsWith('{') || text?.trim().startsWith('[')) return 'json'
  return 'csv'
}

function parseJsonText(text: string): TelemetryDataset {
  const parsed = JSON.parse(text)
  if (Array.isArray(parsed)) {
    return { id: crypto.randomUUID(), name: 'Imported JSON', source: 'localFile', samples: parsed as TelemetrySample[] }
  }
  if (parsed.samples) {
    const { samples, ...rest } = parsed
    return { id: rest.id ?? crypto.randomUUID(), name: rest.name ?? 'Imported JSON', source: 'localFile', samples }
  }
  throw new Error('Invalid JSON telemetry: missing samples array')
}

function parseCsvText(text: string): TelemetryDataset {
  const lines = text.trim().split(/\r?\n/)
  if (!lines.length) throw new Error('Empty CSV file')
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase())
  const idx = {
    t: headers.findIndex((h) => ['t', 'time', 'seconds'].includes(h)),
    lat: headers.findIndex((h) => ['lat', 'latdeg', 'latitude'].includes(h)),
    lon: headers.findIndex((h) => ['lon', 'londeg', 'longitude'].includes(h)),
    alt: headers.findIndex((h) => ['alt', 'altitude', 'altmeters'].includes(h)),
    speed: headers.findIndex((h) => ['speed', 'speedmps'].includes(h)),
  }
  if (idx.t < 0 || idx.lat < 0 || idx.lon < 0) {
    throw new Error('CSV missing required headers time/lat/lon')
  }
  const samples: TelemetrySample[] = []
  for (let i = 1; i < lines.length; i += 1) {
    const row = lines[i].trim()
    if (!row) continue
    const cols = row.split(',').map((c) => c.trim())
    const t = Number(cols[idx.t])
    const latDeg = Number(cols[idx.lat])
    const lonDeg = Number(cols[idx.lon])
    const altMeters = idx.alt >= 0 ? Number(cols[idx.alt]) : undefined
    const speedMps = idx.speed >= 0 ? Number(cols[idx.speed]) : undefined
    if ([t, latDeg, lonDeg].some((v) => Number.isNaN(v))) {
      throw new Error(`Invalid numeric value on line ${i + 1}`)
    }
    samples.push({ t, latDeg, lonDeg, altMeters, speedMps })
  }
  return { id: crypto.randomUUID(), name: 'Imported CSV', source: 'localFile', samples }
}

export async function importTelemetry(file: File | Blob, filename?: string): Promise<TelemetryDataset> {
  const text = await file.text()
  const format = detectFormat(filename, text)
  if (format === 'json') {
    return parseJsonText(text)
  }
  return parseCsvText(text)
}

export default importTelemetry
