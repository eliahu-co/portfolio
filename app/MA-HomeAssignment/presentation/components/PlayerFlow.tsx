import { PLAYER_FLOW } from '../deckData'
import type { DeckSlideKey } from '../useDeckReset'
import { InteractiveCallout } from './InteractiveCallout'

export type PlayerFlowProps = {
  readonly slideKey: DeckSlideKey
}

export function PlayerFlow({ slideKey }: PlayerFlowProps) {
  return (
    <section aria-label="Card Bounty player journey">
      <ol
        aria-label="Card Bounty player flow"
        className="grid grid-cols-6 items-start gap-3"
      >
        {PLAYER_FLOW.map(({ label, branchNote }, index) => (
          <li key={label} className="relative min-w-0" data-flow-stage={index + 1}>
            <p className="mb-2 font-sans text-[12px] font-extrabold uppercase tracking-[0.12em] text-cm-crimson">
              Stage {index + 1}
            </p>
            <InteractiveCallout
              id={`card-bounty-flow-${index + 1}`}
              label={label}
              detail={<p data-flow-branch-note>{branchNote}</p>}
              slideKey={slideKey}
              className="rounded-2xl p-1 transition-colors data-[active=true]:bg-[#1E7BA8]/15 data-[active=true]:shadow-[0_0_0_2px_rgba(30,123,168,0.45)]"
              buttonClassName="min-h-[92px] w-full justify-center border-cm-wood/45 bg-white/85 px-3 text-center text-[14px] leading-snug"
            />
            {index < PLAYER_FLOW.length - 1 && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-[13px] top-[76px] z-10 text-[20px] font-black text-[#1E7BA8]"
              >
                →
              </span>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
