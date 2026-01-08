import DatasetPicker from '@/ui/DatasetPicker'
import FileImportButton from '@/ui/FileImportButton'
import Timeline from '@/ui/Timeline'
import LayerToggles from '@/ui/LayerToggles'
import './panel.css'

export function Panel() {
  return (
    <aside className="app-panel">
      <section className="panel-section">
        <p className="section-kicker">Mission control</p>
        <h2 className="section-title">Telemetry datasets</h2>
        <div className="section-body">
          <FileImportButton />
          <DatasetPicker />
        </div>
      </section>

      <section className="panel-section">
        <p className="section-kicker">Playback</p>
        <h2 className="section-title">Timeline + speed</h2>
        <div className="section-body timeline">
          <Timeline />
        </div>
      </section>

      <section className="panel-section">
        <p className="section-kicker">Layers</p>
        <h2 className="section-title">Overlays</h2>
        <div className="section-body">
          <LayerToggles />
        </div>
      </section>
    </aside>
  )
}

export default Panel
