import { create } from 'zustand'
import type { TelemetryDataset } from '@/data/types'
import sampleShuttle from '../../public/data/sample_shuttle.json'

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
}

export type StoreState = {
  datasets: TelemetryDataset[]
  selectedDatasetId?: string
  playState: PlayState
  uiToggles: UiToggles

  setDatasets: (datasets: TelemetryDataset[]) => void
  selectDataset: (id: string | undefined) => void
  play: () => void
  pause: () => void
  setSpeed: (speed: number) => void
  setCurrentTime: (t: number) => void
  toggleUi: (key: keyof UiToggles) => void
  resetPlayback: () => void
}

const defaultDataset: TelemetryDataset = {
  ...sampleShuttle,
  source: 'bundled',
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
  },

  setDatasets: (datasets) => set((state) => ({ datasets, selectedDatasetId: datasets[0]?.id ?? state.selectedDatasetId })),
  selectDataset: (id) => set(() => ({ selectedDatasetId: id })),
  play: () => set((state) => ({ playState: { ...state.playState, playing: true } })),
  pause: () => set((state) => ({ playState: { ...state.playState, playing: false } })),
  setSpeed: (speed) => set((state) => ({ playState: { ...state.playState, speed } })),
  setCurrentTime: (t) => set((state) => ({ playState: { ...state.playState, currentTime: t } })),
  toggleUi: (key) => set((state) => ({ uiToggles: { ...state.uiToggles, [key]: !state.uiToggles[key] } })),
  resetPlayback: () =>
    set((state) => ({
      playState: {
        ...state.playState,
        currentTime: 0,
        playing: false,
      },
    })),
}))
