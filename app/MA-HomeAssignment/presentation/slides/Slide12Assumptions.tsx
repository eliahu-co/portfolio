'use client'

import { useCallback, useState } from 'react'
import { ASSUMPTION_STORIES } from '../deckData'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import { useDeckReset } from '../useDeckReset'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide12Assumptions({ slideKey }: OpeningSlideProps) {
  const [hovered, setHovered] = useState<number | null>(null)
  const [focused, setFocused] = useState<number | null>(null)
  const active = focused ?? hovered
  const reset = useCallback(() => {
    setHovered(null)
    setFocused(null)
  }, [])
  useDeckReset(reset, slideKey)

  return (
    <SlideShell>
      <Eyebrow>Assumptions</Eyebrow>
      <SlideTitle>Assumptions</SlideTitle>
      <div className="mt-6 flex max-w-[1040px] flex-col gap-4">
        {ASSUMPTION_STORIES.map(({ assumption }, index) => (
          <div
            key={assumption}
            data-assumption="true"
            data-active={active === index ? 'true' : 'false'}
            data-deck-interactive="true"
            tabIndex={0}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setFocused(index)}
            onBlur={() => setFocused(null)}
            className={`py-1 transition-opacity duration-300 motion-reduce:transition-none ${active !== null && active !== index ? 'opacity-20' : 'opacity-100'}`}
          >
            <p className="font-sans text-[18px] leading-relaxed text-[#1A1A1A]">{assumption}</p>
          </div>
        ))}
      </div>
    </SlideShell>
  )
}
