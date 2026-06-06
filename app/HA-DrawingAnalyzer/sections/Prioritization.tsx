// app/HA-DrawingAnalyzer/sections/Prioritization.tsx
// Section — Prioritization: scoring framework, scores across the four use
// cases, and the resulting decision.

'use client'

import { useState } from 'react'
import Section from './Section'

const CRITERIA = ['Impact', 'Platform Leverage', 'Confidence', 'Feasibility']

const CRITERIA_DEFS: { title: string; body: string; rubric: [string, string][] }[] = [
  {
    title: 'Impact',
    body: 'Magnitude of value delivered if successful.',
    rubric: [
      ['5', 'Significant user and business impact.'],
      ['3', 'Meaningful but limited impact.'],
      ['1', 'Nice-to-have improvement.'],
    ],
  },
  {
    title: 'Platform Leverage',
    body: 'Degree to which the use case depends on the unique capabilities of the AI Drawing Analyzer.',
    rubric: [
      ['5', 'Impossible without drawing intelligence.'],
      ['3', 'Somewhat benefits from it.'],
      ['1', 'Mostly unrelated.'],
    ],
  },
  {
    title: 'Confidence',
    body: 'Confidence that users will understand, adopt, and realize value from the workflow.',
    rubric: [
      ['5', 'Clear pain point and obvious value.'],
      ['3', 'Some adoption or behavior-change risk.'],
      ['1', 'Significant uncertainty around adoption or value.'],
    ],
  },
  {
    title: 'Feasibility',
    body: 'Estimated effort required to deliver a valuable MVP.',
    rubric: [
      ['5', 'Low effort and limited dependencies.'],
      ['3', 'Moderate effort or coordination required.'],
      ['1', 'Significant effort or complexity required.'],
    ],
  },
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
  const [open, setOpen] = useState<Set<string>>(new Set())
  const toggle = (title: string) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(title)) next.delete(title)
      else next.add(title)
      return next
    })
  return (
    <Section id="prioritization" eyebrow="Prioritization" title="Criteria, scoring & decision">
      <div className="max-w-2xl mb-6">
        <p className="font-sans text-[14px] leading-relaxed text-charcoal">
          Each use case is scored from 1–5 across four criteria. Scores are intended to compare
          strategic opportunities rather than estimate outcomes with precision. All criteria are
          oriented so that higher scores indicate a more attractive investment opportunity.
        </p>
      </div>

      {/* Criterion definitions + scoring rubric (accordion) */}
      <div className="max-w-2xl mb-8 flex flex-col gap-2.5">
        {CRITERIA_DEFS.map(({ title, body, rubric }) => {
          const isOpen = open.has(title)
          return (
            <div key={title} className="pl-3 border-l-4 border-charcoal">
              <button
                type="button"
                onClick={() => toggle(title)}
                aria-expanded={isOpen}
                className="flex items-center gap-2 text-left"
              >
                <span className={`text-charcoal/45 text-[9px] transition-transform duration-150 ${isOpen ? 'rotate-90' : ''}`} aria-hidden="true">▶</span>
                <span className="font-serif text-[14px] text-black">{title}</span>
              </button>
              <p className="ml-[18px] font-sans text-[11px] italic leading-relaxed text-charcoal/80">{body}</p>
              {isOpen && (
                <div className="mt-1.5 ml-[18px] flex flex-col gap-0.5">
                  {rubric.map(([score, desc]) => (
                    <p key={score} className="font-sans text-[11px] leading-relaxed text-charcoal/70">
                      <span className="font-bold text-charcoal">{score}</span>
                      <span className="text-charcoal/40"> — </span>
                      {desc}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )
        })}
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
              <tr
                key={row.useCase}
                className={`border-b border-charcoal/15 ${row.winner ? 'animate-shimmer motion-reduce:animate-none' : ''}`}
                style={row.winner ? { backgroundImage: 'linear-gradient(90deg, rgba(6,150,215,0.06) 0%, rgba(6,150,215,0.22) 50%, rgba(6,150,215,0.06) 100%)', backgroundSize: '200% 100%' } : undefined}
              >
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
        <div className="flex flex-col gap-3">
          <p className="font-sans text-[14px] leading-relaxed text-charcoal">
            Change Validation scores highest (18) and is recommended as the starting point. It addresses
            a high-frequency workflow with clear user value, strong platform leverage, and relatively low
            implementation risk. It also establishes the structured change foundation that can later
            support Context Link and other downstream opportunities.
          </p>
          <p className="font-sans text-[14px] leading-relaxed text-charcoal">
            Context Link (16) is the next strongest candidate and a natural follow-on investment, leveraging
            the same ability to identify and relate objects within drawings.
          </p>
        </div>
      </div>
    </Section>
  )
}
