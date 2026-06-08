// app/HA-DrawingAnalyzer/presentation/slides/SlideUseCase.tsx
'use client'

import { useEffect, useState } from 'react'
import { SlideShell, UserPill } from '../primitives'
import ExecWorkflow from '../ExecWorkflow'
import { EXEC_WORKFLOWS } from '../execWorkflows'
import type { UseCaseData } from '@/app/HA-DrawingAnalyzer/sections/UseCase'

function roleExamples(data: UseCaseData): string[] {
  return (data.primaryUser.role ?? '').split('/').map((s) => s.trim()).filter(Boolean)
}

// one column of title pills (wraps within its width)
function RevealColumn({ items, tone }: { items: string[]; tone: 'value' | 'risk' }) {
  const cls = tone === 'value' ? 'bg-[#ffff00] text-black' : 'bg-black text-white'
  return (
    <div className="flex flex-col items-start gap-3">
      {items.map((t) => (
        <span key={t} className={`rounded-none px-2 py-1 font-sans text-[10px] font-semibold uppercase leading-tight tracking-[0.06em] ${cls}`}>{t}</span>
      ))}
    </div>
  )
}

export default function SlideUseCase({ data, index }: { data: UseCaseData; index: number }) {
  const [revealed, setRevealed] = useState(false)
  // hide the reveal whenever the deck navigates, so returning to the slide is unactivated
  useEffect(() => {
    const reset = () => setRevealed(false)
    window.addEventListener('deck:navigate', reset)
    return () => window.removeEventListener('deck:navigate', reset)
  }, [])
  const title = data.title.split('\n')[0]
  const wf = EXEC_WORKFLOWS[data.id]
  const image = index === 2 ? '/presentation/usecase-2.jpeg' : data.opportunity.image
  const values = data.value.map((v) => v.title)
  const risks = data.tradeoffs.map((t) => t.title)
  const tradeoff =
    index === 1 ? { gain: 'Fewer review rounds', cost: 'Additional step' }
    : index === 2 ? { gain: 'Faster resolution', cost: 'Additional step' }
    : index === 3 ? { gain: 'Dependency tracking', cost: 'Setup effort' }
    : index === 4 ? { gain: 'Consistent fast reviews', cost: 'Setup effort' }
    : data.tradeoff
  return (
    <div className="relative h-full w-full bg-[#c9c9c9]">
      <SlideShell>
        {/* header: user pill + construction phase */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <UserPill pill={data.primaryUser.pill ?? ''} examples={roleExamples(data)} />
          <span className="font-sans text-[11px] uppercase tracking-[0.1em] text-charcoal">{data.constructionPhase.name}</span>
        </div>
        <h2 className="mb-8 text-[clamp(34px,5vw,64px)] font-extrabold leading-[1.04] tracking-[-0.01em] text-black whitespace-pre-line">{title}</h2>

        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-[minmax(0,380px)_1fr]">
          <div className="flex h-full flex-col">
            <div className={`transition-opacity duration-300 ${revealed ? 'opacity-20' : ''}`}>
              {wf && <ExecWorkflow current={wf.current} proposed={wf.proposed} />}
            </div>
            {tradeoff && (
              <div
                onClick={() => setRevealed((v) => !v)}
                className="relative mt-auto pt-8 font-sans text-[11px] uppercase leading-relaxed tracking-[0.1em] text-charcoal"
              >
                {/* values (left) / risks (right) panel, revealed above the tradeoff */}
                <div className={`absolute inset-x-0 bottom-full mb-3 grid grid-cols-2 gap-x-10 transition-opacity ${revealed ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
                  <RevealColumn items={values} tone="value" />
                  <RevealColumn items={risks} tone="risk" />
                </div>
                {tradeoff.gain}
                <span className="mx-1.5" aria-hidden="true">⇄</span>
                {tradeoff.cost}
              </div>
            )}
          </div>
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt=""
              className={`transition-opacity duration-300 ${revealed ? 'opacity-20' : ''} ${
                index === 2
                  ? 'max-h-[62vh] w-auto justify-self-start object-contain'
                  : 'max-h-[84vh] w-full object-contain'
              }`}
            />
          )}
        </div>
      </SlideShell>
    </div>
  )
}
