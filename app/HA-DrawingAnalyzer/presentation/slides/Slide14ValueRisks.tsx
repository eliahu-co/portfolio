// app/HA-DrawingAnalyzer/presentation/slides/Slide14ValueRisks.tsx
import { SlideShell, MiniCard } from '../primitives'
import { USE_CASES, METRICS } from '../deckData'

export default function Slide14ValueRisks() {
  const cv = USE_CASES[0]
  return (
    <SlideShell eyebrow="Change Validation" title="Value, risks, metrics">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <p className="mb-4 font-sans text-[12px] font-bold uppercase tracking-[0.12em] text-black">Value delivered</p>
          <div className="flex flex-col gap-3">
            {cv.value.map((v) => <MiniCard key={v.title} title={v.title} tone="value" primary={v.primary} />)}
          </div>
        </div>
        <div>
          <p className="mb-4 font-sans text-[12px] font-bold uppercase tracking-[0.12em] text-black">Risks</p>
          <div className="flex flex-col gap-3">
            {cv.tradeoffs.map((r) => <MiniCard key={r.title} title={r.title} tone="risk" primary={r.primary} />)}
          </div>
        </div>
        <div>
          <p className="mb-4 font-sans text-[12px] font-bold uppercase tracking-[0.12em] text-black">Metrics</p>
          <div className="flex flex-col gap-3">
            {METRICS.map((m, i) => <MiniCard key={m} title={m} tone="metric" primary={i === 0} />)}
          </div>
        </div>
      </div>
    </SlideShell>
  )
}
