// app/MA-HomeAssignment/sections/PrototypeDemo.tsx
// Section 8 — Prototype demo. Links to the interactive Card Bounty prototype.

import Section from './Section'
import PrototypePreview from './PrototypePreview'

export default function PrototypeDemo() {
  return (
    <Section id="prototype" eyebrow="Prototype demo" title="Card Bounty, interactive">
      <div className="max-w-2xl flex flex-col gap-4">
        <p className="font-sans text-[14px] leading-relaxed text-charcoal">
          An interactive concept prototype of Card Bounty within Coin Master’s Cards Center. Choose an
          eligible missing Card and open Coin-purchased Chests to fill the Bounty meter. Higher-value
          Chests add more progress; if the Card is not obtained earlier, filling the meter guarantees it.
        </p>
        <PrototypePreview />
      </div>
    </Section>
  )
}
