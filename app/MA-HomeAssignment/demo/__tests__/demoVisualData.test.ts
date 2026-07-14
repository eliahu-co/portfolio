import fs from 'node:fs'
import path from 'node:path'
import { CHESTS } from '../demoData'
import { DEMO_COLLECTIONS, REEL_GRID, REQUIRED_VISUAL_ASSETS } from '../demoVisualData'

it('provides eight collections and nine deterministic reel cells', () => {
  expect(DEMO_COLLECTIONS).toHaveLength(8)
  expect(REEL_GRID).toHaveLength(9)
  expect(new Set(DEMO_COLLECTIONS.map((item) => item.id)).size).toBe(8)
})

it('uses optimized WebP artwork for every purchasable Chest', () => {
  expect(CHESTS.map((chest) => chest.image)).toEqual([
    '/coinmaster/card-bounty/wooden-chest.webp',
    '/coinmaster/card-bounty/golden-chest.webp',
    '/coinmaster/card-bounty/magical-chest.webp',
  ])
})

it('tracks every target, reveal, and closed Chest image as a required runtime asset', () => {
  expect(REQUIRED_VISUAL_ASSETS).toEqual(expect.arrayContaining([
    'coinmaster/card-bounty/whale-boat.png',
    'coinmaster/card-bounty/bionica.png',
    'coinmaster/card-bounty/nautilus.png',
    'coinmaster/card-bounty/island-eye.png',
    'coinmaster/card-bounty/shipwreck.png',
    'coinmaster/card-bounty/golden-house.png',
    'coinmaster/card-bounty/wooden-chest.webp',
    'coinmaster/card-bounty/golden-chest.webp',
    'coinmaster/card-bounty/magical-chest.webp',
  ]))
})

it.each(REQUIRED_VISUAL_ASSETS)('ships %s', (asset) => {
  expect(fs.existsSync(path.join(process.cwd(), 'public', asset))).toBe(true)
})
