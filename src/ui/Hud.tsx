import { useMemo } from 'react'
import { useActiveSamples, usePlayState, formatAltitude, formatLatLon, formatSpeed, formatTimeSeconds } from '@/state/selectors'
import './hud.css'

function pickSample(samples: ReturnType<typeof useActiveSamples>, t: number) {
  if (!samples.length) return null
  let last = samples[0]
  for (let i = 1; i < samples.length; i += 1) {
    const s = samples[i]
    if (s.t > t) break
    last = s
  }
  return last
}

export function Hud() {
  const samples = useActiveSamples()
  const { currentTime } = usePlayState()

  const currentSample = useMemo(() => pickSample(samples, currentTime), [samples, currentTime])

  const latLon = formatLatLon(currentSample?.latDeg, currentSample?.lonDeg)
  const altitude = formatAltitude(currentSample?.altMeters)
  const speed = formatSpeed(currentSample?.speedMps)
  const timeText = formatTimeSeconds(currentTime)

  return (
    <div className="hud">
      <div className="hud-block">
        <p className="hud-label">Lat / Lon</p>
        <p className="hud-value">{latLon}</p>
      </div>
      <div className="hud-block">
        <p className="hud-label">Altitude</p>
        <p className="hud-value">{altitude}</p>
      </div>
      <div className="hud-block">
        <p className="hud-label">Speed</p>
        <p className="hud-value">{speed}</p>
      </div>
      <div className="hud-block">
        <p className="hud-label">Time</p>
        <p className="hud-value">{timeText}</p>
      </div>
    </div>
  )
}

export default Hud
