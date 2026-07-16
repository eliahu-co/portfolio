'use client'

import { useCallback, useState } from 'react'
import {
  METRIC_GROUPS,
  TOOLTIP_NOTES,
  type MetricRole,
  type TooltipKey,
} from '../../content/validation'
import styles from '../PresentationStage.module.css'
import { PrintDetails, RevealControl } from '../primitives'
import { useDeckReset, type DeckSlideKey } from '../useDeckReset'

export type MetricMatrixProps = {
  readonly slideKey: DeckSlideKey
}

type MetricName = (typeof METRIC_GROUPS)[number]['metrics'][number]['metric']
type MetricGroupName = (typeof METRIC_GROUPS)[number]['title']

type CanonicalMetric = {
  readonly metric: MetricName
  readonly target: string
  readonly mutedTarget?: string
  readonly role?: MetricRole
  readonly metricHelp?: TooltipKey
}

type MetricDetail = {
  readonly definition: string
  readonly denominator: string
  readonly rationale: string
}

type MetricStory = CanonicalMetric & MetricDetail & {
  readonly group: MetricGroupName
  readonly classification: 'Primary' | MetricRole | 'Guardrail'
}

type MetricInteraction = {
  readonly hovered: MetricName | null
  readonly focused: MetricName | null
}

const IDLE: MetricInteraction = {
  hovered: null,
  focused: null,
}

const SUPPORTING_ROLES: readonly MetricRole[] = [
  'Monetization',
  'Economy',
  'Feature funnel',
]

const ROLE_TONES: Record<MetricRole, string> = {
  Monetization: 'border-cm-gold/55 bg-cm-gold/10',
  Economy: 'border-[#1E7BA8]/40 bg-[#1E7BA8]/10',
  'Feature funnel': 'border-cm-violet-deep/25 bg-cm-violet-deep/5',
}

const METRIC_DETAILS = {
  ARPDAU: {
    definition: 'Average revenue generated per daily active user during the event.',
    denominator: 'Event-period revenue ÷ all daily active users.',
    rationale: 'Directly tests whether the feature lifts the assignment’s revenue outcome.',
  },
  'ARPPU by payer tier': {
    definition: 'Average revenue per paying user, segmented by payer tier.',
    denominator: 'Revenue within each payer tier ÷ paying users in that tier.',
    rationale: 'Explains whether payer depth contributes to the ARPDAU result.',
  },
  'Coin spend on Chests per DAU': {
    definition: 'Average Coins spent on Chests by daily active users.',
    denominator: 'Coins spent on Chests ÷ all daily active users.',
    rationale: 'Tests the intended increase in demand for Chest purchases.',
  },
  'Total Coin Consumption per DAU': {
    definition: 'Average Coins consumed across all sinks by daily active users.',
    denominator: 'Total Coins consumed ÷ all daily active users.',
    rationale: 'Distinguishes incremental Coin demand from a shift between existing sinks.',
  },
  'Target Selection Rate': {
    definition: 'Share of eligible daily active users who choose a missing Card target.',
    denominator: 'Players who select a target ÷ eligible daily active users.',
    rationale: 'Measures whether the eligible audience adopts the feature proposition.',
  },
  'First-Chest Conversion': {
    definition: 'Share of adopters who purchase at least one Chest after selecting a target.',
    denominator: 'Adopters opening a first Chest ÷ players who selected a target.',
    rationale: 'Measures whether target selection converts into the intended action.',
  },
  'Bounty Completion Rate': {
    definition: 'Share of activated players who fill the meter and receive the target Card.',
    denominator: 'Players completing a bounty ÷ players who activated.',
    rationale: 'Checks whether the guarantee is attainable without becoming automatic.',
  },
  'Card Collections Completed per Player': {
    definition: 'Average Card Collections completed by each eligible player.',
    denominator: 'Completed Card Collections ÷ eligible players.',
    rationale: 'Protects the pace of Collection completion and reward release.',
  },
  'Village Upgrades per Player': {
    definition: 'Average Village upgrades completed by each eligible player.',
    denominator: 'Completed Village upgrades ÷ eligible players.',
    rationale: 'Protects the core Village progression loop from Coin cannibalization.',
  },
  'Post-Event Coin Spend on Chests per Player': {
    definition: 'Average Coins spent on Chests after the event by each eligible player.',
    denominator: 'Post-event Coins spent on Chests ÷ eligible players.',
    rationale: 'Checks that event demand is incremental rather than borrowed from later spend.',
  },
  'Post-Event Revenue per Player': {
    definition: 'Average revenue after the event for each eligible player.',
    denominator: 'Post-event revenue ÷ eligible players.',
    rationale: 'Checks that event revenue is not offset by lower revenue afterward.',
  },
} as const satisfies Readonly<Record<MetricName, MetricDetail>>

