'use client'

import { useCallback, useState } from 'react'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import { useDeckReset } from '../useDeckReset'
import type { OpeningSlideProps } from './Slide01Cover'
import { FlowArrow } from '../components/FlowArrow'

const TIMELINE = ['Brazil', 'Holland', 'Israel'] as const

const BULLETS = [
  '31 years old',
  'Married',
  'Crossfitter',
  '7 years of Aliyah',
  '10 years in the AEC industry',
  '6 years in ConTech',
] as const

type BrazilInteraction = {
  hovered: boolean
  focused: boolean
}

const IDLE: BrazilInteraction = {
  hovered: false,
  focused: false,
}

export default function Slide02About({ slideKey }: OpeningSlideProps) {
  const [interaction, setInteraction] = useState<BrazilInteraction>(IDLE)
  const reset = useCallback(() => setInteraction(IDLE), [])
  const showEduardo = interaction.hovered || interaction.focused

  useDeckReset(reset, slideKey)

  return (
    <SlideShell className="relative">
      <Eyebrow>About</Eyebrow>
      <SlideTitle id="about-name">
        <span className="relative inline-block whitespace-nowrap">
          <span aria-hidden="true" className="invisible">Eduardo Cohen</span>
          <span
            aria-hidden={showEduardo}
            className={`absolute left-0 top-0 transition-opacity duration-300 motion-reduce:transition-none print:!opacity-100 ${showEduardo ? 'opacity-0' : 'opacity-100'}`}
          >
            Eliahu Cohen
          </span>
          <span
            aria-hidden={!showEduardo}
            className={`absolute left-0 top-0 transition-opacity duration-300 motion-reduce:transition-none print:!opacity-0 ${showEduardo ? 'opacity-100' : 'opacity-0'}`}
          >
            Eduardo Cohen
          </span>
        </span>
      </SlideTitle>
      <p className="font-serif text-[64px] font-black leading-[1.04] tracking-[-0.01em] text-cm-violet-deep">
        Product Manager
      </p>

      <div className="mt-8 grid min-h-0 flex-1 grid-cols-[320px_1fr] items-stretch gap-10">
        <figure
          data-ma-photo-frame="true"
          className="self-start overflow-hidden rounded-2xl border-2 border-cm-wood/50 bg-white p-1 shadow-[0_3px_0_rgba(144,57,0,0.28)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/presentation/family.jpeg"
            alt="Eliahu and family"
            className="h-[300px] w-full rounded-xl object-cover"
          />
        </figure>

        <div className="flex h-[310px] flex-col justify-between py-1">
          <ol aria-label="Personal timeline" className="flex w-full items-center gap-5">
            {TIMELINE.map((place, index) => (
              <li
                key={place}
                data-journey-pill="true"
                className="relative flex min-w-0 flex-1 items-center"
              >
                {place === 'Brazil' ? (
                  <button
                    type="button"
                    data-deck-interactive="true"
                    aria-expanded={showEduardo}
                    aria-controls="about-name"
                    onMouseEnter={() => setInteraction((current) => ({ ...current, hovered: true }))}
                    onMouseLeave={() => setInteraction((current) => ({ ...current, hovered: false }))}
                    onFocus={() => setInteraction((current) => ({ ...current, focused: true }))}
                    onBlur={() => setInteraction((current) => ({ ...current, focused: false }))}
                    className="min-h-11 w-full rounded-lg border border-[#1E7BA8]/30 bg-gradient-to-b from-[#F0FAFE] to-[#DBF1FC] px-5 py-2 font-sans text-[14px] font-extrabold uppercase tracking-[0.1em] text-[#0d3a5a] shadow-[0_2px_0_rgba(30,123,168,0.16)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#1E7BA8]"
                  >
                    {place}
                  </button>
                ) : (
                  <span className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-[#1E7BA8]/30 bg-gradient-to-b from-[#F0FAFE] to-[#DBF1FC] px-5 py-2 font-sans text-[14px] font-extrabold uppercase tracking-[0.1em] text-[#0d3a5a] shadow-[0_2px_0_rgba(30,123,168,0.16)]">
                    {place}
                  </span>
                )}
                {index < TIMELINE.length - 1 && (
                  <FlowArrow
                    data-journey-connector="true"
                    className="absolute left-full top-1/2 h-[14px] w-5 -translate-y-1/2"
                    color="rgba(30,123,168,0.65)"
                  />
                )}
              </li>
            ))}
          </ol>

          <ul aria-label="About Eliahu" className="grid grid-cols-2 gap-x-10 gap-y-5">
            {BULLETS.map((bullet) => (
              <li
                key={bullet}
                data-flat-fact="true"
                className="font-sans text-[18px] leading-relaxed text-[#1A1A1A]"
              >
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SlideShell>
  )
}
