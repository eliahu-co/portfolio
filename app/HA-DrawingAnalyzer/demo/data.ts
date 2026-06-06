export type FileRow = {
  id: string
  name: string
  version: 1 | 2
  updated: string
  by: string
  isTarget?: boolean
}

export const FILE_ROWS: FileRow[] = [
  { id: 'narrative', name: '2026-06-10 - P1016 Bulletin 1 - Change Narrative.pdf', version: 1, updated: 'Jun 10, 2026 10:59', by: 'Ronit Haquim' },
  { id: 'drawings',  name: '2026-06-10 - P1016 Bulletin 1 - Drawings.pdf',          version: 1, updated: 'Jun 10, 2026 11:00', by: 'Ronit Haquim', isTarget: true },
]

export type ChangeType = 'added' | 'modified' | 'removed'

export type Change = {
  id: string
  type: ChangeType
  title: string
  description: string
  shownIn: 'current' | 'incoming'    // which pane carries the marked object
  crop: string                       // SVG viewBox "minX minY w h" for thumbnail
  marker: { x: number; y: number }   // marker chip center in plan coords
}

// removed → marked on Current (the object that goes away); added/modified → Incoming.
export const CHANGES: Change[] = [
  { id: 'doors',    type: 'added',    title: 'Doors added',                 description: '2 doors added to Corridor.',                     shownIn: 'incoming', crop: '300 350 300 110', marker: { x: 450, y: 402 } },
  { id: 'bedroom3', type: 'modified', title: 'Bedroom 3 boundary modified', description: 'Partition shifted — area 138 SF → 149 SF (+8%).', shownIn: 'incoming', crop: '300 430 185 220', marker: { x: 351, y: 545 } },
  { id: 'toilet',   type: 'removed',  title: 'Toilet removed',              description: 'Toilet removed from Bath 2.',                    shownIn: 'current',  crop: '116 230 150 130', marker: { x: 206, y: 300 } },
]

export const TYPE_META: Record<ChangeType, { label: string; color: string }> = {
  added:    { label: 'Added',    color: '#2e7d32' },
  modified: { label: 'Modified', color: '#caa000' },
  removed:  { label: 'Removed',  color: '#c62828' },
}
