// app/HA-DrawingAnalyzer/presentation/slides/SlideUseCase.tsx
'use client'

import { useState } from 'react'
import { SlideShell, UserPill } from '../primitives'
import ExecWorkflow from '../ExecWorkflow'
import { EXEC_WORKFLOWS } from '../execWorkflows'
import type { UseCaseData } from '@/app/HA-DrawingAnalyzer/sections/UseCase'

function roleExamples(data: UseCaseData): string[] {
  return (data.primaryUser.role ?? '').split('/').map((s) => s.trim()).filter(Boolean)
}

// list of titles that grows upward from the tradeoff side, shown only when revealed
function RevealList({ items, shown }: { items: string[]; shown: boolean }) {
  return (
    <span className={`absolute bottom-full left-0 mb-2 flex flex-col gap-1 transition-opacity ${shown ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
      {items.map((t) => (
        <span key={t} className="whitespace-nowrap font-sans text-[11px] font-semibold uppercase leading-tight tracking-[0.08em] text-black">{t}</span>
      ))}
    </span>
  )
}

export default function SlideUseCase({ data, index }: { data: UseCaseData; index: number }) {
  const [revealed, setRevealed] = useState(false)
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
                className="mt-auto pt-8 font-sans text-[11px] uppercase leading-relaxed tracking-[0.1em] text-charcoal"
              >
                <span className="relative">
                  <RevealList items={values} shown={revealed} />
                  {tradeoff.gain}
                </span>
                <span className="mx-1.5" aria-hidden="true">⇄</span>
                <span className="relative">
                  <RevealList items={risks} shown={revealed} />
                  {tradeoff.cost}
                </span>
              </div>
            )}
          </div>
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt=""
              className={
                index === 2
                  ? 'max-h-[62vh] w-auto justify-self-start object-contain'
                  : 'max-h-[84vh] w-full object-contain'
              }
            />
          )}
        </div>
      </SlideShell>
    </div>
  )
}
