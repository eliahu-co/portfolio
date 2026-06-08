// app/HA-DrawingAnalyzer/presentation/slides/Slide11Results.tsx
'use client'

import { useState, type ReactNode } from 'react'
import { SlideShell } from '../primitives'
import ScoreTable from '../ScoreTable'
import { CRITERIA, SCORE_ROWS, SCORE_NOTES } from '../deckData'

// yellow highlight that only appears when its sentence (the parent `group`) is hovered
function Hl({ children }: { children: ReactNode }) {
  return (
    <span className="box-decoration-clone rounded-none px-0.5 transition-colors group-hover:bg-[#ffff00] group-hover:text-black">
      {children}
    </span>
  )
}

export default function Slide11Results() {
  const [hover, setHover] = useState<{ row: number; col: number } | null>(null)
  // a per-cell note exists only for the criteria columns (0..3), not the Total column
  const note = hover && hover.col < CRITERIA.length ? SCORE_NOTES[hover.row]?.[hover.col] : null

  return (
    <SlideShell eyebrow="Prioritization" title="Change Validation">
      <ScoreTable criteria={CRITERIA} rows={SCORE_ROWS} onHoverChange={setHover} />
      <div className="relative mt-10 max-w-5xl">
        <div className={`border-t-2 border-black pt-4 transition-opacity duration-300 ${hover ? 'opacity-20' : ''}`}>
          <p className="text-[22px] font-bold text-black">Highest Confidence</p>
          <p className="group mt-3 font-sans text-[14px] leading-relaxed text-charcoal">
            <Hl>Change Validation</Hl> is introduced on a <Hl>high-frequency</Hl> workflow with clear user value, and <Hl>minimal behavior change</Hl>.
          </p>
          <p className="group mt-3 font-sans text-[14px] leading-relaxed text-charcoal">
            <Hl>Context Link</Hl> has greater adoption risk: field teams operate under time pressure in dynamic <Hl>construction environments</Hl> — the additional verification step is a <Hl>harder sell</Hl>.
          </p>
          <p className="group mt-3 font-sans text-[14px] leading-relaxed text-charcoal">
            <Hl>Coordination Lock</Hl> and <Hl>Program Conformance</Hl> require creating a <Hl>new behavior</Hl>.
          </p>
        </div>

        {/* per-cell rationale, shown over the dimmed section while hovering a score cell */}
        {hover && note && (
          <div className="absolute inset-x-0 top-0 border-t-2 border-black pt-4">
            <p className="text-[22px] font-bold text-black">{SCORE_ROWS[hover.row].useCase}</p>
            <p className="mt-3 font-sans text-[13px] font-bold uppercase tracking-[0.1em] text-black">
              {CRITERIA[hover.col]} = {SCORE_ROWS[hover.row].scores[hover.col]}
            </p>
            <p className="mt-1 max-w-3xl font-sans text-[15px] leading-relaxed text-charcoal">{note}</p>
          </div>
        )}
      </div>
    </SlideShell>
  )
}
