import { render, screen } from '@testing-library/react'
import Slide05ThreeBets from '@/app/MA-HomeAssignment/presentation/slides/Slide05ThreeBets'
import Slide06Hometown from '@/app/MA-HomeAssignment/presentation/slides/Slide06HometownThesis'
import Slide08CardBounty from '@/app/MA-HomeAssignment/presentation/slides/Slide08CardBountyThesis'
import Slide10HotTrail from '@/app/MA-HomeAssignment/presentation/slides/Slide10HotTrailThesis'

describe('MA presentation features', () => {
  it('introduces three bets without preview controls', () => {
    render(<Slide05ThreeBets slideKey="slide-5" />)
    expect(screen.getByRole('heading', { name: 'Three bets' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Hometown' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Card Bounty' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Hot Trail' })).toBeVisible()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it.each([
    [Slide06Hometown, 'Hometown'],
    [Slide08CardBounty, 'Card Bounty'],
    [Slide10HotTrail, 'Hot Trail'],
  ])('renders each feature as one complete slide', (Component, title) => {
    const { container } = render(<Component slideKey="feature" />)
    expect(screen.getByRole('heading', { name: title })).toBeVisible()
    expect(container.querySelector('img')).toBeInTheDocument()
    expect(screen.getByText('Player motivation')).toBeVisible()
    expect(screen.getByText('Risks')).toBeVisible()
  })
})
