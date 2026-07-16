import { readFileSync } from 'fs'
import { resolve } from 'path'
import { render, screen } from '@testing-library/react'
import PresentationPage, {
  metadata,
  revalidate,
} from '@/app/MA-HomeAssignment/presentation/page'

jest.mock('@/app/MA-HomeAssignment/presentation/PresentationDeck', () => ({
  __esModule: true,
  default: () => <div data-testid="presentation-deck" />,
}))

describe('MA presentation route', () => {
  it('renders the deck inside page-scoped local font variables', () => {
    const { container } = render(<PresentationPage />)
    const page = screen.getByRole('main')

    expect(page).toContainElement(screen.getByTestId('presentation-deck'))
    expect(page.className).toContain('ma-presentation-page')
    expect(container.querySelector('main')?.className).toContain('variable')

    const source = readFileSync(resolve(
      process.cwd(),
      'app/MA-HomeAssignment/presentation/page.tsx',
    ), 'utf8')
    expect(source).toContain("../../fonts/nunito-latin-variable.woff2")
    expect(source).toContain("../../fonts/nunito-sans-latin-variable.woff2")
    expect(source).toContain("variable: '--font-cm-display'")
    expect(source).toContain("variable: '--font-cm-body'")
    expect(source).not.toContain('next/font/google')
  })

  it('is canonical but unlisted, uncached, and unavailable to crawlers', () => {
    expect(metadata).toEqual(expect.objectContaining({
      title: 'Increasing ARPDAU - Presentation by Eliahu Cohen',
      description: 'A 21-slide product presentation for the Moon Active PM home assignment.',
      alternates: {
        canonical: 'https://eliahu.co/MA-HomeAssignment/presentation/',
      },
      robots: expect.objectContaining({
        index: false,
        follow: false,
        nocache: true,
      }),
    }))
    expect(revalidate).toBe(0)
  })
})
