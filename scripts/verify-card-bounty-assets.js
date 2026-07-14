const fs = require('node:fs/promises')
const path = require('node:path')
const sharp = require('sharp')

const PUBLIC_ROOT = path.join(process.cwd(), 'public')
const MAX_RUNTIME_BYTES = 2 * 1024 * 1024

const COLLECTIONS = [
  'sinbad',
  'space-travel',
  'ocean',
  'pets',
  'vikings',
  'fairy-tales',
  'steampunk',
  'winter-wonders',
]

const CARD_ART = [
  'whale-boat',
  'bionica',
  'nautilus',
  'island-eye',
  'shipwreck',
  'golden-house',
]

const CLOSED_CHESTS = [
  'wooden-chest',
  'golden-chest',
  'magical-chest',
]

const REQUIRED_ASSETS = [
  ...CARD_ART.map((name) => ({
    path: `coinmaster/card-bounty/${name}.png`,
    format: 'png',
    width: 250,
    height: 340,
    alpha: false,
    maxBytes: 128 * 1024,
  })),
  ...CLOSED_CHESTS.map((name) => ({
    path: `coinmaster/card-bounty/${name}.webp`,
    format: 'webp',
    width: 192,
    height: 192,
    alpha: true,
    maxBytes: 16 * 1024,
  })),
  ...COLLECTIONS.map((name) => ({
    path: `coinmaster/card-bounty/generated/collections/${name}.webp`,
    format: 'webp',
    width: 512,
    height: 512,
    alpha: false,
    maxBytes: 80 * 1024,
  })),
  {
    path: 'coinmaster/card-bounty/generated/card-bounty-badge.webp',
    format: 'webp',
    width: 256,
    height: 256,
    alpha: true,
    maxBytes: 24 * 1024,
  },
  {
    path: 'coinmaster/card-bounty/generated/magical-chest-open.webp',
    format: 'webp',
    width: 768,
    height: 768,
    alpha: true,
    maxBytes: 80 * 1024,
  },
  {
    path: 'coinmaster/card-bounty/generated/spin/snowy-background.webp',
    format: 'webp',
    width: 1024,
    height: 1536,
    alpha: false,
    maxBytes: 64 * 1024,
  },
  {
    path: 'coinmaster/card-bounty/generated/spin/slot-cabinet.webp',
    format: 'webp',
    width: 1024,
    height: 1024,
    alpha: true,
    maxBytes: 128 * 1024,
  },
  ...[
    'symbol-pig',
    'symbol-coin',
    'symbol-hammer',
    'symbol-shield',
    'symbol-energy',
    'symbol-chest',
  ].map((name) => ({
    path: `coinmaster/card-bounty/generated/spin/${name}.webp`,
    format: 'webp',
    width: 192,
    height: 192,
    alpha: true,
    maxBytes: 16 * 1024,
  })),
  ...[
    'pet',
    'event-raid',
    'event-tournament',
  ].map((name) => ({
    path: `coinmaster/card-bounty/generated/spin/${name}.webp`,
    format: 'webp',
    width: 384,
    height: 384,
    alpha: true,
    maxBytes: 32 * 1024,
  })),
  {
    path: 'coinmaster/card-bounty-preview.webp',
    format: 'webp',
    width: 860,
    height: 1864,
    exactDimensions: true,
    alpha: false,
    maxBytes: 128 * 1024,
  },
  {
    path: 'coinmaster/card-bounty-preview.jpg',
    format: 'jpeg',
    width: 860,
    height: 1864,
    exactDimensions: true,
    alpha: false,
    maxBytes: 256 * 1024,
  },
]

async function verifyAsset(spec) {
  const assetPath = path.join(PUBLIC_ROOT, spec.path)
  const [metadata, stats] = await Promise.all([
    sharp(assetPath).metadata(),
    fs.stat(assetPath),
  ])
  const errors = []

  if (metadata.format !== spec.format) {
    errors.push(`expected ${spec.format}, received ${metadata.format ?? 'unknown format'}`)
  }

  if (spec.exactDimensions) {
    if (metadata.width !== spec.width || metadata.height !== spec.height) {
      errors.push(`expected exactly ${spec.width}x${spec.height}, received ${metadata.width ?? '?'}x${metadata.height ?? '?'}`)
    }
  } else if (!metadata.width || !metadata.height || metadata.width > spec.width || metadata.height > spec.height) {
    errors.push(`expected at most ${spec.width}x${spec.height}, received ${metadata.width ?? '?'}x${metadata.height ?? '?'}`)
  }

  if (Boolean(metadata.hasAlpha) !== spec.alpha) {
    errors.push(`expected alpha=${spec.alpha}, received alpha=${Boolean(metadata.hasAlpha)}`)
  }

  if (stats.size > spec.maxBytes) {
    errors.push(`expected at most ${spec.maxBytes} bytes, received ${stats.size}`)
  }

  if (errors.length > 0) {
    throw new Error(`${spec.path}: ${errors.join('; ')}`)
  }

  return {
    line: `${spec.path}: ${metadata.width}x${metadata.height}, ${stats.size} bytes, alpha=${Boolean(metadata.hasAlpha)}`,
    bytes: stats.size,
  }
}

async function main() {
  const results = []

  for (const spec of REQUIRED_ASSETS) {
    results.push(await verifyAsset(spec))
  }

  const totalBytes = results.reduce((sum, result) => sum + result.bytes, 0)

  if (totalBytes > MAX_RUNTIME_BYTES) {
    throw new Error(`Runtime assets total ${totalBytes} bytes, exceeding the ${MAX_RUNTIME_BYTES}-byte budget`)
  }

  console.log(results.map((result) => result.line).join('\n'))
  console.log(`Verified ${REQUIRED_ASSETS.length} runtime assets; runtime payload is ${totalBytes} bytes`)
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
