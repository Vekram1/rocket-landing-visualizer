import { useMemo } from 'react'
import { Sphere } from '@react-three/drei'

export type VehicleMarkerProps = {
  position?: [number, number, number]
  color?: string
  radius?: number
}

export function VehicleMarker({ position = [0, 0, 0], color = '#7ef3ff', radius = 0.025 }: VehicleMarkerProps) {
  const pos = useMemo(() => position, [position])

  return (
    <Sphere args={[radius, 24, 24]} position={pos}>
      <meshStandardMaterial emissive={color} color={color} emissiveIntensity={1.2} />
    </Sphere>
  )
}

export default VehicleMarker
