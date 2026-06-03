// app/HA-DrawingAnalyzer/sections/MVP.tsx
// Section 7 — MVP: scope, success metrics, and the open variables
// (accuracy / latency / cost) that define feasibility.

import Section from './Section'

const SCOPE_IN = [
  'TODO: In-scope capability for v1.',
  'TODO: In-scope capability for v1.',
]
const SCOPE_OUT = [
  'TODO: Explicitly out of scope for v1.',
  'TODO: Explicitly out of scope for v1.',
]
const METRICS = [
  'TODO: Primary success metric (with target).',
  'TODO: Secondary metric.',
  'TODO: Guardrail metric.',
]
const VARIABLES = [
  { label: 'Accuracy', body: 'TODO: What accuracy is good enough, and how is it measured?' },
  { label: 'Latency',  body: 'TODO: Acceptable time-to-result, and where it must be real-time vs. batch.' },
  { label: 'Cost',     body: 'TODO: Per-drawing / per-project cost envelope and its sensitivity.' },
]

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="font-sans text-[9px] uppercase tracking-[0.14em] text-charcoal/70 mb-2">{title}</p>
      <ul className="flex flex-col gap-1.5">
        {items.map((b, i) => (
          <li key={i} className="font-sans text-[14px] leading-relaxed text-charcoal flex gap-2">
            <span className="text-autodesk-blue mt-1 shrink-0">—</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function MVP() {
  return (
    <Section id="mvp" eyebrow="MVP" title="Scope, metrics & open variables">
      <div className="grid md:grid-cols-2 gap-x-10 gap-y-8 mb-10 max-w-3xl">
        <List title="In scope" items={SCOPE_IN} />
        <List title="Out of scope" items={SCOPE_OUT} />
      </div>

      <div className="mb-10 max-w-3xl">
        <List title="Success metrics" items={METRICS} />
      </div>

      <div className="border-t-2 border-charcoal/20 pt-5">
        <p className="font-sans text-[9px] uppercase tracking-[0.14em] text-charcoal/70 mb-4">
          Open variables — feasibility unknowns
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {VARIABLES.map(({ label, body }) => (
            <div key={label}>
              <p className="font-serif text-[18px] text-autodesk-blue mb-1">{label}</p>
              <p className="font-sans text-[13px] leading-relaxed text-charcoal">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
