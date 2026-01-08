import type { MissionManifestEntry, TelemetryDataset } from '@/data/types'

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<T>
}

export async function loadBundledMissions(baseUrl?: string): Promise<TelemetryDataset[]> {
  const root = baseUrl ?? (typeof window !== 'undefined' ? window.location.origin : 'http://localhost')
  const manifestUrl = new URL('/data/missions.json', root).toString()
  const manifest = await fetchJson<MissionManifestEntry[]>(manifestUrl)

  const datasets: TelemetryDataset[] = await Promise.all(
    manifest.map(async (entry) => {
      const fileUrl = new URL(entry.file, root).toString()
      const data = await fetchJson<TelemetryDataset>(fileUrl)
      return {
        ...data,
        id: entry.id ?? data.id,
        name: entry.name ?? data.name,
        description: entry.description ?? data.description,
        source: 'bundled' as const,
        style: {
          ...data.style,
          color: entry.color ?? data.style?.color,
        },
      }
    }),
  )

  return datasets
}

export default loadBundledMissions
