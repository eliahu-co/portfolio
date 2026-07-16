import { readFileSync } from 'fs'
import { resolve } from 'path'
import { fireEvent, render, screen, within } from '@testing-library/react'
import {
  ADDITIONAL_TESTS,
  METRIC_GROUPS,
  PROTOCOL,
  TOOLTIP_NOTES,
} from '@/app/MA-HomeAssignment/content/validation'
import Slide18ExperimentDesign from '@/app/MA-HomeAssignment/presentation/slides/Slide18ExperimentDesign'
import Slide19Metrics from '@/app/MA-HomeAssignment/presentation/slides/Slide19Metrics'
import Slide20FollowUpExperiments from '@/app/MA-HomeAssignment/presentation/slides/Slide20FollowUpExperiments'
import Slide21ThankYou from '@/app/MA-HomeAssignment/presentation/slides/Slide21ThankYou'

function requiredElement(container: HTMLElement, selector: string): HTMLElement {
  const element = container.querySelector<HTMLElement>(selector)
  expect(element).not.toBeNull()
  if (!element) throw new Error(`Missing required element: ${selector}`)
  return element
}

function metricTarget(metric: (typeof METRIC_GROUPS)[number]['metrics'][number]): string {
  return [metric.target, metric.mutedTarget].filter(Boolean).join(' ')
}

function metricControl(board: HTMLElement, metricName: string): HTMLButtonElement {
  const control = Array.from(
    board.querySelectorAll<HTMLButtonElement>('button[data-metric-card="true"]'),
  ).find((candidate) => candidate.dataset.metricName === metricName)

  expect(control).toBeDefined()
  if (!control) throw new Error(`Missing metric control: ${metricName}`)
  return control
}

