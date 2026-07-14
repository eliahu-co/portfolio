import { render, screen } from '@testing-library/react'
import { BountyMeter } from '../BountyMeter'

describe('BountyMeter', () => {
  it('exposes the 300-point progress and nine internal milestones', () => {
    render(<BountyMeter label="Bounty progress" progress={30} threshold={300} />)

    const meter = screen.getByRole('progressbar', { name: 'Bounty progress' })
    expect(meter).toHaveAttribute('aria-valuenow', '30')
    expect(meter).toHaveAttribute('aria-valuemax', '300')
    expect(meter).toHaveAttribute('aria-valuetext', '30 of 300 Bounty progress')
    const milestones = screen.getAllByTestId('bounty-milestone')
    expect(milestones).toHaveLength(9)
    expect(milestones.map((milestone) => milestone.style.left)).toEqual([
      '10%',
      '20%',
      '30%',
      '40%',
      '50%',
      '60%',
      '70%',
      '80%',
      '90%',
    ])
  })

  it('clamps the visual fill between zero and one hundred percent', () => {
    const { rerender } = render(
      <BountyMeter label="Bounty progress" progress={450} threshold={300} />,
    )

    expect(screen.getByTestId('bounty-meter-fill')).toHaveStyle({ width: '100%' })
    expect(screen.getByRole('progressbar', { name: 'Bounty progress' })).toHaveAttribute(
      'aria-valuenow',
      '300',
    )
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuetext',
      '300 of 300 Bounty progress',
    )

    rerender(<BountyMeter label="Bounty progress" progress={-30} threshold={300} />)

    expect(screen.getByTestId('bounty-meter-fill')).toHaveStyle({ width: '0%' })
    expect(screen.getByRole('progressbar', { name: 'Bounty progress' })).toHaveAttribute(
      'aria-valuenow',
      '0',
    )
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuetext',
      '0 of 300 Bounty progress',
    )
  })
})
