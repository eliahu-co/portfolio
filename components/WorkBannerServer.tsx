// components/WorkBannerServer.tsx  — server component
// Reads public/{architecture,design,product,research}/ at request time.
// Drop images into any folder; no other code changes needed.
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

function readImageDir(dirName: string, meta: Record<string, ImageMeta>) {
  const dir = join(process.cwd(), 'public', dirName)
  return shuffle(
    readdirSync(dir)
      .filter(f => IMAGE_EXTS.test(f))
      .map(f => ({
        src:  `/${dirName}/${encodeURIComponent(f)}`,
        meta: meta[f] ?? null,
      }))
  )
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
