import { useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'

const DEFAULT_SATELLITE_URL = '/assets/blue-marble-8k.jpg'

export type GlobeMeshProps = {
  radius?: number
  wireColor?: string
  surfaceColor?: string
  useSatelliteTexture?: boolean
  textureUrl?: string
}

export function GlobeMesh({
  radius = 1,
  wireColor = '#264a7a',
  surfaceColor = '#0f141f',
  useSatelliteTexture = false,
  textureUrl = DEFAULT_SATELLITE_URL,
}: GlobeMeshProps) {
  const args = useMemo(() => [radius, 64, 64] as const, [radius])
  const texture = useLoader(TextureLoader, textureUrl || DEFAULT_SATELLITE_URL)

  return (
    <group>
      <mesh>
        <sphereGeometry args={args} />
        <meshStandardMaterial
          map={useSatelliteTexture ? texture : null}
          color={useSatelliteTexture ? undefined : surfaceColor}
          transparent={!useSatelliteTexture}
          opacity={useSatelliteTexture ? 1 : 0.6}
          roughness={useSatelliteTexture ? 1 : 0.9}
          metalness={useSatelliteTexture ? 0 : 0.05}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={args} />
        <meshStandardMaterial
          color={wireColor}
          wireframe
          transparent
          opacity={useSatelliteTexture ? 0.4 : 0.9}
          polygonOffset
          polygonOffsetFactor={-1}
        />
      </mesh>
    </group>
  )
}

export default GlobeMesh
