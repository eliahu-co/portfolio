export type FileRow = {
  id: string
  name: string
  version: 1 | 2
  updated: string
  by: string
  isTarget?: boolean
}

export const FILE_ROWS: FileRow[] = [
  { id: 'narrative', name: 'P1016 Bulletin 1 - Change Narrative.pdf', version: 1, updated: 'Jun 6, 2026 10:59', by: 'Eliahu Cohen' },
  { id: 'drawings',  name: 'P1016 Bulletin 1 - Second Floor Plan.pdf', version: 1, updated: 'Jun 6, 2026 11:00', by: 'Eliahu Cohen', isTarget: true },
]

export type ChangeType = 'added' | 'modified' | 'removed'

export type Confidence = 'High' | 'Medium' | 'Low'

export type Change = {
  id: string
  type: ChangeType
  title: string
  description: string
  passes: number[]                   // which review passes report this change
  confidence: Confidence             // how sure the AI is this is a real change
  crop: string                       // SVG viewBox "minX minY w h" for thumbnail
  marker: { x: number; y: number }   // marker chip center in plan coords
}

// passes: which review passes report this change. confidence: how sure the AI is it's a real change.
export const CHANGES: Change[] = [
  { id: 'door-corridor', type: 'added', title: 'Door added at Corridor', description: 'New door opening.', passes: [1, 2], confidence: 'High', crop: '520 350 140 100', marker: { x: 566, y: 391 } },
  { id: 'door-laundry',  type: 'added', title: 'Door added at Laundry',  description: 'New door opening.', passes: [1, 2], confidence: 'High', crop: '170 350 140 100', marker: { x: 218, y: 396 } },
  { id: 'bedroom3', type: 'modified', title: 'Bedroom 3 area changed', description: 'Area 138 SF → 149 SF (+8%).',           passes: [1, 2], confidence: 'High',   crop: '332 430 260 224', marker: { x: 508, y: 551 } },
  { id: 'bedroom2', type: 'modified', title: 'Bedroom 2 area changed', description: 'Area 126 SF → 116 SF (−8%).',           passes: [1, 2], confidence: 'High',   crop: '116 432 240 222', marker: { x: 284, y: 551 } },
  { id: 'wall',     type: 'modified', title: 'Wall moved',           description: 'Partition between Bedroom 2 and 3 relocated.', passes: [1, 2], confidence: 'Medium', crop: '270 470 150 150', marker: { x: 340, y: 548 } },
  { id: 'toilet',   type: 'removed',  title: 'Toilet removed',       description: 'Toilet removed from Bath 2.',            passes: [1],    confidence: 'High',   crop: '116 230 150 130', marker: { x: 206, y: 300 } },
]

export const TYPE_META: Record<ChangeType, { label: string; color: string }> = {
  added:    { label: 'Added',    color: '#2e7d32' },
  modified: { label: 'Modified', color: '#caa000' },
  removed:  { label: 'Removed',  color: '#c62828' },
}

export const CONF_META: Record<Confidence, string> = {
  High: '#2e7d32',
  Medium: '#b8860b',
  Low: '#c62828',
}
