// app/HA-DrawingAnalyzer/presentation/slides/Slide17KeyUnknowns.tsx
import { SlideShell } from '../primitives'
import { VARIABLES } from '../deckData'

export default function Slide17KeyUnknowns() {
  return (
    <SlideShell eyebrow="Feasibility" title="Key unknowns to validate">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {VARIABLES.map(({ label, body }) => (
          <div key={label}>
            <p className="mb-2 font-serif text-[24px] text-autodesk-blue">{label}</p>
            <p className="font-sans text-[15px] leading-relaxed text-charcoal">{body}</p>
          </div>
        ))}
      </div>
    </SlideShell>
  )
}
