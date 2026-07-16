import { render, screen } from '@testing-library/react'
import {
  Eyebrow,
  Panel,
  Pill,
  PrintDetails,
  RevealControl,
  SlideShell,
  SlideTitle,
  StageCounter,
} from '@/app/MA-HomeAssignment/presentation/primitives'
import { useDeckReset } from '@/app/MA-HomeAssignment/presentation/useDeckReset'

describe('MA presentation primitives', () => {
  it('renders a semantic slide title and projection-scale default copy', () => {
    render(
      <SlideShell data-testid="shell">
        <Eyebrow>Decision</Eyebrow>
        <SlideTitle>Comparative scoring</SlideTitle>
        <Panel>Every Chest advances visible progress.</Panel>
      </SlideShell>,
    )

    expect(screen.getByRole('heading', { level: 2, name: 'Comparative scoring' }))
      .toHaveClass('text-[64px]', 'leading-[1.04]')
    expect(screen.getByText('Every Chest advances visible progress.')).toBeVisible()
    expect(screen.getByTestId('shell'))
      .toHaveClass('bg-cm-cream', 'text-[16px]', 'px-20', 'pt-20', 'pb-16')
    expect(screen.getByText('Decision')).toHaveClass(
      'text-[12px]',
      'mb-1',
      'font-medium',
      'uppercase',
      'tracking-[0.14em]',
      'text-black',
    )
  })

  it('allows the cover title to use a semantic level-one heading', () => {
    render(<SlideTitle as="h1">Increasing ARPDAU</SlideTitle>)

    expect(screen.getByRole('heading', { level: 1, name: 'Increasing ARPDAU' })).toBeInTheDocument()
  })

  it('renders approved MA panel and pill tones without shrinking label copy', () => {
    render(
      <Panel tone="blue" data-testid="panel">
        <Pill tone="gold">Progress</Pill>
        <Pill tone="crimson">Risk</Pill>
      </Panel>,
    )

    expect(screen.getByTestId('panel').className).toContain('border-[#1E7BA8]')
    expect(screen.getByText('Progress')).toHaveClass('bg-cm-gold', 'text-[14px]')
    expect(screen.getByText('Risk')).toHaveClass('bg-cm-crimson', 'text-[14px]')
  })

  it('shows a one-based stage counter with an accessible status label', () => {
    render(<StageCounter index={2} total={21} />)

    expect(screen.getByRole('status', { name: 'Slide 3 of 21' })).toHaveTextContent('3 / 21')
  })

  it('uses a real focusable reveal button while keeping its summary visible', () => {
    render(
      <RevealControl summary="Choose a missing Card" active={false} aria-controls="target-details" />,
    )

    const control = screen.getByRole('button', { name: 'Choose a missing Card' })
    expect(control).toBeVisible()
    expect(control).toHaveAttribute('type', 'button')
    expect(control).toHaveAttribute('aria-expanded', 'false')
    expect(control).toHaveAttribute('data-deck-interactive', 'true')
    expect(control.className).toContain('focus-visible:outline')
    expect(control).toHaveClass('motion-reduce:transition-none')

    control.focus()
    expect(control).toHaveFocus()
  })

  it('marks supporting detail for print without replacing the visible summary', () => {
    render(
      <div>
        <p>Visible decision summary</p>
        <PrintDetails>Printed criterion definition and rubric</PrintDetails>
      </div>,
    )

    expect(screen.getByText('Visible decision summary')).toBeVisible()
    const details = screen.getByText('Printed criterion definition and rubric')
    expect(details).toHaveAttribute('data-print-details', 'true')
    expect(details).toHaveAttribute('aria-hidden', 'true')
  })
})

function ResetHarness({ reset, slideKey }: { reset: () => void; slideKey: string }) {
  useDeckReset(reset, slideKey)
  return null
}

describe('useDeckReset', () => {
  it('resets with the latest callback only when the active slide key changes', () => {
    const firstReset = jest.fn()
    const latestReset = jest.fn()
    const { rerender } = render(<ResetHarness reset={firstReset} slideKey="cover" />)

    expect(firstReset).not.toHaveBeenCalled()

    rerender(<ResetHarness reset={latestReset} slideKey="cover" />)
    expect(firstReset).not.toHaveBeenCalled()
    expect(latestReset).not.toHaveBeenCalled()

    rerender(<ResetHarness reset={latestReset} slideKey="approach" />)
    expect(firstReset).not.toHaveBeenCalled()
    expect(latestReset).toHaveBeenCalledTimes(1)
  })
})
