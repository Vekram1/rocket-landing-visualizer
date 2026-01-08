import { Line } from '@react-three/drei'
import { useMemo } from 'react'

export type TrajectoryPathProps = {
  positions: [number, number, number][]
  color?: string
  width?: number
}

export function TrajectoryPath({ positions, color = '#7ef3ff', width = 2 }: TrajectoryPathProps) {
  const safePositions = useMemo(() => positions ?? [], [positions])

  if (!safePositions.length) {
    return null
  }

  return <Line points={safePositions} color={color} lineWidth={width} dashed={false} />
}

export default TrajectoryPath
