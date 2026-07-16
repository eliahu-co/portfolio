import { fireEvent, render, screen, within } from '@testing-library/react'
import Slide12Assumptions from '@/app/MA-HomeAssignment/presentation/slides/Slide12Assumptions'
import Slide13ComparativeScoring from '@/app/MA-HomeAssignment/presentation/slides/Slide13ComparativeScoring'
import Slide14Recommendation from '@/app/MA-HomeAssignment/presentation/slides/Slide14Recommendation'
import { ASSUMPTION_STORIES } from '@/app/MA-HomeAssignment/presentation/deckData'

describe('MA presentation decision chapter', () => {
  it('keeps assumptions as a flat, readable list', () => {
    render(<Slide12Assumptions slideKey="slide-9" />)
    expect(screen.getByRole('heading', { name: 'Assumptions' })).toBeVisible()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    fireEvent.mouseEnter(screen.getByText(ASSUMPTION_STORIES[1].assumption))
    expect(screen.getByText(ASSUMPTION_STORIES[0].assumption).closest('[data-assumption]')).toHaveClass('opacity-20')
  })

  it('reveals scoring rationale from the comparative table', () => {
    const { container } = render(<Slide13ComparativeScoring slideKey="slide-10" />)
    const button = screen.getByRole('button', { name: /Hot Trail: Core-Loop Fit score 5/i })
    fireEvent.focus(button)
    expect(screen.getByTestId('score-column-coreLoopFit')).toHaveAttribute('data-active', 'true')
    expect(within(container).getByRole('status', { name: 'Score detail' })).toHaveTextContent('Hot Trail')
    expect(within(container).getByRole('status', { name: 'Score detail' })).toHaveTextContent('Core-Loop Fit')
    fireEvent.blur(button)
    expect(screen.queryByTestId('score-column-coreLoopFit')).not.toHaveAttribute('data-active', 'true')
  })

  it('recommends Card Bounty with its feature image and evidence', () => {
    const { container } = render(<Slide14Recommendation slideKey="slide-11" />)
    expect(screen.getByRole('heading', { name: 'Card Bounty' })).toBeVisible()
    expect(container.querySelector('img[alt="Card Bounty feature mockup"]')).toBeInTheDocument()
    expect(screen.getByText(/Primary risk:/)).toBeVisible()
  })
})
