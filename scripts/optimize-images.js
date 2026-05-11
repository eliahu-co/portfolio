// scripts/optimize-images.js
// Runs at prebuild — resizes and compresses JPG/PNG images in public/architecture/.
// GIFs are skipped (animated; sharp doesn't preserve animation).
// Images already within the size/quality budget are left untouched.

const fs   = require('fs')
const path = require('path')
const sharp = require('sharp')

const DIR        = path.join(__dirname, '..', 'public', 'architecture')
const MAX_HEIGHT = 1440   // px — retina-safe for 80vh on 1080p screens
const JPG_Q      = 82     // JPEG quality

async function optimizeImage(filePath) {
  const ext  = path.extname(filePath).toLowerCase()
  const meta = await sharp(filePath).metadata()
  const before = fs.statSync(filePath).size

  let pipeline = sharp(filePath)

  // Resize if taller than budget
  if (meta.height > MAX_HEIGHT) {
    pipeline = pipeline.resize({ height: MAX_HEIGHT, withoutEnlargement: true })
  }

  // Compress
  if (ext === '.jpg' || ext === '.jpeg') {
    pipeline = pipeline.jpeg({ quality: JPG_Q, mozjpeg: true })
  } else if (ext === '.png') {
    // Convert PNG to JPEG (no transparency used in these images)
    const outPath = filePath.replace(/\.png$/i, '.jpg')
    await pipeline.jpeg({ quality: JPG_Q, mozjpeg: true }).toFile(outPath + '.tmp')
    fs.renameSync(outPath + '.tmp', outPath)
    if (outPath !== filePath) fs.unlinkSync(filePath)
    const after = fs.statSync(outPath).size
    return { file: path.basename(outPath), before, after }
  } else {
    return null // skip
  }

  await pipeline.toFile(filePath + '.tmp')
  fs.renameSync(filePath + '.tmp', filePath)
  const after = fs.statSync(filePath).size
  return { file: path.basename(filePath), before, after }
}

async function main() {
  const files = fs.readdirSync(DIR).filter(f => /\.(jpg|jpeg|png)$/i.test(f))
  let totalBefore = 0, totalAfter = 0

  console.log(`\nOptimizing ${files.length} images in public/architecture/...\n`)

  for (const f of files) {
    const result = await optimizeImage(path.join(DIR, f))
    if (!result) {
      console.log(`  skip  ${f}`)
      continue
    }
    totalBefore += result.before
    totalAfter  += result.after
    const saved = ((1 - result.after / result.before) * 100).toFixed(0)
    console.log(`  ${saved.padStart(3)}%  ${result.file}  (${kb(result.before)} → ${kb(result.after)})`)
  }

  const totalSaved = ((1 - totalAfter / totalBefore) * 100).toFixed(0)
  console.log(`\nTotal: ${kb(totalBefore)} → ${kb(totalAfter)} (${totalSaved}% saved)\n`)
}

const kb = n => `${Math.round(n / 1024)}KB`

main().catch(err => { console.error(err); process.exit(1) })
