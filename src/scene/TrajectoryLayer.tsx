import { useMemo } from 'react'
import TrajectoryPath from './TrajectoryPath'

export type TrajectorySegment = {
  id: string
  positions: [number, number, number][]
  color?: string
  width?: number
}

export type TrajectoryLayerProps = {
  trajectories: TrajectorySegment[]
  defaultColor?: string
  defaultWidth?: number
}

const palette = ['#7ef3ff', '#86a8ff', '#ff9e7f', '#7bffc8']

export function TrajectoryLayer({ trajectories, defaultColor = '#7ef3ff', defaultWidth = 2 }: TrajectoryLayerProps) {
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
      {normalized.map((t) => (
        <TrajectoryPath key={t.id} positions={t.positions} color={t.color} width={t.width} />
      ))}
    </group>
  )
}

export default TrajectoryLayer
