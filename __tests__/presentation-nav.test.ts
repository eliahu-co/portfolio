import { TOTAL_SLIDES, clampIndex, step, hashForIndex, indexFromHash } from '@/app/HA-DrawingAnalyzer/presentation/nav'

describe('presentation nav', () => {
  it('has 17 slides', () => {
    expect(TOTAL_SLIDES).toBe(17)
  })

  it('clamps below and above range', () => {
    expect(clampIndex(-3)).toBe(0)
    expect(clampIndex(99)).toBe(TOTAL_SLIDES - 1)
    expect(clampIndex(5)).toBe(5)
  })

  it('steps forward and backward, clamped at ends', () => {
    expect(step(0, 1)).toBe(1)
    expect(step(0, -1)).toBe(0)
    expect(step(TOTAL_SLIDES - 1, 1)).toBe(TOTAL_SLIDES - 1)
    expect(step(4, -1)).toBe(3)
  })

  it('round-trips index <-> hash (1-based)', () => {
    expect(hashForIndex(0)).toBe('#slide-1')
    expect(hashForIndex(16)).toBe('#slide-17')
    expect(indexFromHash('#slide-1')).toBe(0)
    expect(indexFromHash('slide-17')).toBe(16)
  })

  it('returns null for invalid or out-of-range hashes', () => {
    expect(indexFromHash('')).toBeNull()
    expect(indexFromHash('#about')).toBeNull()
    expect(indexFromHash('#slide-0')).toBeNull()
    expect(indexFromHash('#slide-18')).toBeNull()
    expect(indexFromHash('#slide-99')).toBeNull()
  })
})
