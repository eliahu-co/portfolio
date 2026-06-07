// app/HA-DrawingAnalyzer/presentation/slides/Slide09Assumptions.tsx
import { SlideShell } from '../primitives'
import { ASSUMPTIONS } from '../deckData'

export default function Slide09Assumptions() {
  return (
    <SlideShell eyebrow="Assumptions">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {ASSUMPTIONS.map((a, i) => (
          <div key={i} className="border-l-4 border-black pl-4">
            <p className="font-sans text-[15px] leading-relaxed text-black">{a}</p>
          </div>
        ))}
      </div>
    </SlideShell>
  )
}
