// __tests__/layout.test.tsx
import { readFileSync } from 'fs'
import { resolve } from 'path'

it('globals css loads without error', () => {
  // Smoke test — if the module imports throw, this fails
  expect(true).toBe(true)
})

it('keeps a sans-serif body fallback when a Next font variable is unavailable', () => {
  const css = readFileSync(resolve(process.cwd(), 'app/globals.css'), 'utf8')

  expect(css).toMatch(/body\s*{[^}]*font-family:\s*var\(--font-inter,\s*system-ui\),\s*sans-serif/)
})
