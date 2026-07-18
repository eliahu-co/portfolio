import { closingMenuTargets, slideCount, slideRegistry } from '@/app/MA-HomeAssignment/presentation/slideRegistry'
import { createElement } from 'react'
import { render, screen } from '@testing-library/react'

describe('MA presentation registry', () => {
  it('defines the approved 19-slide story with an introduction before each feature and MVP', () => {
    expect(slideCount).toBe(19)
    expect(slideRegistry.map(({ id }) => id)).toEqual(
      Array.from({ length: 19 }, (_, index) => `slide-${index + 1}`),
    )
    expect(slideRegistry.map(({ title }) => title)).toEqual([
      'Increasing ARPDAU', 'About', 'Approach',
      'A counter-Raid that turns a loss into a reason to return and Spin',
      'Hot Trail',
      'A visible path to a chosen Card through buying Chests',
      'Card Bounty',
      'A customizable town built from unlocked Villages items',
      'Hometown', 'Score',
      'Expanded player flow',
      'Target-selection, Chest-progress, guarantee mechanics',
      'MVP scope', 'Interactive prototype',
      'A/B-test design', 'Success metrics and guardrails', 'What We Test Next', 'Assumptions', 'Thank you',
    ])
  })

  it.each([
    [3, 'Feature 1', 'A counter-Raid that turns a loss into a reason to return and Spin'],
    [5, 'Feature 2', 'A visible path to a chosen Card through buying Chests'],
    [7, 'Feature 3', 'A customizable town built from unlocked Villages items'],
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
      { label: 'Validation', href: '#slide-15' },
    ])
  })
})
