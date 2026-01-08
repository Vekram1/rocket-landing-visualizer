import { useCallback, useEffect, useState } from 'react'
import GlobeCanvas from '@/scene/GlobeCanvas'
import Panel from '@/ui/Panel'
import Hud from '@/ui/Hud'
import Toasts from '@/ui/Toasts'
import { usePlaybackClock } from '@/state/hooks/usePlaybackClock'
import { useUiToggles, usePlaybackActions } from '@/state/selectors'
import MercatorInset from '@/inset/MercatorInset'
import AltitudeTimeInset from '@/inset/AltitudeTimeInset'
import loadBundledMissions from '@/data/loadBundledMissions'
import './app.css'

function App() {
  const [resetSignal, setResetSignal] = useState(0)
  const [fitEnabled, setFitEnabled] = useState(true)
  const ui = useUiToggles()
  const { setDatasets, selectDataset } = usePlaybackActions()

  usePlaybackClock()

  useEffect(() => {
    loadBundledMissions()
      .then((data) => {
        if (data.length) {
          setDatasets(data)
          selectDataset(data[0].id)
        }
      })
      .catch(() => {
        /* ignore fetch failures; fallback to default store dataset */
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleResetView = useCallback(() => {
    setResetSignal((n) => n + 1)
  }, [])

  const toggleFit = useCallback(() => {
    setFitEnabled((v) => !v)
    setResetSignal((n) => n + 1)
  }, [])

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-title">Rocket Landing Visualizer</p>
          <p className="app-subtitle">Globe + telemetry playback scaffold</p>
        </div>
        <div className="app-badges">
          <span className="pill">Vite</span>
          <span className="pill">React</span>
          <span className="pill">R3F</span>
          <span className="pill">Zustand</span>
        </div>
      </header>

      <main className="app-main">
        <Panel />

        <section className="app-view">
          <div className="canvas-wrap" role="presentation">
            <GlobeCanvas
              resetSignal={resetSignal}
              fitEnabled={fitEnabled}
              showSatelliteTexture={ui.showSatelliteTexture}
            />
          </div>
          <div className="view-overlay">
            <div className="view-controls">
              <button className="chip" onClick={handleResetView}>
                Reset view
              </button>
              <button className={`chip ${fitEnabled ? 'active' : ''}`} onClick={toggleFit}>
                {fitEnabled ? 'Disable fit' : 'Enable fit'}
              </button>
            </div>

            <Hud />

            <div className="inset-stack">
              {ui.showMercatorInset && <MercatorInset />}
              {ui.showAltitudeInset && <AltitudeTimeInset />}
            </div>
          </div>
        </section>
      </main>

      <Toasts />
    </div>
  )
}

export default App
