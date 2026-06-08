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

// Black user pill; hovering reveals the role examples stacked above it.
export function UserPill({ pill, examples }: { pill: string; examples: string[] }) {
  return (
    <span className="group relative">
      <span className="rounded-none bg-black px-2.5 py-1 font-sans text-[11px] font-semibold uppercase tracking-wider text-white">{pill}</span>
      {examples.length > 0 && (
        <span className="invisible absolute bottom-full left-0 z-30 flex gap-1 pb-2 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
          {examples.map((e) => (
            <span key={e} className="whitespace-nowrap rounded-none bg-black px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider text-white">{e}</span>
          ))}
        </span>
      )}
    </span>
  )
}

export function Counter({ index, total }: { index: number; total: number }) {
  return (
    <p className="deck-counter fixed bottom-16 left-1/2 z-20 -translate-x-1/2 font-sans text-[12px] tracking-[0.12em] text-charcoal/60 lg:bottom-20">
      {index + 1} / {total}
    </p>
  )
}

const GLYPH: Record<string, string> = {
  normal: '●', ai: '⚡︎', catch: '⚑', reject: '✕', approve: '✓', repeat: '⟲',
}

function Lane({ steps, proposed }: { steps: WorkflowStep[]; proposed: boolean }) {
  const accent = proposed ? 'text-black' : 'text-charcoal'
  const border = proposed ? 'border-black/55' : 'border-charcoal/25'
  return (
    <div className="flex flex-1 flex-col gap-2">
      <p className={`mb-1 font-sans text-[12px] uppercase tracking-[0.12em] ${accent}`}>
        {proposed ? 'Proposed' : 'Current'}
      </p>
      {steps.map((s, i) => {
        const kind = s.kind ?? 'normal'
        return (
          <div key={i} className={`flex items-center gap-2 rounded-sm border ${border} bg-white px-3 py-2`}>
            <span className={`shrink-0 text-[13px] ${kind === 'ai' ? 'text-black' : 'text-charcoal/70'}`} aria-hidden="true">
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

export function MiniCard({ title, tone, primary, tag }: { title: string; tone: 'value' | 'risk' | 'metric'; primary?: boolean; tag?: string }) {
  const color = tone === 'value' ? 'border-black' : tone === 'risk' ? 'border-[#ffff00]' : 'border-[#1d91d0]'
  // thicker bar for the primary item; padding compensates so text stays aligned (border + pl = 20px)
  const bar = primary ? 'border-l-8 pl-3' : 'border-l-4 pl-4'
  return (
    <div className={`flex items-center justify-between gap-2 ${bar} ${color} py-2`}>
      <p className="text-[20px] font-semibold leading-snug text-black">{title}</p>
      {tag && (
        <span className="shrink-0 whitespace-pre-line rounded-none bg-[#1d91d0] px-2 py-0.5 text-center font-sans text-[10px] font-semibold uppercase leading-tight tracking-wider text-white">{tag}</span>
      )}
    </div>
  )
}

const MEDALS = ['🥇', '🥈', '🥉', '']

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
        <tr className="border-b-2 border-black">
          <th className="py-3 pr-4 font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-charcoal">Use case</th>
          {criteria.map((c) => (
            <th key={c} className="px-3 py-3 text-center font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-charcoal">{c}</th>
          ))}
          <th className="pl-3 py-3 text-center font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-charcoal">Total</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, ri) => (
          <tr key={r.useCase} className="border-b border-charcoal/15" style={r.winner ? { backgroundColor: '#ffff00' } : undefined}>
            <td className={`py-3 pr-4 font-sans text-[16px] ${r.winner ? 'font-bold text-black' : 'text-charcoal'}`}>
              <span className="mr-2 inline-block w-7 text-center" aria-hidden="true">{MEDALS[ri]}</span>{r.useCase}
            </td>
            {r.scores.map((s, i) => (
              <td key={i} className={`px-3 py-3 text-center font-sans text-[16px] ${r.winner ? 'text-black' : 'text-charcoal/70'}`}>{s}</td>
            ))}
            <td className={`pl-3 py-3 text-center font-sans text-[18px] font-bold text-black`}>{r.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
