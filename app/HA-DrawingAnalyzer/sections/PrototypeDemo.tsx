// app/HA-DrawingAnalyzer/sections/PrototypeDemo.tsx
// Section 8 — Prototype demo. Links to the interactive Change Validation
// prototype (a full-screen route that simulates the flow inside Autodesk Forma).

import Section from './Section'

export default function PrototypeDemo() {
  return (
    <Section id="prototype" eyebrow="Prototype demo" title="Change Validation, interactive">
      <div className="max-w-2xl flex flex-col gap-4">
        <p className="font-sans text-[14px] leading-relaxed text-charcoal">
          An interactive concept prototype of the Change Validation flow, built to feel embedded in
          Autodesk Forma / ACC: upload a revised drawing, run change validation before submission,
          review the detected object-level changes on a two-pane plan compare, and submit for review.
        </p>
        <a
          href="/HA-DrawingAnalyzer/demo"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 self-start font-sans text-[12px] font-semibold uppercase tracking-[0.08em] text-white bg-autodesk-blue rounded-sm px-4 py-2.5 no-underline hover:opacity-90 transition-opacity"
        >
          Open interactive prototype ↗
        </a>
        <p className="font-sans text-[11px] text-charcoal/70">Best viewed on desktop.</p>
      </div>
    </Section>
  )
}
