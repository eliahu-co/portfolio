import { readFileSync } from 'fs'
import { resolve } from 'path'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { ASSUMPTION_STORIES, RECOMMENDATION, SCORE_STORIES } from '@/app/MA-HomeAssignment/presentation/deckData'
import {
  CRITERIA_DEFS,
  OPPORTUNITY_SCORE_FORMULA,
} from '@/app/MA-HomeAssignment/content/prioritization'
import Slide12Assumptions from '@/app/MA-HomeAssignment/presentation/slides/Slide12Assumptions'
import Slide13ComparativeScoring from '@/app/MA-HomeAssignment/presentation/slides/Slide13ComparativeScoring'
import Slide14Recommendation from '@/app/MA-HomeAssignment/presentation/slides/Slide14Recommendation'

function scoreLabel(rowIndex: number, criterionIndex: number): string {
  const story = SCORE_STORIES[rowIndex]
  const criterion = CRITERIA_DEFS[criterionIndex]

  return `${story.row.useCase}: ${criterion.title} score ${story.row.scores[criterionIndex]}`
}

function totalLabel(rowIndex: number): string {
  const { row } = SCORE_STORIES[rowIndex]
  return `${row.useCase}: total opportunity score ${Math.round(row.total)}`
}

function scoreRow(table: HTMLElement, rowIndex: number): HTMLElement {
  const row = table.querySelector<HTMLElement>(
    `[data-score-row="${SCORE_STORIES[rowIndex].row.useCase}"]`,
  )

  if (!row) throw new Error(`Missing score row ${SCORE_STORIES[rowIndex].row.useCase}`)
  return row
}

