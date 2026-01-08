import { useCallback, useRef, useState } from 'react'
import importTelemetry from '@/data/importTelemetry'
import { useDatasets, usePlaybackActions } from '@/state/selectors'
import './fileImportButton.css'

export function FileImportButton() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const datasets = useDatasets()
  const { setDatasets, selectDataset, resetPlayback } = usePlaybackActions()

  const handleClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleFiles = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return
      try {
        setError(null)
        const dataset = await importTelemetry(file, file.name)
        const nextDatasets = [...datasets, dataset]
        setDatasets(nextDatasets)
        selectDataset(dataset.id)
        resetPlayback()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to import file'
        setError(message)
      } finally {
        event.target.value = ''
      }
    },
    [datasets, resetPlayback, selectDataset, setDatasets],
  )

  return (
    <div className="file-import">
      <button className="action ghost" onClick={handleClick}>
        Import CSV / JSON
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.json,application/json,text/csv"
        className="visually-hidden"
        onChange={handleFiles}
      />
      {error && <p className="file-import-error">{error}</p>}
    </div>
  )
}

export default FileImportButton
