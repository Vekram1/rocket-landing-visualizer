import { useMemo } from 'react'
import TrajectoryPath from './TrajectoryPath'

export type Triplet = [number, number, number]

export type TrajectorySegment = {
  id: string
  /** Altitude-exaggerated positions */
  positions?: Triplet[]
  /** Surface-only positions (radius 1) */
  surfacePositions?: Triplet[]
  /** Pre-split segments to avoid anti-meridian artifacts */
  segments?: Triplet[][]
  color?: string
  width?: number
}

export type TrajectoryLayerProps = {
  trajectories: TrajectorySegment[]
  defaultColor?: string
  defaultWidth?: number
  showSurfaceTrack?: boolean
  showAltitudeTrack?: boolean
}

const palette = ['#7ef3ff', '#86a8ff', '#ff9e7f', '#7bffc8']

export function TrajectoryLayer({
  trajectories,
  defaultColor = '#7ef3ff',
  defaultWidth = 2,
  showSurfaceTrack = true,
  showAltitudeTrack = true,
}: TrajectoryLayerProps) {
  const normalized = useMemo(() => {
    return trajectories.map((t, index) => ({
      ...t,
      color: t.color ?? palette[index % palette.length] ?? defaultColor,
      width: t.width ?? defaultWidth,
    }))
  }, [trajectories, defaultColor, defaultWidth])

  if (!normalized.length) return null

  return (
    <group>
      {normalized.map((t) => {
        const color = t.color
        const width = t.width

        const surfaceSegments = showSurfaceTrack
          ? t.segments ?? (t.surfacePositions ? [t.surfacePositions] : [])
          : []
        const altitudeSegments = showAltitudeTrack
          ? t.segments ?? (t.positions ? [t.positions] : [])
          : []

        return (
          <group key={t.id}>
            {surfaceSegments.map((seg, idx) => (
              <TrajectoryPath key={`${t.id}-surface-${idx}`} positions={seg} color={color} width={width} />
            ))}
            {altitudeSegments.map((seg, idx) => (
              <TrajectoryPath key={`${t.id}-alt-${idx}`} positions={seg} color={color} width={width} />
            ))}
          </group>
        )
      })}
    </group>
  )
}

export default TrajectoryLayer
