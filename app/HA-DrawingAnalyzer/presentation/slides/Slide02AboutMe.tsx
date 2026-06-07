// app/HA-DrawingAnalyzer/presentation/slides/Slide02AboutMe.tsx
// NOTE: copy and photo are author-supplied. Values below are placeholders
// marked TODO — replace before presenting.
import { SlideShell } from '../primitives'

const TIMELINE = ['Brazil', 'Netherlands', 'Israel'] // TODO: confirm/expand

export default function Slide02AboutMe() {
  return (
    <SlideShell eyebrow="About" title="Architect · Product Manager · Builder">
      <div className="flex flex-wrap items-center gap-3">
        {TIMELINE.map((place, i) => (
          <span key={place} className="flex items-center gap-3">
            <span className="font-serif text-[26px] text-black">{place}</span>
            {i < TIMELINE.length - 1 && <span className="text-autodesk-blue" aria-hidden="true">→</span>}
          </span>
        ))}
      </div>
      <p className="mt-8 font-sans text-[18px] leading-relaxed text-charcoal">
        {/* TODO: replace with real bio */}
        Six years in ConTech across product and engineering — owning product
        lifecycles and shipping production code alongside the team.
      </p>
    </SlideShell>
  )
}
