// app/MA-HomeAssignment/sections/PrototypeDemo.tsx
// Section 8 — Prototype demo. Links to the interactive Card Bounty prototype.

import Section from './Section'
import DemoVideo from './DemoVideo'

export default function PrototypeDemo() {
  return (
    <Section id="prototype" eyebrow="Prototype demo" title="Card Bounty, interactive">
      <div className="max-w-2xl flex flex-col gap-4">
        <p className="font-sans text-[14px] leading-relaxed text-charcoal">
          An interactive concept prototype of Card Bounty, designed to fit within Coin Master’s Cards
          Center. Choose an eligible missing Card, open Chests to increase its drop chance and fill the
          Bounty meter. If the Card does not drop earlier, completing the meter guarantees it.
        </p>
        <DemoVideo />
        <a
          href="/HA-DrawingAnalyzer/demo"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 self-start font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] text-cm-violet-deep bg-gradient-to-b from-[#FFD95C] to-cm-gold rounded-full px-5 py-2.5 no-underline shadow-[0_3px_0_#B7202E] hover:brightness-105 transition-[filter]"
        >
          Open interactive prototype ↗
        </a>
      </div>
    </Section>
  )
}
