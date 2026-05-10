// components/WorkBannerServer.tsx  — server component
// Reads public/architecture/ at request time and passes the list + metadata
// to the client WorkBanner. Drop any image into the folder and add an entry
// to public/architecture/metadata.json — no other code changes needed.
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import WorkBanner, { type ImageMeta } from './WorkBanner'

const IMAGE_EXTS = /\.(gif|png|jpg|jpeg|webp|avif)$/i

export default function WorkBannerServer() {
  const dir = join(process.cwd(), 'public', 'architecture')

  // Load metadata (graceful fallback if file is missing)
  let rawMeta: Record<string, ImageMeta> = {}
  try {
    rawMeta = JSON.parse(readFileSync(join(dir, 'metadata.json'), 'utf-8'))
  } catch { /* no metadata file — tooltips will be empty */ }

  const images = readdirSync(dir)
    .filter(f => IMAGE_EXTS.test(f))
    .map(f => ({
      src:  `/architecture/${encodeURIComponent(f)}`,
      meta: rawMeta[f] ?? null,
    }))

  // Shuffle here on the server so the client receives one stable ordered array.
  // Client-side shuffle with Math.random() inside useMemo is unsafe — React
  // StrictMode can invoke the memo factory twice with different random results,
  // splitting src and meta onto wrong indices.
  for (let i = images.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [images[i], images[j]] = [images[j], images[i]]
  }

  return <WorkBanner images={images} />
}
