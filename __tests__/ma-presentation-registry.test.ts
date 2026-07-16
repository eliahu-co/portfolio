import { closingMenuTargets, slideCount, slideRegistry } from '@/app/MA-HomeAssignment/presentation/slideRegistry'

describe('MA presentation registry', () => {
  it('defines the approved 17-slide story', () => {
    expect(slideCount).toBe(17)
    expect(slideRegistry.map(({ id }) => id)).toEqual(
      Array.from({ length: 17 }, (_, index) => `slide-${index + 1}`),
    )
    expect(slideRegistry.map(({ title }) => title)).toEqual([
      'Increasing ARPDAU', 'About', 'Approach', 'Core loop and meta', 'Three bets',
      'Hometown', 'Card Bounty', 'Hot Trail', 'Assumptions', 'Comparative scoring',
      'Recommendation', 'Expanded player flow', 'MVP scope', 'Interactive prototype',
      'A/B-test design', 'Success metrics and guardrails', 'Thank you',
    ])
  })

  it('derives the closing navigation from chapter starts', () => {
    expect(closingMenuTargets).toEqual([
      { label: 'Approach', href: '#slide-3' },
      { label: 'Three bets', href: '#slide-5' },
      { label: 'Decision', href: '#slide-10' },
      { label: 'Player flow', href: '#slide-12' },
      { label: 'Validation', href: '#slide-15' },
    ])
  })
})
