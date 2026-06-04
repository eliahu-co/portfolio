// app/HA-DrawingAnalyzer/sections/Prioritization.tsx
// Section — Prioritization: scoring framework, scores across the four use
// cases, and the resulting decision.

import Section from './Section'
import { CardList } from './UseCase'

const CRITERIA = ['Impact', 'Platform Leverage', 'Confidence', 'Feasibility']

const CRITERIA_DEFS = [
  { title: 'Impact', body: 'Magnitude of value delivered if successful. Considers problem severity, workflow frequency, and business impact.' },
  { title: 'Platform Leverage', body: 'How strongly the use case demonstrates and extends the unique capabilities of the AI Drawing Analyzer.' },
  { title: 'Confidence', body: 'Confidence that the workflow can be implemented accurately and adopted successfully given current technology and user behavior.' },
  { title: 'Feasibility', body: 'Likelihood that the use case can be successfully delivered and adopted given current technology, workflow constraints, and implementation complexity. Higher scores indicate lower overall delivery risk.' },
]

type Row = { useCase: string; scores: number[]; total: number; winner?: boolean }

const ROWS: Row[] = [
  { useCase: 'Change Validation',          scores: [5, 5, 5, 3], total: 18, winner: true },
  { useCase: 'Context Link',               scores: [5, 5, 3, 3], total: 16 },
  { useCase: 'Coordination Lock',          scores: [5, 4, 3, 2], total: 14 },
  { useCase: 'Program Conformance Review', scores: [4, 5, 2, 2], total: 13 },
]

// Medals for the top three totals (computed by rank so it survives reordering)
const MEDALS = ['🥇', '🥈', '🥉']
const RANKED_TOTALS = [...ROWS].map((r) => r.total).sort((a, b) => b - a)

export default function Prioritization() {
  return (
    <Section id="prioritization" eyebrow="Prioritization" title="Criteria, scoring & decision">
      <div className="max-w-2xl mb-6">
        <p className="font-sans text-[14px] leading-relaxed text-charcoal">
          Each use case is scored from 1–5 across four criteria. Scores are intended to compare
          strategic opportunities rather than estimate outcomes with precision. All criteria are
          oriented so that higher scores indicate a more attractive investment opportunity.
        </p>
      </div>

      {/* Criterion definitions — reuse the value/risk card style, black accent */}
      <div className="max-w-2xl mb-8">
        <CardList items={CRITERIA_DEFS} variant="neutral" columns={1} />
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
                <th key={c} className="font-sans text-[9px] uppercase tracking-[0.12em] text-charcoal/70 py-2 px-3 text-center">
                  {c}
                </th>
              ))}
              <th className="font-sans text-[9px] uppercase tracking-[0.12em] text-charcoal/70 py-2 pl-3 text-center">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => {
              const medal = MEDALS[RANKED_TOTALS.indexOf(row.total)]
              return (
              <tr key={row.useCase} className={`border-b border-charcoal/15 ${row.winner ? 'bg-autodesk-blue/5' : ''}`}>
                <td className={`font-sans text-[13px] py-3 pr-4 ${row.winner ? 'text-black font-medium' : 'text-charcoal'}`}>
                  {medal && <span className="mr-1.5" aria-hidden="true">{medal}</span>}
                  {row.useCase}
                </td>
                {row.scores.map((s, i) => (
                  <td key={i} className="font-sans text-[13px] text-charcoal/70 py-3 px-3 text-center">{s}</td>
                ))}
                <td className={`font-sans text-[14px] py-3 pl-3 text-center font-medium ${row.winner ? 'text-autodesk-blue' : 'text-black'}`}>
                  {row.total}
                </td>
              </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="max-w-2xl">
        <p className="font-sans text-[9px] uppercase tracking-[0.14em] text-autodesk-blue mb-2">Decision</p>
        <p className="font-sans text-[14px] leading-relaxed text-charcoal">
          Change Validation scores highest (18) — pairing the strongest impact and
          platform leverage with high implementation confidence — making it the recommended
          starting point. Context Link (16) is the next strongest and a natural follow-on,
          reusing the same structured-drawing foundation.
        </p>
      </div>
    </Section>
  )
}
