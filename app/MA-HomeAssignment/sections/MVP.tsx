// app/MA-HomeAssignment/sections/MVP.tsx
// Section 7 — Card Bounty, Expanded: player flow, scope, and success metrics.

import { type ReactNode } from 'react'
import Section from './Section'
import { Pill } from './UseCase'
import PlayerFlow from './PlayerFlow'

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
  'Meter goal scales with Card rarity.',
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
const METRICS: { kind: string; title: string; body: string; signal?: string }[] = [
  {
    kind: 'Primary outcome',
    title: 'Incremental ARPDAU',
    body: 'Average daily revenue per active player during the event.',
    signal: 'Positive lift.',
  },
  {
    kind: 'Economy',
    title: 'Incremental Chest Coin Spend per DAU',
    body: 'Average daily Coins spent on Chests per active player during the event.',
    signal: 'Positive lift.',
  },
  {
    kind: 'Economy',
    title: 'Total Coin Consumption per DAU',
    body: 'Average daily Coins spent across all Coin sinks per active player during the event.',
    signal: 'Positive lift.',
  },
  {
    kind: 'Adoption',
    title: 'Bounty Activation Rate',
    body: 'Percentage of active treatment players who select a target and open at least one Coin-purchased Chest.',
    signal: 'Meets or exceeds the predefined activation target.',
  },
  {
    kind: 'Guardrail',
    title: 'Post-Event Revenue per Player',
    body: 'Average revenue per player during the post-event period.',
    signal: 'Stable or higher.',
  },
  {
    kind: 'Guardrail',
    title: 'Post-Event Chest Coin Spend per Player',
    body: 'Average Coins spent on Chests per player during the post-event period.',
    signal: 'Stable or higher.',
  },
  {
    kind: 'Guardrail',
    title: 'Card Collections Completed per Player',
    body: 'Average number of Card Collections completed per player across the event and post-event period.',
    signal: 'Increase remains within the predefined tolerance range.',
  },
  {
    kind: 'Guardrail',
    title: 'Village Upgrades per Player',
    body: 'Average number of Village upgrades completed per player across the event and post-event period.',
    signal: 'Stable or higher.',
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

      <div className="mb-10 max-w-3xl">
        <SubHeading>Success metrics</SubHeading>
        <p className="font-sans text-[14px] leading-relaxed text-charcoal mb-5 max-w-2xl">
          Eligible players have access to the Cards Center and at least one targetable missing Card at
          event launch. Event metrics use eligible players active on each day; post-event guardrails
          use the full eligible group, including players who do not return. Unless stated otherwise,
          results compare treatment with control. Targets and tolerance ranges are defined in advance.
        </p>
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
