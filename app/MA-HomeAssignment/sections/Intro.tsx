// app/MA-HomeAssignment/sections/Intro.tsx
// Intro content beneath the hero band, rendered as the first block in <main> so
// it sits in the content column beside the sticky sidebar: the Coin Master
// core-loop diagram and the framing paragraphs.

import CoreLoopDiagram from './CoreLoopDiagram'

export default function Intro() {
  return (
    <div id="hero" className="scroll-mt-8 max-w-2xl mb-14">
      <p className="font-sans text-[15px] leading-relaxed text-charcoal mb-8">
        Coin Master’s core loop starts with Spins: players use them to generate Coins and other
        outcomes, then spend Coins to build Villages and advance. Attacks and Raids are also triggered
        through Spins and extend the loop into PvP. Chests feed Card Collections, and completed
        Collections return Spins. Pets modify rewards, while social systems and LiveOps add goals,
        competition, urgency and additional rewards to existing actions. Gems provide premium
        acceleration.
      </p>

      <CoreLoopDiagram />

      <p className="font-sans pt-3 text-[15px] leading-relaxed text-charcoal">
        With these loops mapped, I looked for opportunities that could increase ARPDAU through greater
        resource demand, payer conversion or a new spend surface. I played Coin Master with a product
        lens and reviewed official support material, advanced gameplay, player communities and industry
        analysis. I compared it with Monopoly GO! and Dice Dreams, then looked at Royal Match and
        Whiteout Survival for cross-genre approaches to collections, guarantees, customization, social
        status, PvP and LiveOps. I set aside concepts that introduced a separate game mode without a
        clear path back to the core loop.
      </p>
      <p className="font-sans mt-4 text-[15px] leading-relaxed text-charcoal">
        I developed three concepts across different parts of the game. Hometown connects Village
        progression with customization and social visibility. Card Bounty uses collection intent to
        increase Chest demand and Coin consumption. Hot Trail uses loss aversion and urgency to drive
        return sessions and Spin consumption. I then compared them using ARPDAU impact,
        core-loop fit, confidence and effort before expanding the strongest opportunity.
      </p>
    </div>
  )
}
