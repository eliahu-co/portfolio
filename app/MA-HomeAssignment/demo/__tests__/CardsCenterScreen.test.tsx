import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { render, screen, within } from '@testing-library/react'
import CardsCenterScreen from '../CardsCenterScreen'

describe('CardsCenterScreen', () => {
  it('renders the collection medallions and stage-local controls', () => {
    const onOpenBounty = jest.fn()

    render(<CardsCenterScreen countdown={85_272} onOpenBounty={onOpenBounty} />)

    expect(screen.getByRole('heading', { name: 'Cards Center' })).toBeInTheDocument()
    const list = screen.getByRole('list', { name: 'Card collections' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(8)
    expect(screen.getAllByRole('button', { name: 'Open Card Bounty' })).toHaveLength(1)
    expect(screen.queryByLabelText(/Coins/i)).not.toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Cards Center views' })).toBeInTheDocument()
  })

  it('reserves safe-area space without changing the zero-inset layout dimensions', () => {
    const css = readFileSync(
      resolve(process.cwd(), 'app/MA-HomeAssignment/demo/CardsCenterScreen.module.css'),
      'utf8',
    )

    expect(css).toMatch(
      /grid-template-rows:\s*calc\(118px \+ env\(safe-area-inset-top\)\)\s+minmax\(0, 1fr\)\s+calc\(86px \+ env\(safe-area-inset-bottom\)\)/,
    )
    expect(css).toMatch(
      /\.screen::before\s*{[^}]*inset:\s*calc\(118px \+ env\(safe-area-inset-top\)\) 0 calc\(86px \+ env\(safe-area-inset-bottom\)\)/,
    )
    expect(css).toMatch(
      /\.header\s*{[^}]*padding:\s*calc\(15px \+ env\(safe-area-inset-top\)\) 17px 12px/,
    )
    expect(css).toMatch(/\.tabs\s*{[^}]*padding-bottom:\s*env\(safe-area-inset-bottom\)/)
  })
})
