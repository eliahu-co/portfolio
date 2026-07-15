import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const readDemoSource = (file: string) => readFileSync(
  resolve(process.cwd(), 'app/MA-HomeAssignment/demo', file),
  'utf8',
)

describe('DemoShell presentation contract', () => {
  it('uses the portfolio canvas and plaque tokens without sky decoration', () => {
    const shell = readDemoSource('DemoShell.tsx')
    const css = readDemoSource('CardBountyPrototype.module.css')

    expect(css).toMatch(/\.demoRoot\s*{[\s\S]*?background:\s*var\(--color-canvas\)/)
    expect(css).toMatch(/\.prototypeControls\s*{[\s\S]*?background:\s*var\(--color-gray-ui\)/)
    expect(css).toMatch(/\.prototypeControls\s*{[\s\S]*?border:\s*var\(--border\)/)
    expect(css).toMatch(/\.prototypeControls\s*{[\s\S]*?border-radius:\s*2px/)
    expect(css).toMatch(/\.prototypeControls\s*{[\s\S]*?box-shadow:\s*var\(--shadow-card\)/)
    expect(css).not.toContain('/coinmaster-sky.webp')
    expect(shell).not.toMatch(/skyGlow|floatingCoin/)
  })

  it('keeps the mobile game stage edge to edge', () => {
    const css = readDemoSource('CardBountyPrototype.module.css')

    expect(css).toMatch(
      /@media \(max-width: 767px\)[\s\S]*\.gameViewport\s*{[^}]*width:\s*100vw;[^}]*height:\s*100dvh;[^}]*border:\s*0;[^}]*border-radius:\s*0;/,
    )
  })
})
