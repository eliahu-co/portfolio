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

type DiagramInteraction = {
  hovered: boolean
  focused: boolean
}

const IDLE: DiagramInteraction = { hovered: false, focused: false }

export default function Slide03Approach({ slideKey }: OpeningSlideProps) {
  const [interaction, setInteraction] = useState<DiagramInteraction>(IDLE)
  const [playInteraction, setPlayInteraction] = useState<DiagramInteraction>(IDLE)
  const reset = useCallback(() => {
    setInteraction(IDLE)
    setPlayInteraction(IDLE)
  }, [])
  const showDiagram = interaction.hovered || interaction.focused
  const showPlayDrawing = playInteraction.hovered || playInteraction.focused
  useDeckReset(reset, slideKey)

  return (
    <SlideShell>
      <SlideTitle>Approach</SlideTitle>
      <section aria-label="Product approach" className="mt-16 flex min-h-0 flex-1 flex-col">
        <ol className="relative z-20 flex shrink-0 items-center gap-5">
          {APPROACH_STEPS.map((step, index) => {
            const triggersDiagram = step.label === 'Map systems & economy'
            const triggersPlayDrawing = step.label === 'Play the game'
            return (
              <li key={step.label} className="relative min-w-0 flex-1">
                {triggersDiagram || triggersPlayDrawing ? (
                  <button
                    type="button"
                    data-deck-interactive="true"
                    data-approach-pill="true"
                    data-blue-surface="true"
                    aria-expanded={triggersDiagram ? showDiagram : showPlayDrawing}
                    aria-controls={triggersDiagram ? 'approach-core-loop-diagram' : 'approach-play-game-drawing'}
                    onMouseEnter={() => (triggersDiagram ? setInteraction : setPlayInteraction)((current) => ({ ...current, hovered: true }))}
                    onMouseLeave={() => (triggersDiagram ? setInteraction : setPlayInteraction)((current) => ({ ...current, hovered: false }))}
                    onFocus={() => (triggersDiagram ? setInteraction : setPlayInteraction)((current) => ({ ...current, focused: true }))}
                    onBlur={() => (triggersDiagram ? setInteraction : setPlayInteraction)((current) => ({ ...current, focused: false }))}
                    className={`${SURFACE_CLASSES} focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#1E7BA8]`}
                  >
                    {step.label}
                  </button>
                ) : (
                  <div data-approach-pill="true" data-blue-surface="true" className={SURFACE_CLASSES}>
                    {step.label}
                  </div>
                )}
                {index < APPROACH_STEPS.length - 1 && (
                  <FlowArrow
                    data-approach-connector="true"
                    className="absolute left-full top-1/2 h-[14px] w-5 -translate-y-1/2"
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
            className={`absolute inset-x-0 top-0 mx-auto w-full transition-opacity duration-300 motion-reduce:transition-none ${showDiagram ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            style={{ maxWidth: 'min(720px, 74vh)' }}
          >
            <CoreLoopDiagram />
          </div>
        </div>
      </section>
    </SlideShell>
  )
}
