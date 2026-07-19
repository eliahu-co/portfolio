const fs = require('node:fs')
const path = require('node:path')

const ROOT = process.cwd()
const PUBLIC = path.join(ROOT, 'public')
const OUTPUT = path.join(ROOT, 'components', 'workBannerManifest.json')
const IMAGE_EXTS = /\.(gif|png|jpg|jpeg|webp|avif)$/i
const VIDEO_EXTS = /\.(mp4|webm|ogg)$/i

function leadingNum(name) {
  const match = name.match(/^(\d+)/)
  return match ? Number.parseInt(match[1], 10) : Number.POSITIVE_INFINITY
}

function loadMeta(dirName) {
  try {
    return JSON.parse(fs.readFileSync(path.join(PUBLIC, dirName, 'metadata.json'), 'utf8'))
  } catch {
    return {}
  }
}

function readDimensions(filePath) {
  const data = fs.readFileSync(filePath).subarray(0, 65536)
  if (data[0] === 0x89 && data[1] === 0x50 && data.length >= 24) {
    return { w: data.readUInt32BE(16), h: data.readUInt32BE(20) }
  }
  if (data[0] === 0x47 && data[1] === 0x49 && data[2] === 0x46 && data.length >= 10) {
    return { w: data.readUInt16LE(6), h: data.readUInt16LE(8) }
  }
  if (data[0] === 0xff && data[1] === 0xd8) {
    let index = 2
    while (index + 9 < data.length) {
      if (data[index] !== 0xff) break
      const marker = data[index + 1]
      const segmentLength = data.readUInt16BE(index + 2)
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { h: data.readUInt16BE(index + 5), w: data.readUInt16BE(index + 7) }
      }
      index += 2 + segmentLength
    }
  }
  return null
}

function pairLandscapes(raw) {
  const slots = []
  let index = 0
  while (index < raw.length) {
    const current = raw[index]
    if (current.isVideo) {
      slots.push({ a: { src: current.src, meta: current.meta, isVideo: true }, b: null })
      index += 1
      continue
    }
    const currentDimensions = readDimensions(current.filePath)
    const currentIsLandscape = currentDimensions && currentDimensions.w > currentDimensions.h
    const next = raw[index + 1]
    if (currentIsLandscape && next && !next.isVideo) {
      const nextDimensions = readDimensions(next.filePath)
      if (nextDimensions && nextDimensions.w > nextDimensions.h) {
        const aspectA = currentDimensions.w / currentDimensions.h
        const aspectB = nextDimensions.w / nextDimensions.h
        slots.push({
          a: { src: current.src, meta: current.meta },
          b: { src: next.src, meta: next.meta },
          aspectRatio: 1 / (1 / aspectA + 1 / aspectB),
        })
        index += 2
        continue
      }
    }
    slots.push({ a: { src: current.src, meta: current.meta }, b: null })
    index += 1
  }
  return slots
}

function readMediaDir(dirName) {
  const directory = path.join(PUBLIC, dirName)
  const metadata = loadMeta(dirName)
  const entries = fs.readdirSync(directory, { withFileTypes: true })
  const subdirectories = entries
    .filter((entry) => entry.isDirectory())
    .sort((a, b) => leadingNum(a.name) - leadingNum(b.name))

  let raw
  if (subdirectories.length) {
    raw = subdirectories.flatMap((subdirectory) => {
      const subdirectoryPath = path.join(directory, subdirectory.name)
      return fs.readdirSync(subdirectoryPath)
        .filter((name) => IMAGE_EXTS.test(name))
        .sort((a, b) => leadingNum(a) - leadingNum(b) || a.localeCompare(b))
        .map((name) => ({
          filePath: path.join(subdirectoryPath, name),
          src: `/${dirName}/${subdirectory.name}/${encodeURIComponent(name)}`,
          meta: metadata[name] ?? null,
        }))
    })
  } else {
    const media = entries.filter((entry) => entry.isFile() && (IMAGE_EXTS.test(entry.name) || VIDEO_EXTS.test(entry.name)))
    media.sort((a, b) => leadingNum(a.name) - leadingNum(b.name) || a.name.localeCompare(b.name))
    raw = media.map((entry) => ({
      filePath: path.join(directory, entry.name),
      src: `/${dirName}/${encodeURIComponent(entry.name)}`,
      meta: metadata[entry.name] ?? null,
      ...(VIDEO_EXTS.test(entry.name) ? { isVideo: true } : {}),
    }))
  }

  return pairLandscapes(raw)
}

const manifest = Object.fromEntries(
  ['product', 'architecture', 'research', 'design'].map((name) => [name, readMediaDir(name)])
)

fs.writeFileSync(OUTPUT, `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`Generated ${path.relative(ROOT, OUTPUT)}`)
