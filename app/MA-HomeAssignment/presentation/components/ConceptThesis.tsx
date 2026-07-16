import type { PresentationConcept } from '../deckData'
import type { DeckSlideKey } from '../useDeckReset'
import { InteractiveCallout } from './InteractiveCallout'

export type ConceptThesisProps = {
  readonly concept: PresentationConcept
  readonly slideKey: DeckSlideKey
}

export function ConceptThesis({ concept, slideKey }: ConceptThesisProps) {
  return (
    <section
      aria-label={`${concept.title} concept thesis`}
      className="grid grid-cols-[1.08fr_0.92fr] items-center gap-8"
    >
      <figure className="overflow-hidden rounded-[28px] border-2 border-cm-wood/45 bg-white shadow-[0_14px_34px_rgba(42,27,84,0.14)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={concept.mockup}
          alt={`${concept.title} concept mockup`}
          className="block h-[440px] w-full object-contain"
        />
      </figure>

      <div>
        <h3 className="font-serif text-[44px] font-black leading-[1.02] text-cm-violet-deep">
          {concept.title}
        </h3>
        <p className="mt-5 font-sans text-[23px] font-bold leading-snug text-[#1A1A1A]">
          {concept.thesis}
        </p>
        <p className="mt-4 border-l-4 border-cm-gold pl-4 font-sans text-[16px] leading-relaxed text-charcoal">
          {concept.monetizationSummary}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3" aria-label={`${concept.title} thesis details`}>
          {concept.reveals.map((reveal, index) => (
            <InteractiveCallout
              key={reveal.label}
              id={`${concept.id}-thesis-${index}`}
              label={reveal.label}
              detail={reveal.detail}
              slideKey={slideKey}
              buttonClassName="w-full justify-center"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
