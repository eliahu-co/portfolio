// app/MA-HomeAssignment/sections/Intro.tsx
// Intro content beneath the hero band, rendered as the first block in <main> so
// it sits in the content column beside the sticky sidebar: the Coin Master
// core-loop diagram, the framing paragraph, and the table of selected features.
// Content strings match the HA-DrawingAnalyzer original.

import CoreLoopDiagram from './CoreLoopDiagram'

const FEATURES: { feature: string; motive: string }[] = [
  { feature: 'Hometown',                           motive: 'Customization mechanic' },
  { feature: 'Card Bounty',                        motive: 'Collection' },
  { feature: 'Cross-Discipline Coordination Lock', motive: '—' },
]

export default function Intro() {
  return (
    <div id="hero" className="scroll-mt-8 max-w-2xl mb-14">
      <CoreLoopDiagram />

      <p className="font-sans pt-8 text-[15px] leading-relaxed text-charcoal">
        The following features were selected to represent different points of view across the
        construction lifecycle—from designers and field teams to owners—while spanning multiple
        project phases and workflows. Together they illustrate the breadth of opportunities
        that become possible when construction drawings are transformed from static documents into
        structured, queryable project data.
      </p>

      <table className="w-full border-collapse text-left mt-6">
        <thead>
          <tr className="border-b border-charcoal/15">
            <th className="font-sans text-[9px] uppercase tracking-[0.12em] text-charcoal/70 py-2 pr-4">Feature</th>
            <th className="font-sans text-[9px] uppercase tracking-[0.12em] text-charcoal/70 py-2 pl-4">Monetization motive</th>
          </tr>
        </thead>
        <tbody>
          {FEATURES.map(({ feature, motive }, i) => (
            <tr key={feature} className="border-b border-charcoal/15">
              <td className="font-sans text-[13px] text-charcoal py-2.5 pr-4">
                <span className="mr-1.5">{i + 1}.</span>{feature}
              </td>
              <td className="font-sans text-[13px] text-charcoal py-2.5 pl-4">{motive}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
