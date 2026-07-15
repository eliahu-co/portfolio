// app/MA-HomeAssignment/sections/Intro.tsx
// Intro content beneath the hero band, rendered as the first block in <main> so
// it sits in the content column beside the sticky sidebar: the Coin Master
// core-loop diagram and the framing paragraphs.

import CoreLoopDiagram from './CoreLoopDiagram'

export default function Intro() {
  return (
    <div id="hero" className="scroll-mt-8 mb-14">
      <p className="font-sans text-[14px] leading-relaxed text-charcoal mb-8">
        Coin Master’s core loop starts with Spins, which generate Coins and trigger rewards, Attacks
        and Raids. Coins advance Villages; Chests feed Card Collections, whose rewards return Spins.
        Pets modify rewards, social systems and LiveOps add goals, competition and urgency.
      </p>

      <CoreLoopDiagram />

      <p className="font-sans pt-3 text-[14px] leading-relaxed text-charcoal">
        I played the game and used official support pages, advanced gameplay, player communities and industry analysis to
        cover systems that I had not reached yet. I compared Coin Master with Monopoly GO! and Dice
        Dreams, then reviewed Royal Match and Whiteout Survival for transferable collection, guarantee,
        customization, social, PvP and LiveOps mechanics.
      </p>
      <p className="font-sans mt-4 text-[14px] leading-relaxed text-charcoal">
        The exploration led me to a Daily Card Memory challenge, but it would add another gameplay
        mode to an already dense{' '}
        <a
          href="https://support.coinmastergame.com/hc/en-us/articles/32009776420626-How-can-I-best-strategize-my-daily-routine-in-Coin-Master"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#1E7BA8] underline underline-offset-2 hover:text-cm-crimson transition-colors"
        >
          daily routine
        </a>
        {' '}without a clear path to ARPDAU. A Pet equipment concept was also dropped after I found
        that it overlapped with existing{' '}
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
      <p className="font-sans mt-4 text-[14px] leading-relaxed text-charcoal">
        The three selected concepts target different paths to ARPDAU growth: a new spend surface,
        increased resource demand and more purchase opportunities through re-engagement.
      </p>
    </div>
  )
}
