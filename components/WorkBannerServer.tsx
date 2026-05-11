// components/WorkBannerServer.tsx  — server component
// Reads public/architecture/ and public/design/ at request time.
// Drop images into either folder; no other code changes needed.
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

function loadMeta(dirName: string): Record<string, ImageMeta> {
  try {
    return JSON.parse(
      readFileSync(join(process.cwd(), 'public', dirName, 'metadata.json'), 'utf-8')
    )
  } catch { return {} }
}

export default function WorkBannerServer() {
  const architecture = readImageDir('architecture', loadMeta('architecture'))
  const design       = readImageDir('design',       loadMeta('design'))

  return <WorkBannerSwitcher architecture={architecture} design={design} />
}
