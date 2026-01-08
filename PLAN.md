# Rocket/Space-Shuttle Trajectory Globe — Project PLAN

## 1) Overview & Goals
- Browser-first interactive globe (Three.js + TypeScript) with dark theme, wireframe Earth, orbit/zoom, bright trajectories, and dual insets: Mercator mini-map and altitude-vs-time strip.
- Load local telemetry (JSON/CSV), normalize, and animate a marker along the path. Primary focus on reentry altitudes (0–120 km) with sensible altitude exaggeration defaults.
- Ship as static web app (Vite + TS + React + R3F + Drei + Zustand). Future Tauri wrapper reuses the same bundle.

## 2) Personas & Primary Use Cases
- Casual viewer: instant demo mission, play/pause, clean visuals.
- Space nerd / educator: compare missions, toggle insets/layers, speed control.
- Engineer / analyst: precise timeline, data readouts, robust file import & validation.
- Developer: modular architecture, clear schema, predictable build/test workflows.

## 3) Core UX Flows
- Landing → sample mission auto-load → orbit/zoom → play → scrub timeline.
- Mission picker → load bundled dataset → fit camera → play/reset timeline.
- File import (JSON/CSV) → validate/normalize → appear under "Local Imports" → select and play; errors surface with details.
- Playback: play/pause, scrub, speed select, HUD readouts (t, lat, lon, alt, speed if present), optional camera reset/fit.
- Layer toggles: grid, surface vs altitude track, trajectory visibility, Mercator inset, altitude-time inset, satellite view toggle, great-circle vs rhumb-line overlay.
- Camera: orbit controls + "Reset View" + "Fit to trajectory" preset.

## 4) Visualization Design
- Globe: unit sphere (R=1); orientation: +Y = north, +X = lon = 0 (Greenwich on equator); altitude scaled by configurable exaggeration (default tuned for reentry 0–120 km); toggleable satellite-texture view.
- Grid: explicit lat/lon line meshes (Line2 for consistent thickness); highlight equator/prime meridian.
- Trajectory: polyline (Line2 or thin Line fallback); bright per-trajectory color; optional surface track; split at anti-meridian; handle time gaps.
- Marker: glowing sprite/small emissive sphere; linear time interpolation; optional short trailing segment.
- Mercator inset: bottom-right mini-map using Canvas2D (or lightweight Three); projection clamped near poles; mirrors trajectory + marker; handles anti-meridian splits.
- Altitude-time inset: 2D plot with time on x-axis, altitude (km) on y-axis; shows current time cursor; optional shading for below-ground.

## 5) Data Model
- Dataset: `id`, `name`, `description`, `source (bundled|localFile)`, `timeBase`, `samples[]`, `style`, `bounds`.
- TelemetrySample: `t` (seconds from start), `latDeg`, `lonDeg`, `altMeters`; optional `speedMps`, `attitude`, etc.
- Normalization: parse → validate (ranges, required fields) → normalize time to seconds-from-start → normalize lon range → fill missing alt=0 → compute bounds and derived buffers (3D positions, 2D Mercator points, altitude-time arrays).
- Formats: JSON (object with `samples` or array), CSV (header required: time/lat/lon; alt optional); header aliasing for common names.

## 6) Architecture (React + R3F + Drei + Zustand)
- Rationale: declarative scene composition, strong UI ecosystem, shared bundle for Tauri.
- Rendering layer:
  - `GlobeScene` with `GlobeMesh`, `GridLayer`, multiple `TrajectoryPath`s, `VehicleMarker`, minimal `Lighting`, `CameraRig`, `OrbitControls`.
  - Insets: `MercatorInset` (Canvas2D) and `AltitudeTimeInset` (Canvas2D/SVG).
- Data layer:
  - Parsers: `parseCsvTelemetry`, `parseJsonTelemetry`.
  - Normalizer/validator: `normalizeTelemetry`, `validateTelemetry`.
  - Bundled mission loader: `loadBundledMissions`.
- State (Zustand):
  - `datasets`, `selectedDatasetId`, `overlays[]`, `playState` (playing, speed, currentTime), `uiToggles` (grid, surface/altitude, inset on/off), `camera presets`.
