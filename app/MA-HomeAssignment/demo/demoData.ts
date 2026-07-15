export type TargetId = 'whale-boat' | 'bionica' | 'nautilus'
export type ChestId = 'wooden' | 'golden' | 'magical'

export const BOUNTY_THRESHOLD = 150

export type DemoTarget = {
  id: TargetId
  name: string
  collection: string
  collectionProgress: number
  collectionRewardSpins: number
  stars: number
  bountyThreshold: number
  image: string
  cardType: 'regular'
  tradable: true
}

export type DemoChest = {
  id: ChestId
  name: string
  image: string
  price: number
  cardsPerChest: number
  bountyProgress: number
  defaultQuantity: number
  accent: 'wood' | 'gold' | 'magic'
}

export const TARGETS: DemoTarget[] = [
  {
    id: 'whale-boat',
    name: 'Whale Boat',
    collection: 'Sinbad',
    collectionProgress: 8,
    collectionRewardSpins: 2_500,
    stars: 4,
    bountyThreshold: BOUNTY_THRESHOLD,
    image: '/coinmaster/card-bounty/whale-boat.png',
    cardType: 'regular',
    tradable: true,
  },
  {
    id: 'bionica',
    name: 'Bionica',
    collection: 'Space Travel',
    collectionProgress: 7,
    collectionRewardSpins: 10_000,
    stars: 5,
    bountyThreshold: BOUNTY_THRESHOLD,
    image: '/coinmaster/card-bounty/bionica.png',
    cardType: 'regular',
    tradable: true,
  },
  {
    id: 'nautilus',
    name: 'Nautilus',
    collection: 'Ocean',
    collectionProgress: 6,
    collectionRewardSpins: 1_000,
    stars: 5,
    bountyThreshold: BOUNTY_THRESHOLD,
    image: '/coinmaster/card-bounty/nautilus.png',
    cardType: 'regular',
    tradable: true,
  },
]

export const CHESTS: DemoChest[] = [
  {
    id: 'wooden',
    name: 'Wooden Chest',
    image: '/coinmaster/card-bounty/wooden-chest.webp',
    price: 5_200_000,
    cardsPerChest: 2,
    bountyProgress: 1,
    defaultQuantity: 1,
    accent: 'wood',
  },
  {
    id: 'golden',
    name: 'Golden Chest',
    image: '/coinmaster/card-bounty/golden-chest.webp',
    price: 16_000_000,
    cardsPerChest: 4,
    bountyProgress: 2,
    defaultQuantity: 1,
    accent: 'gold',
  },
  {
    id: 'magical',
    name: 'Magical Chest',
    image: '/coinmaster/card-bounty/magical-chest.webp',
    price: 29_000_000,
    cardsPerChest: 8,
    bountyProgress: 3,
    defaultQuantity: 10,
    accent: 'magic',
  },
]

export const STARTING_COINS = 3_200_000_000
export const STARTING_SPINS = 1_850
export const EVENT_SECONDS = 23 * 60 * 60 + 41 * 60 + 12

export const DUPLICATE_REVEALS = [
  { name: 'Island Eye', image: '/coinmaster/card-bounty/island-eye.png' },
  { name: 'Shipwreck', image: '/coinmaster/card-bounty/shipwreck.png' },
  { name: 'Golden House', image: '/coinmaster/card-bounty/golden-house.png' },
]

export function getTarget(id: TargetId | null) {
  return TARGETS.find((target) => target.id === id) ?? null
}

export function getChest(id: ChestId | null) {
  return CHESTS.find((chest) => chest.id === id) ?? null
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatCompactCoins(value: number) {
  const millions = value / 1_000_000
  return `${Number.isInteger(millions) ? millions : millions.toFixed(1)}M`
}

export function formatCountdown(totalSeconds: number) {
  const safe = Math.max(0, totalSeconds)
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const seconds = safe % 60
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':')
}
