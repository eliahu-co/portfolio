import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('GuidedAction attention treatment', () => {
  it('uses a raised purple halo with a static reduced-motion cue', () => {
    const css = readFileSync(
      resolve(process.cwd(), 'app/MA-HomeAssignment/demo/GuidedAction.module.css'),
      'utf8',
    )

    expect(css).toMatch(
      /\.attention\s*{[^}]*position:\s*relative;[^}]*z-index:\s*3;[^}]*animation:\s*guidedAction 1\.4s ease-in-out infinite;/,
    )
    expect(css).toMatch(
      /\.attention::after\s*{[^}]*z-index:\s*3;[^}]*inset:\s*-6px;[^}]*border:\s*4px solid #c86cff;[^}]*border-radius:\s*inherit;[^}]*pointer-events:\s*none;[^}]*animation:\s*guidedHalo 1\.4s ease-in-out infinite;/,
    )
    expect(css).toMatch(/@keyframes guidedHalo/)
    expect(css).not.toContain('255, 213, 61')
    expect(css).not.toMatch(/filter:\s*drop-shadow/)
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\)\s*{[\s\S]*?\.attention,\s*\.attention::after\s*{[^}]*animation:\s*none;/,
    )
  })
})
