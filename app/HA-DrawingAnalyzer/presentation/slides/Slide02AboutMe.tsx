// app/HA-DrawingAnalyzer/presentation/slides/Slide02AboutMe.tsx
// NOTE: copy and photo are author-supplied. Values below are placeholders
// marked TODO — replace before presenting.
import { SlideShell } from '../primitives'

const TIMELINE = ['Brazil', 'Netherlands', 'Israel'] // TODO: confirm/expand

const BULLETS = [
  '31 years old',
  'Married',
  'Crossfitter',
  '10 years in the AEC industry',
  '6 years in ConTech',
]

export default function Slide02AboutMe() {
  return (
    <SlideShell eyebrow="About" title="Architect · Product Manager · Builder">
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[auto_1fr]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/presentation/family.jpeg"
          alt="Eliahu and family"
          className="w-full max-w-[300px] rounded-lg shadow-sm"
        />
        <div>
          <div className="flex flex-wrap items-center gap-3">
            {TIMELINE.map((place, i) => (
              <span key={place} className="flex items-center gap-3">
                <span className="font-serif text-[26px] text-black">{place}</span>
                {i < TIMELINE.length - 1 && <span className="text-autodesk-blue" aria-hidden="true">→</span>}
              </span>
            ))}
          </div>
          <ul className="mt-8 flex flex-col gap-3">
            {BULLETS.map((b) => (
              <li key={b} className="flex gap-3 font-sans text-[18px] leading-relaxed text-charcoal">
                <span className="mt-0.5 shrink-0 text-autodesk-blue" aria-hidden="true">—</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SlideShell>
  )
}
