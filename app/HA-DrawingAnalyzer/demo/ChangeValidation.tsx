// app/HA-DrawingAnalyzer/demo/ChangeValidation.tsx
// The hero screen: a two-pane Current vs. Incoming compare of the A102 plan
// with a detected-changes review rail. Modeled on ChangeValidation_Ref2.
// Hovering/clicking a change card focuses its highlight in the Incoming pane.

'use client'

import { useState } from 'react'
import FloorPlan from './FloorPlan'
import { CHANGES, TYPE_META } from './data'

const BLUE = '#0d66d0'

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

function Pane({ label, version, focus }: { label: string; version: 'current' | 'incoming'; focus?: string | null }) {
  const accent = version === 'incoming'
  return (
    <div className="flex flex-col min-h-0 rounded-md border border-[#e6e6e6] bg-white overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#eee] bg-[#fafafa]">
        <span className="text-[12px] font-medium text-[#1a1a1a]">{label}</span>
        <span
          className="text-[10px] uppercase tracking-wide rounded-full px-2 py-0.5 border"
          style={accent ? { color: BLUE, borderColor: `${BLUE}80` } : { color: '#5a5a5a', borderColor: '#d9d9d9' }}
        >
          {accent ? 'Incoming · V2' : 'Current · V1'}
        </span>
      </div>
      <div className="flex-1 min-h-0 p-2">
        <FloorPlan version={version} focus={focus} />
      </div>
    </div>
  )
}

export default function ChangeValidation({
  onReturn,
  onConfirm,
}: {
  onReturn: () => void
  onConfirm: () => void
}) {
  const [focus, setFocus] = useState<string | null>(null)
  const [changesOnly, setChangesOnly] = useState(true)

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
          <div className="h-4 w-px bg-[#e6e6e6]" />
          <h1 className="text-[14px] font-medium">A102 — Second Floor Plan</h1>
          <span className="text-[11px] text-[#5a5a5a] rounded bg-[#f2f4f6] px-2 py-0.5">Change Validation</span>

          <div className="ml-auto flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[11px] text-[#5a5a5a]">
              <span className="rounded-full border border-[#d9d9d9] px-2 py-0.5">Current · V1</span>
              <span aria-hidden>→</span>
              <span className="rounded-full px-2 py-0.5 border" style={{ color: BLUE, borderColor: `${BLUE}80` }}>Incoming · V2</span>
            </span>
            <button
              onClick={() => setChangesOnly((v) => !v)}
              className="flex items-center gap-2 text-[12px] text-[#5a5a5a]"
              aria-pressed={changesOnly}
            >
              <span className={`relative inline-block h-4 w-7 rounded-full transition-colors ${changesOnly ? 'bg-[#0d66d0]' : 'bg-[#cbd0d4]'}`}>
                <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${changesOnly ? 'left-3.5' : 'left-0.5'}`} />
              </span>
              Show changes only
            </button>
          </div>
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
            <Pane label="Current" version="current" />
            <Pane label="Incoming" version="incoming" focus={focus} />
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
            <h2 className="text-[13px] font-semibold">Change Validation Review</h2>
            <p className="text-[11px] text-[#5a5a5a] mt-0.5">{CHANGES.length} changes detected · object-level diff of V1 → V2</p>
          </div>
          <div className="flex-1 overflow-auto p-3 flex flex-col gap-2.5">
            {CHANGES.map((c, i) => {
              const active = focus === c.id
              const color = TYPE_META[c.type].color
              return (
                <button
                  key={c.id}
                  onMouseEnter={() => setFocus(c.id)}
                  onMouseLeave={() => setFocus(null)}
                  onClick={() => setFocus(c.id)}
                  className={`text-left rounded-md border bg-white p-2.5 flex gap-3 transition-shadow ${active ? 'shadow-sm' : ''}`}
                  style={{ borderColor: active ? color : '#e6e6e6' }}
                >
                  {/* thumbnail crop — from the pane that carries the change */}
                  <div className="shrink-0 w-[92px] h-[68px] rounded border border-[#eee] overflow-hidden bg-white">
                    <FloorPlan version={c.shownIn} viewBox={c.crop} focus={c.id} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="grid place-items-center h-4 w-4 rounded-full text-[9px] font-bold text-white shrink-0"
                        style={{ background: color }}
                      >
                        {i + 1}
                      </span>
                      <TypeTag type={c.type} />
                    </div>
                    <p className="text-[12.5px] font-medium leading-tight">{c.title}</p>
                    <p className="text-[11px] text-[#5a5a5a] leading-snug mt-0.5">{c.description}</p>
                  </div>
                </button>
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
            className="text-[13px] font-medium text-[#1a1a1a] border border-[#d9d9d9] bg-white rounded px-4 py-2 hover:bg-[#f5f6f7]"
          >
            Don&apos;t start review
          </button>
          <button
            onClick={onConfirm}
            className="text-[13px] font-semibold text-white rounded px-4 py-2 shadow-sm hover:opacity-90"
            style={{ background: BLUE }}
          >
            Confirm &amp; submit review
          </button>
        </div>
      </footer>
    </div>
  )
}
