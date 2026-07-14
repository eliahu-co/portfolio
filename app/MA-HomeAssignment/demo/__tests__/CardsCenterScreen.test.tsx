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
})
