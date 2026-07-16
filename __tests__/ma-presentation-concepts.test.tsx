import { fireEvent, render, screen } from '@testing-library/react'
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
    expect(container.querySelectorAll('img')).toHaveLength(1)
    expect(container.querySelector('img')).toHaveClass('max-h-[330px]', 'w-auto')
    const loop = container.querySelector(`[data-feature-loop="${title}"]`)!
    const image = container.querySelector(`[data-feature-image="${title}"]`)!
    const reveal = container.querySelector(`[data-feature-reveal="${title}"]`)!
    expect(loop.compareDocumentPosition(image) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(reveal).toHaveClass('opacity-0', 'pointer-events-none')
    expect(container.querySelectorAll('[data-feature-loop-arrow][data-flow-arrow="true"]')).toHaveLength(
      title === 'Hometown' ? 3 : 4,
    )
    expect(loop.querySelectorAll('[data-blue-surface="true"]').length).toBeGreaterThan(0)
    expect(container.querySelector('[data-feature-frame="true"]')).not.toHaveClass('w-full')
    expect(container.querySelector('[data-feature-frame="true"]')).not.toHaveClass('px-4')
    expect(container.querySelectorAll('.border-l-4, .border-l-8')).toHaveLength(0)

    const tradeoff = screen.getByRole('button', { name: 'Trade-off' })
    expect(tradeoff).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(tradeoff)
    expect(tradeoff).toHaveAttribute('aria-expanded', 'true')
    expect(reveal).toHaveClass('opacity-100')
    expect(loop).toHaveClass('opacity-20')
    expect(image).toHaveClass('opacity-20')
    fireEvent.click(tradeoff)
    expect(tradeoff).toHaveAttribute('aria-expanded', 'false')

    const layout = container.querySelector(`[data-feature-layout="${title}"]`)
    expect(layout).toHaveClass('grid-cols-[1fr_0.78fr]')
  })

  it('resets a revealed trade-off when the slide key changes', () => {
    const { rerender } = render(<Slide08CardBounty slideKey="feature-1" />)
    fireEvent.click(screen.getByRole('button', { name: 'Trade-off' }))
    expect(screen.getByRole('button', { name: 'Trade-off' })).toHaveAttribute('aria-expanded', 'true')
    rerender(<Slide08CardBounty slideKey="feature-2" />)
    expect(screen.getByRole('button', { name: 'Trade-off' })).toHaveAttribute('aria-expanded', 'false')
  })
})
