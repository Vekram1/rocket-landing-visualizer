import { useCallback } from 'react'
import { useDatasets, useSelectedDatasetId, usePlaybackActions } from '@/state/selectors'
import './datasetPicker.css'

export function DatasetPicker() {
  const datasets = useDatasets()
  const selectedId = useSelectedDatasetId()
  const { selectDataset, resetPlayback } = usePlaybackActions()

  const handleSelect = useCallback(
    (id: string) => {
      selectDataset(id)
      resetPlayback()
    },
    [resetPlayback, selectDataset],
  )

  if (!datasets.length) {
    return <div className="dataset-picker empty">No datasets loaded</div>
  }

  return (
    <div className="dataset-picker" role="list" aria-label="Telemetry datasets">
      {datasets.map((ds) => {
        const isActive = ds.id === selectedId
        return (
          <button
            key={ds.id}
            className={`dataset-card ${isActive ? 'active' : ''}`}
            role="listitem"
            aria-pressed={isActive}
            onClick={() => handleSelect(ds.id)}
          >
            <div className="dataset-name">{ds.name}</div>
            {ds.description && <div className="dataset-desc">{ds.description}</div>}
            <div className="dataset-meta">
              <span className="pill">{ds.source}</span>
              <span className="pill subtle">{ds.samples.length} samples</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default DatasetPicker
