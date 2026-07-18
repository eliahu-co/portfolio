import { closingMenuTargets, slideCount, slideRegistry } from '@/app/MA-HomeAssignment/presentation/slideRegistry'

describe('MA presentation registry', () => {
  it('defines the approved 14-slide story', () => {
    expect(slideCount).toBe(14)
    expect(slideRegistry.map(({ id }) => id)).toEqual(
      Array.from({ length: 14 }, (_, index) => `slide-${index + 1}`),
    )
    expect(slideRegistry.map(({ title }) => title)).toEqual([
      'Increasing ARPDAU', 'About', 'Approach',
      'Hot Trail', 'Card Bounty', 'Hometown', 'Comparative scoring',
      'Expanded player flow', 'MVP scope', 'Interactive prototype',
      'A/B-test design', 'Success metrics and guardrails', 'Assumptions', 'Thank you',
    ])
  })

  it('derives the closing navigation from chapter starts', () => {
    expect(closingMenuTargets).toEqual([
      { label: 'Approach', href: '#slide-3' },
      { label: 'Three bets', href: '#slide-4' },
      { label: 'Decision', href: '#slide-7' },
      { label: 'Player flow', href: '#slide-8' },
      { label: 'Validation', href: '#slide-11' },
    ])
  })
})
