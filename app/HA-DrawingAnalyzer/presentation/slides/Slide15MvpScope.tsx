// app/HA-DrawingAnalyzer/presentation/slides/Slide15MvpScope.tsx
import { SlideShell } from '../primitives'
import { SCOPE_IN, SCOPE_OUT } from '../deckData'

export default function Slide15MvpScope() {
  return (
    <SlideShell eyebrow="MVP" title="Scope">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div>
          <p className="mb-4 font-sans text-[12px] font-bold uppercase tracking-[0.12em] text-black">In scope</p>
          <ul className="flex flex-col gap-3">
            {SCOPE_IN.map((s, i) => (
              <li key={i} className="flex gap-2 font-sans text-[16px] leading-relaxed text-charcoal">
                <span className="mt-0.5 shrink-0 font-bold text-black" aria-hidden="true">✓</span><span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-4 font-sans text-[12px] font-bold uppercase tracking-[0.12em] text-charcoal/50">Out of scope</p>
          <ul className="flex flex-col gap-3">
            {SCOPE_OUT.map((s, i) => (
              <li key={i} className="flex gap-2 font-sans text-[16px] leading-relaxed text-charcoal/60">
                <span className="mt-0.5 shrink-0 font-bold text-charcoal/40" aria-hidden="true">✕</span><span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SlideShell>
  )
}
