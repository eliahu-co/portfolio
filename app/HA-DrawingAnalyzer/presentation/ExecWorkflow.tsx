// app/HA-DrawingAnalyzer/presentation/ExecWorkflow.tsx
// Executive Current-vs-Proposed workflow, faithfully matching the workflow lanes
// on /HA-DrawingAnalyzer: bordered step boxes, emphasis (border-2 + bold) on the
// outcome step, the AI step with a blue glow + bold ⚡ + "DA" pill, and SVG
// down-arrow connectors. Recreated here so no existing site file is edited.

export type ExecStep = { label: string; kind?: 'ai' | 'approve' | 'repeat'; actor?: string }
export type ExecLane = { steps: ExecStep[]; footer: string }

// Down-arrow connector — same geometry as the site's Connector.
function Connector({ proposed }: { proposed: boolean }) {
  const color = proposed ? '#000000' : 'rgba(102,102,102,0.6)'
  return (
    <div className="flex justify-center">
      <svg width="14" height="15" viewBox="0 0 14 15" fill="none" aria-hidden="true" style={{ display: 'block' }}>
        <path d="M7 0 V14" stroke={color} strokeWidth="1" strokeLinecap="round" />
        <path d="M2 10 L7 14 L12 10" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function Step({ step, proposed }: { step: ExecStep; proposed: boolean }) {
  const kind = step.kind
  const isEmphasis = kind === 'approve'

  let box = proposed ? 'bg-[#c9c9c9] border-black/55' : 'bg-[#c9c9c9] border-charcoal/40'
  if (kind === 'ai') box = 'bg-[#ffff00] border-black'
  else if (kind === 'approve') box = 'bg-[#c9c9c9] border-black'

  const borderW = isEmphasis || kind === 'ai' ? 'border-2' : 'border'
  const labelColor = kind === 'ai' || kind === 'approve' ? 'text-black font-semibold' : proposed ? 'text-black' : 'text-charcoal'

  const glyph = kind === 'ai' ? '⚡︎' : kind === 'approve' ? '✓' : kind === 'repeat' ? '⟲' : '•'
  const glyphColor =
    kind === 'ai' || kind === 'approve' ? 'text-black'
    : kind === 'repeat' ? (proposed ? 'text-black' : 'text-charcoal')
    : 'text-transparent'

  return (
    <div className={`relative flex items-center gap-2 overflow-hidden rounded-none ${borderW} px-2 py-1.5 ${box}`}>
      <span
        className={`relative shrink-0 leading-none ${kind === 'ai' ? 'text-[16px] font-bold' : 'text-[12px]'} ${glyphColor}`}
        aria-hidden="true"
      >
        {glyph}
      </span>
      <span className={`relative min-w-0 font-sans text-[10px] leading-snug ${labelColor}`}>{step.label}</span>
      {(kind === 'ai' || step.actor) && (
        <span className="relative ml-auto flex shrink-0 items-center gap-1.5">
          {kind === 'ai' && (
            <span className="rounded-none border border-black bg-black px-1 py-px text-[8px] font-bold uppercase tracking-wider text-white">DA</span>
          )}
          {step.actor && (
            <span className="rounded-none border border-black px-1 py-px text-[8px] font-bold uppercase tracking-wider text-black">{step.actor}</span>
          )}
        </span>
      )}
    </div>
  )
}

function Lane({ lane, proposed }: { lane: ExecLane; proposed: boolean }) {
  const accent = proposed ? 'text-black' : 'text-charcoal'
  return (
    <div className="flex h-full flex-col">
      <div className={`mb-3 border-b-2 pb-1.5 ${proposed ? 'border-black' : 'border-charcoal/40'}`}>
        <span className={`font-sans text-[10px] font-bold uppercase tracking-[0.12em] ${accent}`}>
          {proposed ? 'Proposed' : 'Current'}
        </span>
      </div>
      <div className="flex flex-col">
        {lane.steps.map((s, i) => (
          <div key={i}>
            <Step step={s} proposed={proposed} />
            {i < lane.steps.length - 1 && <Connector proposed={proposed} />}
          </div>
        ))}
      </div>
      <p className={`mt-auto pt-4 text-[15px] font-bold ${accent}`}>{lane.footer}</p>
    </div>
  )
}

export default function ExecWorkflow({ current, proposed }: { current: ExecLane; proposed: ExecLane }) {
  return (
    <div className="grid grid-cols-2 items-stretch gap-x-3">
      <Lane lane={current} proposed={false} />
      <Lane lane={proposed} proposed />
    </div>
  )
}
