// app/HA-DrawingAnalyzer/presentation/slides/Slide12Recommendation.tsx
import { SlideShell } from '../primitives'
import { RECOMMENDATION_PILLARS } from '../deckData'

export default function Slide12Recommendation() {
  return (
    <SlideShell eyebrow="Recommendation" variant="centered">
      <h2 className="text-[clamp(34px,5.5vw,68px)] font-extrabold leading-[1.04] text-black">
        <span className="bg-[#ffff00] px-2 text-black">Change Validation</span>
      </h2>
      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {RECOMMENDATION_PILLARS.map((p) => (
          <div key={p.title} className="border-t-2 border-black pt-4">
            <p className="text-[22px] font-bold text-black">{p.title}</p>
            <p className="mt-2 font-sans text-[14px] leading-relaxed text-charcoal">{p.body}</p>
          </div>
        ))}
      </div>
    </SlideShell>
  )
}
