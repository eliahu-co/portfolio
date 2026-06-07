// app/HA-DrawingAnalyzer/presentation/slides/Slide03Approach.tsx
import { SlideShell } from '../primitives'
import { LIFECYCLE_PHASES, LIFECYCLE_GROUPS, APPROACH_FLOW } from '../deckData'

const COLS = LIFECYCLE_PHASES.length
const gridCols = { gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }

export default function Slide03Approach() {
  return (
    <SlideShell eyebrow="Approach">
      <div className="my-24">
        {/* Stage grouping brackets */}
        <div className="grid gap-x-3" style={gridCols}>
          {LIFECYCLE_GROUPS.map((g) => (
            <div
              key={g.label}
              style={{ gridColumn: `${g.start + 1} / span ${g.span}` }}
              className={`flex flex-col items-center transition-opacity ${g.muted ? 'opacity-30' : ''}`}
            >
              <span className="mb-1.5 text-center font-sans text-[10px] font-medium uppercase tracking-[0.1em] text-black">
                {g.label}
              </span>
              {/* downward-opening bracket spanning the stage */}
              <div className="h-2.5 w-full rounded-t-sm border-x-2 border-t-2 border-black" />
            </div>
          ))}
        </div>

        {/* Phase circles + names */}
        <div className="mt-7 grid items-start gap-x-3" style={gridCols}>
          {LIFECYCLE_PHASES.map((p) => (
            <div key={p.initials} className={`flex flex-col items-center transition-opacity ${p.muted ? (p.initials === 'BP' ? 'opacity-50' : 'opacity-30') : ''}`}>
              <div className="grid aspect-square w-full max-w-[84px] place-items-center rounded-full border-2 border-black">
                <span className="font-sans text-[clamp(16px,1.8vw,24px)] font-bold tracking-wide text-black">{p.initials}</span>
              </div>
              <span className="mt-2.5 max-w-[100px] text-center font-sans text-[10px] uppercase leading-tight tracking-[0.08em] text-charcoal">
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Method flow */}
      <div className="flex flex-wrap items-center gap-3">
        {APPROACH_FLOW.map((f, i) => (
          <span key={f} className="flex items-center gap-3">
            <span className="text-[22px] font-semibold text-black">{f}</span>
            {i < APPROACH_FLOW.length - 1 && <span className="text-black" aria-hidden="true">→</span>}
          </span>
        ))}
      </div>
    </SlideShell>
  )
}
