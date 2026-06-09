// app/HA-DrawingAnalyzer/presentation/slides/Slide18ThankYou.tsx
// Closing slide. "Thank you" + a yellow button list that jumps to any slide
// (via #slide-n hash; PresentationDeck listens for hashchange).
import { SlideShell } from '../primitives'

// label + target slide number (problem intro slides are intentionally excluded;
// use-case links point to the detail slides, not the problem slides)
const SLIDE_LINKS = [
  { label: 'Intro', slide: 1 },
  { label: 'About', slide: 2 },
  { label: 'Approach', slide: 3 },
  { label: 'Use Cases', slide: 4 },
  { label: 'Change Validation', slide: 6 },
  { label: 'Context Link', slide: 8 },
  { label: 'Coordination Lock', slide: 10 },
  { label: 'Conformance Review', slide: 12 },
  { label: 'Assumptions', slide: 13 },
  { label: 'Criteria', slide: 14 },
  { label: 'Scoring', slide: 15 },
  { label: 'MVP Scope', slide: 16 },
  { label: 'Value, Risks & Metrics', slide: 17 },
  { label: 'Prototype', slide: 18 },
  { label: 'Key Unknowns', slide: 19 },
]

export default function Slide18ThankYou() {
  return (
    <SlideShell variant="centered">
      <h2 className="text-[clamp(48px,9vw,120px)] font-extrabold leading-[0.95] tracking-[-0.02em] text-black">Thank you</h2>
      <div className="mt-12 grid grid-cols-2 gap-2 md:grid-cols-4">
        {SLIDE_LINKS.map(({ label, slide }, i) => {
          const isUseCase = i >= 4 && i <= 7 // the four use-case slides
          return (
            <a
              key={label}
              href={`#slide-${slide}`}
              className={`rounded-none border-2 bg-[#ffff00] px-3 py-2 font-sans text-[11px] font-semibold uppercase tracking-wider text-black no-underline hover:opacity-90 ${isUseCase ? 'border-black' : 'border-[#ffff00]'}`}
            >
              {i + 1}. {label}
            </a>
          )
        })}
      </div>
    </SlideShell>
  )
}
