import {
  closingMenuTargets,
  slideCount,
  slideRegistry,
} from '@/app/MA-HomeAssignment/presentation/slideRegistry'

const TITLES = [
  'Increasing ARPDAU',
  'About',
  'Approach',
  'Coin Master economy',
  'Three bets',
  'Hometown thesis',
  'Hometown mechanics',
  'Card Bounty thesis',
  'Card Bounty mechanics',
  'Hot Trail thesis',
  'Hot Trail mechanics',
  'Assumptions',
  'Comparative scoring',
  'Recommendation',
  'Expanded player flow',
  'MVP scope',
  'Interactive prototype',
  'A/B-test design',
  'Success metrics and guardrails',
  'Follow-up experiments',
  'Thank you',
] as const

const SHORT_TITLES = [
  'Cover',
  'About',
  'Approach',
  'Economy',
  'Three bets',
  'Hometown thesis',
  'Hometown mechanics',
  'Bounty thesis',
  'Bounty mechanics',
  'Hot Trail thesis',
  'Hot Trail mechanics',
  'Assumptions',
  'Scoring',
  'Recommendation',
  'Player flow',
  'MVP scope',
  'Prototype',
  'Experiment design',
  'Metrics',
  'Follow-up tests',
  'Thank you',
] as const

describe('MA presentation registry', () => {
  it('is the single ordered source for all 21 unique slides and components', () => {
    expect(slideRegistry).toHaveLength(21)
    expect(slideCount).toBe(slideRegistry.length)
    expect(slideRegistry.map(({ id }) => id)).toEqual(
      Array.from({ length: 21 }, (_, index) => `slide-${index + 1}`),
    )
    expect(new Set(slideRegistry.map(({ id }) => id)).size).toBe(slideRegistry.length)
    expect(slideRegistry.map(({ title }) => title)).toEqual(TITLES)
    expect(slideRegistry.map(({ shortTitle }) => shortTitle)).toEqual(SHORT_TITLES)
    slideRegistry.forEach(({ chapter, Component }) => {
      expect(chapter.length).toBeGreaterThan(0)
      expect(typeof Component).toBe('function')
    })
  })

  it('derives unique closing-menu labels and jump targets from chapter starts', () => {
    expect(closingMenuTargets).toEqual([
      { label: 'Approach', href: '#slide-3' },
      { label: 'Three bets', href: '#slide-5' },
      { label: 'Decision', href: '#slide-13' },
      { label: 'Player flow', href: '#slide-15' },
      { label: 'Validation', href: '#slide-18' },
    ])
    expect(new Set(closingMenuTargets.map(({ href }) => href)).size)
      .toBe(closingMenuTargets.length)
    closingMenuTargets.forEach(({ href }) => {
      expect(slideRegistry.some(({ id }) => href === `#${id}`)).toBe(true)
    })
  })
})
