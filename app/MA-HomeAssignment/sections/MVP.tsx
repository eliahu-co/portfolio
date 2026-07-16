// app/MA-HomeAssignment/sections/MVP.tsx
// Section 7 — Card Bounty, Expanded: player flow, scope, and success metrics.

import { type ReactNode } from 'react'
import { SCOPE_IN, SCOPE_OUT } from '../content/mvp'
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

function List({
  title,
  items,
  marker,
  markerClass,
  textClass = 'text-charcoal',
}: {
  title: string
  items: readonly string[]
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
        The MVP includes only the target-selection, Chest-progress and guarantee mechanics required to
        validate Card Bounty.
      </p>
      <div className="grid gap-y-8 mb-10 max-w-3xl">
        <List title="In scope" items={SCOPE_IN} marker="✓" markerClass="text-cm-gold" />
        <List title="Out of scope" items={SCOPE_OUT} marker="✕" markerClass="text-charcoal/40" textClass="text-charcoal/60" />
      </div>

      <div id="prototype" className="mb-10 max-w-2xl scroll-mt-6">
        <SubHeading>Interactive prototype</SubHeading>
        <PrototypePreview />
      </div>

    </Section>
  )
}
