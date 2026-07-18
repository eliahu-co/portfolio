import { closingMenuTargets, slideCount, slideRegistry } from '@/app/MA-HomeAssignment/presentation/slideRegistry'
import { createElement } from 'react'
import { render, screen } from '@testing-library/react'

describe('MA presentation registry', () => {
  it('defines the approved 17-slide story with an introduction before each feature', () => {
    expect(slideCount).toBe(17)
    expect(slideRegistry.map(({ id }) => id)).toEqual(
      Array.from({ length: 17 }, (_, index) => `slide-${index + 1}`),
    )
    expect(slideRegistry.map(({ title }) => title)).toEqual([
      'Increasing ARPDAU', 'About', 'Approach',
      'A time-limited counter-Raid that turns a loss into an urgent reason to return and Spin.',
      'Hot Trail',
      'A limited LiveOps event that gives players a visible path to a missing Card.',
      'Card Bounty',
      'A customizable town built from items the player has unlocked across Villages.',
      'Hometown', 'Comparative scoring',
      'Expanded player flow', 'MVP scope', 'Interactive prototype',
      'A/B-test design', 'Success metrics and guardrails', 'Assumptions', 'Thank you',
    ])
  })

  it.each([
    [3, 'Feature 1', 'A time-limited counter-Raid that turns a loss into an urgent reason to return and Spin.'],
    [5, 'Feature 2', 'A limited LiveOps event that gives players a visible path to a missing Card.'],
    [7, 'Feature 3', 'A customizable town built from items the player has unlocked across Villages.'],
  ])('renders feature introduction slide %s with the shared title treatment', (index, eyebrow, statement) => {
    render(createElement(slideRegistry[index].Component, { slideKey: `intro-${index}` }))
    expect(screen.getByText(eyebrow)).toBeVisible()
    expect(screen.getByRole('heading', { name: statement })).toHaveClass('font-serif', 'text-[64px]')
  })

  it('derives the closing navigation from chapter starts', () => {
    expect(closingMenuTargets).toEqual([
      { label: 'Approach', href: '#slide-3' },
      { label: 'Three bets', href: '#slide-4' },
      { label: 'Decision', href: '#slide-10' },
      { label: 'Player flow', href: '#slide-11' },
      { label: 'Validation', href: '#slide-14' },
    ])
  })
})
