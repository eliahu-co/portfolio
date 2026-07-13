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
        lens, reviewed player communities and industry analysis, and used advanced gameplay and the
        official support pages to cover systems I had not yet reached. I compared it with Monopoly GO!
        and Dice Dreams, then looked at Royal Match and Whiteout Survival for cross-genre approaches to
        collections, guarantees, customization, social status, PvP and LiveOps.
      </p>
      <p className="font-sans mt-4 text-[15px] leading-relaxed text-charcoal">
        I considered a daily Card memory challenge, but set it aside because it would add a separate
        game mode to an already dense{' '}
        <a
          href="https://support.coinmastergame.com/hc/en-us/articles/32009776420626-How-can-I-best-strategize-my-daily-routine-in-Coin-Master"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#1E7BA8] underline underline-offset-2 hover:text-cm-crimson transition-colors"
        >
          daily routine
        </a>
        , without a direct path back to the core loop or ARPDAU. I also considered a Pet equipment system, but removed it after discovering that a
        similar mechanic already exists through{' '}
        <a
          href="https://support.coinmastergame.com/hc/en-us/articles/16428340470546-What-are-Pet-Outfits"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#1E7BA8] underline underline-offset-2 hover:text-cm-crimson transition-colors"
        >
          Pet Outfits
        </a>
        .
      </p>
      <p className="font-sans mt-4 text-[15px] leading-relaxed text-charcoal">
        I developed three concepts across different parts of the game. Hometown connects Village
        progression with customization and social visibility. Card Bounty uses collection intent to
        increase Chest demand and Coin consumption. Hot Trail uses loss aversion and urgency to drive
        return sessions and Spin consumption. I then compared them using ARPDAU impact, core-loop fit,
        confidence and effort before expanding the strongest opportunity.
      </p>
    </div>
  )
}
