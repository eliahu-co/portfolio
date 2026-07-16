import { CONCEPTS } from '../deckData'
import type { DeckSlideKey } from '../useDeckReset'
import { InteractiveCallout } from './InteractiveCallout'

const SYSTEMS = [
  {
    name: 'Spins',
    detail: 'Spins are the core input: they resolve actions that produce Coins and PvP outcomes.',
  },
  {
    name: 'Coins',
    detail: 'Coins carry earned value into Village upgrades and Chest purchases.',
  },
  {
    name: 'Villages',
    detail: 'Villages consume Coins, express progression, and unlock the next cycle of play.',
  },
  {
    name: 'Chests',
    detail: 'Chests convert Coins into randomized Cards and near-completion intent.',
  },
  {
    name: 'Collections',
    detail: 'Collections turn Cards into goals and return Spins when a set is completed.',
  },
  {
    name: 'LiveOps',
    detail: 'LiveOps creates bounded urgency around familiar resources, goals, and offers.',
  },
  {
    name: 'Social',
    detail: 'Social visibility gives progression, ownership, gifting, and reactions an audience.',
  },
  {
    name: 'PvP',
    detail: 'Raids create the loss trigger, target relationship, and emotional reason to return.',
  },
] as const

const RELATIONSHIPS = [
  'Spins → Coins',
  'Coins → Villages',
  'Coins → Chests',
  'Chests → Collections',
  'Collections → Spins',
  'LiveOps → resource demand',
  'Social → ownership & status',
  'PvP → loss & re-engagement',
] as const

export function EconomyMap({ slideKey }: { readonly slideKey: DeckSlideKey }) {
  return (
    <section aria-label="Coin Master economy map" className="grid grid-cols-[1fr_0.8fr] gap-6">
      <div>
        <div className="grid grid-cols-4 gap-3" aria-label="Economy systems">
          {SYSTEMS.map((system) => (
            <InteractiveCallout
              key={system.name}
              id={`economy-${system.name.toLowerCase()}`}
              label={system.name}
              detail={system.detail}
              slideKey={slideKey}
              buttonClassName="w-full justify-center border-cm-wood/35 bg-white/80 text-[16px]"
            />
          ))}
        </div>

        <ul
          aria-label="Visible economy relationships"
          className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 rounded-2xl border border-cm-wood/25 bg-white/55 p-4"
        >
          {RELATIONSHIPS.map((relationship) => (
            <li
              key={relationship}
              className="font-sans text-[14px] font-bold leading-relaxed text-cm-violet-deep"
            >
              {relationship}
            </li>
          ))}
        </ul>
      </div>

      <aside aria-label="ARPDAU paths" className="flex flex-col gap-3">
        {CONCEPTS.map((concept, index) => (
          <div
            key={concept.id}
            className="rounded-2xl border-2 border-cm-gold/45 bg-cm-gold/10 px-5 py-4 shadow-[0_8px_24px_rgba(42,27,84,0.08)]"
          >
            <p className="font-sans text-[12px] font-extrabold uppercase tracking-[0.12em] text-cm-crimson">
              ARPDAU path {index + 1}
            </p>
            <p className="mt-1 font-serif text-[20px] font-black leading-tight text-cm-violet-deep">
              {concept.arpdauPath}
            </p>
            <p className="mt-2 font-sans text-[14px] leading-relaxed text-charcoal">
              {concept.monetizationSummary}
            </p>
          </div>
        ))}
      </aside>
    </section>
  )
}
