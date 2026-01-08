export type TelemetrySample = {
  t: number // seconds from start
  latDeg: number
  lonDeg: number
  altMeters?: number
  speedMps?: number
}

export type TelemetryBounds = {
  minLat: number
  maxLat: number
  minLon: number
  maxLon: number
  minAlt: number
  maxAlt: number
}

export type DatasetSource = 'bundled' | 'localFile'

export type TelemetryDataset = {
  id: string
  name: string
  description?: string
  source: DatasetSource
  timeBase?: string
  samples: TelemetrySample[]
  style?: {
    color?: string
    width?: number
    exaggeration?: number
  }
  bounds?: TelemetryBounds
}

export type NormalizedPositions = {
  positions: Float32Array
  mercator2d: Float32Array
  altSeries: Float32Array
}

export type MissionManifestEntry = {
  id: string
  name: string
  description?: string
  file: string
  color?: string
}
