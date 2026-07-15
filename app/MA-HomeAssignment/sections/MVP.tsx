// app/MA-HomeAssignment/sections/MVP.tsx
// Section 7 — Card Bounty, Expanded: player flow, scope, and success metrics.

import { type ReactNode } from 'react'
import Section from './Section'
import PlayerFlow from './PlayerFlow'
import PrototypePreview from './PrototypePreview'

// Sub-heading styled like a section title (h2 so the .ma-page 800-weight rule
// applies), used for the peer blocks in this section.
function SubHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-serif text-[clamp(22px,3vw,32px)] leading-tight text-cm-violet-deep mb-5">{children}</h2>
  )
}

const SCOPE_IN = [
  'Entry point within the Cards Center, with an event countdown.',
  'Target one missing Card at a time.',
  'Meter goal scales with the target Card’s star rating.',
  'Buying Chests advances the meter; higher-value Chests contribute more.',
  'Changing the target resets the meter.',
  'If the target is obtained before the meter is filled, the player can change target.',
  'Reaching the meter goal awards the target, and ends the event for that player.',
  'Uncompleted progress expires when the event ends.',
]
const SCOPE_OUT = [
  'Targeting Gold, Diamond or Seasonal Cards.',
  'Milestone rewards before the target Card.',
  'New Chest types or changes to existing Chest prices, contents or drop rates.',
  'Event-specific purchase bundles.',
  'Gameplay outside the existing Chest-opening flow.',
]
type Metric = { metric: string; target: string }
type MetricGroup = {
  title: string
  metrics: Metric[]
  emphasis?: 'north-star'
  note?: string
}

