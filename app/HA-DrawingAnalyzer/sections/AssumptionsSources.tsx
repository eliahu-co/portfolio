// app/HA-DrawingAnalyzer/sections/AssumptionsSources.tsx
// Section 10 — Assumptions & sources.

import Section from './Section'

const ASSUMPTIONS = [
  'TODO: Assumption the strategy depends on.',
  'TODO: Assumption about user behavior or market.',
  'TODO: Assumption about technical feasibility.',
]

type Source = { label: string; href?: string }
const SOURCES: Source[] = [
  { label: 'TODO: Source / reference', href: undefined },
  { label: 'TODO: Source / reference', href: undefined },
]

export default function AssumptionsSources() {
  return (
    <Section id="assumptions" eyebrow="Assumptions & sources" title="What this rests on">
      <div className="grid md:grid-cols-2 gap-x-10 gap-y-8 max-w-3xl">
        <div>
          <p className="font-sans text-[9px] uppercase tracking-[0.14em] text-charcoal/70 mb-2">
            Assumptions
          </p>
          <ul className="flex flex-col gap-1.5">
            {ASSUMPTIONS.map((a, i) => (
              <li key={i} className="font-sans text-[14px] leading-relaxed text-charcoal flex gap-2">
                <span className="text-autodesk-blue mt-1 shrink-0">—</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-sans text-[9px] uppercase tracking-[0.14em] text-charcoal/70 mb-2">
            Sources
          </p>
          <ul className="flex flex-col gap-1.5">
            {SOURCES.map((s, i) => (
              <li key={i} className="font-sans text-[14px] leading-relaxed text-charcoal flex gap-2">
                <span className="text-autodesk-blue mt-1 shrink-0">—</span>
                {s.href ? (
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-autodesk-blue underline-offset-4 hover:underline"
                  >
                    {s.label}
                  </a>
                ) : (
                  <span>{s.label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
