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
    expect(screen.queryByRole('heading', { name: 'Loop' })).not.toBeInTheDocument()
    expect(container.querySelectorAll('img')).toHaveLength(1)
    expect(container.querySelector('img')).toHaveClass('h-full', 'max-h-none', 'w-auto')
    const loop = container.querySelector(`[data-feature-loop="${title}"]`)!
    const loopStack = loop.querySelector('[data-feature-loop-stack="true"]')!
    const image = container.querySelector(`[data-feature-image="${title}"]`)!
    const reveal = container.querySelector(`[data-feature-reveal="${title}"]`)!
    expect(loop.compareDocumentPosition(image) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(image).toHaveClass('-mt-[99px]')
    expect(container.querySelector('[data-feature-body="true"]')).toHaveClass('mt-8')
    expect(container.querySelector('[data-feature-body="true"]')).not.toHaveClass('mt-4')
    expect(reveal).toHaveClass('opacity-0', 'pointer-events-none')
    expect(container.querySelectorAll('[data-feature-loop-arrow][data-flow-arrow="true"]')).toHaveLength(
      title === 'Hometown' ? 3 : 4,
    )
    expect(loop.querySelectorAll('[data-loop-step]')).toHaveLength(title === 'Hometown' ? 4 : 5)
    const returnArrow = loop.querySelector('[data-loop-return="true"][data-flow-arrow="true"]')!
    expect(returnArrow).toBeInTheDocument()
    expect(returnArrow.querySelector('[data-loop-return-shaft]')).toHaveAttribute('stroke', '#1E7BA8')
    expect(returnArrow.querySelector('[data-loop-return-shaft]')).toHaveAttribute('stroke-width', '1.3')
    expect(returnArrow.querySelector('[data-loop-return-head]')).toHaveAttribute('stroke', '#1E7BA8')
    expect(returnArrow.querySelector('[data-loop-return-head]')).toHaveAttribute('stroke-width', '1.3')
    expect(loop.querySelectorAll('[data-blue-surface="true"]').length).toBeGreaterThan(0)
    expect(loop.querySelectorAll('[data-wood-surface="true"]').length).toBeGreaterThan(0)
    loop.querySelectorAll('[data-blue-surface="true"], [data-wood-surface="true"]').forEach((surface) => {
      expect(surface).toHaveClass('font-normal')
      expect(surface).not.toHaveClass('font-bold', 'font-extrabold')
    })
    expect(loopStack).not.toHaveClass('mx-auto')
    expect(loopStack).toHaveClass('max-w-[350px]')
    expect(container.querySelector('[data-feature-frame="true"]')).toHaveClass('h-[calc(100vh-228px)]')
    expect(container.querySelector('[data-feature-frame="true"]')).not.toHaveClass('w-full')
    expect(container.querySelector('[data-feature-frame="true"]')).not.toHaveClass('px-4')
    expect(container.querySelector('[data-feature-frame="true"]')).not.toHaveClass(
      'bg-white',
      'p-1',
      'shadow-[0_4px_0_rgba(144,57,0,0.28)]',
    )
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
    expect(layout).toHaveClass('grid-cols-[0.72fr_1fr]')
  })

  it('resets a revealed trade-off when the slide key changes', () => {
    const { rerender } = render(<Slide08CardBounty slideKey="feature-1" />)
    fireEvent.click(screen.getByRole('button', { name: 'Trade-off' }))
    expect(screen.getByRole('button', { name: 'Trade-off' })).toHaveAttribute('aria-expanded', 'true')
    rerender(<Slide08CardBounty slideKey="feature-2" />)
    expect(screen.getByRole('button', { name: 'Trade-off' })).toHaveAttribute('aria-expanded', 'false')
  })
})
