// app/MA-HomeAssignment/sections/MVP.tsx
// Section 7 — MVP: scope and success metrics.

import Section from './Section'
import { Pill } from './UseCase'

const SCOPE_IN = [
  'Familiar five-slot Hometown layout.',
  'Items unlocked through completed Villages.',
  'First item placed in each slot for free.',
  'Coin cost for constructing an additional item for the first time.',
  'Time-limited discount on the next Village upgrade.',
  'One standard backdrop and a limited selection of premium backdrops or variants.',
  'Friend visits from existing social surfaces.',
  'Name, avatar, Stars, current Village level and Team in the Hometown header.',
  'One-tap reactions and access to the existing daily Gift action.',
  'Item inspection showing its source or available premium offer.',
]
const SCOPE_OUT = [
  'Hometown levels or a separate progression ladder.',
  'Exact last-seen information or current resource balances.',
  'Public partner ratings or historical event contribution scores.',
  'Coins, Spins or other rewards for receiving reactions.',
  'Comments, direct messaging or Card trading.',
  'Popularity leaderboards or design contests.',
  'Premium social gifts.',
  'Multiple saved layouts.',
  'Attacks, Raids, Coin storage or defensive benefits.',
]
const METRICS: { kind: string; title: string; body: string; signal?: string }[] = [
  {
    kind: 'Business outcome',
    title: 'Incremental ARPDAU',
    body: 'Average daily revenue per eligible active user in the treatment group compared with the control group.',
    signal: 'Positive and sustained lift after the initial novelty period.',
  },
  {
    kind: 'Monetization',
    title: 'Premium Customization Conversion',
    body: 'Percentage of eligible players who purchase a premium backdrop or item variant.',
    signal: 'Positive conversion with repeat purchases across more than one offer cycle.',
  },
  {
    kind: 'Economy',
    title: 'Net Coin Consumption per DAU',
    body: 'Total Coins spent on Hometown construction and Village progression, including the effect of the upgrade discount.',
    signal: 'Higher than the control group, confirming that Hometown creates an incremental sink rather than moving existing spend.',
  },
  {
    kind: 'Usage',
    title: 'Repeat Customization Rate',
    body: 'Percentage of activated players who construct another item or update their layout after the initial setup.',
    signal: 'Positive and sustained after the first free placements.',
  },
  {
    kind: 'Social utility',
    title: 'Social Action Rate',
    body: 'Percentage of Hometown visits that result in a reaction, Gift or item inspection.',
    signal: 'Strong enough to generate repeat visits and correlated with higher customization conversion.',
  },
  {
    kind: 'Guardrail',
    title: 'Village Progression Rate',
    body: 'Village upgrades completed per eligible active user and median time to complete the next Village.',
    signal: 'Stable relative to the control group.',
  },
  {
    kind: 'Guardrail',
    title: 'Existing Revenue per DAU',
    body: 'Revenue from existing offers and systems, excluding Hometown purchases.',
    signal: 'No decline large enough to offset Hometown revenue.',
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
        The MVP tests whether permanent customization with a visible audience creates incremental Coin
        consumption and premium purchases without slowing Village progression.
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
