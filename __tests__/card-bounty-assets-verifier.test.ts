import { spawnSync } from 'node:child_process'

it('verifies every Card Bounty runtime asset, including optimized Chests and both posters', () => {
  const result = spawnSync(process.execPath, ['scripts/verify-card-bounty-assets.js'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  })

  expect(result.stderr).toBe('')
  expect(result.status).toBe(0)
  expect(result.stdout).toContain('coinmaster/card-bounty/wooden-chest.webp: 192x192')
  expect(result.stdout).toContain('coinmaster/card-bounty-preview.webp: 860x1864')
  expect(result.stdout).toContain('coinmaster/card-bounty-preview.jpg: 860x1864')
  expect(result.stdout).toContain('Verified 32 runtime assets; runtime payload is')
})
