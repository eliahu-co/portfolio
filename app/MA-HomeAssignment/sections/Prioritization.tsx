'use client'

// app/MA-HomeAssignment/sections/Prioritization.tsx
// Section — Prioritization: scoring framework, scores across the three
// features, and the resulting decision.

import { createPortal } from 'react-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import Section from './Section'

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
const TOOLTIP_WIDTH = 240
const VIEWPORT_GUTTER = 12

export default function Prioritization() {
  const [mounted, setMounted] = useState(false)
  const [activeCriterion, setActiveCriterion] = useState<number | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const infoButtonRefs = useRef<(HTMLButtonElement | null)[]>([])

  const positionTooltip = useCallback((index: number) => {
    const anchor = infoButtonRefs.current[index]
    if (!anchor) return

    const rect = anchor.getBoundingClientRect()
    const preferredLeft = index === CRITERIA_DEFS.length - 1
      ? rect.right - TOOLTIP_WIDTH
      : rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2
    const maxLeft = Math.max(VIEWPORT_GUTTER, window.innerWidth - TOOLTIP_WIDTH - VIEWPORT_GUTTER)

    setTooltipPosition({
      top: rect.bottom + 8,
      left: Math.min(Math.max(preferredLeft, VIEWPORT_GUTTER), maxLeft),
    })
  }, [])

  const showTooltip = useCallback((index: number) => {
    positionTooltip(index)
    setActiveCriterion(index)
  }, [positionTooltip])

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (activeCriterion === null) return

    const reposition = () => positionTooltip(activeCriterion)
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)
    return () => {
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition, true)
    }
  }, [activeCriterion, positionTooltip])

  return (
    <>
      <Section id="prioritization" eyebrow="Prioritization" title="Decision, scoring and criteria">
      {/* Decision */}
      <div className="max-w-2xl mb-8">
        <div className="flex flex-col gap-3">
          <p className="font-sans text-[14px] leading-relaxed text-charcoal">
            Card Bounty ranks first (33): it builds on existing Chest and Collection behavior, drives
            additional Coin spend and can be validated through a contained LiveOps event. If successful,
            it becomes a repeatable event framework that can be tuned by Card rarity, player segment and
            duration. Its main risk is making the guarantee too attainable, which could accelerate
            Collection completion and weaken future Chest demand.
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
              {CRITERIA_DEFS.map(({ title }, index) => {
                const tooltipId = `criterion-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-tooltip`

                return (
                  <th
                    key={title}
                    data-criterion-header={title}
                    onMouseEnter={() => showTooltip(index)}
                    onMouseLeave={(event) => {
                      if (!event.currentTarget.contains(document.activeElement)) setActiveCriterion(null)
                    }}
                    className="group font-sans text-[9px] uppercase tracking-[0.12em] text-charcoal/70 py-2 px-3 text-center"
                  >
                    <span className="inline-flex items-center justify-center gap-1 whitespace-nowrap">
                      <span>{title}</span>
                      <button
                        ref={(node) => { infoButtonRefs.current[index] = node }}
                        type="button"
                        aria-label={`About ${title}`}
                        aria-describedby={tooltipId}
                        onFocus={() => showTooltip(index)}
                        onBlur={() => setActiveCriterion(null)}
                        onClick={() => showTooltip(index)}
                        className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border border-cm-wood/60 bg-cm-cream font-sans text-[8px] font-bold normal-case tracking-normal text-cm-wood outline-none transition-colors hover:border-cm-crimson hover:text-cm-crimson focus-visible:ring-2 focus-visible:ring-cm-gold focus-visible:ring-offset-1"
                      >
                        i
                      </button>
                    </span>
                  </th>
                )
              })}
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
                  <span data-prioritization-feature className="inline-flex items-center whitespace-nowrap">
                    {medal && <span className="mr-1.5" aria-hidden="true">{medal}</span>}
                    {row.useCase}
                  </span>
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
      <div className="max-w-2xl mb-6 flex flex-col gap-3">
        <p className="font-sans text-[14px] leading-relaxed text-charcoal">
          The scores compare opportunities; without internal player-segment and exposure data, Reach
          cannot be estimated reliably. I
          therefore replace it with Core-Loop Fit and use a modified RICE-style calculation:
        </p>
        <p className="font-sans text-[14px] font-normal leading-relaxed text-charcoal border-l-4 border-cm-gold pl-3">
          Opportunity Score = (ARPDAU Impact × Core-Loop Fit × Confidence) ÷ Effort
        </p>
        <p className="font-sans text-[14px] leading-relaxed text-charcoal">
          The calculation favors opportunities that combine monetization potential, natural integration
          and confidence with a manageable investment.
        </p>
      </div>

      </Section>
      {mounted && createPortal(
        <>
          {CRITERIA_DEFS.map(({ title, body, rubric }, index) => {
            const tooltipId = `criterion-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-tooltip`
            const isActive = activeCriterion === index

            return (
              <div
                key={title}
                id={tooltipId}
                role="tooltip"
                aria-hidden={!isActive}
                style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
                className={`pointer-events-none fixed z-[100] w-60 rounded-lg border border-cm-wood/35 bg-cm-cream p-3 text-left font-sans normal-case tracking-normal shadow-[0_10px_24px_rgba(42,27,84,0.18)] transition-[opacity,visibility] duration-150 ${isActive ? 'visible opacity-100' : 'invisible opacity-0'}`}
              >
                <p className="mb-2 text-[11px] font-normal italic leading-relaxed text-charcoal/80">{body}</p>
                <div className="flex flex-col gap-1 border-t border-charcoal/15 pt-2">
                  {rubric.map(([score, description]) => (
                    <p key={score} data-rubric-item className="flex gap-1.5 text-[10px] font-normal leading-relaxed text-charcoal/70">
                      <span className="font-bold text-cm-crimson">{score}</span>
                      <span>{description}</span>
                    </p>
                  ))}
                </div>
              </div>
            )
          })}
        </>,
        document.body
      )}
    </>
  )
}
