'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'
import type { PresentationConcept } from '../deckData'
import type { WorkflowStep } from '@/app/MA-HomeAssignment/sections/UseCase'
import { useDeckReset, type DeckSlideKey } from '../useDeckReset'
import LoopReturn from '@/app/MA-HomeAssignment/sections/LoopReturn'
import { FlowArrow } from './FlowArrow'

function LoopPill({ label, core, resourceDelta }: Pick<WorkflowStep, 'label' | 'coreLoop' | 'resourceDelta'> & { core?: boolean }) {
  const resourceName = resourceDelta?.resource === 'coin'
    ? 'Coins'
    : resourceDelta?.resource === 'spin'
      ? 'Spins'
      : 'Card'
  const resourceLabel = resourceDelta
    ? `${resourceDelta.direction === 'spend' ? 'Spend' : 'Gain'} ${resourceName}`
    : null

  return (
    <div
      data-loop-step="true"
      data-blue-surface={core ? undefined : 'true'}
      data-wood-surface={core ? 'true' : undefined}
      className={core
      ? 'relative rounded-lg border px-4 py-2 text-center font-sans text-[14px] font-normal leading-snug text-cm-wood'
      : 'relative rounded-lg border px-4 py-2 text-center font-sans text-[14px] font-normal leading-snug text-[#0d3a5a]'}>
      <span className={resourceDelta ? 'block px-10' : undefined}>{label}</span>
      {resourceDelta && (
        <span
          data-resource-indicator="true"
          aria-label={resourceLabel!}
          className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center leading-none"
        >
          <span className="relative block h-7 w-7" aria-hidden="true">
            <Image
              src={`/coinmaster/resources/${resourceDelta.resource}-emoji.png`}
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
            />
            <Image
              src={`/coinmaster/resources/${resourceDelta.direction === 'spend' ? 'minus' : 'plus'}-badge.png`}
              alt=""
              width={16}
              height={16}
              data-resource-sign="true"
              className="absolute -left-1 -top-1 z-10 h-4 w-4 object-contain"
            />
          </span>
        </span>
      )}
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
    <div data-feature-layout={title} className="grid h-full grid-cols-[0.72fr_1fr] gap-10">
      <div className="relative flex min-h-0 flex-col">
        <section
          aria-label={`${title} loop`}
          data-feature-loop={title}
          className={`transition-opacity duration-300 motion-reduce:transition-none ${revealed ? 'opacity-20' : 'opacity-100'}`}
        >
          <div data-feature-loop-stack="true" className="relative max-w-[350px]">
            {loop.steps.map((step, index) => (
              <div key={step.label}>
                <LoopPill label={step.label} core={step.coreLoop} resourceDelta={step.resourceDelta} />
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
            {loop.loop && <LoopReturn color="#1E7BA8" strokeWidth={1.3} />}
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
        className={`-mt-[99px] flex min-h-0 items-start justify-end transition-opacity duration-300 motion-reduce:transition-none ${revealed ? 'opacity-20' : 'opacity-100'}`}
      >
        <figure data-feature-frame="true" className="inline-flex h-[calc(100vh-228px)] w-fit overflow-hidden rounded-2xl border-2 border-cm-wood/50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={concept.mockup} alt={`${title} feature mockup`} className="h-full max-h-none w-auto rounded-xl object-contain" />
        </figure>
      </div>
    </div>
  )
}
