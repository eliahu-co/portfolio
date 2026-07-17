import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const readDemoSource = (file: string) => readFileSync(
  resolve(process.cwd(), 'app/MA-HomeAssignment/demo', file),
  'utf8',
)

const readCssBlock = (source: string, rule: string) => {
  const ruleStart = source.indexOf(rule)
  const openingBrace = source.indexOf('{', ruleStart)
  if (ruleStart < 0 || openingBrace < 0) return ''

  let depth = 0
  for (let index = openingBrace; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1
    if (source[index] !== '}') continue

    depth -= 1
    if (depth === 0) return source.slice(openingBrace + 1, index)
  }

  return ''
}

describe('DemoShell presentation contract', () => {
  it('uses a compact purple dot for desktop guidance', () => {
    const css = readDemoSource('CardBountyPrototype.module.css')
    const guidanceDot = readCssBlock(css, '.guidance > span')

    expect(guidanceDot).toMatch(/width:\s*8px;/)
    expect(guidanceDot).toMatch(/height:\s*8px;/)
    expect(guidanceDot).toMatch(/background:\s*#c86cff;/)
    expect(guidanceDot).toMatch(
      /box-shadow:\s*0 0 0 4px rgba\(200, 108, 255, \.18\),\s*0 0 10px rgba\(200, 108, 255, \.62\);/,
    )
    expect(guidanceDot).toMatch(/animation:\s*guidePulse 1\.8s ease-in-out infinite;/)
    expect(guidanceDot).not.toContain('#ef9f00')
  })

  it('uses the polished desktop shell geometry without sky decoration', () => {
    const shell = readDemoSource('DemoShell.tsx')
    const css = readDemoSource('CardBountyPrototype.module.css')

    expect(css).toMatch(/\.demoRoot\s*{[^}]*background:\s*#FFF9EE;/)
    expect(css).toMatch(/\.prototypeControls\s*{[\s\S]*?background:\s*var\(--color-gray-ui\)/)
    expect(css).toMatch(/\.prototypeControls\s*{[^}]*border:\s*2px solid rgba\(144, 57, 0, \.5\);/)
    expect(css).toMatch(/\.prototypeControls\s*{[^}]*border-radius:\s*16px;/)
    expect(css).toMatch(/\.prototypeControls\s*{[^}]*box-shadow:\s*0 3px 0 rgba\(144, 57, 0, \.28\);/)
    expect(css).toMatch(/\.gameViewport\s*{[^}]*border:\s*2px solid rgba\(144, 57, 0, \.5\);/)
    expect(css).toMatch(/\.gameViewport\s*{[^}]*border-radius:\s*16px;/)
    expect(css).toMatch(/\.gameViewport\s*{[^}]*box-shadow:\s*0 3px 0 rgba\(144, 57, 0, \.28\);/)
    expect(css).toMatch(/\.homeLink,\s*\.restartButton\s*{[^}]*border-radius:\s*12px;/)
    expect(css).not.toContain('/coinmaster-sky.webp')
    expect(shell).not.toMatch(/skyGlow|floatingCoin/)
  })

  it('keeps the mobile game stage edge to edge', () => {
    const css = readDemoSource('CardBountyPrototype.module.css')
    const mobileCss = readCssBlock(css, '@media (max-width: 767px)')

    expect(mobileCss).toMatch(
      /\.gameViewport\s*{[^}]*width:\s*100vw;[^}]*height:\s*100dvh;[^}]*border:\s*0;[^}]*border-radius:\s*0;[^}]*box-shadow:\s*none;/,
    )
  })

  it('defines a presentation mode without changing the standalone shell', () => {
    const shell = readDemoSource('DemoShell.tsx')
    const css = readDemoSource('CardBountyPrototype.module.css')

    expect(shell).toContain("mode = 'standalone'")
    expect(shell).toContain('data-prototype-presentation-shell')
    expect(shell).toContain('data-prototype-presentation-controls')
    expect(shell).toContain('data-prototype-scale-stage')
    expect(shell).toContain('ResizeObserver')
    expect(css).toMatch(/\.demoRootPresentation\s*{[^}]*height:\s*100%;[^}]*min-height:\s*0;/)
    expect(css).toMatch(/\.demoRootPresentation\s*{[^}]*display:\s*block;/)
    expect(css).toMatch(/\.prototypeControlsPresentation\s*{[^}]*position:\s*absolute;[^}]*top:\s*118px;[^}]*left:\s*0;/)
    expect(css).toMatch(/\.prototypeControlsPresentation\s*{[^}]*transform:\s*none;/)
    expect(css).toMatch(/\.restartButtonPresentation\s*{[^}]*border-radius:\s*999px;[^}]*background:\s*linear-gradient\(to bottom, #FFD95C, #F6B719\);/)
    expect(css).toMatch(/\.restartButtonPresentation\s*{[^}]*box-shadow:\s*0 3px 0 #B7202E, 0 8px 18px rgba\(31, 20, 75, \.3\);/)
    expect(css).toMatch(/\.gameViewportPresentation\s*{[^}]*width:\s*430px;[^}]*height:\s*932px;/)
    expect(css).toMatch(/\.gameViewportPresentation\s*{[^}]*transform:\s*translate\(-50%, -50%\) scale\(var\(--prototype-scale\)\);/)
  })
})
