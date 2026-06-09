// app/HA-DrawingAnalyzer/presentation/slides/Slide11Results.tsx
'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { SlideShell } from '../primitives'
import ScoreTable from '../ScoreTable'
import { CRITERIA, SCORE_ROWS, SCORE_NOTES } from '../deckData'

const CONFIDENCE_COL = CRITERIA.indexOf('Confidence')

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
  // Highest Confidence starts faded; clicking the Confidence column reveals it.
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    const reset = () => setRevealed(false)
    window.addEventListener('deck:navigate', reset)
    return () => window.removeEventListener('deck:navigate', reset)
  }, [])
  // a per-cell note exists only for the criteria columns (0..3), not the Total column
  const note = hover && hover.col < CRITERIA.length ? SCORE_NOTES[hover.row]?.[hover.col] : null

  return (
    <SlideShell eyebrow="Prioritization" title="Change Validation">
      <ScoreTable
        criteria={CRITERIA}
        rows={SCORE_ROWS}
        onHoverChange={setHover}
        onColumnClick={(col) => col === CONFIDENCE_COL && setRevealed((v) => !v)}
      />
      <div className="mt-10">
        {/* per-cell rationale, shown above the (dimmed) Highest Confidence on cell hover */}
        <div className="min-h-[2.5rem]">
          {note && <p className="max-w-3xl font-sans text-[16px] font-bold leading-relaxed text-black">{note}</p>}
        </div>
        <div className={`mt-2 border-t-2 border-black pt-4 transition-opacity duration-300 ${hover || !revealed ? 'opacity-20' : 'opacity-100'}`}>
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
      </div>
    </SlideShell>
  )
}
