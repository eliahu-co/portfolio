import { APPROACH_STEPS } from '../deckData'
import { SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'
import { FlowArrow } from '../components/FlowArrow'

export default function Slide03Approach(_props: OpeningSlideProps) {
  return (
    <SlideShell>
      <SlideTitle>Approach</SlideTitle>
      <section aria-label="Product approach" className="mt-16 flex-1">
        <ol className="flex items-center gap-5">
          {APPROACH_STEPS.map((step, index) => (
            <li key={step.label} className="relative min-w-0 flex-1">
              <div
                data-approach-pill="true"
                className="flex min-h-[96px] items-center justify-center rounded-lg border border-[#1E7BA8]/30 bg-gradient-to-b from-[#F0FAFE] to-[#DBF1FC] px-4 py-3 text-center font-sans text-[16px] font-extrabold leading-snug text-[#0d3a5a] shadow-[0_3px_0_rgba(30,123,168,0.2)]"
              >
                {step.label}
              </div>
              {index < APPROACH_STEPS.length - 1 && (
                <FlowArrow
                  data-approach-connector="true"
                  className="absolute left-full top-1/2 h-[14px] w-5 -translate-y-1/2"
                  color="#1E7BA8"
                />
              )}
            </li>
          ))}
        </ol>
      </section>
    </SlideShell>
  )
}
