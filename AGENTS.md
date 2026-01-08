# AGENTS GUIDE
For: rocket-landing-visualizer (Vite/React/TS/R3F/Zustand globe demo).
Audience: agentic contributors; prioritize accuracy over speed.
Status: source tree not present; follow PLAN.md layout when (re)hydrating.
Cursor/Copilot rules: none found (.cursor, .cursorrules, .github/copilot-instructions.md absent).
PLAN.md is the source of truth for structure and UX; keep aligned.
Security: no secrets; avoid leaking local paths in UI/logs.
Branch hygiene: small commits with context; no force pushes unless told.
Node toolchain: prefer pnpm>npm>yarn; if lockfile exists, obey it.
Package manager assumption: until lockfile exists, default to npm.
Install: npm install
Dev server: npm run dev
Build: npm run build (Vite production bundle).
Preview: npm run preview
Lint: npm run lint (ESLint; add --fix for autofix when safe).
Type-check: npm run typecheck (vite-tsconfig-paths/tsc --noEmit typical).
Tests: npm test (Vitest expected); single test: npm test -- <pattern> or npm test -- --runInBand <pattern> if jest.
Coverage: npm test -- --coverage.
Playwright/E2E: none defined unless package scripts added later.
Formatting: npm run format if configured; otherwise use prettier defaults (printWidth 100, semicolons on, singleQuote false unless repo sets otherwise).
Lockfiles: commit the chosen lock once created; do not mix managers.
Node version: prefer LTS (18/20); record in .nvmrc if added.
Build artifacts: output under dist/ (Vite default); do not commit dist/.
Environment: frontend only; keep future Tauri path in mind.
Data: bundled samples expected under public/data; treat as immutable fixtures.
Static assets: public/assets holds favicon and future textures; keep small.
Source root: src/ with main.tsx entrypoint; App.tsx under src/app.
UI layout: dark theme; left control panel; R3F canvas main view.
Scenes: GlobeCanvas orchestrates GlobeMesh, GridLayer, TrajectoryLayer, VehicleMarker.
Insets: MercatorInset + AltitudeTimeInset using Canvas2D/SVG.
Data pipeline: parseCsv.ts, parseJson.ts, normalize.ts, validate.ts under src/data.
State: Zustand store.ts/selectors.ts controlling datasets, playback, overlays.
Math: geo.ts (lat/lon->xyz), interpolation.ts, bounds.ts under src/math.
Theme: colors.ts + styles.css under src/theme.
File import UX: FileImportButton triggers importTelemetry; errors surface via toasts.
Playback: usePlaybackClock (rAF); clamp to dataset duration; speed control.
Trajectories: Line2 preferred; handle anti-meridian splits; altitude exaggeration default to reentry ranges.
HUD: readouts of time, lat, lon, altitude, speed if available.
Camera: orbit controls; Reset View and Fit to trajectory helpers.
Nice-to-haves: gradient by altitude/time, velocity vectors, decimation for huge logs.
Testing priorities: normalize/validate functions, mercator math, altitude plot scales, playback clock.
Vitest patterns: describe blocks per module; prefer pure helpers to be unit tested.
React testing: use @testing-library/react if added; prefer user-centric assertions.
Three.js pieces: test math utils directly; avoid DOM canvas in unit tests unless using jsdom mocks.
Data fixtures: place sample telemetry under src/data/__fixtures__/; keep small.
TypeScript: enable strict; no implicit any; prefer readonly where possible.
Imports: use absolute path aliases via tsconfig paths if configured; otherwise relative with index clarity.
Import order: built-ins -> external -> internal absolute -> relative; keep side-effect imports separate.
React components: functional components with hooks; avoid default exports except entrypoints.
Props typing: define Props interfaces/types near component; prefer exact shape, avoid `any`.
State management: Zustand slices; keep selectors memoized; avoid anonymous inline selectors in components to prevent rerenders.
Derived data: compute with useMemo when heavy; avoid recomputing geo transforms per frame.
Asynchronicity: prefer async/await; wrap await in try/catch with user-facing toasts for import errors.
Error handling: validation errors should be user-readable; log technical details to console with context tags.
Null safety: guard optional fields (speedMps, attitude) before display; fallback to '—' in HUD.
Date/time: telemetry times are seconds-from-start; avoid Date unless source requires; prefer number comparisons.
Units: keep lat/lon in degrees until conversion; alt in meters; document conversions.
Normalization: clamp lon to [-180,180) or [0,360) consistently; note choice in normalize.ts.
Interpolation: linear interpolation for marker; handle gaps by pausing or skipping segments.
Performance: precompute Line2 geometry buffers; avoid per-frame object creation.
Memory: avoid retaining raw CSV strings post-parse; store normalized arrays.
Rendering: prefer useFrame hooks for rAF; keep GPU state stable; avoid shader complexity unless necessary.
Styling: CSS under src/theme/styles.css; prefer CSS variables for theme colors; avoid inline styles except quick overrides.
Color palette: dark base; bright trajectory colors; ensure contrast for HUD text.
Animation: subtle; avoid layout thrash; camera transitions eased but short.
Accessibility: keyboard focus on controls; aria-label for buttons (play/pause/import/toggles).
Responsive: ensure panel and canvas adapt; min widths; inset placement mobile-safe.
File structure blueprint (from PLAN.md):
/index.html
/package.json
/vite.config.ts
/tsconfig.json
/public/data/missions.json
/public/data/sample_shuttle.json
/public/data/sample_rocket.csv
/public/assets/favicon.svg
/src/main.tsx
/src/app/App.tsx
/src/ui/Panel.tsx
/src/ui/Timeline.tsx
/src/ui/DatasetPicker.tsx
/src/ui/LayerToggles.tsx
/src/ui/FileImportButton.tsx
/src/ui/Hud.tsx
/src/ui/Toasts.tsx
/src/scene/GlobeCanvas.tsx
/src/scene/CameraRig.tsx
/src/scene/Controls.tsx
/src/scene/GlobeMesh.tsx
/src/scene/GridLayer.tsx
/src/scene/TrajectoryLayer.tsx
/src/scene/TrajectoryPath.tsx
/src/scene/VehicleMarker.tsx
/src/inset/MercatorInset.tsx
/src/inset/mercatorMath.ts
/src/inset/insetRenderer.ts
/src/inset/AltitudeTimeInset.tsx
/src/inset/altitudePlot.ts
/src/data/types.ts
/src/data/loadBundledMissions.ts
/src/data/importTelemetry.ts
/src/data/parseCsv.ts
/src/data/parseJson.ts
/src/data/normalize.ts
/src/data/validate.ts
/src/math/geo.ts
/src/math/interpolation.ts
/src/math/bounds.ts
/src/state/store.ts
/src/state/selectors.ts
/src/theme/colors.ts
/src/theme/styles.css
Use this map when rehydrating the repository.
Config files to add soon: eslint config (.eslintrc.cjs), prettier (.prettierrc), vite config, tsconfig paths.
Git ignores: add node_modules, dist, .DS_Store, coverage, .vite.
Data validation: reject rows missing time/lat/lon; altitude optional default 0; provide error line numbers.
CSV parsing: use papaparse or custom; trim headers; support aliases for time/lat/lon/alt.
JSON parsing: accept object with samples array or top-level array; validate shape.
Normalization outputs: computed positions (Vec3), mercator points, altitude-time arrays, bounds for camera fit.
Play/pause: global store with speed multipliers; timeline scrub updates currentTime; clamp to dataset duration.
Inset sync: mercator and altitude chart use same currentTime; show cursor at playback time.
Camera fit: compute bounding sphere from trajectory bounds; set dolly distance with padding.
Layer toggles: grid on/off, surface track, altitude track, overlays, inset toggles.
Overlays: allow great-circle vs rhumb-line references; keep optional to reduce clutter.
Colors: emphasize bright trajectory lines; use glow for marker; avoid purple default if not desired.
HUD formatting: clamp decimals (lat/lon to 3-4 dp, altitude in km with 1 dp).
Units display: show alt in km; speed in m/s if present.
Telemetry gaps: if delta t too large, consider splitting segments; avoid straight-line jumps.
Anti-meridian: split lines crossing +-180; keep mercator projection aware of wrapping.
Altitude exaggeration: default tuned for 0–120 km; expose UI slider.
Performance guardrails: throttle HUD updates, memoize geometry, dispose unused buffers.
Event handling: debounce resize and camera fit triggers; prefer requestAnimationFrame for continuous updates.
Logging: prefix with [telemetry], [render], [state]; avoid console noise in production builds.
Error surfaces: toast for user-facing errors; console.error for dev detail; avoid throwing in render.
Accessibility testing: tab through panel; ensure focus styles visible on dark theme.
Internationalization: not required; keep text strings centralized for future i18n.
Tauri path: keep file imports abstract; avoid direct File API coupling; design for Rust bridge later.
CI: add GitHub Actions later with npm ci, lint, test, build; keep caches keyed by lockfile.
Code review checklist: types strict, no silent catch, handle NaNs, avoid mutable shared state, test math edge cases.
Definition of done: lint+typecheck clean; tests passing; UX baseline preserved per PLAN.
When adding dependencies: justify, keep bundle lean; prefer Drei utilities already used.
When adding shaders: isolate under src/shaders; document uniforms and expectations.
When adding assets: compress; prefer SVG for icons; keep textures optimized.
When adding hooks: co-locate under src/hooks; write unit tests for pure hooks.
When updating PLAN-driven structure, update this guide concurrently.
If unknowns: ask maintainers; avoid speculative architecture drift.
If scripts missing: define npm scripts aligned to above commands before coding.
If repo remains sparse: scaffold Vite (npm create vite@latest) matching TS+React; commit structure.
Keep AGENTS.md updated when commands/config change.
You are done reading the rules—execute carefully and document changes.

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
When you believe a bead is complete:

   1. Ensure your changes are consistent with PLAN.md and AGENTS.md.
   2. Update the corresponding bead YAML:
      - Set `status: done`.
      - Add any relevant notes if needed.
   3. In your reply, ALWAYS include:
      - A short summary of what you changed.
      - A suggested commit message.
      - The exact git commands the human should run, for example:

      - Run tests/linters/build as appropriate.
      - Then:

         git add .
         git commit -m "<suggested message>"
         git pull --rebase
         bd sync
         git push
         git status

Agents MUST NOT assume they can run these commands themselves; they only propose them.

5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
Use 'bd' for task tracking
