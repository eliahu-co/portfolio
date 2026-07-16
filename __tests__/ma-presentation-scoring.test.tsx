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
    const inactive = screen.getByText(ASSUMPTION_STORIES[0].assumption).closest('[data-assumption]')
    expect(inactive).toHaveClass('opacity-20', 'transition-opacity', 'duration-300')
  })

  it('keeps assumption disclosure active until both hover and focus end', () => {
    render(<Slide12Assumptions slideKey="slide-9" />)
    const active = screen.getByText(ASSUMPTION_STORIES[1].assumption).closest('[data-assumption]')!
    const inactive = screen.getByText(ASSUMPTION_STORIES[0].assumption).closest('[data-assumption]')!

    fireEvent.mouseEnter(active)
    fireEvent.focus(active)
    fireEvent.mouseLeave(active)
    expect(inactive).toHaveClass('opacity-20')
    fireEvent.blur(active)
    expect(inactive).not.toHaveClass('opacity-20')

    fireEvent.focus(active)
    fireEvent.mouseEnter(active)
    fireEvent.blur(active)
    expect(inactive).toHaveClass('opacity-20')
    fireEvent.mouseLeave(active)
    expect(inactive).not.toHaveClass('opacity-20')
  })

  it('reveals scoring rationale from the comparative table', () => {
    const { container, rerender } = render(<Slide13ComparativeScoring slideKey="slide-10" />)
    const button = screen.getByRole('button', { name: /Hot Trail: Core-Loop Fit score 5/i })
    fireEvent.focus(button)
    expect(screen.getByTestId('score-column-coreLoopFit')).toHaveAttribute('data-active', 'true')
    expect(within(container).getByRole('status', { name: 'Score detail' })).toHaveTextContent('Hot Trail')
    expect(within(container).getByRole('status', { name: 'Score detail' })).toHaveTextContent('Core-Loop Fit')
    fireEvent.blur(button)
    expect(screen.queryByTestId('score-column-coreLoopFit')).not.toHaveAttribute('data-active', 'true')

    fireEvent.mouseEnter(button)
    fireEvent.focus(button)
    fireEvent.mouseLeave(button)
    expect(screen.getByTestId('score-column-coreLoopFit')).toHaveAttribute('data-active', 'true')
    fireEvent.blur(button)

    fireEvent.focus(button)
    fireEvent.mouseEnter(button)
    fireEvent.blur(button)
    expect(screen.getByTestId('score-column-coreLoopFit')).toHaveAttribute('data-active', 'true')
    fireEvent.mouseLeave(button)
    expect(screen.getByTestId('score-column-coreLoopFit')).toHaveAttribute('data-active', 'false')

    fireEvent.focus(button)
    rerender(<Slide13ComparativeScoring slideKey="slide-11" />)
    expect(screen.getByTestId('score-column-coreLoopFit')).toHaveAttribute('data-active', 'false')
  })

  it('keeps scoring disclosure mounted in fixed animated slots', () => {
    render(<Slide13ComparativeScoring slideKey="slide-10" />)
    const region = screen.getByTestId('score-disclosure-region')
    const detail = screen.getByRole('status', { name: 'Score detail' })
    const summary = screen.getByTestId('score-decision-summary')

    expect(region).toHaveClass('grid', 'h-[200px]', 'grid-rows-[144px_56px]')
    expect(detail).toHaveClass('h-[144px]', 'overflow-hidden')
    expect(summary).toHaveClass('h-[56px]', 'overflow-hidden', 'transition-opacity', 'duration-300')
    expect(screen.getByTestId('score-column-coreLoopFit')).toHaveClass('transition-[background-color]', 'duration-300')
    const winner = document.querySelector('[data-score-row="Card Bounty"]')
    expect(winner).toHaveClass('transition-[background-color]', 'duration-300')
    expect(winner).not.toHaveClass('animate-shimmer')

    fireEvent.focus(screen.getByRole('button', { name: /Hot Trail: Core-Loop Fit score 5/i }))
    expect(screen.getByRole('status', { name: 'Score detail' })).toBe(detail)
  })

  it('recommends Card Bounty with its feature image and evidence', () => {
    const { container } = render(<Slide14Recommendation slideKey="slide-11" />)
    expect(screen.getByRole('heading', { name: 'Card Bounty' })).toBeVisible()
    expect(container.querySelectorAll('img[alt="Card Bounty feature mockup"]')).toHaveLength(1)

    const evidence = screen.getByRole('list', { name: 'Why Card Bounty wins' })
    expect(within(evidence).getAllByRole('listitem')).toHaveLength(3)
    expect(within(evidence).getByRole('heading', { name: 'Familiar behavior' })).toBeVisible()
    expect(within(evidence).getByRole('heading', { name: 'Additional Coin demand' })).toBeVisible()
    expect(within(evidence).getByRole('heading', { name: 'Bounded validation' })).toBeVisible()
    expect(evidence).not.toHaveClass('rounded-2xl', 'border', 'bg-white')
    expect(screen.getAllByText(/^Primary risk:/)).toHaveLength(1)
  })
})
