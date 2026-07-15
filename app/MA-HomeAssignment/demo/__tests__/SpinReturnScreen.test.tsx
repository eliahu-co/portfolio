import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fireEvent, render, screen, within } from '@testing-library/react'
import SpinReturnScreen from '../SpinReturnScreen'

it('keeps the deterministic reel order when Spin starts the core loop', () => {
  render(
    <SpinReturnScreen
      coins={300_000_000}
      spins={4_350}
      reward={2_500}
      targetName="Whale Boat"
    />,
  )

  const reels = screen.getByRole('region', { name: 'Slot machine reels' })
  const before = within(reels).getAllByRole('img').map((node) => node.getAttribute('alt'))
  expect(before).toHaveLength(9)
  expect(before).toEqual([
    'Energy barrel symbol, row 1, reel 1',
    'Crown coin symbol, row 1, reel 2',
    'Energy barrel symbol, row 1, reel 3',
    'Energy hammer symbol, row 2, reel 1',
    'Crown coin symbol, row 2, reel 2',
    'Crown coin symbol, row 2, reel 3',
    'Crown coin symbol, row 3, reel 1',
    'Pig thief symbol, row 3, reel 2',
    'Pig thief symbol, row 3, reel 3',
  ])
  expect(screen.getByRole('group', { name: 'Coin balance: 300,000,000' })).toBeInTheDocument()
  expect(screen.getByRole('group', { name: 'Spin balance: 4,350' })).toBeInTheDocument()
  expect(screen.getByText('Collection reward: +2,500 Spins')).toBeInTheDocument()
  expect(screen.getByText('Reward added')).not.toHaveClass('finishedStatus')

  const spin = screen.getByRole('button', { name: 'Spin' })
  expect(spin).toHaveAttribute('aria-pressed', 'false')
  const firstSymbol = within(reels).getAllByRole('img')[0]
  fireEvent.click(spin)
  expect(spin).toHaveAttribute('aria-pressed', 'true')
  expect(spin).toBeEnabled()
  expect(screen.getByText('You finished the demo!')).toHaveClass('finishedStatus')
  expect(within(reels).getAllByRole('img').map((node) => node.getAttribute('alt'))).toEqual(before)
  const firstReplay = within(reels).getAllByRole('img')[0]
  expect(firstReplay).not.toBe(firstSymbol)

  fireEvent.click(spin)
  expect(spin).toBeEnabled()
  expect(within(reels).getAllByRole('img')[0]).not.toBe(firstReplay)
  expect(within(reels).getAllByRole('img').map((node) => node.getAttribute('alt'))).toEqual(before)
})

it('exposes the fake Spin as the only interactive control', () => {
  render(
    <SpinReturnScreen
      coins={2_040_000_000}
      spins={4_350}
      reward={2_500}
      targetName="Whale Boat"
    />,
  )

  expect(screen.getAllByRole('button')).toEqual([screen.getByRole('button', { name: 'Spin' })])
  expect(screen.queryByRole('link')).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Open game menu' })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Shop' })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Cards Center' })).not.toBeInTheDocument()
  expect(screen.getByRole('region', { name: 'Energy and Spins' })).toBeInTheDocument()
  expect(screen.queryByText('Raid')).not.toBeInTheDocument()
  expect(screen.queryByText('Booster')).not.toBeInTheDocument()
  expect(screen.queryByLabelText('Spin multiplier')).not.toBeInTheDocument()
  expect(screen.queryByText('x1')).not.toBeInTheDocument()
})

it('keeps the visible cabinet dominant without obsolete in-game navigation styles', () => {
  const css = readFileSync(
    resolve(process.cwd(), 'app/MA-HomeAssignment/demo/SpinReturnScreen.module.css'),
    'utf8',
  )

  expect(css).toMatch(/\.boardStage\s*{[^}]*height:\s*61%/)
  expect(css).toMatch(/\.rewardStatus\s*{[^}]*bottom:\s*max\(8\.2%,\s*calc\(74px \+ env\(safe-area-inset-bottom\)\)\)/)
  expect(css).toMatch(
    /\.resourceBar\s*{[^}]*grid-template-columns:\s*minmax\(98px, 1\.45fr\) minmax\(54px, \.7fr\) minmax\(72px, 1fr\);/,
  )
  expect(css).not.toMatch(/\.menuButton/)
  expect(css).not.toMatch(/\.shopButton/)
  expect(css).not.toMatch(/\.cardsCenterButton/)
  expect(css).not.toMatch(/\.cardsCenterIcon/)
  expect(css).toMatch(
    /\.rewardStatus strong\.finishedStatus\s*{[^}]*text-transform:\s*none/,
  )
  expect(css).toMatch(
    /@media \(prefers-reduced-motion: reduce\)\s*\{[\s\S]*?\.spinButton\s*\{[^}]*outline:\s*3px solid #ffe56a/,
  )
})
