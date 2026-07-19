'use client'

import { useCallback, useState } from 'react'
import { ValidationTable } from '../components/ValidationTable'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import { useDeckReset } from '../useDeckReset'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide19Metrics({ slideKey }: OpeningSlideProps) {
  const [showTargets, setShowTargets] = useState(false)
  const reset = useCallback(() => setShowTargets(false), [])
  useDeckReset(reset, slideKey)

  return (
    <SlideShell>
      <Eyebrow>
        <button
          type="button"
          data-deck-interactive="true"
          data-targets-toggle="true"
          aria-expanded={showTargets}
          aria-controls="metric-group-panel"
          onClick={() => setShowTargets((shown) => !shown)}
          className="border-0 bg-transparent p-0 font-[inherit] uppercase leading-[inherit] tracking-[inherit] text-[inherit] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#1E7BA8]"
        >
          Success criteria
        </button>
      </Eyebrow>
      <SlideTitle>ARPDAU{showTargets ? <> <span data-title-target="true">≥5%</span></> : null} lift</SlideTitle>
      <div className="mt-2 min-h-0 flex-1"><ValidationTable slideKey={slideKey} showTargets={showTargets} /></div>
    </SlideShell>
  )
}
