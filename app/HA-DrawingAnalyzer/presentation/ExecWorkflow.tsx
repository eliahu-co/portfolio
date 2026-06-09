// app/HA-DrawingAnalyzer/presentation/ExecWorkflow.tsx
// Executive Current-vs-Proposed workflow in Autodesk-brand styling. One lane is
// "active" (full opacity) and the other is faded; landing defaults to Current
// active. Clicking the "Current" / "Proposed" header switches which lane is
// active. Hovering a step whose exact label appears in BOTH lanes highlights
// both matches in the Autodesk brand blue (Twilight #1D91D0).
'use client'

import { useEffect, useMemo, useState } from 'react'

export type ExecStep = { label: string; kind?: 'ai' | 'approve' | 'repeat' | 'cost'; actor?: string }
export type ExecLane = { steps: ExecStep[]; footer: string }

const BRAND_BLUE = '#1d91d0'

// Down-arrow connector — same geometry as the site's Connector. (Lane opacity
// handles fading, so the connector is always drawn at full strength.)
function Connector() {
  return (
    <div className="flex justify-center">
      <svg width="14" height="15" viewBox="0 0 14 15" fill="none" aria-hidden="true" style={{ display: 'block' }}>
        <path d="M7 0 V14" stroke="#000000" strokeWidth="1" strokeLinecap="round" />
        <path d="M2 10 L7 14 L12 10" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function Step({
  step,
  highlighted,
  onHover,
}: {
  step: ExecStep
  highlighted: boolean
  onHover: (label: string | null) => void
}) {
  const kind = step.kind

  let box = 'bg-[#c9c9c9] border-black/55'
  if (kind === 'ai') box = 'bg-[#ffff00] border-black'
  else if (kind === 'approve') box = 'bg-[#c9c9c9] border-black'

  const borderW = kind === 'approve' || kind === 'ai' ? 'border-2' : 'border'
  const labelColor = kind === 'ai' || kind === 'approve' ? 'text-black font-semibold' : 'text-black'

  const glyph = kind === 'ai' ? '⚡︎' : kind === 'approve' ? '✓' : kind === 'repeat' ? '⟲' : kind === 'cost' ? '$' : '•'
  const glyphColor = kind ? 'text-black' : 'text-transparent'

  return (
    <div
      onMouseEnter={() => onHover(step.label)}
      onMouseLeave={() => onHover(null)}
      style={highlighted ? { backgroundColor: BRAND_BLUE } : undefined}
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
            <span className="rounded-none border border-black px-1 py-px text-[8px] font-bold uppercase tracking-wider text-black">{step.actor}</span>
          )}
        </span>
      )}
    </div>
  )
}

type HoverState = { label: string; lane: 'current' | 'proposed' } | null

function Lane({
  lane,
  proposed,
  selected,
  hovered,
  shared,
  onHover,
  onSelect,
}: {
  lane: ExecLane
  proposed: boolean
  selected: boolean
  hovered: HoverState
  shared: Set<string>
  onHover: (label: string | null, lane: 'current' | 'proposed') => void
  onSelect: () => void
}) {
  const laneKey: 'current' | 'proposed' = proposed ? 'proposed' : 'current'
  // Hovering a Current step lights only that step (any step, no Proposed mirror).
  // Hovering a Proposed step lights both lanes, but only for labels shared across
  // both (the matching Current step mirrors it).
  const isHighlighted = (label: string) => {
    if (!hovered || hovered.label !== label) return false
    if (hovered.lane === 'current') return laneKey === 'current'
    return shared.has(label)
  }
  return (
    <div className="flex h-full flex-col">
      {/* clickable header — always full opacity so both lanes stay selectable */}
      <div className={`mb-3 border-b-2 pb-1.5 ${selected ? 'border-black' : 'border-charcoal/40'}`}>
        <span
          role="button"
          tabIndex={0}
          onClick={onSelect}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onSelect()
            }
          }}
          aria-pressed={selected}
          className={`font-sans text-[10px] font-bold uppercase tracking-[0.12em] transition-colors ${selected ? 'text-black' : 'text-charcoal'}`}
        >
          {proposed ? 'Proposed' : 'Current'}
        </span>
      </div>
      {/* body fades when this lane is not the active one */}
      <div className={`flex flex-1 flex-col transition-opacity duration-300 ${selected ? 'opacity-100' : 'opacity-40'}`}>
        <div className="flex flex-col">
          {lane.steps.map((s, i) => (
            <div key={i}>
              <Step step={s} highlighted={isHighlighted(s.label)} onHover={(label) => onHover(label, laneKey)} />
              {i < lane.steps.length - 1 && <Connector />}
            </div>
          ))}
        </div>
        <p className="mt-auto pt-4 text-[15px] font-bold text-black">{lane.footer}</p>
      </div>
    </div>
  )
}

export default function ExecWorkflow({ current, proposed }: { current: ExecLane; proposed: ExecLane }) {
  const [hovered, setHovered] = useState<HoverState>(null)
  // which lane is emphasized; landing defaults to Current, reset on navigation
  const [active, setActive] = useState<'current' | 'proposed'>('current')
  useEffect(() => {
    const reset = () => setActive('current')
    window.addEventListener('deck:navigate', reset)
    return () => window.removeEventListener('deck:navigate', reset)
  }, [])

  const shared = useMemo(() => {
    const inCurrent = new Set(current.steps.map((s) => s.label))
    return new Set(proposed.steps.filter((s) => inCurrent.has(s.label)).map((s) => s.label))
  }, [current, proposed])

  const handleHover = (label: string | null, lane: 'current' | 'proposed') =>
    setHovered(label ? { label, lane } : null)

  return (
    <div className="grid grid-cols-2 items-stretch gap-x-4">
      <Lane lane={current} proposed={false} selected={active === 'current'} hovered={hovered} shared={shared} onHover={handleHover} onSelect={() => setActive('current')} />
      <Lane lane={proposed} proposed selected={active === 'proposed'} hovered={hovered} shared={shared} onHover={handleHover} onSelect={() => setActive('proposed')} />
    </div>
  )
}
