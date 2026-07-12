// app/MA-HomeAssignment/sections/KeyUnknowns.tsx
// Section — Key unknowns to validate: the feasibility unknowns
// (accuracy / latency / cost) that the MVP is designed to resolve.

import Section from './Section'

const VARIABLES = [
  { label: 'Accuracy', body: 'What confidence threshold should be required before a detected change is surfaced to the user?' },
  { label: 'Latency',  body: 'What response time is required for Hometown to fit naturally into the review submission workflow?' },
  { label: 'Cost',     body: 'Can change validation run on every review initiated while remaining economically viable at project scale?' },
]

export default function KeyUnknowns() {
  return (
    <Section id="unknowns" eyebrow="Feasibility" title="Key Unknowns to Validate">
      <div className="grid md:grid-cols-3 gap-6 max-w-3xl">
        {VARIABLES.map(({ label, body }) => (
          <div key={label}>
            <p className="font-serif text-[18px] text-cm-wood mb-1">{label}</p>
            <p className="font-sans text-[13px] leading-relaxed text-charcoal">{body}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
