// app/MA-HomeAssignment/sections/Approach.tsx
// Section — Approach: how the assignment was tackled.

import Section from './Section'

export default function Approach() {
  return (
    <Section id="approach" eyebrow="Approach">
      <div className="max-w-2xl flex flex-col gap-3">
        <p className="font-sans text-[14px] leading-relaxed text-charcoal">
          I first mapped Coin Master’s core loop: players use Spins to earn Coins and trigger Attacks
          and Raids, then spend Coins to build Villages and advance. I then mapped the surrounding meta
          systems. Chests feed Card Collections, which return Spins; Pets modify core rewards; social
          systems and LiveOps add goals, competition and reasons to return.
        </p>
        <p className="font-sans text-[14px] leading-relaxed text-charcoal">
          I played Coin Master with a product lens and reviewed official support material, advanced
          gameplay, player communities and industry analysis. I compared it with Monopoly GO! and Dice
          Dreams, then looked at games including Royal Match and Whiteout Survival for cross-genre
          approaches to collections, guarantees, customization, social status, PvP and LiveOps.
        </p>
        <p className="font-sans text-[14px] leading-relaxed text-charcoal">
          I developed concepts across different parts of the game rather than three variations of the
          same mechanic. Card Bounty extends Chests and Card Collections, Hot Trail adds urgency to
          Raids and Spin consumption, and Hometown connects Village progression with customization and
          social visibility. I set aside concepts that introduced a separate game mode without a clear
          path back to the core loop.
        </p>
        <p className="font-sans text-[14px] leading-relaxed text-charcoal">
          I compared the three opportunities using near-term ARPDAU impact, core-loop fit, confidence
          and effort. Card Bounty ranked highest because it builds on established behavior, creates
          measurable Coin demand and can be tested as a bounded LiveOps event. I then expanded it
          through its player flow, monetization logic, connected mechanics, long-term risks, MVP scope
          and measurement plan.
        </p>
      </div>
    </Section>
  )
}