describe('MA presentation decision chapter', () => {
  it('shows every assumption and reveals each practical consequence equally on hover and focus', () => {
    const { rerender } = render(<Slide12Assumptions slideKey="assumptions-a" />)

    expect(screen.getByRole('heading', { level: 2, name: 'Assumptions' })).toBeVisible()

    ASSUMPTION_STORIES.forEach(({ assumption, consequence }) => {
      const control = screen.getByRole('button', { name: assumption })

      expect(control).toBeVisible()
      expect(control).toHaveAttribute('data-deck-interactive', 'true')

      fireEvent.mouseEnter(control)
      expect(screen.getByRole('status')).toHaveTextContent(consequence)
      fireEvent.mouseLeave(control)
      expect(screen.queryByRole('status')).not.toBeInTheDocument()

      fireEvent.focus(control)
      expect(screen.getByRole('status')).toHaveTextContent(consequence)
      fireEvent.blur(control)
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: ASSUMPTION_STORIES[0].assumption }))
    expect(screen.getByRole('status')).toHaveTextContent(ASSUMPTION_STORIES[0].consequence)

    rerender(<Slide12Assumptions slideKey="assumptions-b" />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('renders the complete semantic score table, winner band, totals, formula, and print rubric summary', () => {
    const { container } = render(<Slide13ComparativeScoring slideKey="score-static" />)
    const table = screen.getByRole('table', { name: 'Comparative opportunity scoring' })

    expect(screen.getByRole('heading', { level: 2, name: 'Comparative scoring' })).toBeVisible()
    expect(within(table).getAllByRole('columnheader').map((header) => header.textContent)).toEqual([
      'Feature',
      ...CRITERIA_DEFS.map(({ title }) => title),
      'Total',
    ])

    SCORE_STORIES.forEach(({ row }, rowIndex) => {
      const tableRow = scoreRow(table, rowIndex)
      const buttons = within(tableRow).getAllByRole('button')

      expect(tableRow).toHaveTextContent(row.useCase)
      expect(buttons.map((button) => button.textContent)).toEqual([
        ...row.scores.map(String),
        String(Math.round(row.total)),
      ])
      row.scores.forEach((_, criterionIndex) => {
        expect(screen.getByRole('button', { name: scoreLabel(rowIndex, criterionIndex) })).toBeVisible()
      })
      expect(screen.getByRole('button', { name: totalLabel(rowIndex) })).toBeVisible()
    })

    const winner = scoreRow(table, 0)
    const winnerHeader = within(winner).getByRole('rowheader')
    expect(winner).toHaveAttribute('data-winner', 'true')
    expect(winner).toHaveAttribute('data-winner-band', 'true')
    const winnerAnnouncement = within(winnerHeader).getByText('Recommended winner:')
    expect(winnerAnnouncement).toHaveClass('sr-only')
    expect(winnerAnnouncement).not.toHaveAttribute('aria-hidden')
    expect(winnerHeader).toHaveAccessibleName(/recommended winner:\s*card bounty/i)
    expect(scoreRow(table, 1)).toHaveAttribute('data-winner', 'false')
    expect(scoreRow(table, 2)).toHaveAttribute('data-winner', 'false')
    expect(screen.getByText(OPPORTUNITY_SCORE_FORMULA)).toBeVisible()

    const printSummary = container.querySelector<HTMLElement>('[data-score-print-summary="true"]')
    expect(printSummary).not.toBeNull()
    expect(printSummary).toHaveAttribute('data-print-details', 'true')
    CRITERIA_DEFS.forEach(({ title, body, rubric }) => {
      expect(within(printSummary!).getByRole('heading', { name: title, hidden: true })).toBeInTheDocument()
      expect(within(printSummary!).getByText(body)).toBeInTheDocument()
      const criterionSummary = within(printSummary!).getByRole('heading', {
        name: title,
        hidden: true,
      }).parentElement!
      const rubricItems = Array.from(
        criterionSummary.querySelectorAll<HTMLElement>('[data-score-rubric-item]'),
      )
      expect(rubricItems).toHaveLength(3)
      rubric.forEach(([score, description], index) => {
        expect(rubricItems[index]).toHaveAttribute('data-rubric-score', score)
        expect(rubricItems[index]).toHaveTextContent(description)
      })
    })
  })

  it('keeps the printed criterion summary in a task-specific four-column grid', () => {
    const { container } = render(<Slide13ComparativeScoring slideKey="score-print-grid" />)
    const printSummary = container.querySelector<HTMLElement>('[data-score-print-summary="true"]')
    const css = readFileSync(resolve(
      process.cwd(),
      'app/MA-HomeAssignment/presentation/PresentationStage.module.css',
    ), 'utf8')
    const printCss = css.slice(css.indexOf('@media print'))

    expect(printSummary).not.toBeNull()
    expect(printSummary).toHaveClass('scorePrintGrid')
    expect(printCss).toMatch(
      /\.printDetails\.scorePrintGrid\s*{[\s\S]*?display:\s*grid;[\s\S]*?grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\);[\s\S]*?gap:\s*8px;/,
    )
  })

  it('gives every criterion score pointer and keyboard parity with rationale, definition, rubric, row, and column context', () => {
    render(<Slide13ComparativeScoring slideKey="score-parity" />)
    const table = screen.getByRole('table', { name: 'Comparative opportunity scoring' })

    SCORE_STORIES.forEach((story, rowIndex) => {
      CRITERIA_DEFS.forEach((criterion, criterionIndex) => {
        const control = screen.getByRole('button', {
          name: scoreLabel(rowIndex, criterionIndex),
        })
        const row = scoreRow(table, rowIndex)
        const column = within(table).getByRole('columnheader', { name: criterion.title })
        const assertActiveDetail = () => {
          const detail = screen.getByRole('status', { name: 'Score detail' })

          expect(detail).toHaveTextContent(story.row.useCase)
          expect(detail).toHaveTextContent(criterion.title)
          expect(detail).toHaveTextContent(story.rationales[criterionIndex])
          expect(detail).toHaveTextContent(criterion.body)
          const rubricItems = Array.from(
            detail.querySelectorAll<HTMLElement>('[data-score-rubric-item]'),
          )
          expect(rubricItems).toHaveLength(3)
          criterion.rubric.forEach(([score, description], index) => {
            expect(rubricItems[index]).toHaveAttribute('data-rubric-score', score)
            expect(rubricItems[index]).toHaveTextContent(description)
          })
          expect(control).toHaveAttribute('data-active-cell', 'true')
          expect(row).toHaveAttribute('data-active-row', 'true')
          expect(column).toHaveAttribute('data-active-column', 'true')
          expect(scoreRow(table, 0)).toHaveAttribute('data-winner-band', 'true')
          SCORE_STORIES.forEach((_, index) => {
            expect(screen.getByRole('button', { name: totalLabel(index) })).toBeVisible()
          })
        }

        fireEvent.mouseEnter(control)
        assertActiveDetail()
        fireEvent.mouseLeave(control)
        expect(screen.queryByRole('status', { name: 'Score detail' })).not.toBeInTheDocument()

        fireEvent.focus(control)
        assertActiveDetail()
        fireEvent.blur(control)
        expect(screen.queryByRole('status', { name: 'Score detail' })).not.toBeInTheDocument()
      })
    })
  })

  it('leaves Escape to the deck while an unpinned focus cell keeps its scoring context', () => {
    const deckEscape = jest.fn()
    render(
      <div onKeyDown={(event) => event.key === 'Escape' && deckEscape()}>
        <Slide13ComparativeScoring slideKey="score-focus-escape" />
      </div>,
    )
    const table = screen.getByRole('table', { name: 'Comparative opportunity scoring' })
    const control = screen.getByRole('button', { name: scoreLabel(1, 2) })
    const row = scoreRow(table, 1)
    const column = within(table).getByRole('columnheader', {
      name: CRITERIA_DEFS[2].title,
    })

    fireEvent.focus(control)
    expect(control).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('status', { name: 'Score detail' })).toHaveTextContent(
      SCORE_STORIES[1].rationales[2],
    )

    expect(fireEvent.keyDown(control, { key: 'Escape' })).toBe(true)
    expect(deckEscape).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('status', { name: 'Score detail' })).toHaveTextContent(
      SCORE_STORIES[1].rationales[2],
    )
    expect(control).toHaveAttribute('data-active-cell', 'true')
    expect(row).toHaveAttribute('data-active-row', 'true')
    expect(column).toHaveAttribute('data-active-column', 'true')
  })

  it('pins by click or Enter, lets pinned detail win, and clears by toggle or Escape', () => {
    const deckEscape = jest.fn()
    render(
      <div onKeyDown={(event) => event.key === 'Escape' && deckEscape()}>
        <Slide13ComparativeScoring slideKey="score-pinning" />
      </div>,
    )

    const first = screen.getByRole('button', { name: scoreLabel(0, 0) })
    const other = screen.getByRole('button', { name: scoreLabel(2, 2) })

    fireEvent.click(first)
    expect(first).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('status', { name: 'Score detail' })).toHaveTextContent(
      SCORE_STORIES[0].rationales[0],
    )

    fireEvent.mouseEnter(other)
    fireEvent.focus(other)
    expect(first).toHaveAttribute('aria-pressed', 'true')
    expect(other).toHaveAttribute('data-active-cell', 'false')
    expect(screen.getByRole('status', { name: 'Score detail' })).toHaveTextContent(
      SCORE_STORIES[0].rationales[0],
    )

    fireEvent.click(first)
    expect(first).toHaveAttribute('aria-pressed', 'false')
    expect(screen.queryByRole('status', { name: 'Score detail' })).not.toBeInTheDocument()

    fireEvent.keyDown(other, { key: 'Enter' })
    expect(other).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('status', { name: 'Score detail' })).toHaveTextContent(
      SCORE_STORIES[2].rationales[2],
    )

    fireEvent.keyDown(other, { key: 'Enter' })
    expect(other).toHaveAttribute('aria-pressed', 'false')
    expect(screen.queryByRole('status', { name: 'Score detail' })).not.toBeInTheDocument()

    fireEvent.click(first)
    expect(fireEvent.keyDown(first, { key: 'Escape' })).toBe(false)
    expect(deckEscape).not.toHaveBeenCalled()
    expect(first).toHaveAttribute('aria-pressed', 'false')
    expect(screen.queryByRole('status', { name: 'Score detail' })).not.toBeInTheDocument()
  })

  it('explains every total as a relative score with the current formula on hover and focus', () => {
    render(<Slide13ComparativeScoring slideKey="score-totals" />)
    const table = screen.getByRole('table', { name: 'Comparative opportunity scoring' })
    const totalColumn = within(table).getByRole('columnheader', { name: 'Total' })

    SCORE_STORIES.forEach(({ row }, rowIndex) => {
      const control = screen.getByRole('button', { name: totalLabel(rowIndex) })
      const assertTotalDetail = () => {
        const detail = screen.getByRole('status', { name: 'Score detail' })
        expect(detail).toHaveTextContent('Relative opportunity score')
        expect(detail).toHaveTextContent(row.useCase)
        expect(within(detail).getByText(OPPORTUNITY_SCORE_FORMULA)).toBeVisible()
        expect(scoreRow(table, rowIndex)).toHaveAttribute('data-active-row', 'true')
        expect(totalColumn).toHaveAttribute('data-active-column', 'true')
      }

      fireEvent.mouseEnter(control)
      assertTotalDetail()
      fireEvent.mouseLeave(control)
      expect(screen.queryByRole('status', { name: 'Score detail' })).not.toBeInTheDocument()

      fireEvent.focus(control)
      assertTotalDetail()
      fireEvent.blur(control)
      expect(screen.queryByRole('status', { name: 'Score detail' })).not.toBeInTheDocument()
    })
  })

  it('clears pinned scoring detail when slideKey changes without disturbing the winner or totals', () => {
    const { rerender } = render(<Slide13ComparativeScoring slideKey="score-a" />)
    const control = screen.getByRole('button', { name: scoreLabel(1, 1) })

    fireEvent.click(control)
    expect(control).toHaveAttribute('aria-pressed', 'true')

    rerender(<Slide13ComparativeScoring slideKey="score-b" />)

    expect(screen.queryByRole('status', { name: 'Score detail' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: scoreLabel(1, 1) })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    const table = screen.getByRole('table', { name: 'Comparative opportunity scoring' })
    expect(scoreRow(table, 0)).toHaveAttribute('data-winner-band', 'true')
    SCORE_STORIES.forEach((_, index) => {
      expect(screen.getByRole('button', { name: totalLabel(index) })).toBeVisible()
    })
  })

  it('makes the Card Bounty recommendation, its evidence, risk, and mitigation unmistakably visible', () => {
    const { container } = render(<Slide14Recommendation slideKey="recommendation" />)
    const conclusion = container.querySelector<HTMLElement>('[data-recommendation-conclusion="true"]')!
    const riskSummary = container.querySelector<HTMLElement>('[data-recommendation-risk-summary="true"]')!

    expect(screen.getByRole('heading', { level: 2, name: RECOMMENDATION.title })).toBeVisible()
    expect(conclusion).toBeVisible()
    expect(conclusion).toHaveTextContent(/familiar Chest and Collection behavior/i)
    expect(conclusion).toHaveTextContent(/additional Coin demand/i)
    expect(conclusion).toHaveTextContent(/bounded, repeatable LiveOps event/i)
    expect(screen.getByRole('button', { name: /guarantee.*economy risk/i })).toBeVisible()
    expect(riskSummary).toBeVisible()
    expect(riskSummary).toHaveTextContent(RECOMMENDATION.risk.evidence)
    expect(riskSummary).toHaveTextContent(/calibrate.*meter/i)

    RECOMMENDATION.evidence.forEach(({ reason, evidence }) => {
      const control = screen.getByRole('button', { name: reason })
      fireEvent.mouseEnter(control)
      expect(screen.getByRole('status')).toHaveTextContent(evidence)
      fireEvent.mouseLeave(control)
      fireEvent.focus(control)
      expect(screen.getByRole('status')).toHaveTextContent(evidence)
      fireEvent.blur(control)
    })

    const risk = screen.getByRole('button', { name: RECOMMENDATION.risk.reason })
    fireEvent.focus(risk)
    expect(screen.getByRole('status')).toHaveTextContent(RECOMMENDATION.risk.evidence)
    expect(screen.getByRole('status')).toHaveTextContent(RECOMMENDATION.risk.mitigation)
  })
})
