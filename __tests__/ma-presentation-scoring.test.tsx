import { fireEvent, render, screen, within } from '@testing-library/react'
import Slide12Assumptions from '@/app/MA-HomeAssignment/presentation/slides/Slide12Assumptions'
import Slide13ComparativeScoring from '@/app/MA-HomeAssignment/presentation/slides/Slide13ComparativeScoring'
import { ASSUMPTION_STORIES } from '@/app/MA-HomeAssignment/presentation/deckData'

describe('MA presentation decision chapter', () => {
  it('uses the concise Score title', () => {
    render(<Slide13ComparativeScoring slideKey="slide-10" />)
    expect(screen.getByRole('heading', { name: 'Score' })).toBeVisible()
    expect(screen.queryByRole('heading', { name: 'Comparative scoring' })).not.toBeInTheDocument()
  })

  it('keeps assumptions as a flat, readable list', () => {
    const { container } = render(<Slide12Assumptions slideKey="slide-9" />)
    expect(screen.getByRole('heading', { name: 'Assumptions' })).toBeVisible()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    fireEvent.mouseEnter(screen.getByText(ASSUMPTION_STORIES[1].assumption))
    const inactive = screen.getByText(ASSUMPTION_STORIES[0].assumption).closest('[data-assumption]')
    expect(inactive).toHaveClass('opacity-20', 'transition-opacity', 'duration-300')
    container.querySelectorAll('.transition-opacity').forEach((element) => {
      expect(element).toHaveClass('motion-reduce:transition-none')
    })
    expect(container.querySelectorAll('.border-l-4, .border-l-8')).toHaveLength(0)
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
    expect(within(container).getByRole('status', { name: 'Score detail' })).toHaveTextContent('Uses existing Raids, Spins, targeting, and rewards as the full interaction path.')
    expect(within(container).getByRole('status', { name: 'Score detail' })).not.toHaveTextContent('Core-Loop Fit')
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
    expect(detail.className).not.toMatch(/border-l-/)
    expect(summary).toHaveClass('h-[56px]', 'overflow-hidden', 'transition-opacity', 'duration-300')
    expect(screen.getByTestId('score-column-coreLoopFit')).toHaveClass('transition-[background-color]', 'duration-300')
    const winner = document.querySelector('[data-score-row="Card Bounty"]')
    expect(winner).toHaveClass('transition-[background-color,opacity]', 'duration-300')
    expect(winner).not.toHaveClass('animate-shimmer')

    fireEvent.focus(screen.getByRole('button', { name: /Hot Trail: Core-Loop Fit score 5/i }))
    expect(screen.getByRole('status', { name: 'Score detail' })).toBe(detail)
  })

  it('reveals criterion definitions from the table headers without italic or muted styling', () => {
    render(<Slide13ComparativeScoring slideKey="slide-10" />)
    const header = screen.getByRole('button', { name: 'Explain Core-Loop Fit' })
    fireEvent.mouseEnter(header)
    const detail = screen.getByRole('status', { name: 'Score detail' })
    expect(detail).toHaveTextContent('Degree to which the feature builds on existing Coin Master mechanics and player behavior.')
    expect(detail.querySelector('p')).not.toHaveClass('italic', 'text-charcoal')
  })

  it('keeps the disclosure region quiet until a score is active', () => {
    const { container } = render(<Slide13ComparativeScoring slideKey="slide-10" />)
    const detail = screen.getByRole('status', { name: 'Score detail' })
    const summary = screen.getByTestId('score-decision-summary')

    expect(within(detail).queryByTestId('score-default-detail')).not.toBeInTheDocument()
    expect(detail).not.toHaveTextContent('Highest opportunity')
    expect(detail).not.toHaveTextContent('The strongest combination of ARPDAU impact')
    expect(detail.className).not.toMatch(/border-l-|pl-5/)
    expect(summary).toHaveClass('opacity-100')
    expect(summary).not.toHaveTextContent('Relative comparison:')
    expect(summary).not.toHaveTextContent('Card Bounty leads because')

    fireEvent.focus(screen.getByRole('button', { name: /Hot Trail: Core-Loop Fit score 5/i }))
    expect(within(detail).queryByTestId('score-default-detail')).not.toBeInTheDocument()
    expect(detail.className).not.toMatch(/border-l-|pl-5/)
    expect(within(detail).queryByTestId('score-rubric-item')).not.toBeInTheDocument()
    expect(detail).not.toHaveTextContent('Directly reinforces the existing core or meta loop.')
    expect(summary).toHaveClass('opacity-20')
    container.querySelectorAll('[class*="transition-"]').forEach((element) => {
      expect(element).toHaveClass('motion-reduce:transition-none')
    })
  })

  it('matches HA medals and column-hover emphasis without changing row geometry', () => {
    const { container } = render(<Slide13ComparativeScoring slideKey="slide-10" />)
    expect(container.querySelectorAll('[data-rank-medal="true"]')).toHaveLength(3)
    expect(container).not.toHaveTextContent('★')
    const winner = container.querySelector('[data-score-row="Card Bounty"]')!
    const hotTrail = container.querySelector('[data-score-row="Hot Trail"]')!
    const hometown = container.querySelector('[data-score-row="Hometown"]')!
    const score = screen.getByRole('button', { name: /Hot Trail: Core-Loop Fit score 5/i })

    expect(winner).toHaveClass('bg-cm-gold/20')
    expect(score).toHaveClass('h-11', 'w-12')
    expect(score.className).not.toMatch(/underline/)
    fireEvent.mouseEnter(hotTrail)
    expect(winner).not.toHaveClass('bg-cm-gold/20')
    expect(hotTrail).toHaveClass('opacity-100')
    expect(winner).toHaveClass('opacity-20')
    expect(hometown).toHaveClass('opacity-20')
    fireEvent.mouseLeave(hotTrail)
    expect(winner).toHaveClass('bg-cm-gold/20')
  })

  it('gives the table breathing room and mutes the opportunity formula', () => {
    const { container } = render(<Slide13ComparativeScoring slideKey="slide-10" />)
    expect(container.querySelector('[data-score-matrix-wrap="true"]')).toHaveClass('mt-6')
    expect(screen.getByTestId('score-formula')).toHaveClass('text-charcoal/60')
    expect(screen.getByTestId('score-formula')).not.toHaveClass('text-cm-violet-deep')
  })

})
