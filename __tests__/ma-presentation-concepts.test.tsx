import { fireEvent, render, screen } from '@testing-library/react'
import Slide06Hometown from '@/app/MA-HomeAssignment/presentation/slides/Slide06HometownThesis'
import Slide08CardBounty from '@/app/MA-HomeAssignment/presentation/slides/Slide08CardBountyThesis'
import Slide10HotTrail from '@/app/MA-HomeAssignment/presentation/slides/Slide10HotTrailThesis'

describe('MA presentation features', () => {
  it.each([
    [Slide06Hometown, 'Hometown', ['Core Cannibalization', 'Paying Twice', 'Weak Customization Demand'], ['ARPDAU', 'Coin spend on Hometown per DAU', 'Repeat customization', 'Return sessions per Hometown user']],
    [Slide08CardBounty, 'Card Bounty', ['System Cannibalization', 'Collection Acceleration', 'Spend Shifting'], ['ARPDAU', 'ARPPU by payer tier', 'Coin Spend on Chests per DAU', 'Bounty activation']],
    [Slide10HotTrail, 'Hot Trail', ['Retaliation Loops', 'Failed Urgency', 'Economy Distortion'], ['ARPDAU', 'Hot Trail activation', 'Return rate', 'Spin consumption per exposed DAU']],
  ])('renders each feature as one complete slide', (Component, title, risks, metrics) => {
    const { container } = render(<Component slideKey="feature" />)
    expect(screen.getByRole('heading', { name: title })).toBeVisible()
    expect(screen.queryByRole('heading', { name: 'Loop' })).not.toBeInTheDocument()
    expect(container.querySelectorAll('img')).toHaveLength(11)
    expect(container.querySelector('[data-feature-frame="true"] img')).toHaveClass('h-full', 'max-h-none', 'w-auto')
    const loop = container.querySelector(`[data-feature-loop="${title}"]`)!
    const disclosures = container.querySelector('[data-feature-disclosures="true"]')!
    const loopStack = loop.querySelector('[data-feature-loop-stack="true"]')!
    const image = container.querySelector(`[data-feature-image="${title}"]`)!
    const riskSection = container.querySelector(`[data-feature-risks="${title}"]`)!
    const monetization = container.querySelector(`[data-feature-monetization="${title}"]`)!
    expect(loop.compareDocumentPosition(image) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(image).toHaveClass('-mt-[99px]')
    expect(container.querySelector('[data-feature-body="true"]')).toHaveClass('mt-8')
    expect(container.querySelector('[data-feature-body="true"]')).not.toHaveClass('mt-4')
    expect(monetization).toBeVisible()
    expect(monetization).toHaveClass('w-full', 'max-w-none')
    expect(riskSection).toHaveClass('max-w-[368px]')
    expect(monetization).toHaveClass('flex-row', 'items-center')
    expect(riskSection).toHaveClass('flex-row', 'items-center')
    expect(monetization).not.toHaveClass('max-w-[368px]', 'max-w-[520px]')
    expect(riskSection).not.toHaveClass('max-w-[520px]')
    expect(loop).toHaveClass('h-[calc(100vh-327px)]')
    expect(disclosures).toHaveClass('mt-16', 'flex', 'flex-col', 'gap-8', 'w-[188%]')
    expect(disclosures).not.toHaveClass('mt-8')
    expect(disclosures).not.toHaveClass('absolute', 'top-[278px]', 'grid', 'grid-rows-[82px_56px]', 'bottom-[98px]', 'bottom-0', 'bottom-8', 'bottom-16')
    expect(monetization).not.toHaveClass('mt-8', 'mt-4')
    expect(monetization.compareDocumentPosition(riskSection) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    const monetizationButton = screen.getByRole('button', { name: 'Monetization details' })
    const risksButton = screen.getByRole('button', { name: 'Risk details' })
    expect(monetizationButton).not.toHaveTextContent('Monetization')
    expect(risksButton).not.toHaveTextContent('Risks')
    expect(monetizationButton).toHaveClass('cursor-pointer', 'select-none', '[&_*]:cursor-pointer', 'flex-row', 'items-center')
    expect(risksButton).toHaveClass('cursor-pointer', 'select-none', '[&_*]:cursor-pointer', 'flex-row', 'items-center')
    expect(monetizationButton.querySelector('[data-feature-disclosure-label="true"]')).not.toBeInTheDocument()
    expect(risksButton.querySelector('[data-feature-disclosure-label="true"]')).not.toBeInTheDocument()
    expect(monetizationButton).toHaveAttribute('aria-pressed', 'false')
    expect(risksButton).toHaveAttribute('aria-pressed', 'false')
    expect(monetization).toHaveClass('opacity-25')
    expect(riskSection).toHaveClass('opacity-25')
    expect(container.querySelector('[data-feature-monetization-content="true"]')).toBeVisible()
    expect(container.querySelector('[data-feature-risk-content="true"]')).toBeVisible()
    expect(monetizationButton.querySelector('img')).toHaveAttribute('src', expect.stringContaining('shop-emoji.png'))
    expect(monetizationButton.querySelector('img')).toHaveClass('h-14', 'w-14')
    fireEvent.click(monetizationButton)
    expect(monetizationButton).toHaveAttribute('aria-pressed', 'true')
    expect(monetization).toHaveClass('opacity-100')
    expect(riskSection).toHaveClass('opacity-25')
    expect(monetization).toHaveClass('w-full', 'max-w-none')
    expect(monetization).not.toHaveClass('max-w-[368px]')
    const monetizationContent = container.querySelector('[data-feature-monetization-content="true"]')!
    expect(monetizationContent).toBeVisible()
    expect(monetizationContent).toHaveClass('w-full', 'text-left')
    expect(monetizationContent.querySelector('p')).toHaveClass('text-[18px]', 'text-charcoal')
    expect(monetizationContent.querySelector('p')).not.toHaveClass('font-bold', 'text-cm-violet-deep')
    const metricList = monetizationContent.querySelector('[data-feature-metrics="true"]')!
    expect(metricList).toHaveClass('mt-2', 'flex', 'items-start', 'gap-2', 'font-sans', 'text-[10px]', 'font-medium', 'uppercase', 'tracking-[0.1em]', 'text-charcoal/70')
    expect(metricList).not.toHaveClass('items-center')
    expect(metricList).not.toHaveClass('space-y-1')
    const separators = metricList.querySelectorAll('[data-metric-separator="true"]')
    expect(separators).toHaveLength(metrics.length - 1)
    separators.forEach((separator) => {
      expect(separator).toHaveTextContent('•')
      expect(separator).toHaveClass('text-[7px]', 'text-charcoal/70')
      expect(separator).not.toHaveClass('text-cm-gold')
      expect(separator).toHaveAttribute('aria-hidden', 'true')
    })
    metrics.forEach((metric) => expect(metricList.querySelector(`[aria-label="${metric}"]`)).toBeInTheDocument())
    expect(risksButton.querySelector('img')).toHaveAttribute('src', expect.stringContaining('risk-emoji.png'))
    expect(risksButton.querySelector('img')).toHaveClass('h-14', 'w-14')
    fireEvent.click(risksButton)
    expect(monetizationButton).toHaveAttribute('aria-pressed', 'false')
    expect(risksButton).toHaveAttribute('aria-pressed', 'true')
    expect(monetization).toHaveClass('opacity-25')
    expect(riskSection).toHaveClass('opacity-100')
    expect(container.querySelector('[data-feature-monetization-content="true"]')).toBeVisible()
    const riskContent = container.querySelector('[data-feature-risk-content="true"]')!
    expect(riskContent).toHaveClass('w-full', 'text-left')
    expect(riskContent.querySelector('ul')).toHaveClass('space-y-1', 'text-[18px]', 'text-charcoal')
    expect(riskContent.querySelector('ul')).not.toHaveClass('flex', 'items-center')
    expect(riskContent.querySelectorAll('[data-risk-separator="true"]')).toHaveLength(0)
    expect(riskContent.querySelector('ul')).not.toHaveClass('font-bold', 'text-cm-crimson')
    risks.forEach((risk) => expect(riskContent).toHaveTextContent(risk))
    fireEvent.click(risksButton)
    expect(risksButton).toHaveAttribute('aria-pressed', 'false')
    expect(riskSection).toHaveClass('opacity-25')
    expect(container.querySelector('[data-feature-risk-content="true"]')).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Trade-off' })).not.toBeInTheDocument()
    expect(container.querySelector(`[data-feature-reveal="${title}"]`)).not.toBeInTheDocument()
    expect(container.querySelectorAll('[data-feature-loop-arrow][data-flow-arrow="true"]')).toHaveLength(
      title === 'Hometown' ? 3 : 4,
    )
    const stepArrows = container.querySelectorAll('[data-feature-loop-arrow][data-flow-arrow="true"]')
    expect(stepArrows[0]).toHaveClass('opacity-100')
    Array.from(stepArrows).slice(1).forEach((arrow) => expect(arrow).toHaveClass('opacity-30'))
    expect(loop.querySelectorAll('[data-loop-step]')).toHaveLength(title === 'Hometown' ? 4 : 5)
    const loopSteps = loop.querySelectorAll('[data-loop-step]')
    expect(loopSteps[0]).toHaveAttribute('data-loop-step-active', 'true')
    expect(loopSteps[0]).toHaveClass('opacity-100')
    Array.from(loopSteps).slice(1).forEach((step) => {
      expect(step).toHaveAttribute('data-loop-step-active', 'false')
      expect(step).toHaveClass('opacity-60')
    })
    const returnArrow = loop.querySelector('[data-loop-return="true"][data-flow-arrow="true"]')!
    expect(returnArrow).toBeInTheDocument()
    expect(returnArrow.querySelector('[data-loop-return-shaft]')).toHaveAttribute('stroke', '#1E7BA8')
    expect(returnArrow.querySelector('[data-loop-return-shaft]')).toHaveAttribute('stroke-width', '1.3')
    expect(returnArrow.querySelector('[data-loop-return-head]')).toHaveAttribute('stroke', '#1E7BA8')
    expect(returnArrow.querySelector('[data-loop-return-head]')).toHaveAttribute('stroke-width', '1.3')
    expect(returnArrow).toHaveClass('opacity-30')
    expect(loop.querySelectorAll('[data-blue-surface="true"]').length).toBeGreaterThan(0)
    expect(loop.querySelectorAll('[data-wood-surface="true"]').length).toBeGreaterThan(0)
    loop.querySelectorAll('[data-blue-surface="true"], [data-wood-surface="true"]').forEach((surface) => {
      expect(surface).toHaveClass('font-normal')
      expect(surface).not.toHaveClass('font-bold', 'font-extrabold')
    })
    expect(loopStack).not.toHaveClass('mx-auto')
    expect(loopStack).toHaveClass('max-w-[350px]')
    expect(container.querySelector('[data-feature-frame="true"]')).toHaveClass('h-[calc(100vh-228px)]')
    expect(container.querySelector('[data-feature-frame="true"]')).toHaveClass('border-[1.5px]')
    expect(container.querySelector('[data-feature-frame="true"]')).not.toHaveClass('border-2', 'border-cm-wood/50')
    expect(container.querySelector('[data-feature-frame="true"]')).toHaveStyle({ borderColor: 'rgb(30, 123, 168)' })
    expect(container.querySelector('[data-feature-frame="true"]')).not.toHaveClass('w-full')
    expect(container.querySelector('[data-feature-frame="true"]')).not.toHaveClass('px-4')
    expect(container.querySelector('[data-feature-frame="true"]')).not.toHaveClass(
      'bg-white',
      'p-1',
      'shadow-[0_4px_0_rgba(144,57,0,0.28)]',
    )
    expect(container.querySelectorAll('.border-l-4, .border-l-8')).toHaveLength(0)

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

    expect(loop.querySelectorAll('[data-resource-indicator="true"]')).toHaveLength(4)
    expect(screen.getAllByLabelText('Spend Coins')).toHaveLength(2)
    expect(screen.getByLabelText('Spend Gems')).toBeInTheDocument()
    expect(screen.getByLabelText('Gain Coins')).toBeInTheDocument()
    expect(loop.querySelectorAll('img[src*="coin-emoji.png"]')).toHaveLength(3)
    expect(loop.querySelectorAll('img[src*="gem-emoji.png"]')).toHaveLength(1)
    expect(loop.querySelectorAll('img[src*="minus-badge.png"]')).toHaveLength(3)
    expect(loop.querySelectorAll('img[src*="plus-badge.png"]')).toHaveLength(1)
    const unlockStep = screen.getByText('Unlock Hometown items').closest('[data-loop-step]')!
    expect(unlockStep.querySelector('[data-resource-indicator="true"]')).toBeInTheDocument()
  })

  it('keeps the last hovered Hometown step active and swaps its feature image', () => {
    const { container } = render(<Slide06Hometown slideKey="hometown-hover" />)
    const featureImage = container.querySelector('[data-feature-image="Hometown"] img')!
    const unlockStep = screen.getByText('Unlock Hometown items').closest('[data-loop-step]')!
    const buildStep = screen.getByText('Build new Items').closest('[data-loop-step]')!
    const discountStep = screen.getByText('Get Village build discount!').closest('[data-loop-step]')!

    expect(featureImage).toHaveAttribute('src', '/coinmaster/feature1.png')

    fireEvent.mouseEnter(unlockStep)
    expect(featureImage).toHaveAttribute('src', '/coinmaster/hometown-unlock-v2.png')
    fireEvent.mouseLeave(unlockStep)
    expect(featureImage).toHaveAttribute('src', '/coinmaster/hometown-unlock-v2.png')

    fireEvent.mouseEnter(buildStep)
    expect(featureImage).toHaveAttribute('src', '/coinmaster/hometown-build-v2.png')
    expect(unlockStep).toHaveAttribute('data-loop-step-active', 'false')
    expect(buildStep).toHaveAttribute('data-loop-step-active', 'true')

    fireEvent.mouseEnter(discountStep)
    expect(featureImage).toHaveAttribute('src', '/coinmaster/hometown-discount-v2.png')
    expect(buildStep).toHaveAttribute('data-loop-step-active', 'false')
    expect(discountStep).toHaveAttribute('data-loop-step-active', 'true')
  })

  // Down/Up walk the loop for a presenter who is not holding a mouse. They move
  // the same state hover moves, so the two have to stay interchangeable.
  it.each([
    [Slide06Hometown, 'Hometown', 4],
    [Slide08CardBounty, 'Card Bounty', 5],
    [Slide10HotTrail, 'Hot Trail', 5],
  ])('walks the %# loop with the arrow keys', (Slide, title, stepCount) => {
    const { container } = render(<Slide slideKey={`loop-keys-${title}`} isActive />)
    const steps = [...container.querySelectorAll('[data-loop-step]')]
    const activeIndex = () => steps.findIndex((step) => step.getAttribute('data-loop-step-active') === 'true')
    const press = (key: string) => fireEvent.keyDown(window, { key })

    expect(steps).toHaveLength(stepCount)
    expect(activeIndex()).toBe(0)

    press('ArrowDown')
    expect(activeIndex()).toBe(1)
    press('ArrowDown')
    expect(activeIndex()).toBe(2)

    press('ArrowUp')
    expect(activeIndex()).toBe(1)

    // the diagram returns from the last step to the first, so the keys wrap too
    press('ArrowUp')
    press('ArrowUp')
    expect(activeIndex()).toBe(stepCount - 1)
    press('ArrowDown')
    expect(activeIndex()).toBe(0)

    // hover still works, and the keys carry on from wherever it left the loop
    fireEvent.mouseEnter(steps[2])
    expect(activeIndex()).toBe(2)
    press('ArrowDown')
    expect(activeIndex()).toBe(3)
  })

  // every slide stays mounted, so an unguarded listener would move all three
  // loops at once behind the slide actually on screen
  it('leaves the loop alone while its slide is off screen', () => {
    const { container } = render(<Slide08CardBounty slideKey="loop-keys-inactive" isActive={false} />)
    const steps = [...container.querySelectorAll('[data-loop-step]')]

    fireEvent.keyDown(window, { key: 'ArrowDown' })
    expect(steps[0]).toHaveAttribute('data-loop-step-active', 'true')
    expect(steps[1]).toHaveAttribute('data-loop-step-active', 'false')
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

    const inactiveIndicator = screen.getByText('Get Raided')
      .closest('[data-loop-step]')!
      .querySelector('[data-resource-indicator="true"]')!
    const activeIndicator = screen.getByText('Progress the Village')
      .closest('[data-loop-step]')!
      .querySelector('[data-resource-indicator="true"]')!
    expect(inactiveIndicator).toHaveClass('opacity-25')
    expect(activeIndicator).toHaveClass('opacity-100')
  })

  it('keeps the last hovered Hot Trail step active and swaps its feature image', () => {
    const { container } = render(<Slide10HotTrail slideKey="hot-trail-hover" />)
    const featureImage = container.querySelector('[data-feature-image="Hot Trail"] img')!
    const raidedStep = screen.getByText('Get Raided').closest('[data-loop-step]')!
    const activationStep = screen.getByText('Activate Hot Trail').closest('[data-loop-step]')!
    const spinStep = screen.getByText('Spin to Raid').closest('[data-loop-step]')!
    const counterRaidStep = screen.getByText('Counter-Raid').closest('[data-loop-step]')!

    expect(featureImage).toHaveAttribute('src', '/coinmaster/feature3.png')

    fireEvent.mouseEnter(raidedStep)
    expect(featureImage).toHaveAttribute('src', '/coinmaster/hot-trail-raided.png')
    fireEvent.mouseLeave(raidedStep)
    expect(featureImage).toHaveAttribute('src', '/coinmaster/hot-trail-raided.png')

    fireEvent.mouseEnter(activationStep)
    expect(featureImage).toHaveAttribute('src', '/coinmaster/hot-trail-activated-v2.png')
    expect(raidedStep).toHaveAttribute('data-loop-step-active', 'false')
    expect(activationStep).toHaveAttribute('data-loop-step-active', 'true')

    fireEvent.mouseEnter(spinStep)
    expect(featureImage).toHaveAttribute('src', '/coinmaster/hot-trail-spin-to-raid-v2.png')
    expect(activationStep).toHaveAttribute('data-loop-step-active', 'false')
    expect(spinStep).toHaveAttribute('data-loop-step-active', 'true')

    fireEvent.mouseEnter(counterRaidStep)
    expect(featureImage).toHaveAttribute('src', '/coinmaster/hot-trail-counter-raid-v2.png')
    expect(spinStep).toHaveAttribute('data-loop-step-active', 'false')
    expect(counterRaidStep).toHaveAttribute('data-loop-step-active', 'true')
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

  it('keeps the last hovered Card Bounty step active and swaps its feature image', () => {
    const { container } = render(<Slide08CardBounty slideKey="card-bounty-hover" />)
    const featureImage = container.querySelector('[data-feature-image="Card Bounty"] img')!
    const targetStep = screen.getByText('Target a card').closest('[data-loop-step]')!
    const chestStep = screen.getByText('Buy Chests - fill the meter').closest('[data-loop-step]')!
    const getCardStep = screen.getByText('Get the card').closest('[data-loop-step]')!
    const collectionStep = screen.getByText('Complete the Collection').closest('[data-loop-step]')!

    expect(featureImage).toHaveAttribute('src', '/coinmaster/feature2.png')

    fireEvent.mouseEnter(targetStep)
    expect(featureImage).toHaveAttribute('src', '/coinmaster/card-bounty-target-v2.png')
    expect(targetStep).toHaveAttribute('data-loop-step-active', 'true')

    fireEvent.mouseLeave(targetStep)
    expect(featureImage).toHaveAttribute('src', '/coinmaster/card-bounty-target-v2.png')
    expect(targetStep).toHaveAttribute('data-loop-step-active', 'true')

    fireEvent.mouseEnter(chestStep)
    expect(featureImage).toHaveAttribute('src', '/coinmaster/card-bounty-chests-v2.png')
    expect(targetStep).toHaveAttribute('data-loop-step-active', 'false')
    expect(targetStep).toHaveClass('opacity-60')
    expect(chestStep).toHaveAttribute('data-loop-step-active', 'true')
    expect(chestStep).toHaveClass('opacity-100')

    fireEvent.mouseEnter(getCardStep)
    expect(featureImage).toHaveAttribute('src', '/coinmaster/card-bounty-get-card.png')
    expect(chestStep).toHaveAttribute('data-loop-step-active', 'false')
    expect(getCardStep).toHaveAttribute('data-loop-step-active', 'true')

    fireEvent.mouseEnter(collectionStep)
    expect(featureImage).toHaveAttribute('src', '/coinmaster/card-bounty-collection.png')
    expect(getCardStep).toHaveAttribute('data-loop-step-active', 'false')
    expect(collectionStep).toHaveAttribute('data-loop-step-active', 'true')
    expect(container.querySelector('[data-loop-return="true"]')).toHaveClass('opacity-100')
  })

  it('resets the active loop step when the slide key changes', () => {
    const { rerender } = render(<Slide08CardBounty slideKey="feature-1" />)
    const firstStep = screen.getByText('Spin').closest('[data-loop-step]')!
    const targetStep = screen.getByText('Target a card').closest('[data-loop-step]')!
    fireEvent.mouseEnter(targetStep)
    expect(targetStep).toHaveAttribute('data-loop-step-active', 'true')
    rerender(<Slide08CardBounty slideKey="feature-2" />)
    expect(firstStep).toHaveAttribute('data-loop-step-active', 'true')
    expect(targetStep).toHaveAttribute('data-loop-step-active', 'false')
  })
})
