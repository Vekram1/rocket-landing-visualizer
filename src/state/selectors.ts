import { useStore } from './store'
import { useShallow } from 'zustand/react/shallow'
import type { TelemetryDataset, TelemetrySample } from '@/data/types'

export const useDatasets = () => useStore((s) => s.datasets)
export const useSelectedDatasetId = () => useStore((s) => s.selectedDatasetId)
export const usePlayState = () => useStore((s) => s.playState)
export const useUiToggles = () => useStore((s) => s.uiToggles)

export const useActiveDataset = (): TelemetryDataset | undefined => {
  return useStore((s) => s.datasets.find((d) => d.id === s.selectedDatasetId) ?? s.datasets[0])
}

export const useActiveSamples = (): TelemetrySample[] => {
  return useStore((s) => {
    const ds = s.datasets.find((d) => d.id === s.selectedDatasetId) ?? s.datasets[0]
    return ds?.samples ?? []
  })
}

export const usePlaybackActions = () => {
  return useStore(
    useShallow((s) => ({
      play: s.play,
      pause: s.pause,
      setSpeed: s.setSpeed,
      setCurrentTime: s.setCurrentTime,
      resetPlayback: s.resetPlayback,
      selectDataset: s.selectDataset,
      setDatasets: s.setDatasets,
    })),
  )
}

export const useUiActions = () => {
  return useStore(useShallow((s) => ({ toggleUi: s.toggleUi, setSatelliteTextureUrl: s.setSatelliteTextureUrl })))
}

export const useSatelliteToggle = () => {
  return useStore((s) => s.uiToggles.showSatelliteTexture)
}

export const useSatelliteTextureUrl = () => useStore((s) => s.satelliteTextureUrl)

export function formatLatLon(lat?: number, lon?: number): string {
  if (lat == null || lon == null || Number.isNaN(lat) || Number.isNaN(lon)) return '—'
  return `${lat.toFixed(3)} / ${lon.toFixed(3)}`
}

export function formatAltitude(altMeters?: number): string {
  if (altMeters == null || Number.isNaN(altMeters)) return '—'
  return `${(altMeters / 1000).toFixed(1)} km`
}

export function formatSpeed(speedMps?: number): string {
  if (speedMps == null || Number.isNaN(speedMps)) return '—'
  return `${speedMps.toFixed(0)} m/s`
}

export function formatTimeSeconds(t?: number): string {
  if (t == null || Number.isNaN(t) || t < 0) return '00:00'
  const total = Math.floor(t)
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}
