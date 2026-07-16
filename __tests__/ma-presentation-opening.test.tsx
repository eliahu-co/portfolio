import { fireEvent, render, screen } from '@testing-library/react'
import Slide01Cover from '@/app/MA-HomeAssignment/presentation/slides/Slide01Cover'
import Slide02About from '@/app/MA-HomeAssignment/presentation/slides/Slide02About'
import Slide03Approach from '@/app/MA-HomeAssignment/presentation/slides/Slide03Approach'
import Slide04Economy from '@/app/MA-HomeAssignment/presentation/slides/Slide04Economy'
import Slide05ThreeBets from '@/app/MA-HomeAssignment/presentation/slides/Slide05ThreeBets'

describe('MA presentation opening chapter', () => {
  it('opens with the assignment outcome', () => {
    render(<Slide01Cover slideKey="slide-1" />)
    expect(screen.getByRole('heading', { name: 'Increasing ARPDAU' })).toBeVisible()
  })

  it('keeps About simple and interactive', () => {
    const { container, rerender } = render(<Slide02About slideKey="slide-2" />)
    expect(screen.getByText('Product Manager')).toBeVisible()
    expect(screen.queryByText('Architect, Product Manager')).not.toBeInTheDocument()
    expect(container.querySelectorAll('[data-ma-photo-frame="true"] img[alt="Eliahu and family"]')).toHaveLength(1)
    expect(container.querySelector('[data-ma-photo-frame="true"]')).not.toHaveClass('bg-white', 'p-1')
    expect(container.querySelectorAll('[data-journey-pill="true"]')).toHaveLength(3)
    expect(container.querySelectorAll('[data-journey-pill="true"].flex-1')).toHaveLength(3)
    expect(container.querySelectorAll('svg[data-journey-connector="true"]')).toHaveLength(2)
    expect(container.querySelectorAll('[data-journey-connector="true"][data-flow-arrow="true"]')).toHaveLength(2)
    const facts = Array.from(container.querySelectorAll('[data-flat-fact="true"]'))
    expect(facts).toHaveLength(6)
    expect(container.querySelector('ul[aria-label="About Eliahu"]')).toHaveClass('grid-cols-1')
    expect(container.querySelector('ul[aria-label="About Eliahu"]')).not.toHaveClass('grid-cols-2')
    facts.forEach((fact) => {
      expect(fact.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument()
    })
    container.querySelectorAll('.transition-opacity').forEach((element) => {
      expect(element).toHaveClass('motion-reduce:transition-none')
    })
    const brazil = screen.getByRole('button', { name: 'Brazil' })
    expect(brazil).toHaveClass('bg-transparent', 'hover:bg-gradient-to-b')
    expect(brazil).not.toHaveClass('bg-gradient-to-b')
    container.querySelectorAll('[data-journey-surface="true"]').forEach((surface) => {
      expect(surface).toHaveClass('bg-transparent', 'hover:bg-gradient-to-b')
      expect(surface).not.toHaveClass('bg-gradient-to-b')
    })

    fireEvent.mouseEnter(brazil)
    expect(brazil).toHaveAttribute('aria-expanded', 'true')
    fireEvent.mouseLeave(brazil)
    expect(brazil).toHaveAttribute('aria-expanded', 'false')

    fireEvent.focus(brazil)
    expect(brazil).toHaveAttribute('aria-expanded', 'true')
    fireEvent.mouseEnter(brazil)
    fireEvent.mouseLeave(brazil)
    expect(brazil).toHaveAttribute('aria-expanded', 'true')
    fireEvent.blur(brazil)
    expect(brazil).toHaveAttribute('aria-expanded', 'false')

    fireEvent.mouseEnter(brazil)
    fireEvent.focus(brazil)
    fireEvent.blur(brazil)
    expect(brazil).toHaveAttribute('aria-expanded', 'true')
    fireEvent.mouseLeave(brazil)
    expect(brazil).toHaveAttribute('aria-expanded', 'false')

    fireEvent.mouseEnter(brazil)
    fireEvent.focus(brazil)
    rerender(<Slide02About slideKey="slide-2-reset" />)
    expect(screen.getByRole('button', { name: 'Brazil' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('uses the flat approach flow and original core-loop diagram', () => {
    const approach = render(<Slide03Approach slideKey="slide-3" />)
    expect(screen.getByRole('heading', { name: 'Approach' })).toBeVisible()
    expect(approach.container.querySelectorAll('li')).toHaveLength(6)
    expect(approach.container.querySelectorAll('[data-approach-pill="true"]')).toHaveLength(6)
    expect(approach.container.querySelectorAll('svg[data-approach-connector="true"]')).toHaveLength(5)
    expect(approach.container.querySelectorAll('[data-approach-connector="true"][data-flow-arrow="true"]')).toHaveLength(5)
    expect(approach.container.querySelector('[data-step-number]')).not.toBeInTheDocument()
    expect(screen.queryByText('Discovery to decision')).not.toBeInTheDocument()
    approach.unmount()

    const economy = render(<Slide04Economy slideKey="slide-4" />)
    expect(screen.getByRole('heading', { name: 'Core loop and meta' })).toBeVisible()
    const figure = economy.container.querySelector('figure')
    expect(figure).toBeInTheDocument()
    const diagramWrapper = figure?.parentElement
    expect(diagramWrapper).toHaveClass('max-w-[720px]')
    expect(diagramWrapper).not.toHaveClass('max-h-[450px]', 'overflow-hidden')
    expect(diagramWrapper?.parentElement).not.toHaveClass('overflow-hidden')
    expect(screen.queryByText('Game model')).not.toBeInTheDocument()
  })

  it('introduces three flat bets without controls or a subtitle', () => {
    const { container } = render(<Slide05ThreeBets slideKey="slide-5" />)
    expect(screen.getByRole('heading', { name: 'Three bets' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Hometown' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Card Bounty' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Hot Trail' })).toBeVisible()
    expect(container.querySelectorAll('[data-flat-bet="true"]')).toHaveLength(3)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByText('Features')).not.toBeInTheDocument()
  })
})
