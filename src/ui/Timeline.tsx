import { useMemo, useCallback } from 'react'
import { useActiveSamples, usePlayState, usePlaybackActions, formatTimeSeconds } from '@/state/selectors'
import './timeline.css'

const SPEED_OPTIONS = [0.25, 0.5, 1, 2, 4]

export function Timeline() {
  const samples = useActiveSamples()
  const { playing, speed, currentTime } = usePlayState()
  const { play, pause, setSpeed, setCurrentTime, resetPlayback } = usePlaybackActions()

  const maxTime = useMemo(() => (samples.length ? samples[samples.length - 1].t : 0), [samples])

  const handleScrub = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value)
      if (Number.isNaN(value)) return
      setCurrentTime(value)
    },
    [setCurrentTime],
  )

  const handleSpeedChange = useCallback(
    (next: number) => {
      setSpeed(next)
    },
    [setSpeed],
  )

  const togglePlay = useCallback(() => {
    if (playing) pause()
    else play()
  }, [playing, pause, play])

  return (
    <div className="timeline-wrap" aria-label="Playback timeline">
      <div className="timeline-row">
        <button className="timeline-btn" onClick={togglePlay} aria-pressed={playing}>
          {playing ? 'Pause' : 'Play'}
        </button>
        <button className="timeline-btn ghost" onClick={resetPlayback}>Reset</button>
      </div>

      <div className="timeline-slider">
        <label className="timeline-label" htmlFor="timeline-range">
          Time
        </label>
        <input
          id="timeline-range"
          type="range"
          min={0}
          max={maxTime}
          step={0.1}
          value={Math.min(currentTime, maxTime)}
          onChange={handleScrub}
          disabled={maxTime === 0}
          aria-valuetext={`${formatTimeSeconds(currentTime)} of ${formatTimeSeconds(maxTime)}`}
        />
        <div className="timeline-times">
          <span>{formatTimeSeconds(0)}</span>
          <span>{formatTimeSeconds(currentTime)}</span>
          <span>{formatTimeSeconds(maxTime)}</span>
        </div>
      </div>

      <div className="timeline-speeds" role="group" aria-label="Playback speed">
        {SPEED_OPTIONS.map((opt) => (
          <button
            key={opt}
            className={`chip ${opt === speed ? 'active' : ''}`}
            onClick={() => handleSpeedChange(opt)}
            aria-pressed={opt === speed}
          >
            {opt}x
          </button>
        ))}
      </div>
    </div>
  )
}

export default Timeline
