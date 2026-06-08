// app/HA-DrawingAnalyzer/presentation/ExecWorkflow.tsx
// Executive Current-vs-Proposed workflow in Autodesk-brand styling. Hovering a
// step whose exact label appears in BOTH lanes highlights both matches in the
// Autodesk brand blue (Twilight #1D91D0).
'use client'

import { useMemo, useState } from 'react'

export type ExecStep = { label: string; kind?: 'ai' | 'approve' | 'repeat' | 'cost'; actor?: string }
export type ExecLane = { steps: ExecStep[]; footer: string }

const BRAND_BLUE = '#1d91d0'

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

function Step({
  step,
  proposed,
  active,
  onHover,
}: {
  step: ExecStep
  proposed: boolean
  active: boolean
  onHover: (label: string | null) => void
}) {
  const kind = step.kind

  let box = proposed ? 'bg-[#c9c9c9] border-black/55' : 'bg-[#c9c9c9] border-charcoal/40'
  if (kind === 'ai') box = 'bg-[#ffff00] border-black'
  else if (kind === 'approve') box = 'bg-[#c9c9c9] border-black'
  // (active highlight is applied via background only — keep the original border)

  const borderW = kind === 'approve' || kind === 'ai' ? 'border-2' : 'border'
  const labelColor = kind === 'ai' || kind === 'approve' ? 'text-black font-semibold' : proposed ? 'text-black' : 'text-charcoal'

  const glyph = kind === 'ai' ? '⚡︎' : kind === 'approve' ? '✓' : kind === 'repeat' ? '⟲' : kind === 'cost' ? '$' : '•'
  const glyphColor =
    kind === 'ai' || kind === 'approve' ? 'text-black'
    : kind === 'repeat' || kind === 'cost' ? (proposed ? 'text-black' : 'text-charcoal')
    : 'text-transparent'

  return (
    <div
      onMouseEnter={() => onHover(step.label)}
      onMouseLeave={() => onHover(null)}
      style={active ? { backgroundColor: BRAND_BLUE } : undefined}
      className={`relative flex items-center gap-2 overflow-hidden rounded-none ${borderW} px-2 py-1.5 transition-colors duration-150 ${box}`}
    >
      <span className={`relative shrink-0 leading-none ${kind === 'ai' ? 'text-[16px] font-bold' : 'text-[12px]'} ${glyphColor}`} aria-hidden="true">
        {glyph}
      </span>
      <span className={`relative min-w-0 font-sans text-[10px] leading-snug ${labelColor}`}>{step.label}</span>
      {(kind === 'ai' || step.actor) && (
        <span className="relative ml-auto flex shrink-0 items-center gap-1.5">
          {kind === 'ai' && (
            <span className="rounded-none border border-black bg-black px-1 py-px text-[8px] font-bold uppercase tracking-wider text-white">DA</span>
          )}
          {step.actor && (
            <span className={`rounded-none border px-1 py-px text-[8px] font-bold uppercase tracking-wider ${proposed ? 'border-black text-black' : 'border-charcoal text-charcoal'}`}>{step.actor}</span>
          )}
        </span>
      )}
    </div>
  )
}

function Lane({
  lane,
  proposed,
  hovered,
  shared,
  onHover,
}: {
  lane: ExecLane
  proposed: boolean
  hovered: string | null
  shared: Set<string>
  onHover: (label: string | null) => void
}) {
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
            <Step step={s} proposed={proposed} active={hovered === s.label && shared.has(s.label)} onHover={onHover} />
            {i < lane.steps.length - 1 && <Connector proposed={proposed} />}
          </div>
        ))}
      </div>
      <p className={`mt-auto pt-4 text-[15px] font-bold ${accent}`}>{lane.footer}</p>
    </div>
  )
}

export default function ExecWorkflow({ current, proposed }: { current: ExecLane; proposed: ExecLane }) {
  const [hovered, setHovered] = useState<string | null>(null)
  const shared = useMemo(() => {
    const inCurrent = new Set(current.steps.map((s) => s.label))
    return new Set(proposed.steps.filter((s) => inCurrent.has(s.label)).map((s) => s.label))
  }, [current, proposed])

  return (
    <div className="grid grid-cols-2 items-stretch gap-x-4">
      <Lane lane={current} proposed={false} hovered={hovered} shared={shared} onHover={setHovered} />
      <Lane lane={proposed} proposed hovered={hovered} shared={shared} onHover={setHovered} />
    </div>
  )
}
