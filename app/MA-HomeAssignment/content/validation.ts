export type MetricRole = 'Monetization' | 'Economy' | 'Feature funnel'

export type TooltipKey =
  | 'test-methodology'
  | 'feature-funnel'
  | 'arppu-payer-tier'
  | 'chest-coin-spend'
  | 'total-coin-consumption'
  | 'target-selection-rate'
  | 'first-chest-conversion'
  | 'collections-completed'
  | 'village-upgrades'
  | 'post-event-chest-spend'
  | 'post-event-revenue'

type ValidationMetric = {
  readonly metric: string
  readonly target: string
  readonly mutedTarget?: string
  readonly role?: MetricRole
  readonly metricHelp?: TooltipKey
}

export type MetricGroup = {
  readonly title: 'Primary metric' | 'Supporting metrics' | 'Guardrails'
  readonly metrics: readonly ValidationMetric[]
  readonly emphasis?: 'north-star'
}

export type Experiment = {
  readonly title: string
  readonly setup: string
  readonly outcome: string
}

export const PROTOCOL = [
  {
    label: 'Population',
    body: 'Players with the Cards Center unlocked and at least one eligible missing Card.',
  },
  {
    label: 'Control',
    body: 'Existing Cards Center.',
  },
  {
    label: 'Treatment',
    body: 'Existing Cards Center with Card Bounty as a time-limited LiveOps event.',
  },
  {
    label: 'Hypothesis',
    body: 'A visible meter that advances with each Chest purchased and guarantees a chosen missing Card will increase Coin consumption, driving demand for existing Spin and Coin offers and lifting ARPDAU.',
  },
] as const

export const METRIC_GROUPS: readonly MetricGroup[] = [
  {
    title: 'Primary metric',
    emphasis: 'north-star',
    metrics: [{ metric: 'ARPDAU', target: 'lift', mutedTarget: '≥5%' }],
  },
  {
    title: 'Supporting metrics',
    metrics: [
      {
        metric: 'ARPPU by payer tier',
        role: 'Monetization',
        target: 'lift',
        mutedTarget: '≥5% overall and ≥8% at high-spender cohort',
        metricHelp: 'arppu-payer-tier',
      },
      { metric: 'Coin spend on Chests per DAU', role: 'Economy', target: 'lift', mutedTarget: '≥10%', metricHelp: 'chest-coin-spend' },
      { metric: 'Total Coin Consumption per DAU', role: 'Economy', target: 'lift', mutedTarget: '≥5%', metricHelp: 'total-coin-consumption' },
      {
        metric: 'Target Selection Rate',
        role: 'Feature funnel',
        target: 'adoption',
        mutedTarget: '≥30% of eligible DAU',
        metricHelp: 'target-selection-rate',
      },
      {
        metric: 'First-Chest Conversion',
        role: 'Feature funnel',
        target: 'activation',
        mutedTarget: '≥65% of players who adopted',
        metricHelp: 'first-chest-conversion',
      },
      {
        metric: 'Bounty Completion Rate',
        role: 'Feature funnel',
        target: 'balanced completion',
        mutedTarget: '10–20% of players who activated',
        metricHelp: 'feature-funnel',
      },
    ],
  },
  {
    title: 'Guardrails',
    metrics: [
      { metric: 'Card Collections Completed per Player', target: 'stable or small lift', mutedTarget: '≤115%', metricHelp: 'collections-completed' },
      { metric: 'Village Upgrades per Player', target: 'stable', mutedTarget: '≥95%', metricHelp: 'village-upgrades' },
      { metric: 'Post-Event Coin Spend on Chests per Player', target: 'stable', mutedTarget: '≥95%', metricHelp: 'post-event-chest-spend' },
      { metric: 'Post-Event Revenue per Player', target: 'stable', mutedTarget: '≥98%', metricHelp: 'post-event-revenue' },
    ],
  },
] as const

export const TOOLTIP_NOTES = {
  'test-methodology': 'Event duration, post-event measurement window and target numbers (currently directional) would be calibrated using internal data and comparable LiveOps events.',
  'feature-funnel': 'Catches a guarantee that fires too rarely to matter, or often enough to cheapen it.',
  'arppu-payer-tier': 'Shows whether revenue lift comes from deeper payer spend and which tiers drive it.',
  'chest-coin-spend': 'Shows whether the target and meter convert into actual Chest purchases.',
  'total-coin-consumption': 'Separates a real increase in Coin sink from spend shifted off other sinks.',
  'target-selection-rate': 'Shows whether players opt into the event at all, before any spend question.',
  'first-chest-conversion': 'Locates the drop between picking a target and buying the first Chest.',
  'collections-completed': 'Detects excessive acceleration of Collection completion and reward release.',
  'village-upgrades': 'Detects whether additional Chest spending cannibalizes core Village progression.',
  'post-event-chest-spend': 'Detects whether the event shifts Chest spend rather than lifting it.',
  'post-event-revenue': 'Confirms that event revenue is not offset by lower revenue afterward.',
} as const satisfies Readonly<Record<TooltipKey, string>>

export const TOOLTIP_LABELS = {
  'test-methodology': 'About A/B Test methodology',
  'feature-funnel': 'About Feature funnel',
  'arppu-payer-tier': 'About ARPPU by payer tier',
  'chest-coin-spend': 'About Coin spend on Chests per DAU',
  'total-coin-consumption': 'About Total Coin Consumption per DAU',
  'target-selection-rate': 'About Target Selection Rate',
  'first-chest-conversion': 'About First-Chest Conversion',
  'collections-completed': 'About Card Collections Completed per Player',
  'village-upgrades': 'About Village Upgrades per Player',
  'post-event-chest-spend': 'About Post-Event Coin Spend on Chests per Player',
  'post-event-revenue': 'About Post-Event Revenue per Player',
} as const satisfies Readonly<Record<TooltipKey, string>>

export const ADDITIONAL_TESTS = [
  {
    title: 'Meter Goal Calibration',
    setup: 'Compare the baseline meter requirement with a lower requirement.',
    outcome: 'Tests whether a more attainable goal increases Chest spend without accelerating Collection completion too far.',
  },
  {
    title: 'Paid Progress Carryover',
    setup: 'Players who obtain their target before filling the meter can select another target. Control resets the meter; treatment also allows players to spend Gems to carry existing progress to the new target.',
    outcome: 'Tests whether preserving earned progress creates incremental Gem spend without reducing continued participation or accelerating Collection completion too far.',
  },
  {
    title: 'Chest Tier Weighting',
    setup: 'Keep all Chest contributions unchanged except the Magical Chest contribution.',
    outcome: 'Tests whether greater progress from the highest-value Chest shifts Coin spend toward it.',
  },
] as const satisfies readonly Experiment[]
