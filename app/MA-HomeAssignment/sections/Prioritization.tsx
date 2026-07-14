// app/MA-HomeAssignment/sections/Prioritization.tsx
// Section — Prioritization: scoring framework, scores across the three
// features, and the resulting decision.

'use client'

import { useState } from 'react'
import Section from './Section'

const CRITERIA = ['ARPDAU Impact', 'Core-Loop Fit', 'Confidence', 'Effort']

const CRITERIA_DEFS: { title: string; body: string; rubric: [string, string][] }[] = [
  {
    title: 'ARPDAU Impact',
    body: 'Potential to increase average daily revenue per active user if successful.',
    rubric: [
      ['5', 'Multiple direct monetization levers with significant upside.'],
      ['3', 'Meaningful but bounded or indirect revenue impact.'],
      ['1', 'Weak or speculative path to ARPDAU.'],
    ],
  },
  {
    title: 'Core-Loop Fit',
    body: 'Degree to which the feature builds on existing Coin Master mechanics and player behavior.',
    rubric: [
      ['5', 'Directly reinforces the existing core or meta loop.'],
      ['3', 'Connects to existing systems but introduces meaningful new behavior.'],
      ['1', 'Sits largely outside the current loop.'],
    ],
  },
  {
    title: 'Confidence',
    body: 'Strength of the evidence that players will adopt the feature and produce the intended economy and monetization behavior.',
    rubric: [
      ['5', 'Supported by clear player behavior and proven category mechanics.'],
      ['3', 'Credible hypothesis with adoption or economy risk.'],
      ['1', 'Limited evidence and significant uncertainty.'],
    ],
  },
  {
    title: 'Effort',
    body: 'Relative product, design, engineering and balancing effort required to deliver a valuable MVP.',
    rubric: [
      ['5', 'Major new systems, economy work or cross-feature dependencies.'],
      ['3', 'Moderate implementation and balancing effort.'],
      ['1', 'Bounded extension of an existing mechanic.'],
    ],
  },
]

type Row = { useCase: string; scores: number[]; total: number; winner?: boolean }

// Total is a modified RICE score: (ARPDAU Impact × Core-Loop Fit × Confidence) ÷ Effort
const ROWS: Row[] = [
  { useCase: 'Card Bounty', scores: [5, 5, 4, 3], total: 33.3, winner: true },
  { useCase: 'Hot Trail',   scores: [4, 5, 3, 3], total: 20.0 },
  { useCase: 'Hometown',    scores: [4, 3, 3, 4], total: 9.0 },
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
    <Section id="prioritization" eyebrow="Prioritization" title="Decision, scoring and criteria">
      {/* Decision */}
      <div className="max-w-2xl mb-8">
        <div className="flex flex-col gap-3">
          <p className="font-sans text-[14px] leading-relaxed text-charcoal">
            Card Bounty ranks first (33): it builds on existing Chest and Collection behavior, drives
            additional Coin spend and can be validated through a contained LiveOps event. Its main risk
            is making the guarantee too attainable, which could accelerate Collection completion and
            weaken future Chest demand.
          </p>
          <p className="font-sans text-[14px] leading-relaxed text-charcoal">
            Hot Trail ranks second (20): it fits the existing Raid loop but may motivate competitive
            players while frustrating others. Hometown ranks third (9): it has longer-term potential but
            requires establishing new customization and social-status behavior.
          </p>
          <p className="font-sans text-[14px] leading-relaxed text-charcoal">
            This brief therefore expands Card Bounty.
          </p>
        </div>
      </div>

      {/* Scoring table */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-cm-wood">
              <th className="font-sans text-[9px] uppercase tracking-[0.12em] text-charcoal/70 py-2 pr-4">
                Feature
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
                style={row.winner ? { backgroundImage: 'linear-gradient(90deg, rgba(245,168,0,0.08) 0%, rgba(245,168,0,0.28) 50%, rgba(245,168,0,0.08) 100%)', backgroundSize: '200% 100%' } : undefined}
              >
                <td className={`font-sans text-[13px] py-3 pr-4 ${row.winner ? 'text-black font-medium' : 'text-charcoal'}`}>
                  {medal && <span className="mr-1.5" aria-hidden="true">{medal}</span>}
                  {row.useCase}
                </td>
                {row.scores.map((s, i) => (
                  <td key={i} className="font-sans text-[13px] text-charcoal/70 py-3 px-3 text-center">{s}</td>
                ))}
                <td className={`font-sans text-[14px] py-3 pl-3 text-center font-medium ${row.winner ? 'text-cm-crimson' : 'text-black'}`}>
                  {Math.round(row.total)}
                </td>
              </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Scoring method */}
      <div className="max-w-2xl mb-8 flex flex-col gap-3">
        <p className="font-sans text-[14px] leading-relaxed text-charcoal">
          The scores compare opportunities; without internal player-segment and exposure data, Reach
          cannot be estimated reliably. I
          therefore replace it with Core-Loop Fit and use a modified RICE-style calculation:
        </p>
        <p className="font-sans font-bold text-[13px] leading-relaxed text-cm-violet-deep border-l-4 border-cm-gold pl-3">
          Opportunity Score = (ARPDAU Impact × Core-Loop Fit × Confidence) ÷ Effort
        </p>
        <p className="font-sans text-[14px] leading-relaxed text-charcoal">
          The calculation favors opportunities that combine monetization potential, natural integration
          and confidence with a manageable investment.
        </p>
      </div>

      {/* Criterion definitions + scoring rubric (accordion) — a vertical list on
          mobile, a row of four expand-in-place columns on desktop */}
      <div className="max-w-2xl md:max-w-none flex flex-col gap-2.5 md:grid md:grid-cols-4 md:gap-x-5 md:gap-y-0 md:items-start">
        {CRITERIA_DEFS.map(({ title, body, rubric }) => {
          const isOpen = open.has(title)
          return (
            <div key={title} className="pl-3 border-l-4 border-cm-wood">
              <button
                type="button"
                onClick={() => toggle(title)}
                aria-expanded={isOpen}
                className="flex items-center gap-2 text-left"
              >
                <span className={`text-cm-wood/60 text-[9px] transition-transform duration-150 ${isOpen ? 'rotate-90' : ''}`} aria-hidden="true">▶</span>
                <span className="font-serif text-[14px] text-cm-violet-deep">{title}</span>
              </button>
              {isOpen && (
                <div className="mt-1.5 ml-[18px] flex flex-col gap-0.5">
                  <p className="font-sans text-[11px] italic leading-relaxed text-charcoal/80 mb-1">{body}</p>
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
    </Section>
  )
}