const METRIC_GROUPS: MetricGroup[] = [
  {
    title: 'North Star',
    emphasis: 'north-star',
    metrics: [{ metric: 'ARPDAU', target: '≥5% lift' }],
  },
  {
    title: 'Monetization and economy drivers',
    metrics: [
      { metric: 'ARPPU', target: '≥5% lift overall and ≥8% among the high-spender cohort' },
      { metric: 'Coin spend on Chests per DAU', target: '≥10% lift' },
      { metric: 'Total Coin Consumption per DAU', target: '≥5% lift' },
    ],
  },
  {
    title: 'Feature funnel',
    metrics: [
      { metric: 'Target Selection Rate', target: '≥30% of eligible DAU' },
      { metric: 'First-Chest Conversion', target: '≥65% of players who select a target' },
      { metric: 'Bounty Completion Rate', target: '10–20% of activated players' },
    ],
    note: 'The funnel is coherent: 30% × 65% ≈ 20% activation. The completion range ensures the guarantee provides value without becoming too easy.',
  },
  {
    title: 'Guardrails',
    metrics: [
      { metric: 'Post-Event Revenue per Player', target: '≥98%' },
      { metric: 'Post-Event Chest Coin Spend per Player', target: '≥95%' },
      { metric: 'Card Collections Completed per Player', target: '≤115%' },
      { metric: 'Village Upgrades per Player', target: '≥95%' },
    ],
  },
]
function List({
  title,
  items,
  marker,
  markerClass,
  textClass = 'text-charcoal',
}: {
  title: string
  items: string[]
  marker: string
  markerClass: string
  textClass?: string
}) {
  return (
    <div>
      <p className="font-sans text-[10px] uppercase tracking-[0.12em] text-charcoal mb-2">{title}</p>
      <ul className="flex flex-col gap-1.5">
        {items.map((b, i) => (
          <li key={i} className={`font-sans text-[14px] leading-relaxed flex gap-2 ${textClass}`}>
            <span className={`mt-px shrink-0 font-bold ${markerClass}`} aria-hidden="true">{marker}</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SuccessMetricsTable() {
  return (
    <table className="w-full table-fixed border-collapse text-left">
      <thead>
        <tr className="border-b-2 border-cm-wood">
          <th className="w-[44%] py-2 pr-4 font-sans text-[9px] uppercase tracking-[0.12em] text-charcoal/70 sm:w-[42%]">
            Metric
          </th>
          <th className="py-2 pl-3 font-sans text-[9px] uppercase tracking-[0.12em] text-charcoal/70">
            Proposed target
          </th>
        </tr>
      </thead>
      {METRIC_GROUPS.map((group) => {
        const isNorthStar = group.emphasis === 'north-star'
        const tooltipId = group.note ? 'feature-funnel-tooltip' : undefined

        return (
          <tbody
            key={group.title}
            data-metric-group={group.title}
            className={isNorthStar ? 'animate-shimmer border-l-4 border-[#C77F14] motion-reduce:animate-none' : ''}
            style={isNorthStar ? {
              backgroundImage: 'linear-gradient(110deg, #FFC93C 0%, #FFC93C 40%, #FFE99A 50%, #FFC93C 60%, #FFC93C 100%)',
              backgroundSize: '200% 100%',
              borderLeft: '4px solid #C77F14',
            } : undefined}
          >
            <tr>
              <th
                colSpan={2}
                scope="rowgroup"
                className={`text-left ${isNorthStar ? 'px-3 pb-1 pt-3' : 'pb-2 pt-6'}`}
              >
                <h3 className="group relative inline-flex items-center gap-1.5 font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-cm-violet-deep">
                  <span>{group.title}</span>
                  {group.note && tooltipId && (
                    <>
                      <button
                        type="button"
                        aria-label={`About ${group.title}`}
                        aria-describedby={tooltipId}
                        className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border border-cm-wood/60 bg-cm-cream font-sans text-[8px] font-bold normal-case tracking-normal text-cm-wood outline-none transition-colors hover:border-cm-crimson hover:text-cm-crimson focus-visible:ring-2 focus-visible:ring-cm-gold focus-visible:ring-offset-1"
                      >
                        i
                      </button>
                      <span
                        id={tooltipId}
                        role="tooltip"
                        className="pointer-events-none invisible absolute left-0 top-full z-30 mt-2 w-[min(18rem,calc(100vw-2rem))] rounded-lg border border-cm-wood/35 bg-cm-cream p-3 text-left font-sans text-[11px] font-normal normal-case leading-relaxed tracking-normal text-charcoal/80 opacity-0 shadow-[0_10px_24px_rgba(42,27,84,0.18)] transition-[opacity,visibility] duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
                      >
                        {group.note}
                      </span>
                    </>
                  )}
                </h3>
              </th>
            </tr>
            {group.metrics.map(({ metric, target }) => (
              <tr key={metric} data-metric-row className="border-b border-charcoal/15 last:border-b-0">
                <td className={`py-2.5 pr-4 align-top font-sans text-[13px] font-medium leading-relaxed text-cm-violet-deep ${isNorthStar ? 'pl-3' : ''}`}>
                  {metric}
                </td>
                <td className={`py-2.5 pl-3 align-top font-sans text-[13px] leading-relaxed ${isNorthStar ? 'font-medium text-cm-crimson' : 'text-charcoal'}`}>
                  {target}
                </td>
              </tr>
            ))}
          </tbody>
        )
      })}
    </table>
  )
}

export default function MVP() {
  return (
    <Section id="mvp" eyebrow="Expanded feature">
      <SubHeading>Card Bounty</SubHeading>
      <div className="mb-10">
        <PlayerFlow />
      </div>

      <SubHeading>MVP Scope</SubHeading>
      <p className="font-sans text-[14px] leading-relaxed text-charcoal mb-6 max-w-2xl">
        The MVP answers one question: does a visible, guaranteed path to a chosen Card increase Coin
        spend on Chests, and does that lift ARPDAU? It ships as a time limited LiveOps event inside the
        Cards Center. Duration and balancing parameters come from internal player and economy data.
      </p>
      <div className="grid gap-y-8 mb-10 max-w-3xl">
        <List title="In scope" items={SCOPE_IN} marker="✓" markerClass="text-cm-gold" />
        <List title="Out of scope" items={SCOPE_OUT} marker="✕" markerClass="text-charcoal/40" textClass="text-charcoal/60" />
      </div>

      <div id="prototype" className="mb-10 max-w-2xl scroll-mt-6">
        <SubHeading>Interactive prototype</SubHeading>
        <PrototypePreview />
      </div>

      <div className="mb-10 max-w-3xl">
        <SubHeading>Success metrics</SubHeading>
        <p className="font-sans text-[14px] leading-relaxed text-charcoal mb-5 max-w-2xl">
          Eligible players have the Cards Center unlocked and at least one targetable missing Card. Event
          metrics use eligible players active each day; post event guardrails use the full eligible group. All
          results compare treatment with control.
        </p>
        <div>
          <SuccessMetricsTable />
        </div>
      </div>
    </Section>
  )
}
