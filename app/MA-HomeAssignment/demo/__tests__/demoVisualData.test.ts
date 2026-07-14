import fs from 'node:fs'
import path from 'node:path'
import { DEMO_COLLECTIONS, REEL_GRID, REQUIRED_VISUAL_ASSETS } from '../demoVisualData'

it('provides eight collections and nine deterministic reel cells', () => {
  expect(DEMO_COLLECTIONS).toHaveLength(8)
  expect(REEL_GRID).toHaveLength(9)
  expect(new Set(DEMO_COLLECTIONS.map((item) => item.id)).size).toBe(8)
})

it.each(REQUIRED_VISUAL_ASSETS)('ships %s', (asset) => {
  expect(fs.existsSync(path.join(process.cwd(), 'public', asset))).toBe(true)
})
