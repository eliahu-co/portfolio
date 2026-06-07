// app/HA-DrawingAnalyzer/presentation/slides/Slide09Assumptions.tsx
import { SlideShell } from '../primitives'
import { ASSUMPTIONS } from '../deckData'

export default function Slide09Assumptions() {
  return (
    <SlideShell eyebrow="Assumptions">
      {/* invisible title-sized spacer so the body sits where a big title would put it */}
      <h2 aria-hidden className="mb-8 select-none text-[clamp(34px,5vw,64px)] font-extrabold leading-[1.04]">&nbsp;</h2>
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