function classificationFor(group: MetricGroupName, metric: CanonicalMetric): MetricStory['classification'] {
  if (group === 'Primary metric') return 'Primary'
  if (group === 'Guardrails') return 'Guardrail'
  return metric.role!
}

function targetFor(metric: CanonicalMetric): string {
  return [metric.target, metric.mutedTarget].filter(Boolean).join(' ')
}

const METRIC_STORIES: readonly MetricStory[] = METRIC_GROUPS.flatMap((group) => (
  group.metrics.map((sourceMetric) => {
    const metric = sourceMetric as CanonicalMetric
    const detail = METRIC_DETAILS[metric.metric as keyof typeof METRIC_DETAILS]
    const help = metric.metricHelp ? TOOLTIP_NOTES[metric.metricHelp] : null

    return {
      ...metric,
      ...detail,
      group: group.title,
      classification: classificationFor(group.title, metric),
      rationale: help ? `${detail.rationale} ${help}` : detail.rationale,
    }
  })
))

type MetricCardProps = {
  readonly story: MetricStory
  readonly active: boolean
  readonly dominant?: boolean
  readonly onHover: (metric: MetricName) => void
  readonly onHoverEnd: (metric: MetricName) => void
  readonly onFocus: (metric: MetricName) => void
  readonly onBlur: (metric: MetricName) => void
}

function MetricCard({
  story,
  active,
  dominant = false,
  onHover,
  onHoverEnd,
  onFocus,
  onBlur,
}: MetricCardProps) {
  return (
    <RevealControl
      summary={(
        <span className={dominant
          ? 'grid w-full grid-cols-[1fr_auto] items-center gap-4'
          : 'grid w-full grid-cols-[minmax(0,1fr)_minmax(118px,0.9fr)] items-center gap-2'}>
          <span className="block text-left font-bold leading-tight text-cm-violet-deep">
            {story.metric}
          </span>
          <span
            data-metric-target="true"
            className={dominant
              ? 'block text-right font-serif text-[24px] font-black leading-none text-cm-crimson'
              : 'block text-right font-sans text-[14px] font-bold leading-tight text-charcoal'}
          >
            {story.target}{story.mutedTarget ? ` ${story.mutedTarget}` : ''}
          </span>
        </span>
      )}
      active={active}
      aria-controls="metric-detail"
      data-metric-card="true"
      data-metric-name={story.metric}
      data-metric-classification={story.classification}
      data-dominant={dominant ? 'true' : undefined}
      data-active={active ? 'true' : 'false'}
      className={[
        'w-full justify-start text-left',
        dominant
          ? 'min-h-[52px] border-cm-gold/65 bg-cm-gold/15 !px-4 !py-2 text-[20px] shadow-[0_8px_20px_rgba(42,27,84,0.08)]'
          : 'min-h-11 !rounded-xl !px-2.5 !py-1.5 text-[14px]',
        active ? 'border-[#1E7BA8] bg-[#1E7BA8]/15' : '',
      ].join(' ')}
      onMouseEnter={() => onHover(story.metric)}
      onMouseLeave={() => onHoverEnd(story.metric)}
      onFocus={() => onFocus(story.metric)}
      onBlur={() => onBlur(story.metric)}
    />
  )
}

function DetailField({
  field,
  label,
  children,
}: {
  readonly field: 'definition' | 'denominator' | 'target' | 'classification'
  readonly label: string
  readonly children: string
}) {
  return (
    <div data-metric-detail-field={field}>
      <p className="font-sans text-[10px] font-extrabold uppercase tracking-[0.1em] text-cm-crimson">
        {label}
      </p>
      <p className="font-sans text-[14px] leading-tight text-[#1A1A1A]">{children}</p>
    </div>
  )
}

