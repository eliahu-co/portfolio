import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { render, screen, within } from '@testing-library/react'
import CardsCenterScreen from '../CardsCenterScreen'

describe('CardsCenterScreen', () => {
  it('renders the collection medallions and stage-local controls', () => {
    const onOpenBounty = jest.fn()

    const { container } = render(
      <CardsCenterScreen countdown={85_272} onOpenBounty={onOpenBounty} />,
    )

    expect(screen.getByRole('heading', { name: 'Cards Center' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Close Cards Center' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Close Cards Center' })).not.toBeInTheDocument()
    const closeDisplay = container.querySelector('.closeDisplay')
    expect(closeDisplay).toHaveAttribute('aria-hidden', 'true')
    expect(closeDisplay?.querySelector('svg')).toBeInTheDocument()
    const list = screen.getByRole('list', { name: 'Card collections' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(8)
    expect(screen.getAllByRole('button', { name: 'Open Card Bounty' })).toHaveLength(1)
    expect(screen.queryByLabelText(/Coins/i)).not.toBeInTheDocument()
    const navigation = screen.getByRole('navigation', { name: 'Cards Center views' })
    expect(navigation).toBeInTheDocument()

    for (const label of ['Sets', 'Albums']) {
      const tabLabel = within(navigation).getByText(label)
      expect(tabLabel).toHaveClass('tabLabel')
      expect(tabLabel.previousElementSibling).toHaveAttribute('aria-hidden', 'true')
    }
  })

  it('renders a completed, non-interactive Bounty state and updates the earned collection', () => {
    const onOpenBounty = jest.fn()

    render(
      <CardsCenterScreen
        countdown={0}
        eventCompleted
        completedCollection="Sinbad"
        onOpenBounty={onOpenBounty}
      />,
    )

    const heading = screen.getByRole('heading', { name: 'Cards Center' })
    expect(heading).toHaveAttribute('tabindex', '-1')
    const completedBounty = screen.getByRole('button', { name: 'Card Bounty completed' })
    expect(completedBounty).toBeDisabled()
    expect(within(completedBounty).getByText('Complete')).toBeInTheDocument()
    expect(
      screen.getByRole('listitem', { name: 'Sinbad, 9 of 9 Cards, reward Complete' }),
    ).toBeInTheDocument()
  })

  it('caps collection scale and keeps the active treatment off the tab label', () => {
    const css = readFileSync(
      resolve(process.cwd(), 'app/MA-HomeAssignment/demo/CardsCenterScreen.module.css'),
      'utf8',
    )

    expect(css).toMatch(
      /\.collectionList\s*{[^}]*--medallion-size:\s*min\(30cqw,\s*128px\);[^}]*grid-template-columns:\s*repeat\(2,\s*var\(--medallion-size\)\)/,
    )
    expect(css).not.toMatch(/\.activeTab b\s*\{/)
    expect(css).toMatch(/\.activeTab \.tabCard\s*\{/)
  })

  it('keeps collection ribbons within the portrait columns', () => {
    const css = readFileSync(
      resolve(process.cwd(), 'app/MA-HomeAssignment/demo/CardsCenterScreen.module.css'),
      'utf8',
    )

    expect(css).toMatch(
      /\.ribbon\s*\{[^}]*width:\s*100%;[^}]*min-height:\s*32px;[^}]*margin-top:\s*-27px;[^}]*padding:\s*5px 9px 6px;/,
    )
    expect(css).toMatch(
      /\.ribbon::before,\s*\.ribbon::after\s*\{[^}]*top:\s*6px;[^}]*width:\s*14px;[^}]*height:\s*20px;/,
    )
    expect(css).toMatch(/\.ribbon::before\s*\{[^}]*left:\s*-7px;/)
    expect(css).toMatch(/\.ribbon::after\s*\{[^}]*right:\s*-7px;/)
    expect(css).toMatch(
      /\.ribbon strong\s*\{[^}]*font-size:\s*clamp\(11px,\s*3\.4cqw,\s*15px\);/,
    )
  })

  it('gives the bounty entry a reduced-motion-safe attention cue', () => {
    const css = readFileSync(
      resolve(process.cwd(), 'app/MA-HomeAssignment/demo/CardsCenterScreen.module.css'),
      'utf8',
    )

    expect(css).toMatch(/\.bountyButton\s*\{[\s\S]*?animation:\s*bountyNudge/)
    expect(css).toMatch(/\.bountyButton::before\s*\{[\s\S]*?animation:\s*bountyGlow/)
    expect(css).toMatch(/@keyframes bountyNudge/)
    expect(css).toMatch(/@keyframes bountyGlow/)
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\)\s*\{[\s\S]*?\.bountyButton,\s*\.bountyButton::before\s*\{[^}]*animation:\s*none/,
    )
    expect(css).toMatch(/\.bountyButtonCompleted,\s*\.bountyButtonCompleted::before\s*\{[^}]*animation:\s*none/)
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
