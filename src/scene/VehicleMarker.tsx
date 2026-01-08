import { useMemo } from 'react'
import { Line, Sphere } from '@react-three/drei'

export type Triplet = [number, number, number]

export type VehicleMarkerProps = {
  position?: Triplet
  color?: string
  radius?: number
  trail?: Triplet[]
  trailWidth?: number
}

export function VehicleMarker({
  position = [0, 0, 0],
  color = '#7ef3ff',
  radius = 0.025,
  trail,
  trailWidth = 1,
}: VehicleMarkerProps) {
  const pos = useMemo(() => position, [position])
  const trailPoints = useMemo(() => trail ?? [], [trail])

  return (
    <group>
      {trailPoints.length > 1 && <Line points={trailPoints} color={color} lineWidth={trailWidth} dashed={false} />}
      <Sphere args={[radius, 24, 24]} position={pos}>
        <meshStandardMaterial emissive={color} color={color} emissiveIntensity={1.3} />
      </Sphere>
    </group>
  )
}

export default VehicleMarker
