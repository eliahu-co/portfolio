import { fireEvent, render, screen } from '@testing-library/react'
import Slide18ExperimentDesign from '@/app/MA-HomeAssignment/presentation/slides/Slide18ExperimentDesign'
import Slide19Metrics from '@/app/MA-HomeAssignment/presentation/slides/Slide19Metrics'
import Slide21ThankYou from '@/app/MA-HomeAssignment/presentation/slides/Slide21ThankYou'

describe('MA presentation validation chapter', () => {
  it('shows the comparable control, treatment, population, and hypothesis', () => {
    render(<Slide18ExperimentDesign slideKey="slide-15" />)
    expect(screen.getByRole('heading', { name: 'Card Bounty validation' })).toBeVisible()
    expect(screen.getByText('Control')).toBeVisible()
    expect(screen.getByText('Treatment')).toBeVisible()
    expect(screen.getByText(/Hypothesis/i)).toBeVisible()
  })

  it('keeps ARPDAU dominant and reveals metric methodology', () => {
    render(<Slide19Metrics slideKey="slide-16" />)
    expect(screen.getByRole('heading', { name: 'ARPDAU leads the decision' })).toBeVisible()
    const detail = screen.getByRole('status', { name: 'Metric detail' })
    expect(detail).toHaveTextContent(/Event duration/i)
    const metric = screen.getByRole('button', { name: /ARPDAU/i })
    fireEvent.focus(metric)
    expect(metric).toHaveAttribute('aria-expanded', 'true')
    expect(detail).toHaveTextContent(/ARPDAU is used to explain/i)
    fireEvent.blur(metric)
    expect(metric).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('status', { name: 'Metric detail' })).toBe(detail)
    expect(detail).toHaveTextContent(/Event duration/i)
  })

  it('closes with plain same-deck chapter links', () => {
    render(<Slide21ThankYou slideKey="slide-17" />)
    expect(screen.getByRole('heading', { name: 'Thank you' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Decision' })).toHaveAttribute('href', '#slide-10')
    expect(screen.getByRole('link', { name: 'Validation' })).toHaveAttribute('href', '#slide-15')
  })
})
