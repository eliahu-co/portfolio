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
type MetricRole = 'Primary' | 'Economy' | 'Adoption' | 'Guardrail'

const METRICS: { metric: string; role: MetricRole; target: string }[] = [
  { metric: 'ARPDAU', role: 'Primary', target: '+5% or more during the event' },
  { metric: 'Chest Coin Spend per DAU', role: 'Economy', target: '+10% or more' },
  { metric: 'Total Coin Consumption per DAU', role: 'Economy', target: '+5% or more, confirming incremental Coin demand' },
  { metric: 'Bounty Activation Rate', role: 'Adoption', target: '20% or more of eligible daily active players select a target and open at least one Coin-purchased Chest' },
  { metric: 'Post-Event Revenue per Player', role: 'Guardrail', target: 'Stable or higher: at least 98% of control during the following seven days' },
  { metric: 'Post-Event Chest Coin Spend per Player', role: 'Guardrail', target: 'Stable or higher: at least 95% of control during the following seven days' },
  { metric: 'Card Collections Completed per Player', role: 'Guardrail', target: 'No more than 15% above control across the event and following seven days' },
  { metric: 'Village Upgrades per Player', role: 'Guardrail', target: 'Stable or higher: at least 95% of control across the event and following seven days' },
]

const ROLE_CLASSES: Record<MetricRole, string> = {
  Primary: 'border-cm-wood/50 bg-cm-gold/15 text-cm-wood',
  Economy: 'border-cm-violet-deep/30 bg-cm-violet-deep/10 text-cm-violet-deep',
  Adoption: 'border-cm-violet-deep/30 bg-cm-violet-deep/10 text-cm-violet-deep',
  Guardrail: 'border-cm-crimson/30 bg-cm-crimson/10 text-cm-crimson',
}
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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-cm-wood">
                <th className="w-[30%] py-2 pr-4 font-sans text-[9px] uppercase tracking-[0.12em] text-charcoal/70">Metric</th>
                <th className="w-[16%] px-3 py-2 font-sans text-[9px] uppercase tracking-[0.12em] text-charcoal/70"><span className="sr-only">Role</span></th>
                <th className="py-2 pl-3 font-sans text-[9px] uppercase tracking-[0.12em] text-charcoal/70">Proposed target</th>
              </tr>
            </thead>
            <tbody>
              {METRICS.map(({ metric, role, target }) => (
                <tr key={metric} className="border-b border-charcoal/15">
                  <td className="py-3 pr-4 align-top font-sans text-[13px] font-medium leading-relaxed text-cm-violet-deep">{metric}</td>
                  <td className="px-3 py-3 align-top">
                    <span className={`inline-flex w-20 justify-center rounded-full border px-2 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.08em] ${ROLE_CLASSES[role]}`}>{role}</span>
                  </td>
                  <td className="py-3 pl-3 align-top font-sans text-[13px] leading-relaxed text-charcoal">{target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  )
}