describe('MA presentation validation chapter', () => {
  it('keeps the canonical population, comparable arms, single difference, and hypothesis visible', () => {
    const { container } = render(<Slide18ExperimentDesign slideKey="experiment-copy" />)
    const board = requiredElement(container, '[data-experiment-screen-board="true"]')
    const arms = Array.from(
      board.querySelectorAll<HTMLElement>('[data-experiment-arm][data-shared-baseline]'),
    )

    expect(screen.getByRole('heading', {
      level: 2,
      name: 'One change, one testable hypothesis',
    })).toBeVisible()
    PROTOCOL.forEach(({ label, body }) => {
      expect(within(board).getByText(label, { exact: true })).toBeVisible()
      expect(within(board).getByText(body, { exact: true })).toBeVisible()
    })
    expect(arms).toHaveLength(2)
    expect(arms.map((arm) => arm.getAttribute('data-experiment-arm'))).toEqual([
      'Control',
      'Treatment',
    ])
    arms.forEach((arm) => {
      expect(arm).toHaveAttribute('data-shared-baseline', PROTOCOL[1].body)
    })

    const difference = requiredElement(board, '[data-single-difference="true"]')
    expect(difference).toHaveTextContent('Single experimental difference')
    expect(difference).toHaveTextContent('Card Bounty as a time-limited LiveOps event')
    expect(PROTOCOL[3].body).toMatch(/ARPDAU/)
    expect(within(requiredElement(board, '[data-hypothesis="true"]'))
      .getByText(PROTOCOL[3].body, { exact: true })).toBeVisible()

    const printSummary = requiredElement(container, '[data-experiment-print-summary="true"]')
    expect(printSummary).toHaveClass('experimentPrintSummary')
    PROTOCOL.forEach(({ label, body }) => {
      expect(printSummary).toHaveTextContent(label)
      expect(printSummary).toHaveTextContent(body)
    })
  })

  it('uses one fixed experiment rail with pointer/focus parity and resets it by slide key', () => {
    const { container, rerender } = render(
      <Slide18ExperimentDesign slideKey="experiment-a" />,
    )
    const board = requiredElement(container, '[data-experiment-screen-board="true"]')
    const rail = requiredElement(container, '[data-experiment-detail-rail="true"]')
    const arms = Array.from(
      board.querySelectorAll<HTMLButtonElement>('button[data-experiment-arm-control="true"]'),
    )

    expect(rail).toHaveClass('h-[88px]', 'overflow-hidden')
    expect(arms).toHaveLength(2)
    expect(within(rail).queryByRole('status')).not.toBeInTheDocument()

    arms.forEach((arm) => {
      const assertDetail = () => {
        const detail = within(rail).getByRole('status', { name: 'Experiment arm detail' })
        expect(detail).toHaveTextContent(arm.dataset.experimentArm!)
        expect(detail).toHaveTextContent(`Shared baseline: ${PROTOCOL[1].body}`)
        expect(detail).toHaveTextContent('Single experimental difference')
        expect(arm).toHaveAttribute('data-active', 'true')
        expect(arms.every((control) => control.isConnected)).toBe(true)
      }

      fireEvent.mouseEnter(arm)
      assertDetail()
      fireEvent.mouseLeave(arm)
      expect(within(rail).queryByRole('status')).not.toBeInTheDocument()

      fireEvent.focus(arm)
      assertDetail()
      fireEvent.blur(arm)
      expect(within(rail).queryByRole('status')).not.toBeInTheDocument()
    })

    fireEvent.focus(arms[1])
    rerender(<Slide18ExperimentDesign slideKey="experiment-b" />)
    expect(within(rail).queryByRole('status')).not.toBeInTheDocument()
  })

  it('makes ARPDAU dominant while separating support roles from long-term guardrails', () => {
    const { container } = render(<Slide19Metrics slideKey="metric-structure" />)
    const board = requiredElement(container, '[data-metric-screen-board="true"]')
    const cards = Array.from(
      board.querySelectorAll<HTMLButtonElement>('button[data-metric-card="true"]'),
    )
    const primary = requiredElement(board, '[data-metric-group="Primary metric"]')
    const supporting = requiredElement(board, '[data-metric-group="Supporting metrics"]')
    const guardrails = requiredElement(board, '[data-metric-group="Guardrails"]')

    expect(screen.getByRole('heading', { level: 2, name: 'ARPDAU leads the decision' }))
      .toBeVisible()
    expect(cards).toHaveLength(METRIC_GROUPS.flatMap(({ metrics }) => metrics).length)
    expect(metricControl(primary, 'ARPDAU')).toHaveAttribute('data-dominant', 'true')
    expect(metricControl(primary, 'ARPDAU')).toHaveClass('text-[20px]')
    expect(Array.from(supporting.querySelectorAll('[data-supporting-role]')).map(
      (role) => role.getAttribute('data-supporting-role'),
    )).toEqual(['Monetization', 'Economy', 'Feature funnel'])
    expect(guardrails).toHaveAttribute('data-long-term-guardrails', 'true')
    expect(within(board).getByText(TOOLTIP_NOTES['test-methodology'], { exact: true }))
      .toBeVisible()

    METRIC_GROUPS.forEach((group) => {
      const groupNode = requiredElement(board, `[data-metric-group="${group.title}"]`)
      group.metrics.forEach((metric) => {
        const control = metricControl(groupNode, metric.metric)
        expect(control).toBeVisible()
        expect(control).toHaveTextContent(metric.metric)
        expect(control).toHaveTextContent(metricTarget(metric))
        expect(control).toHaveAttribute(
          'data-metric-classification',
          group.title === 'Primary metric'
            ? 'Primary'
            : group.title === 'Guardrails'
              ? 'Guardrail'
              : metric.role,
        )
      })
    })
  })

  it('reveals every metric definition, denominator, target, and rationale on hover and focus', () => {
    const { container, rerender } = render(<Slide19Metrics slideKey="metric-a" />)
    const board = requiredElement(container, '[data-metric-screen-board="true"]')
    const rail = requiredElement(container, '[data-metric-detail-rail="true"]')
    const metrics = METRIC_GROUPS.flatMap((group) => group.metrics.map((metric) => ({
      group,
      metric,
    })))

    expect(rail).toHaveClass('h-[96px]', 'overflow-hidden')
    metrics.forEach(({ group, metric }) => {
      const control = metricControl(board, metric.metric)
      const assertDetail = () => {
        const detail = within(rail).getByRole('status', { name: 'Metric detail' })
        const fields = Array.from(
          detail.querySelectorAll<HTMLElement>('[data-metric-detail-field]'),
        )
        expect(fields.map((field) => field.dataset.metricDetailField)).toEqual([
          'definition',
          'denominator',
          'target',
          'classification',
        ])
        fields.forEach((field) => expect(field.textContent?.trim().length).toBeGreaterThan(0))
        expect(detail).toHaveTextContent(metric.metric)
        expect(detail).toHaveTextContent(metricTarget(metric))
        expect(detail).toHaveTextContent(
          group.title === 'Primary metric'
            ? 'Primary'
            : group.title === 'Guardrails'
              ? 'Guardrail'
              : metric.role!,
        )
        if (metric.metricHelp) {
          expect(detail).toHaveTextContent(TOOLTIP_NOTES[metric.metricHelp])
        }
        expect(control).toHaveAttribute('data-active', 'true')
        expect(board.querySelectorAll('button[data-metric-card="true"]')).toHaveLength(metrics.length)
      }

      fireEvent.mouseEnter(control)
      assertDetail()
      fireEvent.mouseLeave(control)
      expect(within(rail).queryByRole('status')).not.toBeInTheDocument()

      fireEvent.focus(control)
      assertDetail()
      fireEvent.blur(control)
      expect(within(rail).queryByRole('status')).not.toBeInTheDocument()
    })

    fireEvent.focus(metricControl(board, 'ARPDAU'))
    rerender(<Slide19Metrics slideKey="metric-b" />)
    expect(within(rail).queryByRole('status')).not.toBeInTheDocument()
  })

  it('uses a compact stage stack without shrinking visible targets or metric detail', () => {
    const { container } = render(<Slide19Metrics slideKey="metric-compact-layout" />)
    const shell = requiredElement(container, '[data-slide-shell="true"]')
    const board = requiredElement(container, '[data-metric-screen-board="true"]')
    const primary = requiredElement(board, '[data-metric-group="Primary metric"]')
    const rail = requiredElement(board, '[data-metric-detail-rail="true"]')
    const cards = Array.from(
      board.querySelectorAll<HTMLButtonElement>('button[data-metric-card="true"]'),
    )
    const nonPrimaryCards = cards.filter((card) => card.dataset.dominant !== 'true')

    expect(shell).toHaveClass('!py-7')
    expect(board).toHaveAttribute('data-compact-layout', 'true')
    expect(board.firstElementChild).toBe(primary)
    expect(metricControl(primary, 'ARPDAU')).toHaveClass('min-h-[52px]', 'text-[20px]')
    nonPrimaryCards.forEach((card) => {
      expect(card).toHaveClass('min-h-11', 'text-[14px]')
      expect(requiredElement(card, '[data-metric-target="true"]'))
        .toHaveClass('text-[14px]')
    })
    expect(rail).toHaveClass('mt-1', 'h-[96px]')
    expect(within(rail).getByText(TOOLTIP_NOTES['test-methodology'], { exact: true }))
      .toHaveClass('text-[14px]')

    fireEvent.focus(metricControl(board, 'ARPPU by payer tier'))
    const detail = within(rail).getByRole('status', { name: 'Metric detail' })
    Array.from(detail.querySelectorAll<HTMLElement>('[data-metric-detail-field] > p:last-child'))
      .forEach((copy) => expect(copy).toHaveClass('text-[14px]'))
  })

  it('prints a compact static summary of every metric note and canonical target', () => {
    const { container } = render(<Slide19Metrics slideKey="metric-print" />)
    const summary = requiredElement(container, '[data-metric-print-summary="true"]')
    const entries = Array.from(summary.querySelectorAll<HTMLElement>('[data-metric-print-item]'))
    const allMetrics = METRIC_GROUPS.flatMap(({ metrics }) => metrics)

    expect(summary).toHaveClass('metricPrintSummary')
    expect(entries).toHaveLength(allMetrics.length)
    allMetrics.forEach((metric, index) => {
      expect(entries[index]).toHaveTextContent(metric.metric)
      expect(entries[index]).toHaveTextContent(metricTarget(metric))
      expect(entries[index]).toHaveTextContent('Definition')
      expect(entries[index]).toHaveTextContent('Denominator')
      expect(entries[index]).toHaveTextContent('Why this role')
      if (metric.metricHelp) {
        expect(entries[index]).toHaveTextContent(TOOLTIP_NOTES[metric.metricHelp])
      }
    })
    expect(summary).toHaveTextContent(TOOLTIP_NOTES['test-methodology'])
  })

  it('keeps all follow-up experiment names, setups, and outcomes visible', () => {
    const { container } = render(<Slide20FollowUpExperiments slideKey="follow-up-copy" />)
    const board = requiredElement(container, '[data-follow-up-screen-board="true"]')
    const cards = Array.from(
      board.querySelectorAll<HTMLButtonElement>('button[data-follow-up-card="true"]'),
    )

    expect(screen.getByRole('heading', {
      level: 2,
      name: 'Three tests turn uncertainty into decisions',
    })).toBeVisible()
    expect(cards).toHaveLength(ADDITIONAL_TESTS.length)
    ADDITIONAL_TESTS.forEach(({ title, setup, outcome }, index) => {
      expect(cards[index]).toBeVisible()
      expect(cards[index]).toHaveTextContent(title)
      expect(cards[index]).toHaveTextContent(setup)
      expect(cards[index]).toHaveTextContent(outcome)
    })
  })

  it('reveals treatment, uncertainty, and decision in one fixed follow-up rail', () => {
    const { container, rerender } = render(
      <Slide20FollowUpExperiments slideKey="follow-up-a" />,
    )
    const board = requiredElement(container, '[data-follow-up-screen-board="true"]')
    const rail = requiredElement(container, '[data-follow-up-detail-rail="true"]')
    const cards = Array.from(
      board.querySelectorAll<HTMLButtonElement>('button[data-follow-up-card="true"]'),
    )

    expect(rail).toHaveClass('h-[128px]', 'overflow-hidden')
    cards.forEach((card) => {
      const assertDetail = () => {
        const detail = within(rail).getByRole('status', { name: 'Follow-up experiment detail' })
        expect(detail).toHaveTextContent(card.dataset.followUpTitle!)
        const fields = Array.from(
          detail.querySelectorAll<HTMLElement>('[data-follow-up-detail-field]'),
        )
        expect(fields.map((field) => field.dataset.followUpDetailField)).toEqual([
          'treatment',
          'uncertainty',
          'decision',
        ])
        fields.forEach((field) => expect(field.textContent?.trim().length).toBeGreaterThan(0))
        expect(card).toHaveAttribute('data-active', 'true')
      }

      fireEvent.mouseEnter(card)
      assertDetail()
      fireEvent.mouseLeave(card)
      expect(within(rail).queryByRole('status')).not.toBeInTheDocument()

      fireEvent.focus(card)
      assertDetail()
      fireEvent.blur(card)
      expect(within(rail).queryByRole('status')).not.toBeInTheDocument()
    })

    fireEvent.focus(cards[0])
    rerender(<Slide20FollowUpExperiments slideKey="follow-up-b" />)
    expect(within(rail).queryByRole('status')).not.toBeInTheDocument()
  })

  it('prints all follow-up setup, outcome, uncertainty, and decision copy statically', () => {
    const { container } = render(<Slide20FollowUpExperiments slideKey="follow-up-print" />)
    const summary = requiredElement(container, '[data-follow-up-print-summary="true"]')
    const entries = Array.from(summary.querySelectorAll<HTMLElement>('[data-follow-up-print-item]'))

    expect(summary).toHaveClass('followUpPrintSummary')
    expect(entries).toHaveLength(ADDITIONAL_TESTS.length)
    ADDITIONAL_TESTS.forEach(({ title, setup, outcome }, index) => {
      expect(entries[index]).toHaveTextContent(title)
      expect(entries[index]).toHaveTextContent(setup)
      expect(entries[index]).toHaveTextContent(outcome)
      expect(entries[index]).toHaveTextContent('Treatment')
      expect(entries[index]).toHaveTextContent('Uncertainty')
      expect(entries[index]).toHaveTextContent('Decision')
    })
  })

  it('closes with real same-deck chapter anchors and no reload targets', () => {
    render(<Slide21ThankYou slideKey="thank-you" />)
    const links = screen.getAllByRole('link')
    const expected = [
      ['Approach', '#slide-3'],
      ['Three bets', '#slide-5'],
      ['Decision', '#slide-13'],
      ['Player flow', '#slide-15'],
      ['Validation', '#slide-18'],
    ]

    expect(screen.getByRole('heading', { level: 2, name: 'Thank you' })).toBeVisible()
    expect(screen.getByText(/measurable Coin demand/i)).toBeVisible()
    expect(links).toHaveLength(expected.length)
    expected.forEach(([label, hash], index) => {
      expect(links[index]).toHaveAccessibleName(label)
      expect(links[index]).toHaveAttribute('href', hash)
      expect(links[index]).toHaveAttribute('data-deck-interactive', 'true')
      expect(links[index]).not.toHaveAttribute('target')
      expect(links[index]).not.toHaveAttribute('download')
    })
    expect(links.every((link) => link.getAttribute('href')?.startsWith('#slide-'))).toBe(true)
  })

  it('uses task-specific print grids and hides only the interactive screen boards in print', () => {
    const css = readFileSync(resolve(
      process.cwd(),
      'app/MA-HomeAssignment/presentation/PresentationStage.module.css',
    ), 'utf8')
    const printCss = css.slice(css.indexOf('@media print'))

    expect(printCss).toMatch(
      /\.experimentScreenBoard,\s*\.metricScreenBoard,\s*\.followUpScreenBoard\s*{[\s\S]*?display:\s*none\s*!important;/,
    )
    expect(printCss).toMatch(
      /\.printDetails\.experimentPrintSummary\s*{[\s\S]*?display:\s*grid;[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/,
    )
    expect(printCss).toMatch(
      /\.printDetails\.metricPrintSummary\s*{[\s\S]*?display:\s*grid;[\s\S]*?grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\);/,
    )
    expect(printCss).toMatch(
      /\.printDetails\.followUpPrintSummary\s*{[\s\S]*?display:\s*grid;[\s\S]*?grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\);/,
    )
  })
})
