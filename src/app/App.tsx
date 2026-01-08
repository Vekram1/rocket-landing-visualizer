import GlobeCanvas from '@/scene/GlobeCanvas'
import './app.css'

import { useCallback, useState } from 'react'

function App() {
  const [resetSignal, setResetSignal] = useState(0)
  const [fitEnabled, setFitEnabled] = useState(true)

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
        <aside className="app-panel">
          <section className="panel-section">
            <p className="section-kicker">Mission control</p>
            <h2 className="section-title">Telemetry datasets</h2>
            <div className="section-body">
              <button className="action">Select bundled mission</button>
              <button className="action ghost">Import CSV / JSON</button>
              <ul className="list">
                <li className="list-item">Sample shuttle (demo)</li>
                <li className="list-item">Local imports (empty)</li>
              </ul>
            </div>
          </section>

          <section className="panel-section">
            <p className="section-kicker">Playback</p>
            <h2 className="section-title">Timeline + speed</h2>
            <div className="section-body timeline">
              <div className="slider" aria-hidden />
              <div className="timeline-stats">
                <span>t = 00:00</span>
                <span>speed = 1x</span>
              </div>
              <div className="controls">
                <button className="chip">Play</button>
                <button className="chip">Pause</button>
                <button className="chip" onClick={handleResetView}>
                  Reset view
                </button>
                <button className={`chip ${fitEnabled ? 'active' : ''}`} onClick={toggleFit}>
                  {fitEnabled ? 'Disable fit' : 'Enable fit'}
                </button>
              </div>
            </div>
          </section>

          <section className="panel-section">
            <p className="section-kicker">Layers</p>
            <h2 className="section-title">Overlays</h2>
            <div className="chips">
              <button className="chip">Grid</button>
              <button className="chip">Surface track</button>
              <button className="chip">Altitude track</button>
              <button className="chip">Mercator inset</button>
              <button className="chip">Altitude chart</button>
            </div>
          </section>
        </aside>

        <section className="app-view">
          <div className="canvas-wrap" role="presentation">
            <GlobeCanvas resetSignal={resetSignal} fitEnabled={fitEnabled} />
          </div>
          <div className="view-overlay">
            <div className="hud">
              <div className="hud-block">
                <p className="hud-label">Lat / Lon</p>
                <p className="hud-value">0.000 / 0.000</p>
              </div>
              <div className="hud-block">
                <p className="hud-label">Altitude</p>
                <p className="hud-value">0.0 km</p>
              </div>
              <div className="hud-block">
                <p className="hud-label">Speed</p>
                <p className="hud-value">—</p>
              </div>
              <div className="hud-block">
                <p className="hud-label">Time</p>
                <p className="hud-value">00:00</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
