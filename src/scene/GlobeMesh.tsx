import { useMemo } from 'react'

export type GlobeMeshProps = {
  radius?: number
  wireColor?: string
  surfaceColor?: string
}

export function GlobeMesh({ radius = 1, wireColor = '#264a7a', surfaceColor = '#0f141f' }: GlobeMeshProps) {
  const args = useMemo(() => [radius, 64, 64] as const, [radius])

  return (
    <group>
      <mesh>
        <sphereGeometry args={args} />
        <meshStandardMaterial
          color={surfaceColor}
          transparent
          opacity={0.6}
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={args} />
        <meshStandardMaterial
          color={wireColor}
          wireframe
          transparent
          opacity={0.9}
          polygonOffset
          polygonOffsetFactor={-1}
        />
      </mesh>
    </group>
  )
}

export default GlobeMesh
