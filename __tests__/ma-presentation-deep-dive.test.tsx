import { render, screen } from '@testing-library/react'
import Slide15PlayerFlow from '@/app/MA-HomeAssignment/presentation/slides/Slide15PlayerFlow'
import Slide16MvpScope from '@/app/MA-HomeAssignment/presentation/slides/Slide16MvpScope'
import Slide17Prototype from '@/app/MA-HomeAssignment/presentation/slides/Slide17Prototype'

describe('MA presentation Card Bounty deep dive', () => {
  it('reuses the original player flow diagram', () => {
    const { container } = render(<Slide15PlayerFlow slideKey="slide-12" />)
    expect(screen.getByRole('heading', { name: 'Card Bounty player flow' })).toBeVisible()
    expect(container.querySelector('#player-flow')).toBeInTheDocument()
  })

  it('shows a flat MVP in/out scope', () => {
    render(<Slide16MvpScope slideKey="slide-13" />)
    expect(screen.getByRole('heading', { name: 'Scope' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'In scope' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Out of scope' })).toBeVisible()
  })

  it('reuses the original interactive prototype preview', () => {
    const { container } = render(<Slide17Prototype slideKey="slide-14" />)
    expect(screen.getByRole('heading', { name: 'Card Bounty, interactive' })).toBeVisible()
    expect(container.querySelector('img[src="/coinmaster/prototype.webp"]')).toBeInTheDocument()
    expect(container.querySelector('[data-prototype-cta="true"]')).toBeInTheDocument()
  })
})
