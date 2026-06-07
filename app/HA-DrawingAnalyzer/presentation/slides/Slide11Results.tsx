// app/HA-DrawingAnalyzer/presentation/slides/Slide11Results.tsx
import { SlideShell, ScoreTable } from '../primitives'
import { CRITERIA, SCORE_ROWS, RECOMMENDATION_PILLARS } from '../deckData'

const PILLARS = RECOMMENDATION_PILLARS.filter(
  (p) => p.title === 'Highest Confidence' || p.title === 'Fastest Learning',
)

export default function Slide11Results() {
  return (
    <SlideShell eyebrow="Prioritization" title="Change Validation">
      <ScoreTable criteria={CRITERIA} rows={SCORE_ROWS} />
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        {PILLARS.map((p) => (
          <div key={p.title} className="border-t-2 border-black pt-4">
            <p className="text-[22px] font-bold text-black">{p.title}</p>
            <p className="mt-2 font-sans text-[14px] leading-relaxed text-charcoal">{p.body}</p>
          </div>
        ))}
      </div>
    </SlideShell>
  )
}
