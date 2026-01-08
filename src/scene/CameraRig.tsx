import { useEffect } from 'react'
import { Vector3 } from 'three'
import type { TelemetrySample } from '@/data/types'
import { latLonToCartesian } from '@/math/geo'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

export type CameraRigProps = {
  samples: TelemetrySample[]
  controlsRef?: React.RefObject<OrbitControlsImpl | null>
  padding?: number
  resetSignal?: number
}

function computeFit(samples: TelemetrySample[]): { center: Vector3; radius: number } {
  const center = new Vector3()
  const pts: Vector3[] = samples.map((s) => {
    const radius = 1 + (s.altMeters ?? 0) / 120_000
    const { x, y, z } = latLonToCartesian(s.latDeg, s.lonDeg, radius)
    return new Vector3(x, y, z)
  })

  pts.forEach((p) => center.add(p))
  if (pts.length) {
    center.divideScalar(pts.length)
  }

  let maxRadius = 1
  pts.forEach((p) => {
    maxRadius = Math.max(maxRadius, p.distanceTo(center))
  })

  return { center, radius: maxRadius }
}

export function CameraRig({ samples, controlsRef, padding = 1.6, resetSignal = 0 }: CameraRigProps) {
  useEffect(() => {
    if (!samples.length) return
    const { center, radius } = computeFit(samples)
    const controls = controlsRef?.current

    const distance = radius * padding || 3.2
    const camera = controls?.object

    if (camera) {
      camera.position.copy(center.clone().add(new Vector3(0, 0, distance)))
      camera.lookAt(center)
      camera.updateProjectionMatrix()
    }

    if (controls?.target) {
      controls.target.copy(center)
      controls.update()
    }
  }, [samples, controlsRef, padding, resetSignal])

  return null
}

export default CameraRig
