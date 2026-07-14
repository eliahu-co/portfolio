import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

const fontEntryPoints = [
  'app/layout.tsx',
  'app/MA-HomeAssignment/page.tsx',
  'app/HA-DrawingAnalyzer/presentation/page.tsx',
]

const localFontAssets = [
  'app/fonts/cormorant-garamond-latin-variable.woff2',
  'app/fonts/cormorant-garamond-latin-variable-italic.woff2',
  'app/fonts/dm-sans-latin-variable.woff2',
  'app/fonts/nabla-latin.woff2',
  'app/fonts/nunito-latin-variable.woff2',
  'app/fonts/nunito-sans-latin-variable.woff2',
  'app/fonts/inter-latin-variable.woff2',
]

it('keeps every app font entry point independent of Google Fonts at build time', () => {
  for (const entryPoint of fontEntryPoints) {
    const source = readFileSync(resolve(process.cwd(), entryPoint), 'utf8')

    expect(source).not.toContain('next/font/google')
    expect(source).toContain('next/font/local')
  }
})

it('vendors every local font file referenced by the app', () => {
  for (const asset of localFontAssets) {
    expect(existsSync(resolve(process.cwd(), asset))).toBe(true)
  }
})
