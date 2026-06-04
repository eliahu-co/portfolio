// app/HA-DrawingAnalyzer/sections/MVP.tsx
// Section 7 — MVP: scope, success metrics, and the open variables
// (accuracy / latency / cost) that define feasibility.

import Section from './Section'
import { Pill } from './UseCase'

const SCOPE_IN = [
  'Compare two versions of a single drawing sheet.',
  'Detect added, removed, and modified drawing objects.',
  'Generate human-readable change descriptions.',
  'Allow designers to edit AI-generated change descriptions before submission.',
  'Allow designers to manually add changes not detected by the analyzer.',
  'Allow designers to cancel version creation after reviewing the generated change summary.',
]
const SCOPE_OUT = [
  'Multi-sheet drawing sets.',
  'Historical change report visibility.',
  'Change severity scoring and risk classification.',
  'Selective approval or rejection of individual detected changes.',
  'Automatic filtering of cosmetic or low-impact changes.',
]
const METRICS: { kind: string; title: string; body: string; signal: string }[] = [
  {
    kind: 'Primary',
    title: 'First-Pass Approval Rate',
    body: 'Percentage of revisions approved without being returned for rework.',
    signal: 'Increasing compared to baseline.',
  },
  {
    kind: 'Secondary',
    title: 'Upload Cancellation Rate After Change Review',
    body: 'Percentage of uploads cancelled after the designer reviews the AI-generated change summary.',
    signal: 'Positive and sustained, indicating issues are being identified before version creation.',
  },
  {
    kind: 'Learning',
    title: 'Change Description Edit Rate',
    body: 'Percentage of AI-generated change descriptions modified by designers before submission.',
    signal: 'Low and decreasing over time.',
  },
  {
    kind: 'Learning',
    title: 'Manually Added Change Rate',
    body: 'Percentage of submissions where designers add changes not detected by the analyzer.',
    signal: 'Low and decreasing over time.',
  },
]
const VARIABLES = [
  { label: 'Accuracy', body: 'What level of change-detection accuracy is required for designers to trust the review output?' },
  { label: 'Latency',  body: 'Can analysis complete quickly enough to fit naturally into the upload workflow?' },
  { label: 'Cost',     body: 'Can change validation run on every upload while remaining economically viable at project scale?' },
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
        <p className="font-sans text-[9px] uppercase tracking-[0.14em] text-charcoal/70 mb-4">Success metrics</p>
        <div className="flex flex-col gap-5">
          {METRICS.map(({ kind, title, body, signal }) => (
            <div key={title} className="pl-3 border-l-4 border-autodesk-blue">
              <p className="font-serif text-[14px] text-black mb-0.5 flex items-center gap-2">
                <span className="min-w-0">{title}</span>
                <Pill tone="blue" className="ml-auto shrink-0">{kind}</Pill>
              </p>
              <p className="font-sans text-[11px] italic leading-relaxed text-charcoal/80">{body}</p>
              <p className="mt-2 font-sans text-[9px] uppercase tracking-[0.12em] text-charcoal">
                <span className="font-bold mr-2">Success signal</span>{signal}
              </p>
            </div>
          ))}
        </div>
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
