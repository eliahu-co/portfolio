/**
 * @jest-environment node
 */
import { readFileSync } from 'fs'
import path from 'path'
import sharp from 'sharp'

// The Approach evidence rows size every screenshot to one shared height and let
// width follow from the declared width/height pair. That only looks right while
// the pair matches the file on disk — otherwise the frame takes a shape the
// image does not fill and dead space opens up inside its border. Swapping a
// screenshot without updating its numbers is the easy way to reintroduce that,
// so the numbers are checked against the real files here.
const SLIDE = path.join(
  process.cwd(),
  'app/MA-HomeAssignment/presentation/slides/Slide03Approach.tsx',
)

type Declared = { src: string; width: number; height: number }

function declaredScreenshots(): Declared[] {
  const source = readFileSync(SLIDE, 'utf8')
  const entries = source.matchAll(
    /src: '(\/coinmaster\/(?:research|benchmark)\/[^']+)'[^}]*?width: (\d+), height: (\d+)/g,
  )
  return [...entries].map(([, src, width, height]) => ({
    src,
    width: Number(width),
    height: Number(height),
  }))
}

// A row lays its images out at one fixed height and refuses to shrink, so the
// width it needs is (sum of aspect ratios x that height). Once that exceeds the
// row's own width the run overflows and screenshots fall off the slide. The row
// is 1120px wide, holds 64px of gaps, and draws images at IMAGE_HEIGHT_PX, so
// the ratios can total (1120 - 64) / 412 = 2.56. Crossing the limit below means
// a screenshot has to leave the row, or the height has to drop to make space.
const IMAGE_HEIGHT_PX = 412
const MAX_RATIO_SUM = 2.5

describe('Approach evidence screenshots', () => {
  const declared = declaredScreenshots()

  it('declares every research and benchmark screenshot', () => {
    expect(declared).toHaveLength(10)
  })

  // the height the ratio budget below is calculated against
  it('draws the rows at the height the ratio budget assumes', () => {
    expect(readFileSync(SLIDE, 'utf8')).toContain(`h-[${IMAGE_HEIGHT_PX}px]`)
  })

  it.each(declared)('declares $src at its real pixel size', async ({ src, width, height }) => {
    const file = path.join(process.cwd(), 'public', src)
    const meta = await sharp(file).metadata()
    expect({ width: meta.width, height: meta.height }).toEqual({ width, height })
  })

  it.each(['research', 'benchmark'])('keeps the %s row narrow enough to fit unshrunk', (kind) => {
    const row = declared.filter(({ src }) => src.includes(`/${kind}/`))
    expect(row).toHaveLength(5)
    const ratioSum = row.reduce((total, { width, height }) => total + width / height, 0)
    expect(ratioSum).toBeLessThanOrEqual(MAX_RATIO_SUM)
  })
})
