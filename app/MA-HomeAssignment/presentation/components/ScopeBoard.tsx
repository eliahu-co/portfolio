import { SCOPE_STORIES, type ScopeStory } from '../deckData'
import type { DeckSlideKey } from '../useDeckReset'
import { InteractiveCallout } from './InteractiveCallout'

export type ScopeBoardProps = {
  readonly slideKey: DeckSlideKey
}

type ScopeColumnProps = {
  readonly label: 'In scope' | 'Out of scope'
  readonly stories: readonly ScopeStory[]
  readonly slideKey: DeckSlideKey
  readonly tone: 'in' | 'out'
}

function ScopeColumn({ label, stories, slideKey, tone }: ScopeColumnProps) {
  const isInScope = tone === 'in'

  return (
    <section
      aria-labelledby={`scope-${tone}-heading`}
      className={isInScope
        ? 'rounded-2xl border-2 border-cm-gold/55 bg-cm-gold/10 p-3'
        : 'rounded-2xl border-2 border-cm-crimson/35 bg-cm-crimson/5 p-3'}
    >
      <h3
        id={`scope-${tone}-heading`}
        className={isInScope
          ? 'font-serif text-[26px] font-black text-cm-violet-deep'
          : 'font-serif text-[26px] font-black text-cm-crimson'}
      >
        {label}
      </h3>
      <ul aria-label={label} className="mt-2 grid gap-1">
        {stories.map(({ requirement, rationale }, index) => (
          <li key={requirement}>
            <InteractiveCallout
              id={`scope-${tone}-${index + 1}`}
              label={requirement}
              detail={<p data-scope-rationale>{rationale}</p>}
              slideKey={slideKey}
              className="data-[active=true]:rounded-xl data-[active=true]:bg-[#1E7BA8]/10"
              buttonClassName={isInScope
                ? 'w-full justify-start border-cm-gold/55 bg-white/85 text-left text-[14px] leading-snug'
                : 'w-full justify-start border-cm-crimson/35 bg-white/85 text-left text-[14px] leading-snug'}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}

export function ScopeBoard({ slideKey }: ScopeBoardProps) {
  return (
    <section aria-label="Card Bounty MVP scope board" className="grid grid-cols-2 gap-5">
      <ScopeColumn label="In scope" stories={SCOPE_STORIES.in} slideKey={slideKey} tone="in" />
      <ScopeColumn label="Out of scope" stories={SCOPE_STORIES.out} slideKey={slideKey} tone="out" />
    </section>
  )
}
