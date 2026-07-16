'use client'

import { useCallback, useState } from 'react'
import type { PresentationConcept } from '../deckData'
import { useDeckReset, type DeckSlideKey } from '../useDeckReset'
import { FlowArrow } from './FlowArrow'

function LoopPill({ label, core }: { label: string; core?: boolean }) {
  return (
    <div className={core
      ? 'rounded-lg border border-cm-wood/50 bg-gradient-to-b from-[#FFE9C4] to-[#FFDCA3] px-4 py-2 text-center font-sans text-[14px] font-extrabold leading-snug text-cm-wood shadow-[0_2px_0_rgba(144,57,0,0.3)]'
      : 'rounded-lg border border-[#1E7BA8]/30 bg-gradient-to-b from-[#F0FAFE] to-[#DBF1FC] px-4 py-2 text-center font-sans text-[14px] font-extrabold leading-snug text-[#0d3a5a] shadow-[0_2px_0_rgba(30,123,168,0.16)]'}>
      {label}
    </div>
  )
}

function RevealColumn({ title, items, risk = false }: { title: string; items: readonly { title: string; body: string }[]; risk?: boolean }) {
  return (
    <section>
      <h3 className="mb-3 font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-black">{title}</h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.title}>
            <p className={`font-sans text-[15px] font-extrabold ${risk ? 'text-cm-crimson' : 'text-cm-violet-deep'}`}>{item.title}</p>
            <p className="mt-0.5 font-sans text-[13px] leading-snug text-charcoal">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export type FeatureSlideProps = {
  readonly concept: PresentationConcept
  readonly loop: PresentationConcept['loop']
  readonly title: string
  readonly slideKey: DeckSlideKey
}

export function FeatureSlide({ concept, loop, title, slideKey }: FeatureSlideProps) {
  const [revealed, setRevealed] = useState(false)
  const reset = useCallback(() => setRevealed(false), [])
  useDeckReset(reset, slideKey)

  return (
    <div data-feature-layout={title} className="grid h-full grid-cols-[1fr_0.78fr] gap-10">
      <div className="relative flex min-h-0 flex-col">
        <section
          aria-label={`${title} loop`}
          data-feature-loop={title}
          className={`transition-opacity duration-300 motion-reduce:transition-none ${revealed ? 'opacity-20' : 'opacity-100'}`}
        >
          <h3 className="mb-2 font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-black">Loop</h3>
          <div className="mx-auto max-w-[410px]">
            {loop.steps.map((step, index) => (
              <div key={step.label}>
                <LoopPill label={step.label} core={step.coreLoop} />
                {index < loop.steps.length - 1 && (
                  <FlowArrow
                    direction="down"
                    color="#1E7BA8"
                    data-feature-loop-arrow="true"
                    className="mx-auto h-[20px] w-[14px]"
                  />
                )}
              </div>
            ))}
          </div>
          <p className="mt-4 max-w-[520px] font-sans text-[15px] font-bold leading-snug text-cm-violet-deep">
            {concept.monetizationSummary}
          </p>
        </section>

        <div
          id={`${title.toLowerCase().replaceAll(' ', '-')}-tradeoff`}
          data-feature-reveal={title}
          aria-hidden={!revealed}
          className={`pointer-events-none absolute inset-x-0 top-0 grid grid-cols-2 gap-9 transition-opacity duration-300 motion-reduce:transition-none ${revealed ? 'opacity-100' : 'opacity-0'}`}
        >
          <RevealColumn title="Player motivation" items={concept.values} />
          <RevealColumn title="Risks" items={concept.risks} risk />
        </div>

        <button
          type="button"
          data-deck-interactive="true"
          aria-label="Trade-off"
          aria-expanded={revealed}
          aria-controls={`${title.toLowerCase().replaceAll(' ', '-')}-tradeoff`}
          onClick={() => setRevealed((current) => !current)}
          className="mt-5 self-start border-0 bg-transparent py-2 font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-black focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#1E7BA8]"
        >
          Trade-off <span aria-hidden="true">{revealed ? '×' : '+'}</span>
        </button>
      </div>

      <div
        data-feature-image={title}
        className={`flex min-h-0 items-start justify-end transition-opacity duration-300 motion-reduce:transition-none ${revealed ? 'opacity-20' : 'opacity-100'}`}
      >
        <figure data-feature-frame="true" className="inline-flex w-fit overflow-hidden rounded-2xl border-2 border-cm-wood/50 bg-white p-1 shadow-[0_4px_0_rgba(144,57,0,0.28)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={concept.mockup} alt={`${title} feature mockup`} className="max-h-[330px] w-auto rounded-xl object-contain" />
        </figure>
      </div>
    </div>
  )
}