export function MetricMatrix({ slideKey }: MetricMatrixProps) {
  const [interaction, setInteraction] = useState<MetricInteraction>(IDLE)
  const reset = useCallback(() => setInteraction(IDLE), [])
  const activeName = interaction.focused ?? interaction.hovered
  const activeStory = activeName === null
    ? null
    : METRIC_STORIES.find(({ metric }) => metric === activeName) ?? null
  const primary = METRIC_STORIES.filter(({ group }) => group === 'Primary metric')
  const supporting = METRIC_STORIES.filter(({ group }) => group === 'Supporting metrics')
  const guardrails = METRIC_STORIES.filter(({ group }) => group === 'Guardrails')

  useDeckReset(reset, slideKey)

  const cardProps = (story: MetricStory) => ({
    story,
    active: activeName === story.metric,
    onHover: (metric: MetricName) => setInteraction((current) => ({
      ...current,
      hovered: metric,
    })),
    onHoverEnd: (metric: MetricName) => setInteraction((current) => ({
      ...current,
      hovered: current.hovered === metric ? null : current.hovered,
    })),
    onFocus: (metric: MetricName) => setInteraction((current) => ({
      ...current,
      focused: metric,
    })),
    onBlur: (metric: MetricName) => setInteraction((current) => ({
      ...current,
      focused: current.focused === metric ? null : current.focused,
    })),
  })

  return (
    <section aria-label="Card Bounty success metrics">
      <div
        data-metric-screen-board="true"
        data-compact-layout="true"
        className={styles.metricScreenBoard}
      >
        <section data-metric-group="Primary metric" aria-labelledby="primary-metric-heading">
          <h3
            id="primary-metric-heading"
            className="sr-only"
          >
            Primary metric
          </h3>
          <MetricCard {...cardProps(primary[0])} dominant />
        </section>

        <section
          data-metric-group="Supporting metrics"
          aria-labelledby="supporting-metrics-heading"
          className="mt-1"
        >
          <h3
            id="supporting-metrics-heading"
            className="mb-0.5 font-sans text-[11px] font-extrabold uppercase tracking-[0.11em] text-cm-violet-deep"
          >
            Supporting signals
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {SUPPORTING_ROLES.map((role) => (
              <section
                key={role}
                data-supporting-role={role}
                aria-labelledby={`supporting-${role.toLowerCase().replace(' ', '-')}`}
                className={`rounded-xl border p-1.5 ${ROLE_TONES[role]}`}
              >
                <h4
                  id={`supporting-${role.toLowerCase().replace(' ', '-')}`}
                  className="mb-0.5 font-sans text-[10px] font-extrabold uppercase tracking-[0.1em] text-cm-violet-deep"
                >
                  {role}
                </h4>
                <div className="grid gap-0.5">
                  {supporting.filter((story) => story.role === role).map((story) => (
                    <MetricCard key={story.metric} {...cardProps(story)} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        <section
          data-metric-group="Guardrails"
          data-long-term-guardrails="true"
          aria-labelledby="guardrails-heading"
          className="mt-1"
        >
          <h3
            id="guardrails-heading"
            className="mb-0.5 font-sans text-[11px] font-extrabold uppercase tracking-[0.11em] text-cm-crimson"
          >
            Long-term guardrails
          </h3>
          <div className="grid grid-cols-4 gap-1.5 rounded-xl border border-cm-crimson/30 bg-cm-crimson/5 p-1.5">
            {guardrails.map((story) => (
              <MetricCard key={story.metric} {...cardProps(story)} />
            ))}
          </div>
        </section>

        <div
          id="metric-detail"
          data-metric-detail-rail="true"
          className="mt-1 h-[96px] overflow-hidden rounded-2xl border-2 border-[#1E7BA8]/35 bg-[#1E7BA8]/10 px-3 py-2"
          aria-live="polite"
        >
          {activeStory ? (
            <div role="status" aria-label="Metric detail">
              <p className="font-serif text-[14px] font-black leading-none text-cm-violet-deep">
                {activeStory.metric}
              </p>
              <div className="mt-1 grid grid-cols-[0.95fr_0.9fr_0.65fr_1.5fr] gap-3">
                <DetailField field="definition" label="Definition">
                  {activeStory.definition}
                </DetailField>
                <DetailField field="denominator" label="Denominator">
                  {activeStory.denominator}
                </DetailField>
                <DetailField field="target" label="Target">
                  {targetFor(activeStory)}
                </DetailField>
                <DetailField field="classification" label="Why this role">
                  {`${activeStory.classification}: ${activeStory.rationale}`}
                </DetailField>
              </div>
            </div>
          ) : (
            <div>
              <p className="font-sans text-[14px] leading-snug text-charcoal">
                Hover or focus a metric to inspect its definition, denominator, target, and decision role.
              </p>
              <p
                data-methodology-note="true"
                className="mt-1 font-sans text-[14px] leading-tight text-charcoal"
              >
                {TOOLTIP_NOTES['test-methodology']}
              </p>
            </div>
          )}
        </div>
      </div>

      <PrintDetails
        data-metric-print-summary="true"
        className={styles.metricPrintSummary}
      >
        <p className="col-span-4 rounded-lg border border-cm-gold/45 bg-cm-gold/10 p-2 text-[9px] leading-tight text-charcoal">
          {TOOLTIP_NOTES['test-methodology']}
        </p>
        {METRIC_STORIES.map((story) => (
          <article
            key={story.metric}
            data-metric-print-item="true"
            className="rounded-lg border border-cm-wood/25 bg-white/70 p-2 text-[8px] leading-tight text-[#1A1A1A]"
          >
            <h3 className="font-serif text-[11px] font-black text-cm-violet-deep">
              {story.metric}
            </h3>
            <p className="mt-1"><strong>Definition:</strong> {story.definition}</p>
            <p className="mt-1"><strong>Denominator:</strong> {story.denominator}</p>
            <p className="mt-1"><strong>Target:</strong> {targetFor(story)}</p>
            <p className="mt-1"><strong>Why this role:</strong> {story.classification}: {story.rationale}</p>
          </article>
        ))}
      </PrintDetails>
    </section>
  )
}
