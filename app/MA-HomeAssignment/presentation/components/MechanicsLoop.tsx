import type { PresentationConcept } from '../deckData'
import type { DeckSlideKey } from '../useDeckReset'
import { InteractiveCallout } from './InteractiveCallout'

export type MechanicsLoopProps = {
  readonly concept: PresentationConcept
  readonly slideKey: DeckSlideKey
}

export function MechanicsLoop({ concept, slideKey }: MechanicsLoopProps) {
  return (
    <section aria-label={`${concept.title} mechanics`}>
      <div className="flex items-end justify-between gap-8">
        <div>
          <h3 className="font-serif text-[34px] font-black leading-tight text-cm-violet-deep">
            {concept.loop.stat}
          </h3>
          <p className="mt-2 max-w-[760px] font-sans text-[16px] leading-relaxed text-charcoal">
            {concept.thesis}
          </p>
        </div>
        <p className="max-w-[360px] rounded-2xl border-2 border-cm-gold/45 bg-cm-gold/10 px-5 py-4 font-sans text-[15px] font-bold leading-relaxed text-cm-violet-deep">
          {concept.monetizationSummary}
        </p>
      </div>

      <ol
        aria-label={`${concept.title} mechanics loop`}
        className="mt-6 grid auto-cols-fr grid-flow-col gap-3"
      >
        {concept.loop.steps.map((step, index) => (
          <li key={`${step.label}-${index}`} className="relative min-w-0">
            <InteractiveCallout
              id={`${concept.id}-loop-${index}`}
              label={step.label}
              detail={concept.loopImplications[index]}
              slideKey={slideKey}
              buttonClassName={step.coreLoop
                ? 'h-full w-full justify-center border-cm-wood/55 bg-cm-gold/20 text-center text-[14px]'
                : 'h-full w-full justify-center text-center text-[14px]'}
            />
            {index < concept.loop.steps.length - 1 && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-[13px] top-4 z-10 text-[18px] font-black text-[#1E7BA8]"
              >
                →
              </span>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-6 grid grid-cols-2 gap-5">
        <div className="rounded-2xl border border-cm-gold/45 bg-cm-gold/10 p-4">
          <h4 className="font-sans text-[13px] font-extrabold uppercase tracking-[0.12em] text-cm-violet-deep">
            Player motivation
          </h4>
          <div className="mt-3 flex flex-wrap gap-3">
            {concept.values.map((value, index) => (
              <InteractiveCallout
                key={value.title}
                id={`${concept.id}-value-${index}`}
                label={value.title}
                detail={value.body}
                slideKey={slideKey}
                buttonClassName="border-cm-gold/60 bg-white/80"
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-cm-crimson/35 bg-cm-crimson/5 p-4">
          <h4 className="font-sans text-[13px] font-extrabold uppercase tracking-[0.12em] text-cm-crimson">
            Risks
          </h4>
          <div className="mt-3 flex flex-wrap gap-3">
            {concept.risks.map((risk, index) => (
              <InteractiveCallout
                key={risk.title}
                id={`${concept.id}-risk-${index}`}
                label={risk.title}
                detail={risk.body}
                slideKey={slideKey}
                buttonClassName="border-cm-crimson/40 bg-white/80"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
