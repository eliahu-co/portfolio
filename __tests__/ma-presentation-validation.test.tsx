import { fireEvent, render, screen } from '@testing-library/react'
import Slide18ExperimentDesign from '@/app/MA-HomeAssignment/presentation/slides/Slide18ExperimentDesign'
import Slide19Metrics from '@/app/MA-HomeAssignment/presentation/slides/Slide19Metrics'
import SlideValidationRoadmap from '@/app/MA-HomeAssignment/presentation/slides/SlideValidationRoadmap'
import Slide21ThankYou from '@/app/MA-HomeAssignment/presentation/slides/Slide21ThankYou'
import { METRIC_GROUPS, PROTOCOL } from '@/app/MA-HomeAssignment/content/validation'
import { slideCount, slideRegistry } from '@/app/MA-HomeAssignment/presentation/slideRegistry'

describe('MA presentation validation chapter', () => {
  it('shows the comparable control, treatment, population, and hypothesis', () => {
    const { container } = render(<Slide18ExperimentDesign slideKey="slide-12" />)
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
    const { container } = render(<Slide19Metrics slideKey="slide-13" />)
    expect(screen.getByRole('heading', { name: 'ARPDAU lift' })).toBeVisible()
    expect(container.querySelector('[data-primary-metric="true"]')).not.toBeInTheDocument()
    expect(container.querySelector('[data-primary-metric-spacer="true"]')).toBeInTheDocument()

    const supportingTab = screen.getByRole('tab', { name: 'Supporting metrics' })
    const guardrailsTab = screen.getByRole('tab', { name: 'Guardrails' })
    expect(supportingTab).toHaveAttribute('aria-selected', 'true')
    expect(guardrailsTab).toHaveAttribute('aria-selected', 'false')

    const supporting = METRIC_GROUPS.find(({ title }) => title === 'Supporting metrics')!.metrics
    const guardrails = METRIC_GROUPS.find(({ title }) => title === 'Guardrails')!.metrics
    const columns = container.querySelectorAll('colgroup col')
    expect(columns[0]).toHaveClass('w-[38%]')
    expect(columns[1]).toHaveClass('w-[22%]')
    expect(columns[2]).toHaveClass('w-[40%]')
    supporting.forEach(({ metric, target, mutedTarget }) => {
      const row = screen.getByRole('button', { name: metric }).closest('tr')
      expect(row).toHaveTextContent(mutedTarget ? `${mutedTarget} ${target}` : target)
      expect(row?.lastElementChild).toHaveClass('whitespace-nowrap')
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
    expect(detail).not.toHaveTextContent(guardrails[0].metric)
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

  it('closes the table with a single rule, not the row border plus the rail border', () => {
    const { container } = render(<Slide19Metrics slideKey="slide-17" />)
    const rows = Array.from(container.querySelectorAll('tbody tr'))
    const detail = screen.getByRole('status', { name: 'Metric detail' })

    // the detail rail's top border is the closing line, so the last row drops its own
    expect(rows[rows.length - 1]).toHaveClass('last:border-b-0')
    expect(detail).toHaveClass('border-t')
    rows.slice(0, -1).forEach((row) => expect(row).toHaveClass('border-b'))
  })

  it('activates a metric from anywhere in its row, not just the metric column', () => {
    const { container } = render(<Slide19Metrics slideKey="slide-17" />)
    const detail = screen.getByRole('status', { name: 'Metric detail' })
    const row = container.querySelector('[data-metric-row="ARPPU by payer tier"]')!
    const peer = container.querySelector('[data-metric-row="Coin spend on Chests per DAU"]')!

    // the event lands on the row itself — the pointer could be over the role
    // pill or the target number, which sit outside the metric column
    fireEvent.mouseEnter(row)
    expect(row).toHaveAttribute('data-active-row', 'true')
    expect(row).toHaveClass('opacity-100')
    expect(peer).toHaveClass('opacity-20')
    expect(detail).toHaveTextContent('deeper payer spend')

    fireEvent.mouseLeave(row)
    expect(row).toHaveAttribute('data-active-row', 'false')
    expect(peer).toHaveClass('opacity-100')
  })

  it('leaves the detail rail empty for metrics that carry no note', () => {
    render(<Slide19Metrics slideKey="slide-17" />)
    const detail = screen.getByRole('status', { name: 'Metric detail' })
    const supporting = METRIC_GROUPS.find(({ title }) => title === 'Supporting metrics')!.metrics

    supporting.filter(({ metricHelp }) => !metricHelp).forEach(({ metric }) => {
      fireEvent.mouseEnter(screen.getByRole('button', { name: metric }))
      expect(detail).toBeEmptyDOMElement()
      fireEvent.mouseLeave(screen.getByRole('button', { name: metric }))
    })

    // a metric that does have a note still shows it
    const annotated = supporting.find(({ metricHelp }) => metricHelp)!
    fireEvent.mouseEnter(screen.getByRole('button', { name: annotated.metric }))
    expect(detail.textContent?.length ?? 0).toBeGreaterThan(0)
  })

  it('reveals the muted target numbers only after the eyebrow is clicked', () => {
    const { container } = render(<Slide19Metrics slideKey="slide-17" />)
    const toggle = screen.getByRole('button', { name: 'Success criteria' })
    const targets = () => Array.from(container.querySelectorAll('[data-target-value="true"]'))

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(targets().length).toBeGreaterThan(0)
    targets().forEach((target) => {
      expect(target).toHaveClass('opacity-0')
      expect(target).toHaveAttribute('aria-hidden', 'true')
    })
    // the headline threshold drops out of flow entirely, so the title stays gap-free
    expect(container.querySelector('[data-title-target="true"]')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'ARPDAU lift' })).toBeVisible()

    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    targets().forEach((target) => {
      expect(target).toHaveClass('opacity-100')
      expect(target).not.toHaveAttribute('aria-hidden', 'true')
    })
    expect(screen.getByRole('heading', { name: 'ARPDAU ≥5% lift' })).toBeVisible()

    // the reveal spans both tabs, so guardrails inherit the toggled state
    fireEvent.click(screen.getByRole('tab', { name: 'Guardrails' }))
    targets().forEach((target) => expect(target).toHaveClass('opacity-100'))

    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    targets().forEach((target) => expect(target).toHaveClass('opacity-0'))
  })

  it('presents the validation roadmap and fades tests outside the active row', () => {
    const { container } = render(<SlideValidationRoadmap slideKey="slide-17" />)
    expect(screen.getByText('Test Plan')).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Validate, calibrate, evolve' })).toBeVisible()

    const rows = container.querySelectorAll('[data-validation-roadmap-test]')
    expect(rows).toHaveLength(5)
    expect(rows[0]).toHaveTextContent('Feature Validation')
    expect(rows[0]).not.toHaveTextContent('Main test')
    expect(rows[1]).toHaveTextContent('Meter Goal Calibration')
    expect(rows[2]).toHaveTextContent('Chest Tier Weighting')
    expect(rows[3]).toHaveTextContent('Multiple Milestones')
    expect(rows[4]).toHaveTextContent('Paid Progress Carryover')

    expect(rows[0].querySelector('img')).toHaveAttribute('src', expect.stringContaining('ab-test-emoji.png'))
    expect(rows[1].querySelector('img')).toHaveAttribute('src', expect.stringContaining('card-bounty-meter.png'))
    expect(rows[2].querySelector('img')).toHaveAttribute('src', expect.stringContaining('chest-tier-weighting.png'))
    expect(rows[3].querySelector('img')).toHaveAttribute('src', expect.stringContaining('card-bounty-milestone-meter.png'))
    expect(rows[4].querySelector('img')).toHaveAttribute('src', expect.stringContaining('keep-progress-button.png'))

    fireEvent.mouseEnter(rows[2])
    expect(rows[2]).toHaveClass('opacity-100')
    expect(rows[0]).toHaveClass('opacity-20')
    expect(rows[1]).toHaveClass('opacity-20')
    expect(rows[3]).toHaveClass('opacity-20')
    expect(rows[4]).toHaveClass('opacity-20')
    fireEvent.mouseLeave(rows[2])
    rows.forEach((row) => expect(row).toHaveClass('opacity-100'))
  })

  it('closes with a plain link to every slide in the deck', () => {
    const { container } = render(<Slide21ThankYou slideKey="slide-18" />)
    expect(screen.getByRole('heading', { name: 'Thank you' })).toBeVisible()

    // a link per slide worth returning to — not the cover, feature intros, or this slide
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(slideCount - 5)
    expect(links.map((link) => link.getAttribute('href'))).toEqual(
      slideRegistry
        .filter(({ chapter, closingMenu }) => chapter !== 'Closing' && closingMenu !== false)
        .map(({ id }) => `#${id}`),
    )
    // 7 fixed columns split the 14 links into two even rows
    expect(links[0].closest('ul')).toHaveClass('grid', 'grid-cols-7')
    expect(links.length % 7).toBe(0)
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '#slide-2')
    expect(screen.getByRole('link', { name: 'Score' })).toHaveAttribute('href', '#slide-10')
    expect(screen.getByRole('link', { name: 'Test plan' })).toHaveAttribute('href', '#slide-15')
    ;['Cover', 'Feature 1', 'Feature 2', 'Feature 3', 'Thank you'].forEach((label) => {
      expect(screen.queryByRole('link', { name: label })).not.toBeInTheDocument()
    })
    expect(container.querySelector('img[src="/coinmaster-sky.webp"]')).toBeInTheDocument()
    expect(container.querySelector('[data-celebration-layer="true"]')).toBeInTheDocument()
    expect(container.querySelectorAll('[data-confetti-piece="true"]')).toHaveLength(18)
    expect(container.querySelector('img[src="/coinmaster/resources/coin-emoji.png"]')).toBeInTheDocument()
    expect(container.querySelector('img[src="/coinmaster/resources/gem-emoji.png"]')).toBeInTheDocument()
    expect(container.querySelector('img[src="/coinmaster/resources/spin-emoji.png"]')).toBeInTheDocument()
    expect(container.querySelector('[data-closing-message="true"]')).not.toBeInTheDocument()

    screen.getAllByRole('link').forEach((link) => {
      expect(link.className).not.toMatch(/rounded-full|\bbg-|(?:^|\s)border(?:\s|$)/)
      // deliberately undecorated: colour and the focus ring carry the affordance
      expect(link.className).not.toMatch(/underline|border-b/)
      expect(link).toHaveClass('transition-colors', 'duration-300')
      expect(link).toHaveClass('focus-visible:outline', 'focus-visible:outline-cm-gold')
    })
  })
})
