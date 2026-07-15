// app/MA-HomeAssignment/sections/AssumptionsSources.tsx
// Section 10 — Assumptions & sources.

import Section from './Section'

const ASSUMPTIONS = [
  'ARPDAU lift is the target outcome; engagement and consumption signals matter only if they convert to revenue.',
  'ARPDAU lift should not come at the expense of long-term demand, core-loop health, player trust or the wider game economy.',
  'New features should extend familiar mechanics rather than replace the core-loop.',
  'Existing systems support LiveOps, segmentation and controlled testing.',
  'I had no access to internal data, so scores, balance values and numeric targets are directional, and this analysis reflects the game version I accessed.',
]

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
