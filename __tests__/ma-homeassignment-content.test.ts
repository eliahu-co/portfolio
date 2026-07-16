import { ASSUMPTIONS } from '@/app/MA-HomeAssignment/content/assumptions'
import { SCOPE_IN, SCOPE_OUT } from '@/app/MA-HomeAssignment/content/mvp'
import {
  CRITERIA_DEFS,
  OPPORTUNITY_SCORE_FORMULA,
  SCORE_ROWS,
  type Criterion,
  type ScoreRow,
} from '@/app/MA-HomeAssignment/content/prioritization'
import {
  ADDITIONAL_TESTS,
  METRIC_GROUPS,
  PROTOCOL,
  TOOLTIP_LABELS,
  TOOLTIP_NOTES,
  type Experiment,
  type MetricGroup,
} from '@/app/MA-HomeAssignment/content/validation'
import * as canonicalContent from '@/app/MA-HomeAssignment/content'

describe('MA Home Assignment canonical content', () => {
  it('exports the five assumptions in source-page order', () => {
    expect(ASSUMPTIONS).toEqual([
      'ARPDAU lift is the target outcome; engagement and consumption signals matter only if they convert to revenue.',
      'ARPDAU lift should not come at the expense of long-term demand, core-loop health, player trust or the wider game economy.',
      'New features should extend familiar mechanics rather than replace the core-loop.',
      'Existing systems support LiveOps, segmentation and controlled testing.',
      'I had no access to internal data, so scores, balance values and numeric targets are directional, and this analysis reflects the game version I accessed.',
    ])
  })

  it('exports all prioritization criteria, rubrics, score rows, and the formula', () => {
    const typedCriteria: readonly Criterion[] = CRITERIA_DEFS
    const typedRows: readonly ScoreRow[] = SCORE_ROWS

    expect(typedCriteria).toEqual([
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
    ])
    expect(typedRows).toEqual([
      { useCase: 'Card Bounty', scores: [5, 5, 4, 3], total: 33.3, winner: true },
      { useCase: 'Hot Trail', scores: [4, 5, 3, 3], total: 20 },
      { useCase: 'Hometown', scores: [4, 3, 3, 4], total: 9 },
    ])
    expect(OPPORTUNITY_SCORE_FORMULA).toBe(
      'Opportunity Score = (ARPDAU Impact × Core-Loop Fit × Confidence) ÷ Effort',
    )
  })

  it('exports the complete MVP scope boundary', () => {
    expect(SCOPE_IN).toEqual([
      'Entry point within the Cards Center, with an event countdown.',
      'Target one missing Card at a time.',
      'Meter goal scales with the target Card’s star rating.',
      'Buying Chests advances the meter; higher-value Chests contribute more.',
      'Changing the target resets the meter.',
      'If the target is obtained before the meter is filled, the player can change target.',
      'Reaching the meter goal awards the target, and ends the event for that player.',
      'Uncompleted progress expires when the event ends.',
    ])
    expect(SCOPE_OUT).toEqual([
      'Targeting Gold, Diamond or Seasonal Cards.',
      'Milestone rewards before the target Card.',
      'New Chest types or changes to existing Chest prices, contents or drop rates.',
      'Event-specific purchase bundles.',
      'Gameplay outside the existing Chest-opening flow.',
    ])
  })

  it('exports the experiment protocol, metric targets, and guardrails', () => {
    const typedMetricGroups: readonly MetricGroup[] = METRIC_GROUPS

    expect(PROTOCOL).toEqual([
      {
        label: 'Population',
        body: 'Players with the Cards Center unlocked and at least one eligible missing Card.',
      },
      { label: 'Control', body: 'Existing Cards Center.' },
      {
        label: 'Treatment',
        body: 'Existing Cards Center with Card Bounty as a time-limited LiveOps event.',
      },
      {
        label: 'Hypothesis',
        body: 'A visible meter that advances with each Chest purchased and guarantees a chosen missing Card will increase Coin consumption, driving demand for existing Spin and Coin offers and lifting ARPDAU.',
      },
    ])
    expect(typedMetricGroups).toEqual([
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
          { metric: 'Coin spend on Chests per DAU', role: 'Economy', target: 'lift', mutedTarget: '≥10%' },
          { metric: 'Total Coin Consumption per DAU', role: 'Economy', target: 'lift', mutedTarget: '≥5%' },
          {
            metric: 'Target Selection Rate',
            role: 'Feature funnel',
            target: 'adoption',
            mutedTarget: '≥30% of eligible DAU',
          },
          {
            metric: 'First-Chest Conversion',
            role: 'Feature funnel',
            target: 'activation',
            mutedTarget: '≥65% of players who adopted',
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
          {
            metric: 'Card Collections Completed per Player',
            target: 'stable or small lift',
            mutedTarget: '≤115%',
            metricHelp: 'collections-completed',
          },
          {
            metric: 'Village Upgrades per Player',
            target: 'stable',
            mutedTarget: '≥95%',
            metricHelp: 'village-upgrades',
          },
          {
            metric: 'Post-Event Coin Spend on Chests per Player',
            target: 'stable',
            mutedTarget: '≥95%',
            metricHelp: 'post-event-chest-spend',
          },
          {
            metric: 'Post-Event Revenue per Player',
            target: 'stable',
            mutedTarget: '≥98%',
            metricHelp: 'post-event-revenue',
          },
        ],
      },
    ])
  })

  it('exports metric guidance and all three follow-up experiments', () => {
    const typedExperiments: readonly Experiment[] = ADDITIONAL_TESTS

    expect(TOOLTIP_NOTES).toEqual({
      'test-methodology': 'Event duration, post-event measurement window and target numbers (currently directional) would be calibrated using internal data and comparable LiveOps events.',
      'feature-funnel': 'Ensures the guarantee provides value without becoming too easy.',
      'arppu-payer-tier': 'Shows whether revenue lift comes from deeper payer spend and which tiers drive it.',
      'collections-completed': 'Detects excessive acceleration of Collection completion and reward release.',
      'village-upgrades': 'Detects whether additional Chest spending cannibalizes core Village progression.',
      'post-event-chest-spend': 'Detects whether the event shifts Chest spend rather than lifting it.',
      'post-event-revenue': 'Confirms that event revenue is not offset by lower revenue afterward.',
    })
    expect(TOOLTIP_LABELS).toEqual({
      'test-methodology': 'About A/B Test methodology',
      'feature-funnel': 'About Feature funnel',
      'arppu-payer-tier': 'About ARPPU by payer tier',
      'collections-completed': 'About Card Collections Completed per Player',
      'village-upgrades': 'About Village Upgrades per Player',
      'post-event-chest-spend': 'About Post-Event Coin Spend on Chests per Player',
      'post-event-revenue': 'About Post-Event Revenue per Player',
    })
    expect(typedExperiments).toEqual([
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
    ])
  })

  it('re-exports every canonical value from the content barrel', () => {
    expect(canonicalContent).toMatchObject({
      ASSUMPTIONS,
      CRITERIA_DEFS,
      SCORE_ROWS,
      OPPORTUNITY_SCORE_FORMULA,
      SCOPE_IN,
      SCOPE_OUT,
      PROTOCOL,
      METRIC_GROUPS,
      TOOLTIP_NOTES,
      TOOLTIP_LABELS,
      ADDITIONAL_TESTS,
    })
  })
})
