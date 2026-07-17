import { fireEvent, render, screen } from '@testing-library/react'
import Slide18ExperimentDesign from '@/app/MA-HomeAssignment/presentation/slides/Slide18ExperimentDesign'
import Slide19Metrics from '@/app/MA-HomeAssignment/presentation/slides/Slide19Metrics'
import Slide21ThankYou from '@/app/MA-HomeAssignment/presentation/slides/Slide21ThankYou'
import { METRIC_GROUPS, PROTOCOL } from '@/app/MA-HomeAssignment/content/validation'

describe('MA presentation validation chapter', () => {
  it('shows the comparable control, treatment, population, and hypothesis', () => {
    const { container } = render(<Slide18ExperimentDesign slideKey="slide-15" />)
    expect(screen.getByRole('heading', { name: 'Card Bounty validation' })).toBeVisible()
    PROTOCOL.forEach(({ label, body }) => {
      expect(screen.getByRole('heading', { name: label })).toBeVisible()
      expect(screen.getByText(body)).toBeVisible()
    })

    const sections = Array.from(container.querySelectorAll('[data-protocol-section]'))
    expect(sections).toHaveLength(PROTOCOL.length)
    sections.forEach((section) => {
      expect(section.className).toMatch(/border-t/)
      expect(section.className).not.toMatch(/rounded|shadow|\bbg-/)
    })
  })

  it('keeps ARPDAU dominant and switches between supporting metrics and guardrails', () => {
    const { container } = render(<Slide19Metrics slideKey="slide-15" />)
    expect(screen.getByRole('heading', { name: 'ARPDAU leads the decision' })).toBeVisible()
    const primary = container.querySelector('[data-primary-metric="true"]')!
    expect(primary).toHaveTextContent('ARPDAU')
    expect(primary).toHaveTextContent('≥5% lift')
    expect(primary.querySelector('thead')).not.toBeInTheDocument()

    const supportingTab = screen.getByRole('tab', { name: 'Supporting metrics' })
    const guardrailsTab = screen.getByRole('tab', { name: 'Guardrails' })
    expect(supportingTab).toHaveAttribute('aria-selected', 'true')
    expect(guardrailsTab).toHaveAttribute('aria-selected', 'false')

    const supporting = METRIC_GROUPS.find(({ title }) => title === 'Supporting metrics')!.metrics
    const guardrails = METRIC_GROUPS.find(({ title }) => title === 'Guardrails')!.metrics
    supporting.forEach(({ metric, target, mutedTarget }) => {
      const row = screen.getByRole('button', { name: metric }).closest('tr')
      expect(row).toHaveTextContent(mutedTarget ? `${mutedTarget} ${target}` : target)
    })
    guardrails.forEach(({ metric }) => {
      expect(screen.queryByRole('button', { name: metric })).not.toBeInTheDocument()
    })

    fireEvent.click(guardrailsTab)
    expect(guardrailsTab).toHaveAttribute('aria-selected', 'true')
    expect(supportingTab).toHaveAttribute('aria-selected', 'false')
    guardrails.forEach(({ metric, target, mutedTarget }) => {
      const row = screen.getByRole('button', { name: metric }).closest('tr')
      expect(row).toHaveTextContent(mutedTarget ? `${mutedTarget} ${target}` : target)
    })
    supporting.forEach(({ metric }) => {
      expect(screen.queryByRole('button', { name: metric })).not.toBeInTheDocument()
    })

    const detail = screen.getByRole('status', { name: 'Metric detail' })
    expect(detail).toHaveClass('min-h-[54px]', 'text-[13px]')
    expect(detail.className).not.toMatch(/border-l-/)
    expect(detail).toHaveTextContent(/Event duration/i)
    const metric = screen.getByRole('button', { name: guardrails[0].metric })
    fireEvent.focus(metric)
    expect(metric).toHaveAttribute('aria-expanded', 'true')
    expect(metric).toHaveClass('font-extrabold')
    const activeRow = metric.closest('tr')!
    expect(activeRow).toHaveClass('opacity-100')
    guardrails.slice(1).forEach(({ metric: peerMetric }) => {
      const button = screen.getByRole('button', { name: peerMetric })
      expect(button.closest('tr')).toHaveClass('opacity-20')
    })
    expect(detail).toHaveTextContent(guardrails[0].metric)
    fireEvent.mouseEnter(metric)
    fireEvent.blur(metric)
    expect(metric).toHaveAttribute('aria-expanded', 'true')
    fireEvent.mouseLeave(metric)
    expect(metric).toHaveAttribute('aria-expanded', 'false')

    fireEvent.mouseEnter(metric)
    fireEvent.focus(metric)
    fireEvent.mouseLeave(metric)
    expect(metric).toHaveAttribute('aria-expanded', 'true')
    fireEvent.blur(metric)
    expect(metric).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('status', { name: 'Metric detail' })).toBe(detail)
    expect(detail).toHaveTextContent(/Event duration/i)
  })

  it('closes with plain same-deck chapter links', () => {
    const { container } = render(<Slide21ThankYou slideKey="slide-16" />)
    expect(screen.getByRole('heading', { name: 'Thank you' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Decision' })).toHaveAttribute('href', '#slide-9')
    expect(screen.getByRole('link', { name: 'Validation' })).toHaveAttribute('href', '#slide-14')
    expect(container.querySelector('img, svg')).not.toBeInTheDocument()
    expect(container.querySelector('[data-closing-message="true"]')).toHaveTextContent(/recommend Card Bounty/i)

    screen.getAllByRole('link').forEach((link) => {
      expect(link.className).not.toMatch(/rounded-full|\bbg-|(?:^|\s)border(?:\s|$)/)
      expect(link.className).toMatch(/underline|border-b/)
      expect(link).toHaveClass('transition-colors', 'duration-300')
      expect(link).toHaveClass(
        'motion-reduce:transition-none',
        'focus-visible:text-cm-crimson',
        'focus-visible:decoration-cm-crimson',
      )
    })
  })
})
