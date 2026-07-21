'use client'

import { Fragment, useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import type { PresentationConcept } from '../deckData'
import type { WorkflowStep } from '@/app/MA-HomeAssignment/sections/UseCase'
import { useDeckReset, type DeckSlideKey } from '../useDeckReset'
import LoopReturn from '@/app/MA-HomeAssignment/sections/LoopReturn'
import { FlowArrow } from './FlowArrow'

const METRIC_LINES: Record<string, readonly string[]> = {
  'Coin spend on Hometown per DAU': ['Coin spend per DAU', 'on Hometown'],
  'Return sessions per Hometown user': ['Return sessions', 'per Hometown user'],
  'Coin Spend on Chests per DAU': ['Coin spend per DAU', 'on Chests'],
  'Spin consumption per exposed DAU': ['Spin consumption', 'per exposed DAU'],
}

function LoopPill({
  label,
  core,
  resourceDelta,
  active,
  onActivate,
}: Pick<WorkflowStep, 'label' | 'coreLoop' | 'resourceDelta'> & {
  core?: boolean
  active: boolean
  onActivate: () => void
}) {
  const resourceName = resourceDelta?.resource === 'coin'
    ? 'Coins'
    : resourceDelta?.resource === 'spin'
      ? 'Spins'
      : resourceDelta?.resource === 'gem'
        ? 'Gems'
        : 'Card'
  const resourceLabel = resourceDelta
    ? `${resourceDelta.direction === 'spend' ? 'Spend' : 'Gain'} ${resourceName}`
    : null

  return (
    <div
      data-loop-step="true"
      data-loop-step-active={active ? 'true' : 'false'}
      data-active={active ? 'true' : undefined}
      data-blue-surface={core ? undefined : 'true'}
      data-wood-surface={core ? 'true' : undefined}
      onMouseEnter={onActivate}
      className={`${core
      ? 'relative rounded-lg border px-4 py-2 text-center font-sans text-[14px] font-normal leading-snug text-cm-wood'
      : 'relative rounded-lg border px-4 py-2 text-center font-sans text-[14px] font-normal leading-snug text-[#0d3a5a]'} ${active ? 'opacity-100' : 'opacity-60'} transition-opacity duration-200 motion-reduce:transition-none`}>
      <span className={resourceDelta ? 'block px-10' : undefined}>{label}</span>
      {resourceDelta && (
        <span
          data-resource-indicator="true"
          aria-label={resourceLabel!}
          className={`absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center leading-none transition-opacity duration-200 motion-reduce:transition-none ${active ? 'opacity-100' : 'opacity-25'}`}
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

// 'risk-notes' is the risks block clicked a second time: still open, now with
// each risk's answer beside it. A concept without notes skips that state.
type Detail = 'monetization' | 'risks' | 'risk-notes' | null

export type FeatureSlideProps = {
  readonly concept: PresentationConcept
  readonly loop: PresentationConcept['loop']
  readonly title: string
  readonly slideKey: DeckSlideKey
  readonly isActive?: boolean
}

export function FeatureSlide({ concept, loop, title, slideKey, isActive = false }: FeatureSlideProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [openDetail, setOpenDetail] = useState<Detail>(null)
  const reset = useCallback(() => {
    setActiveStepIndex(0)
    setOpenDetail(null)
  }, [])
  useDeckReset(reset, slideKey)

  const riskNotes = concept.riskNotes
  const risksOpen = openDetail === 'risks' || openDetail === 'risk-notes'
  // click cycles closed -> risks -> risks with their answers -> closed, so the
  // block can still be dismissed rather than sticking on the last step
  const advanceRisks = useCallback(() => {
    setOpenDetail((current) => {
      if (current !== 'risks' && current !== 'risk-notes') return 'risks'
      if (current === 'risks' && riskNotes) return 'risk-notes'
      return null
    })
  }, [riskNotes])

  // Down and Up walk the loop from the keyboard, moving the same step hover
  // moves so a presenter can talk through it without the mouse. Steps wrap,
  // because the diagram itself returns from the last step to the first.
  //
  // Every slide in the deck stays mounted, so all three loops would answer one
  // key press; only the slide on screen listens. The deck reserves Left, Right,
  // and Space for navigation and leaves the vertical arrows free.
  const stepCount = loop.steps.length
  useEffect(() => {
    if (!isActive) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
      event.preventDefault()
      const delta = event.key === 'ArrowDown' ? 1 : -1
      setActiveStepIndex((index) => (index + delta + stepCount) % stepCount)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isActive, stepCount])
  const activeImage = loop.steps[activeStepIndex]?.hoverImage ?? concept.mockup

  return (
    <div data-feature-layout={title} className="grid h-full grid-cols-[0.72fr_1fr] gap-10">
      <div className="relative flex min-h-0 flex-col">
        <section
          aria-label={`${title} loop`}
          data-feature-loop={title}
          className="relative h-[calc(100vh-327px)]"
        >
          <div data-feature-loop-stack="true" className="relative max-w-[350px]">
            {loop.steps.map((step, index) => (
              <div key={step.label}>
                <LoopPill
                  label={step.label}
                  core={step.coreLoop}
                  resourceDelta={step.resourceDelta}
                  active={activeStepIndex === index}
                  onActivate={() => setActiveStepIndex(index)}
                />
                {index < loop.steps.length - 1 && (
                  <FlowArrow
                    direction="down"
                    color="#1E7BA8"
                    data-feature-loop-arrow="true"
                    className={`mx-auto h-[20px] w-[14px] transition-opacity duration-200 motion-reduce:transition-none ${activeStepIndex === index ? 'opacity-100' : 'opacity-30'}`}
                  />
                )}
              </div>
            ))}
            {loop.loop && (
              <LoopReturn
                color="#1E7BA8"
                strokeWidth={1.3}
                className={`transition-opacity duration-200 motion-reduce:transition-none ${activeStepIndex === loop.steps.length - 1 ? 'opacity-100' : 'opacity-30'}`}
              />
            )}
          </div>
          <div
            data-feature-disclosures="true"
            className="mt-16 flex w-[188%] max-w-none flex-col gap-8"
          >
            <div
              data-feature-monetization={title}
              role="button"
              tabIndex={0}
              aria-label="Monetization details"
              aria-pressed={openDetail === 'monetization'}
              onClick={() => setOpenDetail((current) => current === 'monetization' ? null : 'monetization')}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  setOpenDetail((current) => current === 'monetization' ? null : 'monetization')
                }
              }}
              className={`flex w-full max-w-none cursor-pointer select-none flex-row items-center gap-4 rounded-lg transition-opacity duration-200 [&_*]:cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cm-blue motion-reduce:transition-none ${openDetail === 'monetization' ? 'opacity-100' : 'opacity-25'}`}
            >
              <Image
                src="/coinmaster/resources/shop-emoji.png"
                alt=""
                width={56}
                height={56}
                className="h-14 w-14 shrink-0 object-contain"
              />
              <div data-feature-monetization-content="true" className="w-full text-left">
                <p className="font-sans text-[18px] leading-5 text-charcoal">
                  {concept.monetizationSummary}
                </p>
                <ul
                  data-feature-metrics="true"
                  className="mt-2 flex items-start gap-2 font-sans text-[10px] font-medium uppercase leading-[10px] tracking-[0.1em] text-charcoal/70"
                >
                  {[concept.metrics.primary, ...concept.metrics.supporting].map((metric, index) => (
                    <Fragment key={metric}>
                      {index > 0 && (
                        <li
                          data-metric-separator="true"
                          aria-hidden="true"
                          className="shrink-0 text-[7px] text-charcoal/70"
                        >
                          •
                        </li>
                      )}
                      <li
                        aria-label={metric}
                        className={index === 0 ? 'shrink-0 font-semibold text-charcoal' : 'shrink-0'}
                      >
                        {(METRIC_LINES[metric] ?? [metric]).map((line) => (
                          <span key={line} className="block whitespace-nowrap">{line}</span>
                        ))}
                      </li>
                    </Fragment>
                  ))}
                </ul>
              </div>
            </div>
            <div
              data-feature-risks={title}
              role="button"
              tabIndex={0}
              aria-label="Risk details"
              aria-pressed={risksOpen}
              data-risk-notes-open={openDetail === 'risk-notes' ? 'true' : 'false'}
              onClick={advanceRisks}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  advanceRisks()
                }
              }}
              // the notes need room to sit beside the titles rather than under them
              className={`flex cursor-pointer select-none flex-row items-center gap-4 rounded-lg transition-opacity duration-200 [&_*]:cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cm-blue motion-reduce:transition-none ${openDetail === 'risk-notes' ? 'max-w-none' : 'max-w-[368px]'} ${risksOpen ? 'opacity-100' : 'opacity-25'}`}
            >
              <Image
                src="/coinmaster/resources/risk-emoji.png"
                alt=""
                width={56}
                height={56}
                className="h-14 w-14 shrink-0 object-contain"
              />
              <div data-feature-risk-content="true" className="w-full text-left">
                <ul className="space-y-1 font-sans text-[18px] leading-5 text-charcoal">
                  {concept.risks.map((risk) => (
                    <li key={risk.title} className="flex items-baseline gap-3">
                      <span className="shrink-0">{risk.title}</span>
                      {openDetail === 'risk-notes' && riskNotes?.[risk.title] ? (
                        // same size and face as the risk it answers, dropped in
                        // weight so the risk still reads as the headline
                        <span data-risk-note={risk.title} className="whitespace-nowrap text-charcoal/45">
                          {riskNotes[risk.title]}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div
        data-feature-image={title}
        className="-mt-[99px] flex min-h-0 items-start justify-end"
      >
          <figure
            data-feature-frame="true"
            style={{ borderColor: 'rgb(30, 123, 168)' }}
            className="inline-flex h-[calc(100vh-228px)] w-fit overflow-hidden rounded-2xl border-[1.5px]"
          >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={activeImage} alt={`${title} feature mockup`} className="h-full max-h-none w-auto rounded-xl object-contain" />
        </figure>
      </div>
    </div>
  )
}
