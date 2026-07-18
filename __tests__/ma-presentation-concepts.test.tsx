import { fireEvent, render, screen } from '@testing-library/react'
import Slide06Hometown from '@/app/MA-HomeAssignment/presentation/slides/Slide06HometownThesis'
import Slide08CardBounty from '@/app/MA-HomeAssignment/presentation/slides/Slide08CardBountyThesis'
import Slide10HotTrail from '@/app/MA-HomeAssignment/presentation/slides/Slide10HotTrailThesis'

describe('MA presentation features', () => {
  it.each([
    [Slide06Hometown, 'Hometown'],
    [Slide08CardBounty, 'Card Bounty'],
    [Slide10HotTrail, 'Hot Trail'],
  ])('renders each feature as one complete slide', (Component, title) => {
    const { container } = render(<Component slideKey="feature" />)
    expect(screen.getByRole('heading', { name: title })).toBeVisible()
    expect(screen.queryByRole('heading', { name: 'Loop' })).not.toBeInTheDocument()
    expect(container.querySelectorAll('img')).toHaveLength(
      title === 'Hometown' ? 7 : 9,
    )
    expect(container.querySelector('[data-feature-frame="true"] img')).toHaveClass('h-full', 'max-h-none', 'w-auto')
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

  it('renders Hometown coin changes inside the right edge of relevant steps', () => {
    const { container } = render(<Slide06Hometown slideKey="hometown-resources" />)
    const loop = container.querySelector('[data-feature-loop="Hometown"]')!

    expect(loop).toHaveTextContent('Complete Villages')
    expect(loop).toHaveTextContent('Unlock Hometown items')
    expect(loop).toHaveTextContent('Build new Items')
    expect(loop).toHaveTextContent('Get Village build discount!')
    expect(loop).not.toHaveTextContent('Spend Coins to construct new Hometown items')
    expect(loop).not.toHaveTextContent('Receive a discount on the next Village upgrade')

    expect(loop.querySelectorAll('[data-resource-indicator="true"]')).toHaveLength(3)
    expect(screen.getAllByLabelText('Spend Coins')).toHaveLength(2)
    expect(screen.getByLabelText('Gain Coins')).toBeInTheDocument()
    expect(loop.querySelectorAll('img[src*="coin-emoji.png"]')).toHaveLength(3)
    expect(loop.querySelectorAll('img[src*="minus-badge.png"]')).toHaveLength(2)
    expect(loop.querySelectorAll('img[src*="plus-badge.png"]')).toHaveLength(1)
    const unlockStep = screen.getByText('Unlock Hometown items').closest('[data-loop-step]')!
    expect(unlockStep.querySelector('[data-resource-indicator="true"]')).not.toBeInTheDocument()
  })

  it('renders Hot Trail resource changes inside the right edge of relevant steps', () => {
    const { container } = render(<Slide10HotTrail slideKey="hot-trail-resources" />)
    const loop = container.querySelector('[data-feature-loop="Hot Trail"]')!

    expect(loop).toHaveTextContent('Progress the Village')
    expect(loop).toHaveTextContent('Get Raided')
    expect(loop).toHaveTextContent('Spin to Raid')
    expect(loop).not.toHaveTextContent('Trigger a Raid')
    expect(loop).toHaveTextContent('Counter-Raid')
    expect(loop).not.toHaveTextContent('Spend Coins')
    expect(loop).not.toHaveTextContent('lose Coins')
    expect(loop).not.toHaveTextContent('Use Spins')
    expect(loop).not.toHaveTextContent('recover part of the loss')

    const indicators = loop.querySelectorAll('[data-resource-indicator="true"]')
    expect(indicators).toHaveLength(4)
    expect(screen.getAllByLabelText('Spend Coins')).toHaveLength(2)
    expect(screen.getByLabelText('Spend Spins')).toBeInTheDocument()
    expect(screen.getByLabelText('Gain Coins')).toBeInTheDocument()
    expect(loop.querySelectorAll('img[src*="coin-emoji.png"]')).toHaveLength(3)
    expect(loop.querySelectorAll('img[src*="spin-emoji.png"]')).toHaveLength(1)
    loop.querySelectorAll('[data-resource-indicator="true"] img').forEach((emoji) => {
      expect(emoji).toHaveAttribute('alt', '')
    })
    expect(loop.querySelectorAll('img[src*="minus-badge.png"]')).toHaveLength(3)
    expect(loop.querySelectorAll('img[src*="plus-badge.png"]')).toHaveLength(1)
    expect(loop.querySelectorAll('[data-resource-sign="true"]')).toHaveLength(4)
    const activationStep = screen.getByText('Activate Hot Trail').closest('[data-loop-step]')!
    expect(activationStep.querySelector('[data-resource-indicator="true"]')).not.toBeInTheDocument()
  })

  it('renders Card Bounty resource outcomes inside the right edge of relevant steps', () => {
    const { container } = render(<Slide08CardBounty slideKey="card-bounty-resources" />)
    const loop = container.querySelector('[data-feature-loop="Card Bounty"]')!

    expect(loop).toHaveTextContent('Spin')
    expect(loop).toHaveTextContent('Target a card')
    expect(loop).toHaveTextContent('Buy Chests - fill the meter')
    expect(loop).toHaveTextContent('Get the card')
    expect(loop).toHaveTextContent('Complete the Collection')
    expect(loop).not.toHaveTextContent('Choose a missing Card from a Collection')
    expect(loop).not.toHaveTextContent('Spend Coins on Chests')
    expect(loop).not.toHaveTextContent('Receive the target Card')

    const indicators = loop.querySelectorAll('[data-resource-indicator="true"]')
    expect(indicators).toHaveLength(4)
    expect(screen.getByLabelText('Spend Coins')).toBeInTheDocument()
    expect(screen.getByLabelText('Spend Spins')).toBeInTheDocument()
    expect(screen.getByLabelText('Gain Card')).toBeInTheDocument()
    expect(screen.getByLabelText('Gain Spins')).toBeInTheDocument()
    expect(loop.querySelectorAll('img[src*="coin-emoji.png"]')).toHaveLength(1)
    expect(loop.querySelectorAll('img[src*="card-emoji.png"]')).toHaveLength(1)
    expect(loop.querySelectorAll('img[src*="spin-emoji.png"]')).toHaveLength(2)
    expect(loop.querySelectorAll('img[src*="minus-badge.png"]')).toHaveLength(2)
    expect(loop.querySelectorAll('img[src*="plus-badge.png"]')).toHaveLength(2)
    const targetStep = screen.getByText('Target a card').closest('[data-loop-step]')!
    expect(targetStep.querySelector('[data-resource-indicator="true"]')).not.toBeInTheDocument()
  })

  it('resets a revealed trade-off when the slide key changes', () => {
    const { rerender } = render(<Slide08CardBounty slideKey="feature-1" />)
    fireEvent.click(screen.getByRole('button', { name: 'Trade-off' }))
    expect(screen.getByRole('button', { name: 'Trade-off' })).toHaveAttribute('aria-expanded', 'true')
    rerender(<Slide08CardBounty slideKey="feature-2" />)
    expect(screen.getByRole('button', { name: 'Trade-off' })).toHaveAttribute('aria-expanded', 'false')
  })
})
