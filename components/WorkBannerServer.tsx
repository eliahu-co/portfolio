// components/WorkBannerServer.tsx  — server component
// Reads public/{architecture,design,product,research}/ at request time.
// Drop images into any folder; no other code changes needed.
//
// Structured dirs (e.g. architecture): subdirectories named NN_label are
// sorted by leading number; files within each subdir are sorted by their
// leading number (001_, 10_, 21_…). Non-numbered files sort to the end.
//
// Flat dirs (design, product, research): shuffled as before.
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import WorkBannerSwitcher from './WorkBannerSwitcher'
import { type ImageMeta } from './WorkBanner'

const IMAGE_EXTS = /\.(gif|png|jpg|jpeg|webp|avif)$/i

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

function readImageDir(dirName: string, meta: Record<string, ImageMeta>) {
  const dir = join(process.cwd(), 'public', dirName)
  try {
    const entries = readdirSync(dir, { withFileTypes: true })

    // If this directory contains subdirectories, use structured ordering.
    const subdirs = entries
      .filter(e => e.isDirectory())
      .sort((a, b) => leadingNum(a.name) - leadingNum(b.name))

    if (subdirs.length > 0) {
      const result: Array<{ src: string; meta: ImageMeta | null }> = []
      for (const subdir of subdirs) {
        const subdirPath = join(dir, subdir.name)
        readdirSync(subdirPath)
          .filter(f => IMAGE_EXTS.test(f))
          .sort((a, b) => {
            const diff = leadingNum(a) - leadingNum(b)
            return diff !== 0 ? diff : a.localeCompare(b)
          })
          .forEach(f => result.push({
            src:  `/${dirName}/${subdir.name}/${encodeURIComponent(f)}`,
            meta: meta[f] ?? null,
          }))
      }
      return result
    }

    // Flat directory — preserve shuffle behaviour.
    return shuffle(
      entries
        .filter(e => e.isFile() && IMAGE_EXTS.test(e.name))
        .map(e => ({
          src:  `/${dirName}/${encodeURIComponent(e.name)}`,
          meta: meta[e.name] ?? null,
        }))
    )
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
