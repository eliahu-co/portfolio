// app/HA-DrawingAnalyzer/presentation/slides/Slide18ThankYou.tsx
// Closing slide. "Thank you" + a yellow button list that jumps to any slide
// (via #slide-n hash; PresentationDeck listens for hashchange).
import { SlideShell } from '../primitives'

const SLIDE_TITLES = [
  'Intro',
  'About',
  'Approach',
  'Use Cases',
  'Change Validation',
  'Context Link',
  'Coordination Lock',
  'Conformance Review',
  'Assumptions',
  'Criteria',
  'Scoring',
  'Recommendation',
  'Value & Risks',
  'MVP Scope',
  'Prototype',
  'Key Unknowns',
]

export default function Slide18ThankYou() {
  return (
    <SlideShell variant="centered">
      <h2 className="text-[clamp(48px,9vw,120px)] font-extrabold leading-[0.95] tracking-[-0.02em] text-black">Thank you</h2>
      <div className="mt-12 grid grid-cols-2 gap-2 md:grid-cols-4">
        {SLIDE_TITLES.map((t, i) => {
          const isUseCase = i >= 4 && i <= 7 // the four use-case slides
          return (
            <a
              key={t}
              href={`#slide-${i + 1}`}
              className={`rounded-none border-2 bg-[#ffff00] px-3 py-2 font-sans text-[11px] font-semibold uppercase tracking-wider text-black no-underline hover:opacity-90 ${isUseCase ? 'border-black' : 'border-[#ffff00]'}`}
            >
              {i + 1}. {t}
            </a>
          )
        })}
      </div>
    </SlideShell>
  )
}
