const fs = require('node:fs/promises')
const path = require('node:path')
const sharp = require('sharp')

function parseArgs(argv) {
  const args = {}

  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index]
    const value = argv[index + 1]

    if (!key?.startsWith('--') || value === undefined) {
      throw new Error(`Invalid argument near ${key ?? '<end>'}`)
    }

    args[key.slice(2)] = value
  }

  return args
}

function parseInteger(value, name) {
  const parsed = Number.parseInt(value, 10)

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`--${name} must be a positive integer`)
  }

  return parsed
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const required = ['input', 'output', 'width', 'height', 'fit', 'quality']

  for (const name of required) {
    if (!args[name]) {
      throw new Error(`Missing required --${name} argument`)
    }
  }

  const input = path.resolve(args.input)
  const output = path.resolve(args.output)
  const width = parseInteger(args.width, 'width')
  const height = parseInteger(args.height, 'height')
  const fit = args.fit
  const quality = parseInteger(args.quality, 'quality')

  if (!['cover', 'contain', 'fill', 'inside', 'outside'].includes(fit)) {
    throw new Error('--fit must be cover, contain, fill, inside, or outside')
  }

  if (quality > 100) {
    throw new Error('--quality must not exceed 100')
  }

  await fs.mkdir(path.dirname(output), { recursive: true })
  await sharp(input)
    .resize({ width, height, fit, withoutEnlargement: true })
    .webp({ quality, alphaQuality: 90, effort: 6 })
    .toFile(output)

  const metadata = await sharp(output).metadata()
  console.log(`${path.relative(process.cwd(), output)}: ${metadata.width}x${metadata.height} WebP`)
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
