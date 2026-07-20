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

  it('fades every header but the live column, without filling it', () => {
    const { container } = render(<Slide13ComparativeScoring slideKey="slide-10" />)
    const headers = () => Array.from(container.querySelectorAll('thead th'))
    const live = () => screen.getByTestId('score-column-coreLoopFit')

    headers().forEach((h) => expect(h).toHaveClass('opacity-100'))

    fireEvent.mouseEnter(screen.getByRole('button', { name: /Hot Trail: Core-Loop Fit score 5/i }))
    expect(live()).toHaveClass('opacity-100')
    headers().filter((h) => h !== live()).forEach((h) => expect(h).toHaveClass('opacity-20'))
    // not-faded is the whole signal — no gold fill on any header
    headers().forEach((h) => expect(h.className).not.toMatch(/bg-cm-gold/))

    fireEvent.mouseLeave(screen.getByRole('button', { name: /Hot Trail: Core-Loop Fit score 5/i }))
    headers().forEach((h) => expect(h).toHaveClass('opacity-100'))
  })

  it('makes the whole score cell the hover target, not just the number', () => {
    const { container } = render(<Slide13ComparativeScoring slideKey="slide-10" />)
    const cells = Array.from(container.querySelectorAll('tbody td'))
    expect(cells.length).toBeGreaterThan(0)

    cells.forEach((cell) => {
      const button = cell.querySelector('button')!
      // the button carries the hover handlers, so it has to fill the cell —
      // a fixed-width island leaves most of the cell inert
      expect(button.className).toContain('w-full')
      expect(button.className).not.toMatch(/(^|\s)w-12(\s|$)/)
      // padding lives on the button, so no dead ring is left inside the cell
      expect(cell.className).toMatch(/(^|\s)p-0(\s|$)/)
    })
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

    // one fixed slot: the formula and every explanation share it, so the
    // region cannot change height as the pointer moves
    expect(region).toHaveClass('h-[200px]')
    expect(region.className).not.toMatch(/grid-rows-/)
    expect(detail).toHaveClass('h-[200px]', 'overflow-hidden')
    expect(detail.className).not.toMatch(/border-l-/)
    expect(screen.queryByTestId('score-decision-summary')).not.toBeInTheDocument()
    expect(screen.getByTestId('score-column-coreLoopFit')).toHaveClass('transition-opacity', 'duration-300')
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

    expect(within(detail).queryByTestId('score-default-detail')).not.toBeInTheDocument()
    expect(detail).not.toHaveTextContent('Highest opportunity')
    expect(detail).not.toHaveTextContent('The strongest combination of ARPDAU impact')
    expect(detail.className).not.toMatch(/border-l-|pl-5/)
    // at rest the slot holds the formula
    expect(within(detail).getByTestId('score-formula')).toBeVisible()
    expect(detail).not.toHaveTextContent('Relative comparison:')
    expect(detail).not.toHaveTextContent('Card Bounty leads because')

    fireEvent.focus(screen.getByRole('button', { name: /Hot Trail: Core-Loop Fit score 5/i }))
    expect(within(detail).queryByTestId('score-default-detail')).not.toBeInTheDocument()
    expect(detail.className).not.toMatch(/border-l-|pl-5/)
    expect(within(detail).queryByTestId('score-rubric-item')).not.toBeInTheDocument()
    expect(detail).not.toHaveTextContent('Directly reinforces the existing core or meta loop.')
    // the explanation replaces the formula in the same slot
    expect(within(detail).queryByTestId('score-formula')).not.toBeInTheDocument()
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
    // spans the cell while keeping a comfortable minimum target height
    expect(score).toHaveClass('w-full', 'min-h-[60px]')
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
