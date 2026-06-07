// app/HA-DrawingAnalyzer/presentation/slides/Slide17KeyUnknowns.tsx
import { SlideShell } from '../primitives'
import { VARIABLES } from '../deckData'

// Monochrome icons per unknown (kept black to stay on-brand).
const ICONS: Record<string, JSX.Element> = {
  Accuracy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <circle cx="10" cy="14" r="7.5" />
      <circle cx="10" cy="14" r="3" />
      <path d="M21 3 L10 14" />
      <path d="M10 9.5 V14 H14.5" />
    </svg>
  ),
  Latency: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <circle cx="12" cy="13" r="8.5" />
      <path d="M12 8 V13 L15.5 15" />
      <path d="M9 2 H15" />
    </svg>
  ),
  Cost: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M12 3 V21" />
      <path d="M16.5 6.5 C16.5 4.5 14.4 3.5 12 3.5 C9.6 3.5 7.5 4.6 7.5 6.8 C7.5 9 9.6 10 12 10.5 C14.4 11 16.5 12 16.5 14.2 C16.5 16.4 14.4 17.5 12 17.5 C9.6 17.5 7.5 16.5 7.5 14.5" />
    </svg>
  ),
}

export default function Slide17KeyUnknowns() {
  return (
    <SlideShell eyebrow="Feasibility" title="Key unknowns to validate">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {VARIABLES.map(({ label, body }) => (
          <div key={label} className="flex items-start gap-4">
            <div className="shrink-0 text-black" aria-hidden="true">{ICONS[label]}</div>
            <div>
              <p className="mb-2 text-[24px] font-bold text-black">{label}</p>
              <p className="font-sans text-[15px] leading-relaxed text-charcoal">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </SlideShell>
  )
}