- Playback:
  - `usePlaybackClock` with rAF, honoring speed/pause, clamps to dataset duration.
  - HUD values derived from interpolated sample at current time.

## 7) Project Structure (Repo)
```
/
  index.html
  package.json
  vite.config.ts
  tsconfig.json
  public/
    data/
      missions.json          # manifest of bundled datasets
      sample_shuttle.json
      sample_rocket.csv
    assets/
      favicon.svg
  src/
    main.tsx
    app/App.tsx
    ui/
      Panel.tsx              # left panel shell
      Timeline.tsx           # play/pause/scrub/speed
      DatasetPicker.tsx
      LayerToggles.tsx
      FileImportButton.tsx
      Hud.tsx
      Toasts.tsx
    scene/
      GlobeCanvas.tsx        # R3F Canvas + scene composition
      CameraRig.tsx
      Controls.tsx           # OrbitControls config
      GlobeMesh.tsx
      GridLayer.tsx
      TrajectoryLayer.tsx    # manages multiple trajectories
      TrajectoryPath.tsx     # single path render
      VehicleMarker.tsx
    inset/
      MercatorInset.tsx
      mercatorMath.ts
      insetRenderer.ts       # Canvas2D drawing
      AltitudeTimeInset.tsx
      altitudePlot.ts        # Canvas/SVG render helpers
    data/
      types.ts
      loadBundledMissions.ts
      importTelemetry.ts
      parseCsv.ts
      parseJson.ts
      normalize.ts
      validate.ts
    math/
      geo.ts                 # lat/lon → xyz, lon normalization
      interpolation.ts       # time interpolation
      bounds.ts              # dataset bounds
    state/
      store.ts
      selectors.ts
    theme/
      colors.ts
      styles.css
```

## 8) Desktop GUI Path (Tauri)
- Wrap Vite build; Rust handles file dialogs and optional persistence of settings.
- Future: Rust parsing for very large files; shared normalized dataset contract.
- “Open Telemetry File…” in Tauri: Rust dialog → bytes → front-end normalization (or Rust returns normalized payload later).

## 9) Performance & Quality
- Target datasets: 1k–50k samples typical; escape hatches for 200k+ (thin lines, decimation, Web Worker later).
- Precompute geometries; per-frame only interpolate marker and HUD.
- Anti-meridian splitting for both 3D and 2D.
- Altitude exaggeration defaults for reentry; user-adjustable.
- Throttle HUD updates if needed; keep bundle lean (selective Drei usage).

## 10) Incremental Milestones
- M1: Vite+React+R3F scaffold; dark globe, orbit controls, reset view.
- M2: GridLayer; bundled sample trajectory; geo conversion; basic trajectory render.
- M3: Timeline store + controls; VehicleMarker with interpolation; HUD.
- M4: File import (JSON/CSV) + validation/normalization; error toasts; local dataset registry.
- M5 (next): Satellite imagery globe material with a toggle between wireframe/dark and satellite view.
- M6: Mercator inset (Canvas2D), anti-meridian handling; marker sync; inset toggle.
- M7: Altitude-time inset; time cursor synced; style polish; fit-to-trajectory.
- M8: Layer toggles (grid, surface/altitude tracks, overlays), great-circle vs rhumb-line reference.
- M9: Tauri wrapper prep: build pipeline, dialog API surface, config persistence.

## 11) Risks, Open Questions, Nice-to-haves
- Risks: Line2 perf/appearance variance; very large CSV stalls (may need Worker); anti-meridian edge cases.
- Open decisions: lon range choice (`[-180,180)` vs `[0,360)`); default altitude exaggeration curve for reentry; allow pan in OrbitControls.
- Nice-to-haves: gradient by altitude/time, camera follow with smoothing, velocity/attitude vectors, sharing snapshots/URLs, decimation for huge logs.

## Confirmed Preferences (per your answers)
- Globe orientation: +Y = north, +X = lon = 0.
- Primary dataset type: reentry; tune defaults for 0–120 km.
- Insets: Mercator mini-map + altitude-time chart.
- UI layout: screenshot-style left control panel.
