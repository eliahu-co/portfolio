// app/MA-HomeAssignment/sections/AssumptionsSources.tsx
// Section 10 — Assumptions & sources.

import Section from './Section'
import { ASSUMPTIONS } from '../content/assumptions'

export default function AssumptionsSources() {
  return (
    <Section id="assumptions" eyebrow="Assumptions">
      <div className="max-w-2xl">
        <ul className="flex flex-col gap-2.5">
          {ASSUMPTIONS.map((a, i) => (
            <li key={i} className="flex items-start gap-3">
              <span aria-hidden="true" className="inline-flex w-4 shrink-0 justify-center font-sans text-[14px] leading-relaxed text-cm-gold/70">•</span>
              <span data-assumption-text className="font-sans text-[14px] leading-relaxed text-charcoal">
                {a}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
