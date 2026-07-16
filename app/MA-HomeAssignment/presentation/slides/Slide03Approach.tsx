import { APPROACH_STEPS } from '../deckData'
import { InteractiveCallout } from '../components/InteractiveCallout'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide03Approach({ slideKey }: OpeningSlideProps) {
  return (
    <SlideShell>
      <Eyebrow>Discovery to decision</Eyebrow>
      <SlideTitle>Approach</SlideTitle>
      <p className="mt-3 max-w-[820px] font-sans text-[18px] leading-relaxed text-charcoal">
        Start inside the game, map the economy, then narrow three distinct paths to ARPDAU.
      </p>

      <section aria-label="Product approach" className="mt-10 flex-1">
        <ol className="grid h-full grid-cols-6 gap-3">
          {APPROACH_STEPS.map((step, index) => (
            <li key={step.label} className="relative min-w-0">
              <div className="mb-3 flex items-center gap-2">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cm-violet-deep font-sans text-[15px] font-black text-white">
                  {index + 1}
                </span>
                <span aria-hidden="true" className="h-1 flex-1 rounded-full bg-gradient-to-r from-cm-gold to-cm-crimson" />
              </div>

              <InteractiveCallout
                id={`approach-${index}`}
                label={step.label}
                detail={(
                  <div>
                    <p>{step.annotation}</p>
                    <p className="mt-2 font-bold text-cm-violet-deep">Output: {step.output}</p>
                  </div>
                )}
                slideKey={slideKey}
                buttonClassName="min-h-[86px] w-full items-start justify-start px-4 py-4 text-left text-[15px] leading-snug"
              />

              {index < APPROACH_STEPS.length - 1 && (
                <span aria-hidden="true" className="absolute -right-[12px] top-[74px] z-10 text-[21px] font-black text-[#1E7BA8]">→</span>
              )}
            </li>
          ))}
        </ol>
      </section>
    </SlideShell>
  )
}
