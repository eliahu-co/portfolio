// components/WorkBannerServer.tsx  — server component
// Reads public/{architecture,design,product,research}/ at request time.
// Drop images into any folder; no other code changes needed.
//
// Structured dirs (e.g. architecture): subdirectories named NN_label are
// sorted by leading number; files within each subdir are sorted by their
// leading number (001_, 10_, 21_…). Non-numbered files sort to the end.
//
// Consecutive landscape images (w > h) are grouped into a single paired slot
// and rendered stacked vertically in WorkBanner. All other images are single slots.
//
// Flat dirs are shuffled, except product, which follows numeric filename prefixes.
import { readdirSync, readFileSync, openSync, readSync, closeSync } from 'fs'
import { join } from 'path'
import WorkBannerSwitcher from './WorkBannerSwitcher'
import { type ImageMeta, type ImageSlot } from './WorkBanner'

const IMAGE_EXTS = /\.(gif|png|jpg|jpeg|webp|avif)$/i
const VIDEO_EXTS = /\.(mp4|webm|ogg)$/i

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function loadMeta(dirName: string): Record<string, ImageMeta> {
  try {
    return JSON.parse(
      readFileSync(join(process.cwd(), 'public', dirName, 'metadata.json'), 'utf-8')
    )
  } catch { return {} }
}

// Extract the leading integer from a filename/dirname for sort purposes.
// Files without a leading number (e.g. "eliahu_culture_center.jpg") sort last.
function leadingNum(name: string): number {
  const m = name.match(/^(\d+)/)
  return m ? parseInt(m[1], 10) : Infinity
}

// Read image dimensions from the file header — supports JPEG, PNG, GIF.
// Returns null for unknown formats or on error; treated as portrait (not landscape).
function readDimensions(filePath: string): { w: number; h: number } | null {
  let fd = -1
  try {
    fd = openSync(filePath, 'r')
    const buf = Buffer.alloc(65536)
    const n   = readSync(fd, buf, 0, 65536, 0)
    const data = buf.subarray(0, n)

    // PNG: 8-byte magic + IHDR — width@16, height@20 (big-endian uint32)
    if (data[0] === 0x89 && data[1] === 0x50 && n >= 24) {
      return { w: data.readUInt32BE(16), h: data.readUInt32BE(20) }
    }

    // GIF: 'GIF' at 0 — width@6, height@8 (little-endian uint16)
    if (data[0] === 0x47 && data[1] === 0x49 && data[2] === 0x46 && n >= 10) {
      return { w: data.readUInt16LE(6), h: data.readUInt16LE(8) }
    }

    // JPEG: scan segment chain for SOF marker
    if (data[0] === 0xFF && data[1] === 0xD8) {
      let i = 2
      while (i + 9 < n) {
        if (data[i] !== 0xFF) break
        const marker = data[i + 1]
        const segLen = data.readUInt16BE(i + 2)
        // SOF0–SOF15 excluding DHT (C4), JPG (C8), DAC (CC)
        if (
          marker >= 0xC0 && marker <= 0xCF &&
          marker !== 0xC4 && marker !== 0xC8 && marker !== 0xCC
        ) {
          return { h: data.readUInt16BE(i + 5), w: data.readUInt16BE(i + 7) }
        }
        i += 2 + segLen
      }
    }

    return null
  } catch {
    return null
  } finally {
    if (fd >= 0) try { closeSync(fd) } catch { /* ignore */ }
  }
}

type RawEntry = { filePath: string; src: string; meta: ImageMeta | null; isVideo?: boolean }

// Group consecutive landscape images (w > h) into paired slots.
// Videos and non-landscape images become single slots.
function pairLandscapes(raw: RawEntry[]): ImageSlot[] {
  const slots: ImageSlot[] = []
  let i = 0
  while (i < raw.length) {
    const curr      = raw[i]
    if (curr.isVideo) {
      slots.push({ a: { src: curr.src, meta: curr.meta, isVideo: true }, b: null })
      i++
      continue
    }
    const currDims  = readDimensions(curr.filePath)
    const currIsLandscape = currDims !== null && currDims.w > currDims.h

    if (currIsLandscape && i + 1 < raw.length) {
      const next     = raw[i + 1]
      if (next.isVideo) {
        slots.push({ a: { src: curr.src, meta: curr.meta }, b: null })
        i++
        continue
      }
      const nextDims = readDimensions(next.filePath)
      if (nextDims !== null && nextDims.w > nextDims.h) {
        // aspectRatio = 1 / (1/aspect_a + 1/aspect_b)
        // Makes slot width = height × ratio so both images fill full slot width,
        // heights determined by each image's own aspect ratio (split is unequal).
        const aspectA     = currDims.w / currDims.h
        const aspectB     = nextDims.w / nextDims.h
        const aspectRatio = 1 / (1 / aspectA + 1 / aspectB)
        slots.push({
          a: { src: curr.src, meta: curr.meta },
          b: { src: next.src, meta: next.meta },
          aspectRatio,
        })
        i += 2
        continue
      }
    }

    slots.push({ a: { src: curr.src, meta: curr.meta }, b: null })
    i++
  }
  return slots
}

function readImageDir(dirName: string, meta: Record<string, ImageMeta>): ImageSlot[] {
  const dir = join(process.cwd(), 'public', dirName)
  try {
    const entries = readdirSync(dir, { withFileTypes: true })

    // Structured dir: contains subdirectories → sort by leading number, then files within
    const subdirs = entries
      .filter(e => e.isDirectory())
      .sort((a, b) => leadingNum(a.name) - leadingNum(b.name))

    let raw: RawEntry[]

    if (subdirs.length > 0) {
      raw = []
      for (const subdir of subdirs) {
        const subdirPath = join(dir, subdir.name)
        readdirSync(subdirPath)
          .filter(f => IMAGE_EXTS.test(f))
          .sort((a, b) => {
            const diff = leadingNum(a) - leadingNum(b)
            return diff !== 0 ? diff : a.localeCompare(b)
          })
          .forEach(f => raw.push({
            filePath: join(subdirPath, f),
            src:      `/${dirName}/${subdir.name}/${encodeURIComponent(f)}`,
            meta:     meta[f] ?? null,
          }))
      }
    } else {
      const mediaEntries = entries
        .filter(e => e.isFile() && (IMAGE_EXTS.test(e.name) || VIDEO_EXTS.test(e.name)))

      if (dirName === 'product') {
        mediaEntries.sort((a, b) => {
          const diff = leadingNum(a.name) - leadingNum(b.name)
          return diff !== 0 ? diff : a.name.localeCompare(b.name)
        })
      } else {
        shuffle(mediaEntries)
      }

      raw = mediaEntries.map(e => ({
        filePath: join(dir, e.name),
        src:      `/${dirName}/${encodeURIComponent(e.name)}`,
        meta:     meta[e.name] ?? null,
        ...(VIDEO_EXTS.test(e.name) ? { isVideo: true } : {}),
      }))
    }

    return pairLandscapes(raw)
  } catch { return [] }
}

export default function WorkBannerServer() {
  return (
    <WorkBannerSwitcher
      sets={{
        product:      readImageDir('product',      loadMeta('product')),
        architecture: readImageDir('architecture', loadMeta('architecture')),
        research:     readImageDir('research',     loadMeta('research')),
        design:       readImageDir('design',       loadMeta('design')),
      }}
    />
  )
}
