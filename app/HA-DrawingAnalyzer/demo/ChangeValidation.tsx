// app/HA-DrawingAnalyzer/demo/ChangeValidation.tsx
// The hero screen: a two-pane Current vs. Incoming compare of the A102 plan
// with a detected-changes review rail. Modeled on ChangeValidation_Ref2.
// Hovering/clicking a change card focuses its highlight in the Incoming pane.

'use client'

import { useState } from 'react'
import FloorPlan from './FloorPlan'
import { CHANGES, TYPE_META } from './data'

const BLUE = '#0d66d0'

const CONF_EXPLAIN: Record<string, string> = {
  High: 'High confidence — the model is highly certain this is a real change.',
  Medium: 'Medium confidence — the model is moderately certain; worth a closer look.',
  Low: 'Low confidence — the model is unsure; please verify.',
}

function TypeTag({ type }: { type: keyof typeof TYPE_META }) {
  const m = TYPE_META[type]
  return (
    <span
      className="inline-block text-[10px] font-semibold uppercase tracking-wide rounded px-1.5 py-0.5"
      style={{ color: m.color, background: `${m.color}1a` }}
    >
      {m.label}
    </span>
  )
}

function Pane({ version, focus, onFocus, pass }: { version: 'current' | 'incoming'; focus?: string | null; onFocus?: (id: string | null) => void; pass?: 1 | 2 }) {
  const accent = version === 'incoming'
  return (
    <div className="relative flex flex-col min-h-0 rounded-md border border-[#e6e6e6] bg-white overflow-hidden">
      {/* version pill floats on top of the drawing */}
      <span
        className="absolute top-2.5 left-2.5 z-10 text-[11px] font-semibold uppercase tracking-wide rounded-full px-2.5 py-0.5 border bg-white"
        style={accent ? { color: BLUE, borderColor: `${BLUE}80` } : { color: '#5a5a5a', borderColor: '#d9d9d9' }}
      >
        {accent ? (pass === 2 ? 'Incoming · V3' : 'Incoming · V2') : 'Current · V1'}
      </span>
      <div className="flex-1 min-h-0 p-2">
        <FloorPlan version={version} focus={focus} onFocus={onFocus} pass={pass} />
      </div>
    </div>
  )
}

