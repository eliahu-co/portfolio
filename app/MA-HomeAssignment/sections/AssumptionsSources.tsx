// app/MA-HomeAssignment/sections/AssumptionsSources.tsx
// Section 10 — Assumptions & sources.

import Section from './Section'

const ASSUMPTIONS = [
  'Incremental ARPDAU is the target outcome. Engagement, DAU and virtual-currency spend are supporting measures, not outcomes on their own.',
  'Higher Coin or Spin consumption can increase ARPDAU by creating demand for existing offers, but only if total revenue increases.',
  'New features should extend familiar mechanics and player behavior rather than replace the core loop.',
  'Existing systems can support new LiveOps and persistent features, player segmentation and controlled testing.',
  'Feature availability and player experience may vary by Village, cohort, region and active experiment. The analysis reflects the version I accessed and publicly available information.',
  'I did not have access to Moon Active’s internal economy, segmentation, roadmap or development estimates. Prioritization scores, benchmarks and balance decisions are therefore directional.',
  'An ARPDAU lift should not come at the expense of long-term demand, Village progression, player trust or the wider game economy.',
]

export default function AssumptionsSources() {
  return (
    <Section id="assumptions" eyebrow="Assumptions">
      <div className="max-w-2xl">
        <ul className="flex flex-col gap-1.5">
          {ASSUMPTIONS.map((a, i) => (
            <li key={i} className="font-sans text-[14px] leading-relaxed text-charcoal flex gap-2">
              <span className="text-cm-gold mt-1 shrink-0">—</span>
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
