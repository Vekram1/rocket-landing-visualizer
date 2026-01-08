import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'

function PlaceholderGlobe() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#2a76ff" wireframe opacity={0.5} transparent />
      </mesh>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 2, 5]} intensity={0.9} />
    </group>
  )
}

export function GlobeCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 3.2], fov: 50 }} dpr={[1, 2]}>
      <color attach="background" args={[0.05, 0.07, 0.11]} />
      <Suspense fallback={null}>
        <PlaceholderGlobe />
      </Suspense>
      <OrbitControls enablePan={false} enableDamping dampingFactor={0.08} minDistance={1.5} maxDistance={6} />
    </Canvas>
  )
}

export default GlobeCanvas
