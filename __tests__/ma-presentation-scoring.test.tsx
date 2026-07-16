import { fireEvent, render, screen, within } from '@testing-library/react'
import Slide12Assumptions from '@/app/MA-HomeAssignment/presentation/slides/Slide12Assumptions'
import Slide13ComparativeScoring from '@/app/MA-HomeAssignment/presentation/slides/Slide13ComparativeScoring'
import Slide14Recommendation from '@/app/MA-HomeAssignment/presentation/slides/Slide14Recommendation'

describe('MA presentation decision chapter', () => {
  it('keeps assumptions as a flat, readable list', () => {
    render(<Slide12Assumptions slideKey="slide-9" />)
    expect(screen.getByRole('heading', { name: 'Assumptions' })).toBeVisible()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('reveals scoring rationale from the comparative table', () => {
    const { container } = render(<Slide13ComparativeScoring slideKey="slide-10" />)
    const button = screen.getByRole('button', { name: /Card Bounty: Confidence score 4/i })
    fireEvent.focus(button)
    expect(within(container).getByRole('status', { name: 'Score detail' })).toBeVisible()
    fireEvent.blur(button)
  })

  it('recommends Card Bounty with its feature image and evidence', () => {
    const { container } = render(<Slide14Recommendation slideKey="slide-11" />)
    expect(screen.getByRole('heading', { name: 'Card Bounty' })).toBeVisible()
    expect(container.querySelector('img[alt="Card Bounty feature mockup"]')).toBeInTheDocument()
    expect(screen.getByText(/Primary risk:/)).toBeVisible()
  })
})
