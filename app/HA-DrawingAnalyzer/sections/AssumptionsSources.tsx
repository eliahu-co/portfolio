// app/HA-DrawingAnalyzer/sections/AssumptionsSources.tsx
// Section 10 — Assumptions & sources.

import Section from './Section'

const ASSUMPTIONS = [
  'TODO: Assumption the strategy depends on.',
  'TODO: Assumption about user behavior or market.',
  'TODO: Assumption about technical feasibility.',
]

export default function AssumptionsSources() {
  return (
    <Section id="assumptions" eyebrow="Assumptions" title="What this rests on">
      <div className="max-w-2xl">
        <ul className="flex flex-col gap-1.5">
          {ASSUMPTIONS.map((a, i) => (
            <li key={i} className="font-sans text-[14px] leading-relaxed text-charcoal flex gap-2">
              <span className="text-autodesk-blue mt-1 shrink-0">—</span>
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
