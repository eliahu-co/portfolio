import { ASSUMPTION_STORIES } from '../deckData'
import type { DeckSlideKey } from '../useDeckReset'
import { InteractiveCallout } from './InteractiveCallout'

export type AssumptionGridProps = {
  readonly slideKey: DeckSlideKey
}

export function AssumptionGrid({ slideKey }: AssumptionGridProps) {
  return (
    <section aria-label="Decision assumptions" className="grid grid-cols-3 gap-4">
      {ASSUMPTION_STORIES.map(({ assumption, consequence }, index) => (
        <article
          key={assumption}
          className="rounded-2xl border border-cm-wood/25 bg-white/65 p-3 shadow-[0_8px_22px_rgba(42,27,84,0.07)]"
        >
          <p className="mb-2 font-sans text-[12px] font-extrabold uppercase tracking-[0.12em] text-cm-crimson">
            Assumption {index + 1}
          </p>
          <InteractiveCallout
            id={`assumption-${index + 1}-consequence`}
            label={assumption}
            detail={(
              <p>
                <span className="font-bold text-cm-violet-deep">Decision consequence: </span>
                {consequence}
              </p>
            )}
            slideKey={slideKey}
            buttonClassName="min-h-[112px] w-full items-start justify-start border-cm-wood/30 px-4 py-3 text-left text-[14px] leading-snug"
          />
        </article>
      ))}
    </section>
  )
}
