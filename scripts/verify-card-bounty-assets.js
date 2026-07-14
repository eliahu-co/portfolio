const fs = require('node:fs/promises')
const path = require('node:path')
const sharp = require('sharp')

const GENERATED_ROOT = path.join(process.cwd(), 'public', 'coinmaster', 'card-bounty', 'generated')
const MAX_TOTAL_BYTES = 2.5 * 1024 * 1024

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

const REQUIRED_ASSETS = [
  ...COLLECTIONS.map((name) => ({ path: `collections/${name}.webp`, width: 512, height: 512, alpha: false })),
  { path: 'card-bounty-badge.webp', width: 256, height: 256, alpha: true },
  { path: 'magical-chest-open.webp', width: 768, height: 768, alpha: true },
  { path: 'spin/snowy-background.webp', width: 1024, height: 1536, alpha: false },
  { path: 'spin/slot-cabinet.webp', width: 1024, height: 1024, alpha: true },
  { path: 'spin/symbol-pig.webp', width: 192, height: 192, alpha: true },
  { path: 'spin/symbol-coin.webp', width: 192, height: 192, alpha: true },
  { path: 'spin/symbol-hammer.webp', width: 192, height: 192, alpha: true },
  { path: 'spin/symbol-shield.webp', width: 192, height: 192, alpha: true },
  { path: 'spin/symbol-energy.webp', width: 192, height: 192, alpha: true },
  { path: 'spin/symbol-chest.webp', width: 192, height: 192, alpha: true },
  { path: 'spin/pet.webp', width: 384, height: 384, alpha: true },
  { path: 'spin/event-raid.webp', width: 384, height: 384, alpha: true },
  { path: 'spin/event-tournament.webp', width: 384, height: 384, alpha: true },
]

async function listFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...await listFiles(entryPath))
    } else {
      files.push(entryPath)
    }
  }

  return files
}

async function verifyAsset(spec) {
  const assetPath = path.join(GENERATED_ROOT, spec.path)
  const metadata = await sharp(assetPath).metadata()
  const errors = []

  if (metadata.format !== 'webp') {
    errors.push(`expected WebP, received ${metadata.format ?? 'unknown format'}`)
  }

  if (!metadata.width || !metadata.height || metadata.width > spec.width || metadata.height > spec.height) {
    errors.push(`expected at most ${spec.width}x${spec.height}, received ${metadata.width ?? '?'}x${metadata.height ?? '?'}`)
  }

  if (Boolean(metadata.hasAlpha) !== spec.alpha) {
    errors.push(`expected alpha=${spec.alpha}, received alpha=${Boolean(metadata.hasAlpha)}`)
  }

  if (errors.length > 0) {
    throw new Error(`${spec.path}: ${errors.join('; ')}`)
  }

  return `${spec.path}: ${metadata.width}x${metadata.height}, alpha=${Boolean(metadata.hasAlpha)}`
}

async function main() {
  const results = []

  for (const spec of REQUIRED_ASSETS) {
    results.push(await verifyAsset(spec))
  }

  const files = await listFiles(GENERATED_ROOT)
  const sizes = await Promise.all(files.map(async (file) => (await fs.stat(file)).size))
  const totalBytes = sizes.reduce((sum, size) => sum + size, 0)

  if (totalBytes > MAX_TOTAL_BYTES) {
    throw new Error(`Generated assets total ${totalBytes} bytes, exceeding the ${MAX_TOTAL_BYTES}-byte budget`)
  }

  console.log(results.join('\n'))
  console.log(`Verified ${REQUIRED_ASSETS.length} assets; generated folder is ${totalBytes} bytes`)
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
