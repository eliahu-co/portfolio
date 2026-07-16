'use client'

import { useCallback, useState } from 'react'
import { ASSUMPTION_STORIES } from '../deckData'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import { useDeckReset } from '../useDeckReset'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide12Assumptions({ slideKey }: OpeningSlideProps) {
  const [hovered, setHovered] = useState<number | null>(null)
  const reset = useCallback(() => setHovered(null), [])
  useDeckReset(reset, slideKey)

  return (
    <SlideShell>
      <Eyebrow>Assumptions</Eyebrow>
      <SlideTitle className="text-[48px]">Assumptions</SlideTitle>
      <div className="mt-8 flex max-w-[1040px] flex-col gap-5">
        {ASSUMPTION_STORIES.map(({ assumption }, index) => (
          <div
            key={assumption}
            data-assumption="true"
            data-active={hovered === index ? 'true' : 'false'}
            data-deck-interactive="true"
            tabIndex={0}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(index)}
            onBlur={() => setHovered(null)}
            className={`border-cm-violet-deep pl-5 transition-opacity ${hovered !== null && hovered !== index ? 'opacity-20' : 'opacity-100'} ${index === 0 || index === ASSUMPTION_STORIES.length - 1 ? 'border-l-4' : 'border-l-8'}`}
          >
            <p className="font-sans text-[18px] leading-relaxed text-[#1A1A1A]">{assumption}</p>
          </div>
        ))}
      </div>
    </SlideShell>
  )
}
