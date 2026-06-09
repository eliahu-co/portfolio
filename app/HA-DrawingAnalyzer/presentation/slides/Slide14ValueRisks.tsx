// app/HA-DrawingAnalyzer/presentation/slides/Slide14ValueRisks.tsx
'use client'

import { useState } from 'react'
import { SlideShell, MiniCard } from '../primitives'
import { USE_CASES, METRICS, RISK_MITIGATIONS, VALUE_LABELS } from '../deckData'

const HEADING = 'mb-4 font-sans text-[12px] font-bold uppercase tracking-[0.12em] text-black'

export default function Slide14ValueRisks() {
  const cv = USE_CASES[0]
  // hovering a metric or a risk focuses it: its sentence shows below, the rest dims
  const [metric, setMetric] = useState<number | null>(null)
  const [risk, setRisk] = useState<number | null>(null)
  const focused = metric !== null || risk !== null

  return (
    <SlideShell eyebrow="Change Validation" title="Value, risks, metrics">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div className={`transition-opacity duration-300 ${focused ? 'opacity-20' : ''}`}>
          <p className={HEADING}>Value delivered</p>
          <div className="flex flex-col gap-3">
            {cv.value.map((v) => <MiniCard key={v.title} title={VALUE_LABELS[v.title] ?? v.title} tone="value" primary={v.primary} />)}
          </div>
        </div>

        <div className="flex flex-col">
          <p className={`${HEADING} transition-opacity duration-300 ${focused ? 'opacity-20' : ''}`}>Risks</p>
          <div className="flex flex-col gap-3">
            {cv.tradeoffs.map((r, i) => (
              <div
                key={r.title}
                onMouseEnter={() => setRisk(i)}
                onMouseLeave={() => setRisk(null)}
                className={`transition-opacity duration-300 ${focused && risk !== i ? 'opacity-20' : ''}`}
              >
                <MiniCard title={r.title} tone="risk" primary={r.primary} />
              </div>
            ))}
          </div>
          {/* mitigation of the hovered risk, pinned at the bottom of the column */}
          <div className="mt-6 min-h-[4rem]">
            {risk !== null && (
              <p className="font-sans text-[13px] leading-relaxed text-black">
                <span className="mr-2 font-bold uppercase tracking-[0.08em]">Mitigation</span>
                {RISK_MITIGATIONS[cv.tradeoffs[risk].title]}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <p className={`${HEADING} transition-opacity duration-300 ${focused ? 'opacity-20' : ''}`}>Metrics</p>
          <div className="flex flex-col gap-3">
            {METRICS.map((m, i) => (
              <div
                key={m.title}
                onMouseEnter={() => setMetric(i)}
                onMouseLeave={() => setMetric(null)}
                className={`transition-opacity duration-300 ${focused && metric !== i ? 'opacity-20' : ''}`}
              >
                <MiniCard title={m.title} tone="metric" tag={m.type} primary={i === 0} />
              </div>
            ))}
          </div>
          {/* success signal of the hovered metric, pinned at the bottom of the column */}
          <div className="mt-6 min-h-[4rem]">
            {metric !== null && (
              <p className="font-sans text-[13px] leading-relaxed text-black">
                <span className="mr-2 font-bold uppercase tracking-[0.08em]">Success signal</span>
                {METRICS[metric].signal}
              </p>
            )}
          </div>
        </div>
      </div>
    </SlideShell>
  )
}
