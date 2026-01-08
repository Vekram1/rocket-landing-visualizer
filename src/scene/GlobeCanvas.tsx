import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import GlobeMesh from './GlobeMesh'

export function GlobeCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 3.2], fov: 50 }} dpr={[1, 2]}>
      <color attach="background" args={[0.05, 0.07, 0.11]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 2, 5]} intensity={0.9} />
      <Suspense fallback={null}>
        <GlobeMesh />
      </Suspense>
      <OrbitControls enablePan={false} enableDamping dampingFactor={0.08} minDistance={1.5} maxDistance={6} />
    </Canvas>
  )
}

export default GlobeCanvas
