import { fireEvent, render, screen } from '@testing-library/react'
import Slide01Cover from '@/app/MA-HomeAssignment/presentation/slides/Slide01Cover'
import Slide02About from '@/app/MA-HomeAssignment/presentation/slides/Slide02About'
import Slide03Approach from '@/app/MA-HomeAssignment/presentation/slides/Slide03Approach'
import Slide04Economy from '@/app/MA-HomeAssignment/presentation/slides/Slide04Economy'

describe('MA presentation opening chapter', () => {
  it('opens with the assignment outcome', () => {
    render(<Slide01Cover slideKey="slide-1" />)
    expect(screen.getByRole('heading', { name: 'Increasing ARPDAU' })).toBeVisible()
  })

  it('keeps About simple and interactive', () => {
    const { container } = render(<Slide02About slideKey="slide-2" />)
    expect(screen.getByText('Product Manager')).toBeVisible()
    expect(screen.queryByText('Architect, Product Manager')).not.toBeInTheDocument()
    expect(container.querySelector('img[alt="Eliahu and family"]')).toBeInTheDocument()
    const brazil = screen.getByRole('button', { name: 'Brazil' })
    fireEvent.focus(brazil)
    expect(brazil).toHaveAttribute('aria-expanded', 'true')
  })

  it('uses the flat approach flow and original core-loop diagram', () => {
    const approach = render(<Slide03Approach slideKey="slide-3" />)
    expect(screen.getByRole('heading', { name: 'Approach' })).toBeVisible()
    expect(approach.container.querySelectorAll('li')).toHaveLength(6)
    approach.unmount()

    const economy = render(<Slide04Economy slideKey="slide-4" />)
    expect(screen.getByRole('heading', { name: 'Core loop and meta' })).toBeVisible()
    expect(economy.container.querySelector('figure')).toBeInTheDocument()
  })
})
