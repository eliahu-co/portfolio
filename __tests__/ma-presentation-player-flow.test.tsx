import { fireEvent, render, screen, within } from '@testing-library/react'
import Slide15PlayerFlow from '@/app/MA-HomeAssignment/presentation/slides/Slide15PlayerFlow'

describe('MA presentation player flow', () => {
  it('reveals one phase vertically and fades the other phase containers', () => {
    const { container } = render(<Slide15PlayerFlow slideKey="slide-11" />)
    const flow = container.querySelector<HTMLElement>('[data-phase-focus-flow="true"]')!
    const entry = screen.getByRole('button', { name: 'Entry' })
    const target = screen.getByRole('button', { name: 'Target' })
    const progress = screen.getByRole('button', { name: 'Progress' })
    const resolution = screen.getByRole('button', { name: 'Resolution' })

    expect(flow).toBeInTheDocument()
    expect(container.querySelectorAll('[data-phase-control]')).toHaveLength(4)
    expect(container.querySelectorAll('[data-phase-arrow="true"]')).toHaveLength(3)
    expect(entry).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('Event Introduction')).not.toBeInTheDocument()

    fireEvent.mouseEnter(entry)
    expect(entry).toHaveAttribute('aria-expanded', 'true')
    expect(within(flow).getByText('Cards Center')).toBeVisible()
    expect(within(flow).getByText('Event Introduction')).toBeVisible()
    expect(container.querySelectorAll('[data-step-arrow="true"]')).toHaveLength(1)
    expect(entry.closest('[data-phase-column]')).toHaveAttribute('data-faded', 'false')
    ;[target, progress, resolution].forEach((phase) => {
      expect(phase.closest('[data-phase-column]')).toHaveAttribute('data-faded', 'true')
    })

    fireEvent.mouseLeave(flow)
    expect(entry).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('Event Introduction')).not.toBeInTheDocument()
  })

  it('mirrors phase hover behavior for keyboard focus', () => {
    render(<Slide15PlayerFlow slideKey="slide-11" />)
    const resolution = screen.getByRole('button', { name: 'Resolution' })

    fireEvent.focus(resolution)
    expect(resolution).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Bounty Completed')).toBeVisible()
    expect(screen.getByText('Receive Spins')).toBeVisible()

    fireEvent.blur(resolution)
    expect(resolution).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('Bounty Completed')).not.toBeInTheDocument()
  })
})
