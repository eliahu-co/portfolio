// scripts/optimize-images.js
// Runs at prebuild — resizes and compresses JPG/PNG images in public/architecture/.
// GIFs are skipped (animated; sharp doesn't preserve animation).
// A manifest tracks processed files by size so already-optimized images are skipped.

const fs    = require('fs')
const path  = require('path')
const sharp = require('sharp')

const DIR           = path.join(__dirname, '..', 'public', 'architecture')
const MANIFEST_PATH = path.join(__dirname, '.optimize-manifest.json')
const MAX_HEIGHT    = 1440   // px — retina-safe for 80vh on 1080p screens
const JPG_Q         = 82     // JPEG quality

function loadManifest() {
  try { return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8')) } catch { return {} }
}

function saveManifest(manifest) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2))
}

async function optimizeImage(filePath, manifest) {
  const ext      = path.extname(filePath).toLowerCase()
  const basename = path.basename(filePath)
  const before   = fs.statSync(filePath).size

  // Skip if already processed at this exact size
  if (manifest[basename] === before) return 'cached'

  const meta     = await sharp(filePath).metadata()
  let pipeline   = sharp(filePath)

  if (meta.height > MAX_HEIGHT) {
    pipeline = pipeline.resize({ height: MAX_HEIGHT, withoutEnlargement: true })
  }

  if (ext === '.jpg' || ext === '.jpeg') {
    pipeline = pipeline.jpeg({ quality: JPG_Q, mozjpeg: true })
  } else if (ext === '.png') {
    const outPath = filePath.replace(/\.png$/i, '.jpg')
    await pipeline.jpeg({ quality: JPG_Q, mozjpeg: true }).toFile(outPath + '.tmp')
    fs.renameSync(outPath + '.tmp', outPath)
    if (outPath !== filePath) fs.unlinkSync(filePath)
    const after = fs.statSync(outPath).size
    manifest[path.basename(outPath)] = after
    return { file: path.basename(outPath), before, after }
  } else {
    return null // skip GIF etc.
  }

  await pipeline.toFile(filePath + '.tmp')
  fs.renameSync(filePath + '.tmp', filePath)
  const after = fs.statSync(filePath).size
  manifest[basename] = after
  return { file: basename, before, after }
}

async function main() {
  const manifest = loadManifest()
  const files    = fs.readdirSync(DIR).filter(f => /\.(jpg|jpeg|png)$/i.test(f))
  let totalBefore = 0, totalAfter = 0, skipped = 0, processed = 0

  console.log(`\nChecking ${files.length} images in public/architecture/...\n`)

  for (const f of files) {
    const result = await optimizeImage(path.join(DIR, f), manifest)
    if (result === 'cached') {
      skipped++
    } else if (!result) {
      // non-image ext, skip
    } else {
      processed++
      totalBefore += result.before
      totalAfter  += result.after
      const saved = ((1 - result.after / result.before) * 100).toFixed(0)
      console.log(`  ${saved.padStart(3)}%  ${result.file}  (${kb(result.before)} → ${kb(result.after)})`)
    }
  }

  saveManifest(manifest)

  if (processed === 0) {
    console.log(`  All ${skipped} images already optimized — nothing to do.\n`)
  } else {
    const totalSaved = ((1 - totalAfter / totalBefore) * 100).toFixed(0)
    console.log(`\nProcessed ${processed} images: ${kb(totalBefore)} → ${kb(totalAfter)} (${totalSaved}% saved). ${skipped} cached.\n`)
  }
}

const kb = n => `${Math.round(n / 1024)}KB`

main().catch(err => { console.error(err); process.exit(1) })
