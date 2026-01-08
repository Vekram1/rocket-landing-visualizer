import { useUiActions, useUiToggles } from '@/state/selectors'
import './layerToggles.css'

const TOGGLES: { key: keyof ReturnType<typeof useUiToggles>; label: string }[] = [
  { key: 'showGrid', label: 'Grid' },
  { key: 'showSurfaceTrack', label: 'Surface track' },
  { key: 'showAltitudeTrack', label: 'Altitude track' },
  { key: 'showMercatorInset', label: 'Mercator inset' },
  { key: 'showAltitudeInset', label: 'Altitude chart' },
]

export function LayerToggles() {
  const toggles = useUiToggles()
  const { toggleUi } = useUiActions()

  return (
    <div className="layer-toggles" role="group" aria-label="Layer toggles">
      {TOGGLES.map(({ key, label }) => (
        <button
          key={key}
          className={`chip ${toggles[key] ? 'active' : ''}`}
          onClick={() => toggleUi(key)}
          aria-pressed={toggles[key]}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default LayerToggles
