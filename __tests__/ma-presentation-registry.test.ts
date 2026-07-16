import { closingMenuTargets, slideCount, slideRegistry } from '@/app/MA-HomeAssignment/presentation/slideRegistry'

describe('MA presentation registry', () => {
  it('defines the approved 16-slide story', () => {
    expect(slideCount).toBe(16)
    expect(slideRegistry.map(({ id }) => id)).toEqual(
      Array.from({ length: 16 }, (_, index) => `slide-${index + 1}`),
    )
    expect(slideRegistry.map(({ title }) => title)).toEqual([
      'Increasing ARPDAU', 'About', 'Approach', 'Three bets',
      'Hometown', 'Card Bounty', 'Hot Trail', 'Assumptions', 'Comparative scoring',
      'Recommendation', 'Expanded player flow', 'MVP scope', 'Interactive prototype',
      'A/B-test design', 'Success metrics and guardrails', 'Thank you',
    ])
  })

  it('derives the closing navigation from chapter starts', () => {
    expect(closingMenuTargets).toEqual([
      { label: 'Approach', href: '#slide-3' },
      { label: 'Three bets', href: '#slide-4' },
      { label: 'Decision', href: '#slide-9' },
      { label: 'Player flow', href: '#slide-11' },
      { label: 'Validation', href: '#slide-14' },
    ])
  })
})
