'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'
import CoreLoopDiagram from '@/app/MA-HomeAssignment/sections/CoreLoopDiagram'
import { APPROACH_STEPS } from '../deckData'
import { SlideShell, SlideTitle } from '../primitives'
import { useDeckReset } from '../useDeckReset'
import type { OpeningSlideProps } from './Slide01Cover'
import { FlowArrow } from '../components/FlowArrow'

const SURFACE_CLASSES = 'flex min-h-[96px] w-full items-center justify-center rounded-lg border px-4 py-3 text-center font-sans text-[16px] font-normal leading-snug text-[#0d3a5a]'

type Reveal = 'play' | 'map' | null

const ECONOMY_ITEMS = [
  { label: 'Spin', definition: 'Primary action and monetized energy.', src: '/coinmaster/resources/spin-emoji.png' },
  { label: 'Coin', definition: 'Core progression currency.', src: '/coinmaster/resources/coin-emoji.png' },
  { label: 'Star', definition: 'Status and progression signal.', src: '/coinmaster/resources/star-emoji.png' },
  { label: 'Gem', definition: 'Premium acceleration currency.', src: '/coinmaster/resources/gem-emoji.png' },
] as const

export default function Slide03Approach({ slideKey }: OpeningSlideProps) {
  const [activeReveal, setActiveReveal] = useState<Reveal>(null)
  const [activeStep, setActiveStep] = useState<string | null>(null)
  const reset = useCallback(() => {
    setActiveReveal(null)
    setActiveStep(null)
  }, [])
  const showDiagram = activeReveal === 'map'
  const showPlayDrawing = activeReveal === 'play'
  useDeckReset(reset, slideKey)

  return (
    <SlideShell>
      <SlideTitle>Approach</SlideTitle>
      <section aria-label="Product approach" className="mt-16 flex min-h-0 flex-1 flex-col">
        <ol className="relative z-20 flex shrink-0 items-center gap-5">
          {APPROACH_STEPS.map((step, index) => {
            const triggersDiagram = step.label === 'Map'
            const triggersPlayDrawing = step.label === 'Play'
            const reveal: Reveal = triggersDiagram ? 'map' : triggersPlayDrawing ? 'play' : null
            const isActive = activeStep === step.label
            const focusClass = activeStep && !isActive ? 'opacity-30' : 'opacity-100'
            return (
              <li
                key={step.label}
                data-approach-active={isActive}
                className="relative min-w-0 flex-1"
                onMouseEnter={() => {
                  setActiveStep(step.label)
                  setActiveReveal(reveal)
                }}
              >
                {triggersDiagram || triggersPlayDrawing ? (
                  <button
                    type="button"
                    data-deck-interactive="true"
                    data-approach-pill="true"
                    data-blue-surface="true"
                    aria-expanded={triggersDiagram ? showDiagram : showPlayDrawing}
                    aria-controls={triggersDiagram ? 'approach-core-loop-diagram' : 'approach-play-game-drawing'}
                    onFocus={() => {
                      setActiveStep(step.label)
                      setActiveReveal(reveal)
                    }}
                    className={`${SURFACE_CLASSES} ${focusClass} transition-opacity duration-200 motion-reduce:transition-none focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#1E7BA8]`}
                  >
                    {step.label}
                  </button>
                ) : (
                  <div data-approach-pill="true" data-blue-surface="true" className={`${SURFACE_CLASSES} ${focusClass} transition-opacity duration-200 motion-reduce:transition-none`}>
                    {step.label}
                  </div>
                )}
                {index < APPROACH_STEPS.length - 1 && (
                  <FlowArrow
                    data-approach-connector="true"
                    className={`absolute left-full top-1/2 h-[14px] w-5 -translate-y-1/2 transition-opacity duration-200 motion-reduce:transition-none ${activeStep ? 'opacity-30' : 'opacity-100'}`}
                    color="#1E7BA8"
                  />
                )}
              </li>
            )
          })}
        </ol>

        <div data-approach-reveal-stage="true" className="relative mb-14 mt-8 min-h-0 w-full flex-1">
          <div
            id="approach-play-game-drawing"
            data-play-game-drawing="true"
            aria-hidden={!showPlayDrawing}
            className={`absolute inset-0 transition-opacity duration-300 motion-reduce:transition-none ${showPlayDrawing ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          >
            <Image
              src="/coinmaster/approach-notes.webp"
              alt=""
              fill
              sizes="(min-width: 1280px) 1152px, 90vw"
              className="object-contain object-left-top"
            />
          </div>

          <div
            id="approach-core-loop-diagram"
            data-approach-diagram="true"
            aria-hidden={!showDiagram}
            className={`absolute left-0 right-0 top-0 flex items-start gap-14 transition-opacity duration-300 motion-reduce:transition-none ${showDiagram ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          >
            <div className="w-[min(720px,74vh)] shrink-0">
              <CoreLoopDiagram />
            </div>
            <div data-economy-legend="true" role="list" aria-label="Coin Master economy signals" className="grid flex-1 gap-4 pt-3">
              {ECONOMY_ITEMS.map((item) => (
                <div key={item.label} data-economy-item="true" role="listitem" className="flex items-center gap-4">
                  <Image src={item.src} alt={item.label} width={56} height={56} className="h-14 w-14 shrink-0 object-contain" />
                  <p className="whitespace-nowrap font-sans text-[15px] leading-tight text-cm-charcoal">
                    {item.definition}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SlideShell>
  )
}
