const DEG2RAD = Math.PI / 180
const RAD2DEG = 180 / Math.PI

export type Cartesian = {
  x: number
  y: number
  z: number
}

export function degToRad(deg: number): number {
  return deg * DEG2RAD
}

export function radToDeg(rad: number): number {
  return rad * RAD2DEG
}

// Normalize longitude into [-180, 180)
export function normalizeLon180(lonDeg: number): number {
  const wrapped = ((lonDeg + 180) % 360 + 360) % 360 - 180
  return wrapped === -180 ? 180 : wrapped
}

// Normalize longitude into [0, 360)
export function normalizeLon360(lonDeg: number): number {
  const wrapped = ((lonDeg % 360) + 360) % 360
  return wrapped
}

export function latLonToCartesian(latDeg: number, lonDeg: number, radius = 1): Cartesian {
  const phi = degToRad(90 - latDeg)
  const theta = degToRad(normalizeLon180(lonDeg))
  const sinPhi = Math.sin(phi)

  return {
    x: radius * sinPhi * Math.cos(theta),
    y: radius * Math.cos(phi),
    z: radius * sinPhi * Math.sin(theta),
  }
}
