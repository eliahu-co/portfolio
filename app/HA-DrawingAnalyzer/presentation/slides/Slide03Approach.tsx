// app/HA-DrawingAnalyzer/presentation/slides/Slide03Approach.tsx
'use client'

import { useState } from 'react'
import { SlideShell } from '../primitives'
import { LIFECYCLE_PHASES, LIFECYCLE_GROUPS, APPROACH_FLOW } from '../deckData'

const COLS = LIFECYCLE_PHASES.length
const gridCols = { gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }

// phases that, on hover, focus themselves (black, 100%) and dim the rest, with a yellow note
const PHASE_NOTES: Record<string, string> = { BP: 'code compliance', BN: 'competing incentives' }

// the per-use-case analysis sections (grouped into rows), revealed on hovering "Use Cases"
const SECTION_ROWS = [
  ['User', 'Phase'],
  ['Problem', 'Workflow'],
  ['Opportunity'],
  ['Value, risks, metrics'],
  ['Tradeoff'],
]

export default function Slide03Approach() {
  // diagram appears once "Lifecycle" is hovered, and stays on
  const [revealed, setRevealed] = useState(false)
  // diagram dims to 50% while "Use Cases" is hovered
  const [dim, setDim] = useState(false)
  // a focused phase (BP/BN) pops to full black while the rest dims to 20%
  const [focus, setFocus] = useState<string | null>(null)

  return (
    <SlideShell eyebrow="Approach">
      {/* Method flow — above the lifecycle diagram */}
      <div className="mb-16 flex flex-wrap items-center gap-3">
        {APPROACH_FLOW.map((f, i) => (
          <span key={f} className="flex items-center gap-3">
            {f === 'Use Cases' ? (
              <span
                onMouseEnter={() => setDim(true)}
                onMouseLeave={() => setDim(false)}
                className="group relative cursor-default text-[22px] font-semibold text-black"
              >
                {f}
                {/* hover popover — yellow section pills (pt bridges the gap so hover stays) */}
                <span className="invisible absolute left-0 top-full z-30 flex flex-col items-start gap-1.5 pt-3 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                  {SECTION_ROWS.map((row, ri) => (
                    <span key={ri} className="flex gap-1.5">
                      {row.map((s) => (
                        <span key={s} className="whitespace-nowrap rounded-none bg-[#ffff00] px-2.5 py-1 font-sans text-[11px] font-semibold uppercase tracking-wider text-black">{s}</span>
                      ))}
                    </span>
                  ))}
                </span>
              </span>
            ) : f === 'Lifecycle' ? (
              <span onMouseEnter={() => setRevealed(true)} className="cursor-default text-[22px] font-semibold text-black">{f}</span>
            ) : (
              <span className="text-[22px] font-semibold text-black">{f}</span>
            )}
            {i < APPROACH_FLOW.length - 1 && <span className="text-black" aria-hidden="true">→</span>}
          </span>
        ))}
      </div>

      {/* Lifecycle diagram — revealed (and kept) once "Lifecycle" is hovered */}
      <div className={`mt-24 transition-opacity duration-300 ${!revealed ? 'pointer-events-none opacity-0' : dim ? 'opacity-20' : 'opacity-100'}`} aria-hidden={!revealed}>
        {/* Stage grouping brackets */}
        <div className="grid gap-x-3" style={gridCols}>
          {LIFECYCLE_GROUPS.map((g) => (
            <div
              key={g.label}
              style={{ gridColumn: `${g.start + 1} / span ${g.span}` }}
              className={`flex flex-col items-center transition-opacity ${focus ? 'opacity-20' : g.muted ? 'opacity-30' : ''}`}
            >
              <span className="mb-1.5 text-center font-sans text-[10px] font-medium uppercase tracking-[0.1em] text-black">
                {g.label}
              </span>
              {/* downward-opening bracket spanning the stage */}
              <div className="h-2.5 w-full rounded-t-sm border-x-2 border-t-2 border-black" />
            </div>
          ))}
        </div>

        {/* Phase circles + names */}
        <div className="mt-7 grid items-start gap-x-3" style={gridCols}>
          {LIFECYCLE_PHASES.map((p) => {
            const note = PHASE_NOTES[p.initials]
            const isFocused = focus === p.initials
            const op = focus
              ? isFocused ? 'opacity-100' : 'opacity-20'
              : p.muted ? (p.initials === 'BP' ? 'opacity-50' : 'opacity-30') : 'opacity-100'
            return (
              <div
                key={p.initials}
                onMouseEnter={note ? () => setFocus(p.initials) : undefined}
                onMouseLeave={note ? () => setFocus(null) : undefined}
                className={`relative flex flex-col items-center transition-opacity ${op}`}
              >
                <div className="grid aspect-square w-full max-w-[84px] place-items-center rounded-full border-2 border-black">
                  <span className="font-sans text-[clamp(16px,1.8vw,24px)] font-bold tracking-wide text-black">{p.initials}</span>
                </div>
                <span className={`mt-2.5 max-w-[100px] text-center font-sans text-[10px] uppercase leading-tight tracking-[0.08em] ${isFocused ? 'text-black' : 'text-charcoal'}`}>
                  {p.name}
                </span>
                {note && (
                  <span className={`absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-none bg-[#ffff00] px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider text-black transition-opacity ${isFocused ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
                    {note}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </SlideShell>
  )
}
