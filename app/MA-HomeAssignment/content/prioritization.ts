export type Criterion = {
  readonly title: string
  readonly body: string
  readonly rubric: readonly (readonly [score: '5' | '3' | '1', description: string])[]
}

export type ScoreRow = {
  readonly useCase: string
  readonly scores: readonly [number, number, number, number]
  readonly total: number
  readonly winner?: boolean
}

export const CRITERIA_DEFS: readonly Criterion[] = [
  {
    title: 'ARPDAU Impact',
    body: 'Potential to increase average daily revenue per active user if successful.',
    rubric: [
      ['5', 'Multiple direct monetization levers with significant upside.'],
      ['3', 'Meaningful but bounded or indirect revenue impact.'],
      ['1', 'Weak or speculative path to ARPDAU.'],
    ],
  },
  {
    title: 'Core-Loop Fit',
    body: 'Degree to which the feature builds on existing Coin Master mechanics and player behavior.',
    rubric: [
      ['5', 'Directly reinforces the existing core or meta loop.'],
      ['3', 'Connects to existing systems but introduces meaningful new behavior.'],
      ['1', 'Sits largely outside the current loop.'],
    ],
  },
  {
    title: 'Confidence',
    body: 'Strength of the evidence that players will adopt the feature and produce the intended economy and monetization behavior.',
    rubric: [
      ['5', 'Supported by clear player behavior and proven category mechanics.'],
      ['3', 'Credible hypothesis with adoption or economy risk.'],
      ['1', 'Limited evidence and significant uncertainty.'],
    ],
  },
  {
    title: 'Effort',
    body: 'Relative product, design, engineering and balancing effort required to deliver a valuable MVP.',
    rubric: [
      ['5', 'Major new systems, economy work or cross-feature dependencies.'],
      ['3', 'Moderate implementation and balancing effort.'],
      ['1', 'Bounded extension of an existing mechanic.'],
    ],
  },
] as const

export const SCORE_ROWS: readonly ScoreRow[] = [
  { useCase: 'Card Bounty', scores: [5, 5, 4, 3], total: 33.3, winner: true },
  { useCase: 'Hot Trail', scores: [4, 5, 3, 3], total: 20.0 },
  { useCase: 'Hometown', scores: [4, 3, 3, 4], total: 9.0 },
] as const

// Named for the column it produces, which both the report table and the deck
// label "Total".
export const OPPORTUNITY_SCORE_FORMULA =
  'Total = (ARPDAU Impact × Core-Loop Fit × Confidence) ÷ Effort'
