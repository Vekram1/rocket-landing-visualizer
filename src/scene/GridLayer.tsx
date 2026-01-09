import { Line } from '@react-three/drei'
import { useMemo } from 'react'

const DEG2RAD = Math.PI / 180

type Triplet = [number, number, number]

function buildLines(step = 15) {
  const latLines: Triplet[][] = []
  const lonLines: Triplet[][] = []

  for (let lat = -90; lat <= 90; lat += step) {
    const pts: Triplet[] = []
    for (let lon = -180; lon <= 180; lon += 5) {
      const phi = (90 - lat) * DEG2RAD
      const theta = lon * DEG2RAD
      const x = Math.sin(phi) * Math.cos(theta)
      const y = Math.cos(phi)
      const z = Math.sin(phi) * Math.sin(theta)
      pts.push([x, y, z])
    }
    latLines.push(pts)
  }

  const lonValues: number[] = []
  for (let lon = -180; lon < 180; lon += step) {
    lonValues.push(lon)
  }
  if (!lonValues.some((lon) => Math.abs(lon) < 1e-6)) {
    lonValues.push(0)
  }
  lonValues.sort((a, b) => a - b)

  lonValues.forEach((lon) => {
    const pts: Triplet[] = []
    for (let lat = -90; lat <= 90; lat += 5) {
      const phi = (90 - lat) * DEG2RAD
      const theta = lon * DEG2RAD
      const x = Math.sin(phi) * Math.cos(theta)
      const y = Math.cos(phi)
      const z = Math.sin(phi) * Math.sin(theta)
      pts.push([x, y, z])
    }
    lonLines.push(pts)
  })

  return { latLines, lonLines }
}

export type GridLayerProps = {
  step?: number
  color?: string
  highlightColor?: string
  lineWidth?: number
}

export function GridLayer({ step = 15, color = '#324260', highlightColor = '#7ef3ff', lineWidth = 2 }: GridLayerProps) {
  const { latLines, lonLines } = useMemo(() => buildLines(step), [step])

  return (
    <group>
      {latLines.map((pts, i) => {
        const isEquator = Math.abs(-90 + i * step) < 1e-3
        return (
          <Line
            key={`lat-${i}`}
            points={pts}
            color={isEquator ? highlightColor : color}
            lineWidth={isEquator ? lineWidth * 1.4 : lineWidth}
            dashed={false}
          />
        )
      })}

      {lonLines.map((pts, i) => {
        const lonDeg = 0 + i * step
        // const isPrime = Math.abs(lonDeg) < 1e-3
        const isPrime = Math.abs(lonDeg) < 185 && Math.abs(lonDeg) > 175
        return (
          <Line
            key={`lon-${i}`}
            points={pts}
            color={isPrime ? highlightColor : color}
            lineWidth={isPrime ? lineWidth * 1.4 : lineWidth}
            dashed={false}
          />
        )
      })}
    </group>
  )
}

export default GridLayer
