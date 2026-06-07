// app/HA-DrawingAnalyzer/presentation/primitives.tsx
// Slide-local presentational building blocks, sized for projection. These are
// deliberately independent of sections/UseCase.tsx (which must stay untouched).
import type { ReactNode } from 'react'
import type { WorkflowStep } from '@/app/HA-DrawingAnalyzer/sections/UseCase'

// variant 'anchored' (default): header pinned to a consistent top position, body flows
// below — so the eyebrow/title stay in the same place as you advance slides.
// variant 'centered': vertically centered hero layout (cover, recommendation).
export function SlideShell({
  eyebrow,
  title,
  children,
  variant = 'anchored',
}: {
  eyebrow?: string
  title?: ReactNode
  children?: ReactNode
  variant?: 'anchored' | 'centered'
}) {
  const layout = variant === 'centered' ? 'justify-center py-16' : 'justify-start pt-16 pb-16 lg:pt-20'
  return (
    <div className={`mx-auto flex h-full w-full max-w-7xl flex-col px-12 lg:px-20 ${layout}`}>
      {eyebrow && (
        <p className="mb-4 font-sans text-[12px] font-bold uppercase tracking-[0.14em] text-black">{eyebrow}</p>
      )}
      {title && (
        <h2 className="mb-8 text-[clamp(34px,5vw,64px)] font-extrabold leading-[1.04] tracking-[-0.01em] text-black whitespace-pre-line">{title}</h2>
      )}
      {children}
    </div>
  )
}

export function Counter({ index, total }: { index: number; total: number }) {
  return (
    <p className="deck-counter fixed bottom-5 right-6 z-20 font-sans text-[12px] tracking-[0.12em] text-charcoal/60">
      {index + 1} / {total}
    </p>
  )
}

const GLYPH: Record<string, string> = {
  normal: '●', ai: '⚡︎', catch: '⚑', reject: '✕', approve: '✓', repeat: '⟲',
}

function Lane({ steps, proposed }: { steps: WorkflowStep[]; proposed: boolean }) {
  const accent = proposed ? 'text-autodesk-blue' : 'text-charcoal'
  const border = proposed ? 'border-autodesk-blue/40' : 'border-charcoal/25'
  return (
    <div className="flex flex-1 flex-col gap-2">
      <p className={`mb-1 font-sans text-[12px] uppercase tracking-[0.12em] ${accent}`}>
        {proposed ? 'Proposed' : 'Current'}
      </p>
      {steps.map((s, i) => {
        const kind = s.kind ?? 'normal'
        return (
          <div key={i} className={`flex items-center gap-2 rounded-sm border ${border} bg-white px-3 py-2`}>
            <span className={`shrink-0 text-[13px] ${kind === 'ai' ? 'text-autodesk-blue' : 'text-charcoal/70'}`} aria-hidden="true">
              {GLYPH[kind]}
            </span>
            <span className="font-sans text-[13px] leading-snug text-charcoal">{s.label}</span>
          </div>
        )
      })}
    </div>
  )
}

export function MiniWorkflow({ current, proposed }: { current: WorkflowStep[]; proposed: WorkflowStep[] }) {
  return (
    <div className="flex gap-8">
      <Lane steps={current} proposed={false} />
      <Lane steps={proposed} proposed />
    </div>
  )
}

export function MiniCard({ title, tone }: { title: string; tone: 'value' | 'risk' }) {
  const bar = tone === 'value' ? 'border-autodesk-blue' : 'border-[#f4b400]'
  return (
    <div className={`border-l-4 ${bar} pl-4 py-2`}>
      <p className="font-serif text-[20px] leading-snug text-black">{title}</p>
    </div>
  )
}

export function ScoreTable({
  criteria,
  rows,
}: {
  criteria: readonly string[]
  rows: { useCase: string; scores: number[]; total: number; winner?: boolean }[]
}) {
  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-b-2 border-autodesk-blue">
          <th className="py-3 pr-4 font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/70">Use case</th>
          {criteria.map((c) => (
            <th key={c} className="px-3 py-3 text-center font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/70">{c}</th>
          ))}
          <th className="pl-3 py-3 text-center font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/70">Total</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr
            key={r.useCase}
            className="border-b border-charcoal/15"
            style={r.winner ? { backgroundImage: 'linear-gradient(90deg, rgba(6,150,215,0.06) 0%, rgba(6,150,215,0.20) 50%, rgba(6,150,215,0.06) 100%)' } : undefined}
          >
            <td className={`py-3 pr-4 font-sans text-[16px] ${r.winner ? 'font-medium text-black' : 'text-charcoal'}`}>{r.useCase}</td>
            {r.scores.map((s, i) => (
              <td key={i} className="px-3 py-3 text-center font-sans text-[16px] text-charcoal/70">{s}</td>
            ))}
            <td className={`pl-3 py-3 text-center font-sans text-[18px] font-medium ${r.winner ? 'text-autodesk-blue' : 'text-black'}`}>{r.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