export default function ChangeValidation({
  onReturn,
  onConfirm,
  pass,
  submitOpen,
}: {
  onReturn: () => void
  onConfirm: () => void
  pass: 1 | 2
  submitOpen?: boolean
}) {
  const [focus, setFocus] = useState<string | null>(null)

  return (
    <div className="flex flex-col h-screen bg-[#fafafa] font-sans text-[#1a1a1a]">
      {/* Top bar */}
      <header className="shrink-0 bg-white border-b border-[#e6e6e6] px-4 py-2.5">
        <div className="flex items-center gap-4">
          <button
            onClick={onReturn}
            className="flex items-center gap-1 text-[13px] text-[#5a5a5a] hover:text-[#1a1a1a]"
          >
            <span aria-hidden>←</span> Back to Files
          </button>
          <div className="h-5 w-px bg-[#e6e6e6]" />
          <h1 className="text-[15px] font-medium" style={{ color: BLUE }}>Change Validation</h1>
          <span className="text-[13px] text-[#5a5a5a]">A102 — Second Floor Plan</span>
        </div>
        <p className="mt-1.5 text-[11px] italic text-[#7a7f84]">
          Changes detected from drawing objects and their relationships — not a pixel overlay.
        </p>
      </header>

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {/* Panes */}
        <main className="flex-1 min-w-0 flex flex-col p-4 gap-3">
          <div className="grid grid-cols-1 xl:grid-cols-2 auto-rows-fr gap-4 flex-1 min-h-0">
            <Pane version="current" />
            <Pane version="incoming" focus={focus} onFocus={setFocus} pass={pass} />
          </div>
          {/* Legend */}
          <div className="shrink-0 flex items-center gap-5 text-[11px] text-[#5a5a5a]">
            <span className="font-medium text-[#1a1a1a]">Legend</span>
            {(['added', 'modified', 'removed'] as const).map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: TYPE_META[t].color }} />
                {TYPE_META[t].label}
              </span>
            ))}
            <span className="ml-auto text-[#9aa0a6]">A102 · P1016 · SFH2X</span>
          </div>
        </main>

        {/* Review rail */}
        <aside className="w-[360px] shrink-0 border-l border-[#e6e6e6] bg-white flex flex-col min-h-0">
          <div className="px-4 py-3 border-b border-[#eee]">
            <h2 className="text-[13px] font-semibold">Changes Summary</h2>
            <p className="text-[11px] text-[#5a5a5a] mt-0.5">{CHANGES.filter((c) => c.passes.includes(pass)).length} changes detected · object-level diff</p>
          </div>
          <div className="flex-1 overflow-auto p-3 flex flex-col gap-2.5">
            {CHANGES.filter((c) => c.passes.includes(pass)).map((c) => {
              const active = focus === c.id
              const color = TYPE_META[c.type].color
              const letter = String.fromCharCode(65 + CHANGES.findIndex((x) => x.id === c.id))
              return (
                <div key={c.id} className={c.id === 'toilet' ? 'demo-shake flex flex-col gap-1.5' : ''}>
                  <button
                    onMouseEnter={() => setFocus(c.id)}
                    onMouseLeave={() => setFocus(null)}
                    onClick={() => setFocus(c.id)}
                    className={`w-full text-left rounded-md border bg-white p-2.5 flex gap-3 transition-shadow ${active ? 'shadow-sm' : ''}`}
                    style={{ borderColor: active ? color : '#e6e6e6' }}
                  >
                    {/* thumbnail crop — the incoming plan for the current pass */}
                    <div className="shrink-0 w-[92px] h-[68px] rounded border border-[#eee] overflow-hidden bg-white">
                      <FloorPlan version="incoming" pass={pass} viewBox={c.crop} focus={c.id} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className="grid place-items-center h-4 w-4 rounded-full text-[9px] font-bold text-white shrink-0"
                          style={{ background: color }}
                        >
                          {letter}
                        </span>
                        <TypeTag type={c.type} />
                        <span className="ml-auto shrink-0 relative group">
                          <span className="block text-[9px] font-medium uppercase tracking-[0.06em] text-[#5a5a5a] bg-[#f1f3f5] rounded-full px-2 py-0.5">
                            {c.confidence}
                          </span>
                          <span className="pointer-events-none absolute right-0 top-full mt-1.5 z-30 w-48 rounded-md bg-[#1a1a1a] text-white text-[10px] leading-snug px-2.5 py-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            {CONF_EXPLAIN[c.confidence]}
                          </span>
                        </span>
                      </div>
                      <p className="text-[12.5px] font-medium leading-tight">{c.title}</p>
                      <p className="text-[11px] text-[#5a5a5a] leading-snug mt-0.5">{c.description}</p>
                    </div>
                  </button>
                  {c.id === 'toilet' && (
                    <div className="rounded-md border border-autodesk-blue/30 bg-autodesk-blue/[0.06] px-3 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-white bg-autodesk-blue rounded px-1.5 py-[2px]">Demo note</span>
                        <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-autodesk-blue"><span aria-hidden>⚑</span> Issue caught</span>
                      </div>
                      <p className="text-[11px] text-[#5a5a5a] leading-snug">Oops — you didn&apos;t mean to remove this toilet.</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </aside>
      </div>

      {/* Footer actions */}
      <footer className="shrink-0 bg-white border-t border-[#e6e6e6] px-4 py-3 flex items-center">
        <p className="text-[12px] text-[#5a5a5a]">
          <span className="font-semibold text-[#1a1a1a]">{CHANGES.length} object-level changes</span> detected in this revision.
        </p>
        <div className="ml-auto flex items-center gap-2.5">
          <button
            onClick={onReturn}
            className={`text-[13px] font-medium text-[#1a1a1a] border border-[#d9d9d9] bg-white rounded px-4 py-2 hover:bg-[#f5f6f7] ${pass === 1 ? 'demo-shake' : ''}`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={pass === 1}
            className={`text-[13px] font-semibold text-white rounded px-4 py-2 shadow-sm ${pass === 1 ? 'demo-mock opacity-50' : `hover:opacity-90 ${submitOpen ? '' : 'demo-shake'}`}`}
            style={{ background: BLUE }}
          >
            Confirm changes
          </button>
        </div>
      </footer>
    </div>
  )
}
