import { CHESTS, DUPLICATE_REVEALS, TARGETS } from './demoData'

export type DemoCollection = {
  id: string
  name: string
  progress: number
  image: string
  ribbonTone: 'red' | 'violet' | 'blue' | 'green'
  rewardLabel: string
}

export type ReelSymbol = {
  id: string
  label: string
  image: string
}

export const DEMO_COLLECTIONS: readonly DemoCollection[] = [
  { id: 'sinbad', name: 'Sinbad', progress: 8, image: '/coinmaster/card-bounty/generated/collections/sinbad.webp', ribbonTone: 'blue', rewardLabel: '2,500 Spins' },
  { id: 'space-travel', name: 'Space Travel', progress: 7, image: '/coinmaster/card-bounty/generated/collections/space-travel.webp', ribbonTone: 'violet', rewardLabel: '10,000 Spins' },
  { id: 'ocean', name: 'Ocean', progress: 6, image: '/coinmaster/card-bounty/generated/collections/ocean.webp', ribbonTone: 'blue', rewardLabel: '1,000 Spins' },
  { id: 'pets', name: 'Pets', progress: 9, image: '/coinmaster/card-bounty/generated/collections/pets.webp', ribbonTone: 'red', rewardLabel: 'Complete' },
  { id: 'vikings', name: 'Vikings', progress: 8, image: '/coinmaster/card-bounty/generated/collections/vikings.webp', ribbonTone: 'green', rewardLabel: '5,000 Spins' },
  { id: 'fairy-tales', name: 'Fairy Tales', progress: 7, image: '/coinmaster/card-bounty/generated/collections/fairy-tales.webp', ribbonTone: 'red', rewardLabel: '1,500 Spins' },
  { id: 'steampunk', name: 'Steampunk', progress: 5, image: '/coinmaster/card-bounty/generated/collections/steampunk.webp', ribbonTone: 'violet', rewardLabel: '4,000 Spins' },
  { id: 'winter-wonders', name: 'Winter Wonders', progress: 3, image: '/coinmaster/card-bounty/generated/collections/winter-wonders.webp', ribbonTone: 'blue', rewardLabel: '7,500 Spins' },
]

const SYMBOLS = {
  energy: { id: 'energy', label: 'Energy barrel', image: '/coinmaster/card-bounty/generated/spin/symbol-energy.webp' },
  coin: { id: 'coin', label: 'Crown coin', image: '/coinmaster/card-bounty/generated/spin/symbol-coin.webp' },
  hammer: { id: 'hammer', label: 'Energy hammer', image: '/coinmaster/card-bounty/generated/spin/symbol-hammer.webp' },
  pig: { id: 'pig', label: 'Pig thief', image: '/coinmaster/card-bounty/generated/spin/symbol-pig.webp' },
} satisfies Record<string, ReelSymbol>

export const REEL_GRID = [
  SYMBOLS.energy,
  SYMBOLS.coin,
  SYMBOLS.energy,
  SYMBOLS.hammer,
  SYMBOLS.coin,
  SYMBOLS.coin,
  SYMBOLS.coin,
  SYMBOLS.pig,
  SYMBOLS.pig,
] as const

export const REQUIRED_VISUAL_ASSETS = [
  ...TARGETS.map((item) => item.image.slice(1)),
  ...DUPLICATE_REVEALS.map((item) => item.image.slice(1)),
  ...CHESTS.map((item) => item.image.slice(1)),
  ...DEMO_COLLECTIONS.map((item) => item.image.slice(1)),
  'coinmaster/card-bounty/generated/card-bounty-badge.webp',
  'coinmaster/card-bounty/generated/magical-chest-open.webp',
  'coinmaster/card-bounty/generated/spin/snowy-background.webp',
  'coinmaster/card-bounty/generated/spin/slot-cabinet.webp',
  'coinmaster/card-bounty/generated/spin/symbol-pig.webp',
  'coinmaster/card-bounty/generated/spin/symbol-coin.webp',
  'coinmaster/card-bounty/generated/spin/symbol-hammer.webp',
  'coinmaster/card-bounty/generated/spin/symbol-shield.webp',
  'coinmaster/card-bounty/generated/spin/symbol-energy.webp',
  'coinmaster/card-bounty/generated/spin/symbol-chest.webp',
  'coinmaster/card-bounty/generated/spin/pet.webp',
  'coinmaster/card-bounty/generated/spin/event-raid.webp',
  'coinmaster/card-bounty/generated/spin/event-tournament.webp',
] as const
