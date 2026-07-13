// app/MA-HomeAssignment/sections/Intro.tsx
// Intro content beneath the hero band, rendered as the first block in <main> so
// it sits in the content column beside the sticky sidebar: the Coin Master
// core-loop diagram and the framing paragraphs.

import CoreLoopDiagram from './CoreLoopDiagram'

export default function Intro() {
  return (
    <div id="hero" className="scroll-mt-8 max-w-2xl mb-14">
      <p className="font-sans text-[15px] leading-relaxed text-charcoal mb-8">
        Coin Master’s economy follows a reinforcing loop: players use Spins to earn Coins and use
        Coins to progress through Villages. Meta and LiveOps features add goals and return Spins and
        other resources to the loop, while Gems provide premium acceleration. Progression, collection,
        status, social competition, and time-limited urgency create repeated reasons to return and spend.
      </p>

      <CoreLoopDiagram />

      <p className="font-sans pt-3 text-[15px] leading-relaxed text-charcoal">
        The three concepts create new spending opportunities by applying these motivations to
        different parts of the game. Hometown connects customization and status to Village
        progression; Card Bounty builds on collection completion to increase Chest demand and Coin
        consumption; and Hot Trail uses loss-aversion and urgency to drive additional sessions and
        Spin consumption. Together, they target
        distinct ARPDAU opportunities across the core loop, meta, and LiveOps.
      </p>
    </div>
  )
}
