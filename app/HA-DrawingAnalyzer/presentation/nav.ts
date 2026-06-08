// app/HA-DrawingAnalyzer/presentation/nav.ts
// Pure navigation helpers for the presentation deck (no React, no DOM).

export const TOTAL_SLIDES = 20

export function clampIndex(i: number, total: number = TOTAL_SLIDES): number {
  if (i < 0) return 0
  if (i > total - 1) return total - 1
  return i
}

export function step(current: number, dir: 1 | -1, total: number = TOTAL_SLIDES): number {
  return clampIndex(current + dir, total)
}

export function hashForIndex(i: number): string {
  return `#slide-${i + 1}`
}

export function indexFromHash(hash: string, total: number = TOTAL_SLIDES): number | null {
  const m = /^#?slide-(\d+)$/.exec(hash)
  if (!m) return null
  const n = parseInt(m[1], 10) - 1
  if (Number.isNaN(n) || n < 0 || n > total - 1) return null
  return n
}
