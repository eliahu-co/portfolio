// app/HA-DrawingAnalyzer/presentation/ExecWorkflow.tsx
// Executive Current-vs-Proposed workflow, styled like the workflow lanes on
// /HA-DrawingAnalyzer (bordered step boxes + SVG down-arrow connectors + a serif
// lane footer). Recreated here so no existing site file is touched.

export type ExecStep = { label: string; kind?: 'ai' | 'approve' }
export type ExecLane = { steps: ExecStep[]; footer: string }

// Down-arrow connector — same geometry as the site's Connector.
function Connector({ proposed }: { proposed: boolean }) {
  const color = proposed ? 'rgba(6,150,215,0.7)' : 'rgba(102,102,102,0.45)'
  return (
    <div className="flex justify-center py-1">
      <svg width="14" height="16" viewBox="0 0 14 15" fill="none" aria-hidden="true" style={{ display: 'block' }}>
        <path d="M7 0 V14" stroke={color} strokeWidth="1" strokeLinecap="round" />
        <path d="M2 10 L7 14 L12 10" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function Step({ step, proposed }: { step: ExecStep; proposed: boolean }) {
  const kind = step.kind
  const box =
    kind === 'ai'
      ? 'border-autodesk-blue/50 bg-autodesk-blue/10'
      : proposed
        ? 'border-autodesk-blue/30 bg-white'
        : 'border-charcoal/25 bg-white'
  const glyph = kind === 'ai' ? '⚡︎' : kind === 'approve' ? '✓' : null
  const glyphColor = kind === 'ai' || proposed ? 'text-autodesk-blue' : 'text-charcoal'
  const label = kind ? 'font-medium text-black' : 'text-charcoal'
  return (
    <div className={`flex items-center gap-2 rounded-sm border px-3 py-2 ${box}`}>
      {glyph && <span className={`shrink-0 text-[13px] leading-none ${glyphColor}`} aria-hidden="true">{glyph}</span>}
      <span className={`font-sans text-[12px] leading-snug ${label}`}>{step.label}</span>
    </div>
  )
}

function Lane({ lane, proposed }: { lane: ExecLane; proposed: boolean }) {
  const accent = proposed ? 'text-autodesk-blue' : 'text-charcoal'
  return (
    <div className="flex h-full flex-col">
      <p className={`mb-3 font-sans text-[10px] uppercase tracking-[0.12em] ${accent}`}>
        {proposed ? 'Proposed' : 'Current'}
      </p>
      <div className="flex flex-col">
        {lane.steps.map((s, i) => (
          <div key={i}>
            <Step step={s} proposed={proposed} />
            {i < lane.steps.length - 1 && <Connector proposed={proposed} />}
          </div>
        ))}
      </div>
      <p className={`mt-auto pt-4 font-serif text-[15px] ${accent}`}>{lane.footer}</p>
    </div>
  )
}

export default function ExecWorkflow({ current, proposed }: { current: ExecLane; proposed: ExecLane }) {
  return (
    <div className="grid grid-cols-2 items-stretch gap-x-5">
      <Lane lane={current} proposed={false} />
      <Lane lane={proposed} proposed />
    </div>
  )
}
