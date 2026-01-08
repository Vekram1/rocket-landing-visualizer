import { useMemo, Suspense, useEffect, useRef, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import GlobeMesh from './GlobeMesh'
import GridLayer from './GridLayer'
import TrajectoryLayer from './TrajectoryLayer'
import VehicleMarker from './VehicleMarker'
import type { TrajectorySegment } from './TrajectoryLayer'
import type { TelemetryDataset } from '@/data/types'

const shuttleData = (await import('../../public/data/sample_shuttle.json')).default as TelemetryDataset

type GlobeCanvasProps = {
  resetSignal?: number
}

function buildTrajectory(dataset: TelemetryDataset): TrajectorySegment[] {
  if (!dataset.samples?.length) return []
  const positions: [number, number, number][] = dataset.samples.map((s) => {
    const phi = (90 - s.latDeg) * (Math.PI / 180)
    const theta = s.lonDeg * (Math.PI / 180)
    const x = Math.sin(phi) * Math.cos(theta)
    const y = Math.cos(phi)
    const z = Math.sin(phi) * Math.sin(theta)
    const radius = 1 + (s.altMeters ?? 0) / 120_000 // quick exaggeration at reentry scales
    return [x * radius, y * radius, z * radius]
  })

  return [
    {
      id: dataset.id,
      positions,
      color: dataset.style?.color ?? '#7ef3ff',
      width: 2,
    },
  ]
}

export function GlobeCanvas({ resetSignal = 0 }: GlobeCanvasProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const trajectories = useMemo(() => buildTrajectory(shuttleData), [])
  const markerPosition = useMemo<[number, number, number]>(
    () => trajectories[0]?.positions.at(-1) ?? [0, 0, 0],
    [trajectories],
  )

  const resetView = useCallback(() => {
    const controls = controlsRef.current
    if (!controls) return
    controls.object.position.set(0, 0, 3.2)
    controls.target.set(0, 0, 0)
    controls.update()
  }, [])

  useEffect(() => {
    resetView()
  }, [resetSignal, resetView])

  return (
    <Canvas camera={{ position: [0, 0, 3.2], fov: 50 }} dpr={[1, 2]}>
      <color attach="background" args={[0.05, 0.07, 0.11]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 2, 5]} intensity={0.9} />
      <Suspense fallback={null}>
        <GlobeMesh />
        <GridLayer />
        <TrajectoryLayer trajectories={trajectories} />
        <VehicleMarker position={markerPosition} />
      </Suspense>
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={1.5}
        maxDistance={6}
      />
    </Canvas>
  )
}

export default GlobeCanvas
