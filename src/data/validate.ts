import type { TelemetryDataset, TelemetrySample } from '@/data/types'

export class ValidationError extends Error {
  index?: number

  constructor(message: string, index?: number) {
    super(message)
    this.name = 'ValidationError'
    this.index = index
  }
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

export function validateSample(sample: TelemetrySample, index: number): void {
  if (!isFiniteNumber(sample.t)) {
    throw new ValidationError(`Sample ${index}: invalid time`, index)
  }
  if (!isFiniteNumber(sample.latDeg) || sample.latDeg < -90 || sample.latDeg > 90) {
    throw new ValidationError(`Sample ${index}: latDeg out of range`, index)
  }
  if (!isFiniteNumber(sample.lonDeg) || sample.lonDeg < -180 || sample.lonDeg >= 360) {
    throw new ValidationError(`Sample ${index}: lonDeg out of range`, index)
  }
  if (sample.altMeters !== undefined && !isFiniteNumber(sample.altMeters)) {
    throw new ValidationError(`Sample ${index}: altMeters invalid`, index)
  }
  if (sample.speedMps !== undefined && !isFiniteNumber(sample.speedMps)) {
    throw new ValidationError(`Sample ${index}: speedMps invalid`, index)
  }
}

export function validateDataset(dataset: TelemetryDataset): void {
  if (!dataset.id) {
    throw new ValidationError('Dataset missing id')
  }
  if (!dataset.name) {
    throw new ValidationError('Dataset missing name')
  }
  if (!Array.isArray(dataset.samples) || dataset.samples.length === 0) {
    throw new ValidationError('Dataset has no samples')
  }
  dataset.samples.forEach((s, i) => validateSample(s, i))
}

export default validateDataset
