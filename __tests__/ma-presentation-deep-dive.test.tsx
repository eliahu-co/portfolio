import { render, screen } from '@testing-library/react'
import Slide15PlayerFlow from '@/app/MA-HomeAssignment/presentation/slides/Slide15PlayerFlow'
import Slide16MvpScope from '@/app/MA-HomeAssignment/presentation/slides/Slide16MvpScope'
import Slide17Prototype from '@/app/MA-HomeAssignment/presentation/slides/Slide17Prototype'
import { SCOPE_IN, SCOPE_OUT } from '@/app/MA-HomeAssignment/content/mvp'

describe('MA presentation Card Bounty deep dive', () => {
  it('reuses the original player flow diagram', () => {
    const { container } = render(<Slide15PlayerFlow slideKey="slide-12" />)
    expect(screen.getByRole('heading', { name: 'Card Bounty player flow' })).toBeVisible()
    expect(container.querySelector('#player-flow')).toBeInTheDocument()

    const sourceFrame = container.querySelector('[data-source-component="player-flow"]')
    expect(sourceFrame).toHaveClass('max-w-[1080px]', 'h-[410px]', 'max-h-[410px]', 'overflow-hidden')
    expect(sourceFrame).toContainElement(container.querySelector('#player-flow'))
    expect(sourceFrame?.firstElementChild).toHaveClass('w-[128%]', 'scale-[0.78]')
    expect(container.querySelectorAll('#player-flow [data-player-flow-plaque][data-blue-surface="true"]')).toHaveLength(4)
    expect(container.querySelectorAll('#player-flow [data-player-flow-screen][data-blue-surface="true"]').length).toBeGreaterThan(0)
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

  it('reuses the original interactive prototype preview', () => {
    const { container } = render(<Slide17Prototype slideKey="slide-14" />)
    expect(screen.getByRole('heading', { name: 'Card Bounty, interactive' })).toBeVisible()
    expect(container.querySelector('img[src="/coinmaster/prototype.webp"]')).toBeInTheDocument()
    expect(container.querySelector('[data-prototype-cta="true"]')).toBeInTheDocument()

    const sourceFrame = container.querySelector('[data-source-component="prototype-preview"]')
    const prototype = screen.getByRole('link', { name: 'Open the Card Bounty interactive prototype' })
    expect(sourceFrame).toHaveClass('aspect-video', 'max-w-[620px]', 'max-h-[349px]')
    expect(sourceFrame).toContainElement(prototype)
    expect(sourceFrame?.firstElementChild).toBe(prototype)
    expect(prototype).toHaveClass('aspect-video', 'w-full')
    expect(sourceFrame?.className).not.toMatch(/overflow-hidden|rounded|shadow|transition|animate|\bbg-|\bborder\b/)
  })
})
