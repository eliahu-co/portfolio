import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('Vercel function tracing', () => {
  it('renders the homepage gallery from a static manifest', () => {
    const serverComponent = readFileSync(
      join(process.cwd(), 'components', 'WorkBannerServer.tsx'),
      'utf8'
    )

    expect(serverComponent).toContain("import manifest from './workBannerManifest.json'")
    expect(serverComponent).not.toMatch(/from ['"](?:node:)?fs['"]|readdirSync|readFileSync/)
  })
})
