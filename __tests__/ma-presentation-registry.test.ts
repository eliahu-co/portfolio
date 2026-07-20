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
      'A LiveOp that turns Chest buying into a visible path to a chosen Card',
      'Card Bounty',
      'A customizable town built from unlocked Villages items',
      'Hometown', 'Score',
      'Expanded player flow',
      'Target-selection, Chest-progress, guarantee mechanics',
      'MVP scope', 'Interactive prototype',
      'Validate, calibrate, evolve', 'A/B-test design', 'Success metrics and guardrails', 'Assumptions', 'Thank you',
    ])
  })

  it.each([
    [3, 'Feature 1', 'A counter-Raid that turns a loss into a reason to return and Spin'],
    [5, 'Feature 2', 'A LiveOp that turns Chest buying into a visible path to a chosen Card'],
    [7, 'Feature 3', 'A customizable town built from unlocked Villages items'],
  ])('renders feature introduction slide %s with the shared title treatment', (index, eyebrow, statement) => {
    render(createElement(slideRegistry[index].Component, { slideKey: `intro-${index}` }))
    expect(screen.getByText(eyebrow)).toBeVisible()
    expect(screen.getByRole('heading', { name: statement })).toHaveClass('font-serif', 'text-[64px]')
  })

  it('offers the closing navigation the slides worth returning to', () => {
    expect(closingMenuTargets).toEqual([
      { label: 'About', href: '#slide-2' },
      { label: 'Approach', href: '#slide-3' },
      { label: 'Hot Trail', href: '#slide-5' },
      { label: 'Card Bounty', href: '#slide-7' },
      { label: 'Hometown', href: '#slide-9' },
      { label: 'Score', href: '#slide-10' },
      { label: 'Player flow', href: '#slide-11' },
      { label: 'MVP', href: '#slide-12' },
      { label: 'Scope', href: '#slide-13' },
      { label: 'Prototype', href: '#slide-14' },
      { label: 'Test plan', href: '#slide-15' },
      { label: 'A/B test', href: '#slide-16' },
      { label: 'Metrics', href: '#slide-17' },
      { label: 'Assumptions', href: '#slide-18' },
    ])

    // the cover, the three feature intros and the closing slide stay out of it
    const labels = closingMenuTargets.map(({ label }) => label)
    expect(labels).not.toContain('Cover')
    expect(labels).not.toContain('Feature 1')
    expect(labels).not.toContain('Feature 2')
    expect(labels).not.toContain('Feature 3')
    expect(labels).not.toContain('Thank you')
    expect(closingMenuTargets).toHaveLength(slideCount - 5)
    // labels double as the accessible name for each link, so they must be unique
    expect(new Set(labels).size).toBe(closingMenuTargets.length)
  })
})
