import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fireEvent, render, screen, within } from '@testing-library/react'
import SpinReturnScreen from '../SpinReturnScreen'

it('keeps the deterministic reel order when Spin starts the core loop', () => {
  render(<SpinReturnScreen coins={300_000_000} spins={4_350} reward={2_500} targetName="Whale Boat" />)

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

  const spin = screen.getByRole('button', { name: 'Spin' })
  expect(spin).toHaveAttribute('aria-pressed', 'false')
  fireEvent.click(spin)
  expect(spin).toHaveAttribute('aria-pressed', 'true')
  expect(screen.getByText('Core loop ready')).toBeInTheDocument()
  expect(within(reels).getAllByRole('img').map((node) => node.getAttribute('alt'))).toEqual(before)
})

it('keeps the visible cabinet dominant and reserves space above mobile prototype controls', () => {
  const css = readFileSync(
    resolve(process.cwd(), 'app/MA-HomeAssignment/demo/SpinReturnScreen.module.css'),
    'utf8',
  )

  expect(css).toMatch(/\.boardStage\s*{[^}]*height:\s*61%/)
  expect(css).toMatch(/\.rewardStatus\s*{[^}]*bottom:\s*max\(8\.2%,\s*calc\(74px \+ env\(safe-area-inset-bottom\)\)\)/)
})
