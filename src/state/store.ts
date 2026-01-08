import { create } from 'zustand'
import type { TelemetryDataset } from '@/data/types'

export type PlayState = {
  playing: boolean
  speed: number
  currentTime: number
}

export type UiToggles = {
  showGrid: boolean
  showSurfaceTrack: boolean
  showAltitudeTrack: boolean
  showMercatorInset: boolean
  showAltitudeInset: boolean
  showSatelliteTexture: boolean
}

export type StoreState = {
  datasets: TelemetryDataset[]
  selectedDatasetId?: string
  playState: PlayState
  uiToggles: UiToggles
  satelliteTextureUrl: string

  setDatasets: (datasets: TelemetryDataset[]) => void
  selectDataset: (id: string | undefined) => void
  play: () => void
  pause: () => void
  setSpeed: (speed: number) => void
  setCurrentTime: (t: number) => void
  toggleUi: (key: keyof UiToggles) => void
  resetPlayback: () => void
  setSatelliteTextureUrl: (url: string) => void
}




const defaultDataset: TelemetryDataset = {
  id: 'sample_shuttle',
  name: 'Sample Shuttle Reentry',
  description: 'Bundled demo telemetry for globe playback',
  source: 'bundled',
  timeBase: 'seconds',
  samples: [
    { t: 0, latDeg: 28.5, lonDeg: -80.6, altMeters: 82000 },
    { t: 30, latDeg: 30.1, lonDeg: -79.5, altMeters: 78000 },
    { t: 60, latDeg: 31.4, lonDeg: -78.0, altMeters: 72000 },
    { t: 90, latDeg: 33.0, lonDeg: -76.0, altMeters: 65000 },
    { t: 120, latDeg: 34.2, lonDeg: -73.4, altMeters: 55000 },
    { t: 150, latDeg: 35.0, lonDeg: -70.8, altMeters: 44000 },
    { t: 180, latDeg: 35.7, lonDeg: -68.1, altMeters: 32000 },
    { t: 210, latDeg: 36.1, lonDeg: -65.5, altMeters: 21000 },
    { t: 240, latDeg: 36.4, lonDeg: -63.0, altMeters: 12000 },
    { t: 270, latDeg: 36.6, lonDeg: -61.2, altMeters: 7000 },
    { t: 300, latDeg: 36.8, lonDeg: -60.0, altMeters: 0 },
  ],
}

export const useStore = create<StoreState>((set) => ({
  datasets: [defaultDataset],
  selectedDatasetId: defaultDataset.id,
  playState: {
    playing: false,
    speed: 1,
    currentTime: 0,
  },
  uiToggles: {
    showGrid: true,
    showSurfaceTrack: true,
    showAltitudeTrack: true,
    showMercatorInset: true,
    showAltitudeInset: true,
    showSatelliteTexture: true,
  },
  satelliteTextureUrl: '/assets/blue-marble-8k.jpg',

  setDatasets: (datasets) => set((state) => ({ datasets, selectedDatasetId: datasets[0]?.id ?? state.selectedDatasetId })),
  selectDataset: (id) => set(() => ({ selectedDatasetId: id })),
  play: () => set((state) => ({ playState: { ...state.playState, playing: true } })),
  pause: () => set((state) => ({ playState: { ...state.playState, playing: false } })),
  setSpeed: (speed) => set((state) => ({ playState: { ...state.playState, speed } })),
  setCurrentTime: (t) => set((state) => ({ playState: { ...state.playState, currentTime: t } })),
  toggleUi: (key) => set((state) => ({ uiToggles: { ...state.uiToggles, [key]: !state.uiToggles[key] } })),
  setSatelliteTextureUrl: (url) => set(() => ({ satelliteTextureUrl: url })),
  resetPlayback: () =>
    set((state) => ({
      playState: {
        ...state.playState,
        currentTime: 0,
        playing: false,
      },
    })),
}))
