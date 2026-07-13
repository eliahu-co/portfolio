// app/MA-HomeAssignment/sections/MVP.tsx
// Section 7 — MVP: scope and success metrics.

import Section from './Section'
import { Pill } from './UseCase'

const SCOPE_IN = [
  'A short, time-limited Card Bounty event within the Cards Center.',
  'Selection of any eligible missing Card from an unlocked Card Collection.',
  'The target becomes locked after the first qualifying Chest is opened.',
  'Coin-purchased Wooden, Golden and Magical Chests advance the meter by +1, +2 and +3, respectively.',
  'Every qualifying Chest increases the target Card’s drop chance while retaining its normal contents.',
  'The selected Card is guaranteed when the meter is completed if it has not dropped earlier.',
  'If the target drops naturally, the Bounty completes immediately.',
  'If the target is obtained from another source, the player can select another eligible missing Card without losing progress.',
  'One completed Bounty per player during the event.',
  'Existing Card Collection rewards remain unchanged.',
]
const SCOPE_OUT = [
  'Gold, Diamond and Seasonal Cards.',
  'Chests received from events, Raids, trades or duplicate-Card exchanges contributing to the meter.',
  'Changing the target after progress begins, unless the target is obtained elsewhere.',
  'Multiple concurrent Bounties or another target after completion.',
  'Purchasing meter progress or the guaranteed Card directly.',
  'New Chest types, prices or contents.',
  'Event-specific purchase bundles.',
  'Personalized meter thresholds.',
  'Team contributions, Card trading or other social mechanics.',
  'Additional gameplay.',
]
const METRICS: { kind: string; title: string; body: string; signal?: string }[] = [
  {
    kind: 'Primary outcome',
    title: 'Incremental ARPDAU',
    body: 'Average daily revenue per eligible active user in the treatment group compared with the control group.',
    signal: 'Positive and statistically significant lift versus the control group.',
  },
  {
    kind: 'Economy',
    title: 'Incremental Chest Coin Spend per Eligible DAU',
    body: 'Average daily Coins spent on Chests by players eligible for Card Bounty, compared with the control group.',
    signal: 'Higher than the control group.',
  },
  {
    kind: 'Economy',
    title: 'Total Coin Consumption per Eligible DAU',
    body: 'Average daily Coins spent across Chests and Village construction.',
    signal: 'Higher than the control group.',
  },
  {
    kind: 'Adoption',
    title: 'Bounty Activation Rate',
    body: 'Percentage of eligible active players who open at least one Chest through Card Bounty after selecting a target.',
    signal: 'Meets the activation target established from comparable Chest events.',
  },
  {
    kind: 'Guardrail',
    title: 'Post-Event Revenue',
    body: 'Revenue per eligible user during a defined period after the event.',
    signal: 'Stable in comparison to the control group.',
  },
  {
    kind: 'Guardrail',
    title: 'Post-Event Chest Demand',
    body: 'Chest purchase frequency and Coin spend on Chests during a defined time after the event.',
    signal: 'Stable or higher than the control group.',
  },
  {
    kind: 'Guardrail',
    title: 'Village Progression Rate',
    body: 'Average daily Village upgrades completed by players eligible for Card Bounty during the event and a defined period after it, compared with the control group.',
    signal: 'Stable across the full measurement period in comparison to the control group.',
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

export default function MVP() {
  return (
    <Section id="mvp" eyebrow="MVP" title="Scope & metrics">
      <p className="font-sans text-[14px] leading-relaxed text-charcoal mb-6 max-w-2xl">
        The MVP tests whether choosing a missing Card and receiving increasing certainty drives
        incremental Coin spend on Chests and ARPDAU without weakening future Chest demand or
        accelerating Card Collection completion beyond economy targets.
      </p>
      <div className="grid md:grid-cols-2 gap-x-10 gap-y-8 mb-10 max-w-3xl">
        <List title="In scope" items={SCOPE_IN} marker="✓" markerClass="text-cm-gold" />
        <List title="Out of scope" items={SCOPE_OUT} marker="✕" markerClass="text-charcoal/40" textClass="text-charcoal/60" />
      </div>

      <div className="mb-10 max-w-3xl">
        <p className="font-sans text-[10px] uppercase tracking-[0.12em] text-charcoal mb-4">Success metrics</p>
        <div className="flex flex-col gap-5">
          {METRICS.map(({ kind, title, body, signal }) => (
            <div key={title} className="rounded-[10px] border border-cm-gold/40 border-l-4 border-l-cm-gold bg-gradient-to-b from-[#FFFBF2] to-[#FFF3DC] px-3 py-2.5 shadow-[0_2px_6px_rgba(42,27,84,0.08)]">
              <p className="font-serif text-[14px] text-cm-violet-deep mb-0.5 flex items-center gap-3">
                <span className="min-w-0">{title}</span>
                <Pill tone="blue" className="shrink-0">{kind}</Pill>
              </p>
              <p className="font-sans text-[11px] italic leading-relaxed text-charcoal/80 whitespace-pre-line">{body}</p>
              {signal && (
                <p className="mt-2 font-sans text-[9px] uppercase tracking-[0.12em] text-charcoal">
                  <span className="font-bold mr-2">Success signal</span>{signal}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
