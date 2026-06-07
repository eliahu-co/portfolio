// app/HA-DrawingAnalyzer/presentation/slides/Slide03Approach.tsx
import { SlideShell } from '../primitives'
import { APPROACH_PHASES, APPROACH_FLOW } from '../deckData'

export default function Slide03Approach() {
  return (
    <SlideShell eyebrow="Approach" title="From lifecycle to MVP">
      <div className="mb-10">
        <p className="mb-3 font-sans text-[12px] uppercase tracking-[0.12em] text-charcoal/60">Construction lifecycle</p>
        <div className="flex flex-wrap gap-2">
          {APPROACH_PHASES.map((p) => (
            <span key={p} className="rounded-sm border-2 border-charcoal/40 px-3 py-1 font-sans text-[13px] text-charcoal">{p}</span>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {APPROACH_FLOW.map((f, i) => (
          <span key={f} className="flex items-center gap-3">
            <span className="font-serif text-[22px] text-black">{f}</span>
            {i < APPROACH_FLOW.length - 1 && <span className="text-autodesk-blue" aria-hidden="true">→</span>}
          </span>
        ))}
      </div>
    </SlideShell>
  )
}
