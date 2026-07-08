// app/MA-HomeAssignment/sections/MVP.tsx
// Section 7 — MVP: scope and success metrics.

import Section from './Section'
import { Pill } from './UseCase'

const SCOPE_IN = [
  'Compare two versions of a single drawing sheet.',
  'Detect added, removed, and modified objects.',
  'Generate visual previews of detected changes.',
  'Approve detected changes and submit review.',
  'Cancel review submission and return to editing.',
]
const SCOPE_OUT = [
  'Manual addition of undetected changes.',
  'Approval or rejection of individual detected changes.',
  'Generate human-readable change descriptions.',
  'Automatic filtering of cosmetic or low-impact changes.',
  'Change severity scoring and risk classification.',
  'Historical change reports.',
  'Multi-sheet drawing sets.',
]
const METRICS: { kind: string; title: string; body: string; signal?: string }[] = [
  {
    kind: 'Business outcome',
    title: 'First-Pass Approval Rate',
    body: 'Percentage of revisions approved without being returned for rework.\nLonger-term business outcomes would include review effort, review cycle time, and review cost.',
    signal: 'Increasing compared to baseline.',
  },
  {
    kind: 'Usage',
    title: 'Pre-Review Revision Rate',
    body: 'Percentage of initiated reviews where the designer modifies the drawing after Change Validation.',
    signal: 'Positive and sustained, indicating issues are being identified before submission.',
  },
  {
    kind: 'Quality',
    title: 'Change Validation Satisfaction',
    body: 'Collected through a lightweight thumbs-up/down or periodic survey.',
    signal: 'High and increasing over time.',
  },
  {
    kind: 'Guardrail',
    title: 'Review Submission Volume',
    body: 'Number of reviews submitted per project.',
    signal: 'Stable relative to baseline, indicating the added validation step is not reducing workflow adoption.',
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
        The focus is on validating whether pre-submission change review improves first-pass approvals.
        Features that do not directly support that learning objective are intentionally excluded.
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
