import { APPROACH_STEPS } from '../deckData'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide03Approach(_props: OpeningSlideProps) {
  return (
    <SlideShell>
      <Eyebrow>Discovery to decision</Eyebrow>
      <SlideTitle>Approach</SlideTitle>
      <section aria-label="Product approach" className="mt-14 flex-1">
        <ol className="grid grid-cols-6 items-center gap-5">
          {APPROACH_STEPS.map((step, index) => (
            <li key={step.label} className="relative min-w-0">
              <div className="flex min-h-[96px] items-center justify-center rounded-lg border border-[#1E7BA8]/30 bg-gradient-to-b from-[#F0FAFE] to-[#DBF1FC] px-4 py-3 text-center font-sans text-[16px] font-extrabold leading-snug text-[#0d3a5a] shadow-[0_3px_0_rgba(30,123,168,0.2)]">
                {step.label}
              </div>
              {index < APPROACH_STEPS.length - 1 && (
                <span aria-hidden="true" className="absolute -right-[18px] top-1/2 z-10 -translate-y-1/2 text-[24px] font-black text-[#1E7BA8]">→</span>
              )}
            </li>
          ))}
        </ol>
      </section>
    </SlideShell>
  )
}
