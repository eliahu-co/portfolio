// app/HA-DrawingAnalyzer/presentation/slides/Slide02AboutMe.tsx
// NOTE: copy and photo are author-supplied. Values below are placeholders
// marked TODO — replace before presenting.
import { SlideShell } from '../primitives'

const TIMELINE = ['Brazil', 'Holland', 'Israel'] // TODO: confirm/expand

const BULLETS = [
  '31 years old',
  'Married',
  'Crossfitter',
  '7 years of Aliyah',
  '10 years in the AEC industry',
  '6 years in ConTech',
]

export default function Slide02AboutMe() {
  return (
    <SlideShell eyebrow="About">
      <h2 className="mb-3 text-[clamp(34px,5vw,64px)] font-extrabold leading-[1.04] tracking-[-0.01em] text-black">Eliahu Cohen</h2>
      <p className="mb-8 text-[clamp(34px,5vw,64px)] font-extrabold leading-[1.04] tracking-[-0.01em] text-black">Architect, Product Manager</p>
      <div className="grid grid-cols-1 items-stretch gap-y-6 lg:grid-cols-[auto_1fr] lg:gap-x-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/presentation/family.jpeg"
          alt="Eliahu and family"
          className="w-full max-w-[320px] self-start"
        />
        {/* Text column matches the image height: timeline at top, last bullet at bottom */}
        <div className="flex h-full flex-col justify-between py-1">
          <div className="flex items-center gap-3">
            {/* invisible marker matches the bullets' "—" + gap so "Brazil" aligns with "31" */}
            <span className="shrink-0 font-sans text-[18px] leading-relaxed opacity-0" aria-hidden="true">—</span>
            <div className="flex flex-wrap items-center gap-2">
              {TIMELINE.map((place, i) => (
                <span key={place} className="flex items-center gap-2">
                  <span className="rounded-none px-1 font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-black transition-colors hover:bg-[#ffff00]">{place}</span>
                  {i < TIMELINE.length - 1 && <span className="text-[12px] text-black" aria-hidden="true">→</span>}
                </span>
              ))}
            </div>
          </div>
          {BULLETS.map((b) => (
            <div key={b} className="flex gap-3 font-sans text-[18px] leading-relaxed text-charcoal">
              <span className="shrink-0 text-black" aria-hidden="true">—</span>
              <span>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  )
}
