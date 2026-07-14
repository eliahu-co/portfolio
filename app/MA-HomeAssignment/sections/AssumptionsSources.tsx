// app/MA-HomeAssignment/sections/AssumptionsSources.tsx
// Section 10 — Assumptions & sources.

import Section from './Section'

const ASSUMPTIONS = [
  'Incremental ARPDAU is the target outcome. Engagement, DAU and Coin or Spin consumption are supporting signals and are only valuable here if they contribute to incremental revenue.',
  'New features should extend familiar mechanics and player behavior rather than replace the core loop.',
  'Existing systems can support new LiveOps and persistent features, player segmentation and controlled testing.',
  'I did not have access to Moon Active’s internal product and economy data, player segmentation, roadmap or development estimates. Prioritization scores and balance assumptions are therefore directional; test benchmarks would be set using comparable historical events.',
  'An ARPDAU lift should not come at the expense of long-term demand, Village progression, player trust or the wider game economy.',
  'Considering that feature availability may vary by Village, cohort, region and active experiment, this analysis reflects the version I accessed and publicly available information.',
]

export default function AssumptionsSources() {
  return (
    <Section id="assumptions" eyebrow="Assumptions">
      <div className="max-w-2xl">
        <ul className="flex flex-col gap-1.5">
          {ASSUMPTIONS.map((a, i) => (
            <li key={i} className="font-sans text-[14px] leading-relaxed text-charcoal">
              {a}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
