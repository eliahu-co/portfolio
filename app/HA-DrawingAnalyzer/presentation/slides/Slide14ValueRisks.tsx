// app/HA-DrawingAnalyzer/presentation/slides/Slide14ValueRisks.tsx
'use client'

import { useState } from 'react'
import { SlideShell, MiniCard } from '../primitives'
import { USE_CASES, METRICS } from '../deckData'

const HEADING = 'mb-4 font-sans text-[12px] font-bold uppercase tracking-[0.12em] text-black'

export default function Slide14ValueRisks() {
  const cv = USE_CASES[0]
  // hovering a metric focuses it: its success signal shows below, the rest dims
  const [hovered, setHovered] = useState<number | null>(null)
  const focused = hovered !== null

  return (
    <SlideShell eyebrow="Change Validation" title="Value, risks, metrics">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div className={`transition-opacity duration-300 ${focused ? 'opacity-20' : ''}`}>
          <p className={HEADING}>Value delivered</p>
          <div className="flex flex-col gap-3">
            {cv.value.map((v) => <MiniCard key={v.title} title={v.title} tone="value" primary={v.primary} />)}
          </div>
        </div>

        <div className={`transition-opacity duration-300 ${focused ? 'opacity-20' : ''}`}>
          <p className={HEADING}>Risks</p>
          <div className="flex flex-col gap-3">
            {cv.tradeoffs.map((r) => <MiniCard key={r.title} title={r.title} tone="risk" primary={r.primary} />)}
          </div>
        </div>

        <div className="flex flex-col">
          <p className={`${HEADING} transition-opacity duration-300 ${focused ? 'opacity-20' : ''}`}>Metrics</p>
          <div className="flex flex-col gap-3">
            {METRICS.map((m, i) => (
              <div
                key={m.title}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={`transition-opacity duration-300 ${focused && hovered !== i ? 'opacity-20' : ''}`}
              >
                <MiniCard title={m.title} tone="metric" tag={m.type} primary={i === 0} />
              </div>
            ))}
          </div>
          {/* success signal of the hovered metric, pinned at the bottom of the column */}
          <div className="mt-6 min-h-[4rem]">
            {hovered !== null && (
              <p className="font-sans text-[13px] leading-relaxed text-black">
                <span className="mr-2 font-bold uppercase tracking-[0.08em]">Success signal</span>
                {METRICS[hovered].signal}
              </p>
            )}
          </div>
        </div>
      </div>
    </SlideShell>
  )
}
