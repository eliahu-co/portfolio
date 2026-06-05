export type FileRow = {
  id: string
  name: string
  version: 1 | 2
  updated: string
  by: string
  isTarget?: boolean
}

export const FILE_ROWS: FileRow[] = [
  { id: 'narrative', name: '2025-0829 - P1016 Bulletin 1 - Change Narrative.pdf', version: 1, updated: 'Sep 4, 2025 10:59', by: 'Ronit Haquim' },
  { id: 'drawings',  name: '2025-0829 - P1016 Bulletin 1 - Drawings.pdf',          version: 1, updated: 'Sep 4, 2025 11:00', by: 'Ronit Haquim', isTarget: true },
  { id: 'approved',  name: '2025-0829 - P1016 Bulletin 1 - Drawings - APPROVED.pdf', version: 1, updated: 'Sep 10, 2025 12:04', by: 'Ronit Haquim' },
]

export type ChangeType = 'added' | 'modified' | 'removed'

export type Change = {
  id: string
  type: ChangeType
  title: string
  description: string
  crop: string                       // SVG viewBox "minX minY w h" for thumbnail
  marker: { x: number; y: number }   // marker chip center in plan coords
}

export const CHANGES: Change[] = [
  { id: 'doors',    type: 'added',    title: 'Doors added',                 description: '2 doors added to Corridor.',                       crop: '0 0 100 100', marker: { x: 0, y: 0 } },
  { id: 'bedroom3', type: 'modified', title: 'Bedroom 3 boundary modified', description: 'Partition shifted — area 138 SF → 149 SF (+8%).',   crop: '0 0 100 100', marker: { x: 0, y: 0 } },
  { id: 'toilet',   type: 'removed',  title: 'Toilet removed',              description: 'Toilet removed from Bath 2.',                      crop: '0 0 100 100', marker: { x: 0, y: 0 } },
]

export const TYPE_META: Record<ChangeType, { label: string; color: string }> = {
  added:    { label: 'Added',    color: '#2e7d32' },
  modified: { label: 'Modified', color: '#b8860b' },
  removed:  { label: 'Removed',  color: '#c62828' },
}
