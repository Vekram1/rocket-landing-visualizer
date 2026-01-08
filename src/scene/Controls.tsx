import { forwardRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

export type ControlsProps = {
  enablePan?: boolean
  enableDamping?: boolean
  dampingFactor?: number
  minDistance?: number
  maxDistance?: number
}

const Controls = forwardRef<OrbitControlsImpl, ControlsProps>(
  (
    {
      enablePan = false,
      enableDamping = true,
      dampingFactor = 0.08,
      minDistance = 1.5,
      maxDistance = 6,
    },
    ref,
  ) => {
    return (
      <OrbitControls
        ref={ref}
        enablePan={enablePan}
        enableDamping={enableDamping}
        dampingFactor={dampingFactor}
        minDistance={minDistance}
        maxDistance={maxDistance}
      />
    )
  },
)

Controls.displayName = 'Controls'

export default Controls
