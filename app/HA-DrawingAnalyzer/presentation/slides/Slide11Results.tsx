// app/HA-DrawingAnalyzer/presentation/slides/Slide11Results.tsx
import { SlideShell, ScoreTable } from '../primitives'
import { CRITERIA, SCORE_ROWS } from '../deckData'

export default function Slide11Results() {
  return (
    <SlideShell eyebrow="Prioritization" title="Change Validation">
      <ScoreTable criteria={CRITERIA} rows={SCORE_ROWS} />
      <div className="mt-10 max-w-3xl border-t-2 border-black pt-4">
        <p className="text-[22px] font-bold text-black">Highest Confidence</p>
        <p className="mt-3 font-sans text-[14px] leading-relaxed text-charcoal">
          Change Validation is introduced on a high-frequency workflow with clear user value, and minimal behavior change.
        </p>
        <p className="mt-3 font-sans text-[14px] leading-relaxed text-charcoal">
          Context Link has greater adoption risk: field teams operate under time pressure in dynamic construction environments — the additional verification step is a harder sell.
        </p>
      </div>
    </SlideShell>
  )
}
