const MAX_LAT = 85.05112878

export function clampLat(latDeg: number): number {
  return Math.max(-MAX_LAT, Math.min(MAX_LAT, latDeg))
}

export function toMercator(latDeg: number, lonDeg: number): { x: number; y: number } {
  const clampedLat = clampLat(latDeg)
  const latRad = (clampedLat * Math.PI) / 180
  const lonRad = (lonDeg * Math.PI) / 180
  const x = lonRad
  const y = Math.log(Math.tan(Math.PI / 4 + latRad / 2))
  return { x, y }
}

export function wrapLon(lonDeg: number): number {
  return ((lonDeg + 180) % 360 + 360) % 360 - 180
}

export function splitAntiMeridian(points: { x: number; y: number }[], thresholdDeg = 180): { x: number; y: number }[][] {
  if (points.length < 2) return [points]
  const segments: { x: number; y: number }[][] = []
  let current: { x: number; y: number }[] = [points[0]]

  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1]
    const cur = points[i]
    const delta = Math.abs(cur.x - prev.x)
    const thresholdRad = (thresholdDeg * Math.PI) / 180
    if (delta > thresholdRad) {
      segments.push(current)
      current = [cur]
    } else {
      current.push(cur)
    }
  }
  if (current.length) segments.push(current)
  return segments
}
