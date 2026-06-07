// app/HA-DrawingAnalyzer/presentation/slides/Slide11Results.tsx
import type { ReactNode } from 'react'
import { SlideShell, ScoreTable } from '../primitives'
import { CRITERIA, SCORE_ROWS } from '../deckData'

// phrase highlights (box-decoration-clone so they wrap per line)
function Hl({ children }: { children: ReactNode }) {
  return <span className="box-decoration-clone bg-[#ffff00] px-0.5 text-black">{children}</span>
}
function HlDark({ children }: { children: ReactNode }) {
  return <span className="box-decoration-clone bg-charcoal px-0.5 text-white">{children}</span>
}
function HlLight({ children }: { children: ReactNode }) {
  return <span className="box-decoration-clone bg-[#c9c9c9] px-0.5 text-black">{children}</span>
}

export default function Slide11Results() {
  return (
    <SlideShell eyebrow="Prioritization" title="Change Validation">
      <ScoreTable criteria={CRITERIA} rows={SCORE_ROWS} />
      <div className="mt-10 max-w-5xl border-t-2 border-black pt-4">
        <p className="text-[22px] font-bold text-black">Highest Confidence</p>
        <p className="mt-3 font-sans text-[14px] leading-relaxed text-charcoal">
          <Hl>Change Validation</Hl> is introduced on a <Hl>high-frequency</Hl> workflow with clear user value, and <Hl>minimal behavior change</Hl>.
        </p>
        <p className="mt-3 font-sans text-[14px] leading-relaxed text-charcoal">
          <HlDark>Context Link</HlDark> has greater adoption risk: field teams operate under time pressure in dynamic <HlDark>construction environments</HlDark> — the additional verification step is a <HlDark>harder sell</HlDark>.
        </p>
        <p className="mt-3 font-sans text-[14px] leading-relaxed text-charcoal">
          <HlLight>Coordination Lock</HlLight> and <HlLight>Program Conformance</HlLight> require creating a <HlLight>new behavior</HlLight>.
        </p>
      </div>
    </SlideShell>
  )
}
