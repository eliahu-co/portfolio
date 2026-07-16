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

  it('keeps ARPDAU dominant and reveals metric methodology', () => {
    render(<Slide19Metrics slideKey="slide-16" />)
    expect(screen.getByRole('heading', { name: 'ARPDAU leads the decision' })).toBeVisible()
    const canonicalMetrics = METRIC_GROUPS.flatMap((group) => group.metrics)
    expect(screen.getAllByRole('button')).toHaveLength(canonicalMetrics.length)
    screen.getAllByRole('button').forEach((button) => {
      expect(button).toHaveClass('min-h-6', 'text-[11px]')
      expect(button).not.toHaveClass('min-h-7')
    })
    canonicalMetrics.forEach(({ metric, target, mutedTarget }) => {
      const row = screen.getByRole('button', { name: metric }).closest('tr')
      expect(row).toHaveTextContent(target)
      if (mutedTarget) expect(row).toHaveTextContent(mutedTarget)
    })
    const detail = screen.getByRole('status', { name: 'Metric detail' })
    expect(detail).toHaveClass('min-h-[40px]', 'text-[11px]')
    expect(detail.className).not.toMatch(/border-l-/)
    expect(detail).toHaveTextContent(/Event duration/i)
    const metric = screen.getByRole('button', { name: /ARPDAU/i })
    fireEvent.focus(metric)
    expect(metric).toHaveAttribute('aria-expanded', 'true')
    expect(metric).toHaveClass('font-extrabold')
    const activeRow = metric.closest('tr')!
    expect(activeRow).toHaveClass('opacity-100')
    screen.getAllByRole('button').filter((button) => button !== metric).forEach((button) => {
      expect(button.closest('tr')).toHaveClass('opacity-20')
    })
    expect(detail).toHaveTextContent(/ARPDAU is used to explain/i)
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
    const { container } = render(<Slide21ThankYou slideKey="slide-17" />)
    expect(screen.getByRole('heading', { name: 'Thank you' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Decision' })).toHaveAttribute('href', '#slide-10')
    expect(screen.getByRole('link', { name: 'Validation' })).toHaveAttribute('href', '#slide-15')
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
