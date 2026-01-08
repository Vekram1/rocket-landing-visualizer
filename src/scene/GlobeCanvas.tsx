import { useMemo, Suspense, useEffect, useRef, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import GlobeMesh from './GlobeMesh'
import GridLayer from './GridLayer'
import TrajectoryLayer from './TrajectoryLayer'
import VehicleMarker from './VehicleMarker'
import CameraRig from './CameraRig'
import Controls from './Controls'
import { useActiveSamples } from '@/state/selectors'
import type { TrajectorySegment } from './TrajectoryLayer'
import type { TelemetrySample } from '@/data/types'

type GlobeCanvasProps = {
  resetSignal?: number
  fitEnabled?: boolean
  showSatelliteTexture?: boolean
}

function buildTrajectory(samples: TelemetrySample[]): TrajectorySegment[] {
  if (!samples.length) return []
  const positions: [number, number, number][] = samples.map((s) => {
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
      id: 'active-trajectory',
      positions,
      color: '#7ef3ff',
      width: 2,
    },
  ]
}

export function GlobeCanvas({ resetSignal = 0, fitEnabled = true, showSatelliteTexture = false }: GlobeCanvasProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const samples = useActiveSamples()

  const trajectories = useMemo(() => buildTrajectory(samples), [samples])
  const markerPosition = useMemo<[number, number, number]>(
    () => trajectories[0]?.positions?.at(-1) ?? [0, 0, 0],
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
        <GlobeMesh useSatelliteTexture={showSatelliteTexture} />
        <GridLayer />
        <TrajectoryLayer trajectories={trajectories} />
        <VehicleMarker position={markerPosition} />
        {fitEnabled && samples.length > 0 && (
          <CameraRig samples={samples} controlsRef={controlsRef} resetSignal={resetSignal} />
        )}
      </Suspense>
      <Controls ref={controlsRef} />
    </Canvas>
  )
}

export default GlobeCanvas
