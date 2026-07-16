'use client'

import { useCallback, useState } from 'react'
import CoreLoopDiagram from '@/app/MA-HomeAssignment/sections/CoreLoopDiagram'
import { APPROACH_STEPS } from '../deckData'
import { SlideShell, SlideTitle } from '../primitives'
import { useDeckReset } from '../useDeckReset'
import type { OpeningSlideProps } from './Slide01Cover'
import { FlowArrow } from '../components/FlowArrow'

const SURFACE_CLASSES = 'flex min-h-[96px] w-full items-center justify-center rounded-lg border px-4 py-3 text-center font-sans text-[16px] font-extrabold leading-snug text-[#0d3a5a]'

type DiagramInteraction = {
  hovered: boolean
  focused: boolean
}

const IDLE: DiagramInteraction = { hovered: false, focused: false }

export default function Slide03Approach({ slideKey }: OpeningSlideProps) {
  const [interaction, setInteraction] = useState<DiagramInteraction>(IDLE)
  const reset = useCallback(() => setInteraction(IDLE), [])
  const showDiagram = interaction.hovered || interaction.focused
  useDeckReset(reset, slideKey)

  return (
    <SlideShell>
      <SlideTitle>Approach</SlideTitle>
      <section aria-label="Product approach" className="mt-16 flex-1">
        <ol className="flex items-center gap-5">
          {APPROACH_STEPS.map((step, index) => {
            const triggersDiagram = step.label === 'Map systems & economy'
            return (
              <li key={step.label} className="relative min-w-0 flex-1">
                {triggersDiagram ? (
                  <button
                    type="button"
                    data-deck-interactive="true"
                    data-approach-pill="true"
                    data-blue-surface="true"
                    aria-expanded={showDiagram}
                    aria-controls="approach-core-loop-diagram"
                    onMouseEnter={() => setInteraction((current) => ({ ...current, hovered: true }))}
                    onMouseLeave={() => setInteraction((current) => ({ ...current, hovered: false }))}
                    onFocus={() => setInteraction((current) => ({ ...current, focused: true }))}
                    onBlur={() => setInteraction((current) => ({ ...current, focused: false }))}
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

        <div
          id="approach-core-loop-diagram"
          data-approach-diagram="true"
          aria-hidden={!showDiagram}
          className={`mx-auto mt-4 w-full transition-opacity duration-300 motion-reduce:transition-none ${showDiagram ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          style={{ maxWidth: 'min(720px, 74vh)' }}
        >
          <CoreLoopDiagram />
        </div>
      </section>
    </SlideShell>
  )
}
