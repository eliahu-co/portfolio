// app/HA-DrawingAnalyzer/presentation/slides/Slide09Assumptions.tsx
import { SlideShell } from '../primitives'
import { ASSUMPTIONS } from '../deckData'

export default function Slide09Assumptions() {
  return (
    <SlideShell eyebrow="Assumptions" variant="centered">
      <div className="flex max-w-3xl flex-col gap-4">
        {ASSUMPTIONS.map((a, i) => (
          <div key={i} className="border-l-4 border-black pl-4">
            <p className="font-sans text-[15px] leading-relaxed text-black">{a}</p>
          </div>
        ))}
      </div>
    </SlideShell>
  )
}
