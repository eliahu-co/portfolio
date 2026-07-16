import { CONCEPTS, type PresentationConcept } from '../deckData'
import type { DeckSlideKey } from '../useDeckReset'
import { InteractiveCallout } from './InteractiveCallout'

export type ConceptOverviewProps = {
  readonly concepts?: readonly PresentationConcept[]
  readonly slideKey: DeckSlideKey
}

export function ConceptOverview({
  concepts = CONCEPTS,
  slideKey,
}: ConceptOverviewProps) {
  return (
    <section aria-label="Three product concepts" className="grid grid-cols-3 gap-5">
      {concepts.map((concept) => (
        <article
          key={concept.id}
          className="flex min-h-[390px] flex-col rounded-2xl border-2 border-cm-wood/30 bg-white/70 p-6 shadow-[0_10px_28px_rgba(42,27,84,0.09)]"
        >
          <h3 className="font-serif text-[30px] font-black leading-tight text-cm-violet-deep">
            {concept.title}
          </h3>
          <p className="mt-4 font-sans text-[17px] font-bold leading-relaxed text-[#1A1A1A]">
            {concept.thesis}
          </p>
          <p className="mt-4 font-sans text-[14px] leading-relaxed text-charcoal">
            {concept.monetizationSummary}
          </p>

          <InteractiveCallout
            id={`overview-${concept.id}`}
            label={`Preview ${concept.title} loop`}
            detail={(
              <div>
                <p className="font-bold text-cm-violet-deep">{concept.loop.stat}</p>
                <p className="mt-1">{concept.loop.steps.map(({ label }) => label).join(' → ')}</p>
              </div>
            )}
            slideKey={slideKey}
            className="mt-auto pt-5"
            buttonClassName="w-full justify-center"
          />
        </article>
      ))}
    </section>
  )
}
