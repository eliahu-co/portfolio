// app/HA-DrawingAnalyzer/sections/Prioritization.tsx
// Section 6 — Prioritization: criteria, scoring across the three use cases,
// and the resulting decision. Placeholder scoring table.

import Section from './Section'

const CRITERIA = ['Impact', 'Reach', 'Confidence', 'Effort']

type Row = { useCase: string; scores: string[]; total: string }

const ROWS: Row[] = [
  { useCase: 'Use Case 1 — Bid-to-IFC', scores: ['TODO', 'TODO', 'TODO', 'TODO'], total: 'TODO' },
  { useCase: 'Use Case 2 — RFI Linking', scores: ['TODO', 'TODO', 'TODO', 'TODO'], total: 'TODO' },
  { useCase: 'Use Case 3 — TBD',         scores: ['TODO', 'TODO', 'TODO', 'TODO'], total: 'TODO' },
]

export default function Prioritization() {
  return (
    <Section id="prioritization" eyebrow="Prioritization" title="Criteria, scoring & decision">
      <div className="max-w-2xl mb-8">
        <p className="font-sans text-[14px] leading-relaxed text-charcoal">
          {/* TODO: Explain the framework (e.g. RICE / ICE) and why these criteria. */}
          TODO: Describe the scoring framework and why these criteria matter for this
          decision. Note the scale (e.g. 1–5).
        </p>
      </div>

      {/* Scoring table */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-autodesk-blue">
              <th className="font-sans text-[9px] uppercase tracking-[0.12em] text-charcoal/70 py-2 pr-4">
                Use case
              </th>
              {CRITERIA.map((c) => (
                <th key={c} className="font-sans text-[9px] uppercase tracking-[0.12em] text-charcoal/70 py-2 px-3">
                  {c}
                </th>
              ))}
              <th className="font-sans text-[9px] uppercase tracking-[0.12em] text-charcoal/70 py-2 pl-3">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.useCase} className="border-b border-charcoal/15">
                <td className="font-sans text-[13px] text-charcoal py-3 pr-4">{row.useCase}</td>
                {row.scores.map((s, i) => (
                  <td key={i} className="font-sans text-[13px] text-charcoal/70 py-3 px-3">{s}</td>
                ))}
                <td className="font-sans text-[13px] font-medium text-black py-3 pl-3">{row.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="max-w-2xl border-t-2 border-charcoal/20 pt-5">
        <p className="font-sans text-[9px] uppercase tracking-[0.14em] text-autodesk-blue mb-2">Decision</p>
        <p className="font-sans text-[14px] leading-relaxed text-charcoal">
          {/* TODO: State which use case wins and the reasoning. */}
          TODO: State the chosen use case and summarize why it wins on the criteria above.
        </p>
      </div>
    </Section>
  )
}
