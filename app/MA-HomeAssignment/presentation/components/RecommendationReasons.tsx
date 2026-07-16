import { RECOMMENDATION } from '../deckData'
import type { DeckSlideKey } from '../useDeckReset'
import { InteractiveCallout } from './InteractiveCallout'

export type RecommendationReasonsProps = {
  readonly slideKey: DeckSlideKey
}

export function RecommendationReasons({ slideKey }: RecommendationReasonsProps) {
  return (
    <section aria-label="Card Bounty recommendation">
      <p
        data-recommendation-conclusion="true"
        className="rounded-2xl border-2 border-cm-gold/60 bg-cm-gold/15 px-6 py-4 font-sans text-[21px] font-bold leading-snug text-cm-violet-deep shadow-[0_10px_26px_rgba(42,27,84,0.08)]"
      >
        Card Bounty is the strongest next bet: it extends familiar Chest and Collection behavior,
        creates additional Coin demand, and can be validated as a bounded, repeatable LiveOps event.
      </p>

      <div className="mt-5 grid grid-cols-3 gap-4" aria-label="Recommendation evidence">
        {RECOMMENDATION.evidence.map(({ reason, evidence }, index) => (
          <InteractiveCallout
            key={reason}
            id={`recommendation-evidence-${index + 1}`}
            label={reason}
            detail={evidence}
            slideKey={slideKey}
            buttonClassName="w-full justify-center border-cm-gold/55 bg-white/80 text-[16px]"
          />
        ))}
      </div>

      <aside className="mt-5 rounded-2xl border-2 border-cm-crimson/35 bg-cm-crimson/5 px-5 py-4">
        <div className="grid grid-cols-[0.68fr_1.32fr] items-start gap-5">
          <InteractiveCallout
            id="recommendation-risk-detail"
            label={RECOMMENDATION.risk.reason}
            detail={(
              <div>
                <p>{RECOMMENDATION.risk.evidence}</p>
                <p className="mt-2 font-bold text-cm-violet-deep">
                  Mitigation: {RECOMMENDATION.risk.mitigation}
                </p>
              </div>
            )}
            slideKey={slideKey}
            buttonClassName="w-full justify-center border-cm-crimson/50 bg-white/80 text-cm-crimson"
          />
          <div
            data-recommendation-risk-summary="true"
            className="font-sans text-[15px] leading-relaxed text-charcoal"
          >
            <p>{RECOMMENDATION.risk.evidence}</p>
            <p className="mt-2 font-bold text-cm-violet-deep">
              Mitigation direction: {RECOMMENDATION.risk.mitigation}
            </p>
          </div>
        </div>
      </aside>
    </section>
  )
}
