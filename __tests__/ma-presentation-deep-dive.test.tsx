import { render, screen } from '@testing-library/react'
import Slide15PlayerFlow from '@/app/MA-HomeAssignment/presentation/slides/Slide15PlayerFlow'
import Slide16MvpScope from '@/app/MA-HomeAssignment/presentation/slides/Slide16MvpScope'
import Slide17Prototype from '@/app/MA-HomeAssignment/presentation/slides/Slide17Prototype'
import { SCOPE_IN, SCOPE_OUT } from '@/app/MA-HomeAssignment/content/mvp'

describe('MA presentation Card Bounty deep dive', () => {
  it('uses the presentation-only phase-focus player flow', () => {
    const { container } = render(<Slide15PlayerFlow slideKey="slide-12" />)
    expect(screen.getByRole('heading', { name: 'Card Bounty player flow' })).toBeVisible()
    expect(container.querySelector('[data-phase-focus-flow="true"]')).toBeInTheDocument()
    expect(container.querySelectorAll('[data-phase-control]')).toHaveLength(4)
    expect(container.querySelectorAll('[data-phase-arrow="true"]')).toHaveLength(3)
    expect(container.querySelector('[data-source-component="player-flow"]')).not.toBeInTheDocument()
    expect(container.querySelector('#player-flow')).not.toBeInTheDocument()
  })

  it('shows a flat MVP in/out scope', () => {
    const { container } = render(<Slide16MvpScope slideKey="slide-13" />)
    expect(screen.getByRole('heading', { name: 'Scope' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'In scope' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Out of scope' })).toBeVisible()

    const columns = Array.from(container.querySelectorAll('[data-scope-column]'))
    expect(columns).toHaveLength(2)
    expect(columns.map((column) => column.querySelectorAll('li').length)).toEqual([
      SCOPE_IN.length,
      SCOPE_OUT.length,
    ])
    columns.forEach((column) => {
      expect(column.className).not.toMatch(/rounded|shadow|\bbg-|\bborder\b/)
    })
  })

  it('mounts the real prototype only while its slide is active', () => {
    const { container, rerender } = render(
      <Slide17Prototype slideKey="slide-11" isActive />,
    )
    const backdrop = container.querySelector('[data-prototype-slide-backdrop="true"]')
    const eyebrow = container.querySelector('[data-prototype-slide-eyebrow="true"]')
    const title = screen.getByRole('heading', { name: 'Prototype' })

    expect(backdrop).toBeInTheDocument()
    expect(backdrop?.querySelector('img[src="/coinmaster-sky.webp"]')).toBeInTheDocument()
    expect(eyebrow).toHaveTextContent('Card Bounty')
    expect(eyebrow).toHaveClass('text-white/80')
    expect(title).toHaveClass('text-white', 'text-[64px]')
    expect(screen.getByRole('region', { name: 'Card Bounty game prototype' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Restart' })).toBeVisible()
    expect(screen.queryByRole('link', { name: 'Open the Card Bounty interactive prototype' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Home assignment' })).not.toBeInTheDocument()

    const stage = container.querySelector('[data-prototype-stage="true"]')
    const frame = container.querySelector('[data-prototype-frame="true"]')
    const prototype = container.querySelector('[data-prototype-presentation-shell="true"]')
    expect(stage).toHaveClass('absolute', 'inset-x-20', 'bottom-20', 'top-20')
    expect(frame).toHaveClass('max-h-[720px]')
    expect(stage).toContainElement(prototype)
    expect(prototype).toHaveAttribute('data-deck-interactive', 'true')

    rerender(<Slide17Prototype slideKey="slide-10" isActive={false} />)
    expect(screen.queryByRole('region', { name: 'Card Bounty game prototype' })).not.toBeInTheDocument()
    expect(container.querySelector('[data-prototype-presentation-shell="true"]')).not.toBeInTheDocument()
  })
})
