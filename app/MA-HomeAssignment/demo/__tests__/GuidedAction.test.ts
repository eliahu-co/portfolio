import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

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

describe('GuidedAction attention treatment', () => {
  it('keeps secondary attention thinner, smaller, slower, and motion safe', () => {
    const css = readFileSync(
      resolve(process.cwd(), 'app/MA-HomeAssignment/demo/GuidedAction.module.css'),
      'utf8',
    )
    const secondaryControl = readCssBlock(css, '.secondaryAttention')
    const secondaryHalo = readCssBlock(css, '.secondaryAttention::after')
    const reducedMotion = readCssBlock(css, '@media (prefers-reduced-motion: reduce)')

    expect(secondaryControl).toMatch(/position:\s*relative;/)
    expect(secondaryControl).not.toMatch(/transform:/)
    expect(secondaryControl).not.toMatch(/animation:/)
    expect(secondaryHalo).toMatch(/inset:\s*-4px;/)
    expect(secondaryHalo).toMatch(/border:\s*3px solid #c86cff;/)
    expect(secondaryHalo).toMatch(
      /box-shadow:\s*0 0 0 1px rgba\(93, 28, 127, \.72\),\s*0 0 10px 3px rgba\(185, 76, 255, \.52\);/,
    )
    expect(secondaryHalo).toMatch(/pointer-events:\s*none;/)
    expect(secondaryHalo).toMatch(/animation:\s*guidedSecondaryHalo 2s ease-in-out infinite;/)
    expect(css).toMatch(/@keyframes guidedSecondaryHalo/)
    expect(reducedMotion).toMatch(
      /\.secondaryAttention::after\s*\{[^}]*animation:\s*none;[^}]*box-shadow:\s*0 0 0 1px rgba\(93, 28, 127, \.72\),\s*0 0 10px 3px rgba\(185, 76, 255, \.52\);[^}]*transform:\s*none;/,
    )
  })

  it('uses a raised purple halo with a static reduced-motion cue', () => {
    const css = readFileSync(
      resolve(process.cwd(), 'app/MA-HomeAssignment/demo/GuidedAction.module.css'),
      'utf8',
    )

    expect(css).toMatch(
      /\.attention\s*{[^}]*position:\s*relative;[^}]*z-index:\s*3;[^}]*animation:\s*guidedAction 1\.4s ease-in-out infinite;/,
    )
    expect(css).toMatch(
      /\.attention::after\s*{[^}]*z-index:\s*3;[^}]*inset:\s*-4px;[^}]*border:\s*4px solid #c86cff;[^}]*border-radius:\s*inherit;[^}]*pointer-events:\s*none;[^}]*animation:\s*guidedHalo 1\.4s ease-in-out infinite;/,
    )
    expect(css).toMatch(
      /@keyframes guidedHalo\s*{[\s\S]*?50%\s*{[^}]*box-shadow:\s*0 0 0 3px rgba\(93, 28, 127, \.96\),\s*0 0 14px 5px rgba\(185, 76, 255, \.9\);[^}]*transform:\s*scale\(1\.02\);/,
    )
    expect(css).toMatch(/@keyframes guidedHalo/)
    expect(css).not.toContain('255, 213, 61')
    expect(css).not.toMatch(/filter:\s*drop-shadow/)
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\)\s*{[\s\S]*?\.attention,\s*\.attention::after\s*{[^}]*animation:\s*none;/,
    )
    expect(css).toMatch(
      /\.attention\.attention:hover:not\(:disabled\),\s*\.attention\.attention:active:not\(:disabled\)\s*{[^}]*transform:\s*none;/,
    )
  })

  it('reserves paint gutters for guided halos in modal and reward scrollports', () => {
    const ribbonCss = readFileSync(
      resolve(process.cwd(), 'app/MA-HomeAssignment/demo/RibbonDialog.module.css'),
      'utf8',
    )
    const prototypeCss = readFileSync(
      resolve(process.cwd(), 'app/MA-HomeAssignment/demo/CardBountyPrototype.module.css'),
      'utf8',
    )
    const dialogBody = readCssBlock(ribbonCss, '.body')
    const rewardScreen = readCssBlock(prototypeCss, '.rewardScreen')

    expect(dialogBody).toMatch(/margin-inline:\s*-\.6rem;/)
    expect(dialogBody).toMatch(/padding:\s*\.25rem \.8rem 2rem;/)
    expect(dialogBody).toMatch(/overflow-x:\s*hidden;/)
    expect(rewardScreen).toMatch(/padding:\s*34px 32px 34px;/)
  })
})
