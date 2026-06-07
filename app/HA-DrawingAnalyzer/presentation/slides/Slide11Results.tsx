// app/HA-DrawingAnalyzer/presentation/slides/Slide11Results.tsx
import type { ReactNode } from 'react'
import { SlideShell, ScoreTable } from '../primitives'
import { CRITERIA, SCORE_ROWS } from '../deckData'

// yellow highlight that only appears when its sentence (the parent `group`) is hovered
function Hl({ children }: { children: ReactNode }) {
  return (
    <span className="box-decoration-clone rounded-none px-0.5 transition-colors group-hover:bg-[#ffff00] group-hover:text-black">
      {children}
    </span>
  )
}

export default function Slide11Results() {
  return (
    <SlideShell eyebrow="Prioritization" title="Change Validation">
      <ScoreTable criteria={CRITERIA} rows={SCORE_ROWS} />
      <div className="mt-10 max-w-5xl border-t-2 border-black pt-4">
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
    </SlideShell>
  )
}
