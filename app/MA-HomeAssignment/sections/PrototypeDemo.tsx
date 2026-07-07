// app/MA-HomeAssignment/sections/PrototypeDemo.tsx
// Section 8 — Prototype demo. Links to the interactive Change Validation
// prototype (a full-screen route that simulates the flow inside Autodesk Forma).

import Section from './Section'
import DemoVideo from './DemoVideo'

export default function PrototypeDemo() {
  return (
    <Section id="prototype" eyebrow="Prototype demo" title="Change Validation, interactive">
      <div className="max-w-2xl flex flex-col gap-4">
        <p className="font-sans text-[14px] leading-relaxed text-charcoal">
          An interactive concept prototype of Change Validation, designed to feel embedded within
          Autodesk Forma. Upload a revised drawing, validate detected object-level changes before
          submission, and submit a higher-quality revision for review.
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
        <p className="font-sans text-[11px] uppercase tracking-[0.08em] text-charcoal/70">Only available on desktop</p>
      </div>
    </Section>
  )
}
