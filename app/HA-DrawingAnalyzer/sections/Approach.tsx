// app/HA-DrawingAnalyzer/sections/Approach.tsx
// Section — Approach: how the assignment was tackled.

import Section from './Section'

export default function Approach() {
  return (
    <Section id="approach" eyebrow="Approach">
      <div className="max-w-2xl flex flex-col gap-3">
        <p className="font-sans text-[14px] leading-relaxed text-charcoal">
          I first mapped the major phases of the construction lifecycle and the workflows that exist
          within and between them. From there, I identified workflow bottlenecks that could potentially
          benefit from transforming drawings into structured, queryable project data.
        </p>
        <p className="font-sans text-[14px] leading-relaxed text-charcoal">
          I explored a broad set of opportunities and then narrowed the scope to workflows where
          understanding objects, relationships, and changes within drawings appeared to create unique
          value. I intentionally excluded areas such as code compliance, which require a higher level
          of accuracy and regulatory confidence than I could reasonably assume for an MVP, as well as
          bidding workflows, where stakeholders often have competing incentives.
        </p>
        <p className="font-sans text-[14px] leading-relaxed text-charcoal">
          The resulting use cases span design review, construction execution, coordination, and owner
          governance, allowing evaluation of the AI Drawing Analyzer across different users, project
          phases, and business outcomes. Each use case was analyzed using a common framework to enable
          apples-to-apples comparison during prioritization.
        </p>
      </div>
    </Section>
  )
}
