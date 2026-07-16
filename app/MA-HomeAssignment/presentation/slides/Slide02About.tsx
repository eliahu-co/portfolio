'use client'

import { useCallback, useState } from 'react'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import { useDeckReset } from '../useDeckReset'
import type { OpeningSlideProps } from './Slide01Cover'

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

      <div className="grid flex-1 grid-cols-[0.82fr_1.18fr] items-center gap-12">
        <div>
          <SlideTitle id="about-name" className="text-[54px]">
            <span className="relative inline-block whitespace-nowrap">
              <span aria-hidden="true" className="invisible">Eduardo Cohen</span>
              <span
                aria-hidden={showEduardo}
                className={`absolute left-0 top-0 transition-opacity duration-300 print:!opacity-100 ${showEduardo ? 'opacity-0' : 'opacity-100'}`}
              >
                Eliahu Cohen
              </span>
              <span
                aria-hidden={!showEduardo}
                className={`absolute left-0 top-0 transition-opacity duration-300 print:!opacity-0 ${showEduardo ? 'opacity-100' : 'opacity-0'}`}
              >
                Eduardo Cohen
              </span>
            </span>
          </SlideTitle>
          <p className="mt-3 font-sans text-[24px] font-bold text-cm-violet-deep">
            Product Manager
          </p>

          <figure className="mt-7 overflow-hidden rounded-2xl border-2 border-cm-wood/50 bg-white shadow-[0_3px_0_rgba(144,57,0,0.28)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/presentation/family.jpeg"
              alt="Eliahu and family"
              className="h-[286px] w-full object-cover"
            />
          </figure>
        </div>

        <div className="flex h-full max-h-[500px] flex-col justify-center py-3">
          <ol
            aria-label="Personal timeline"
            className="flex w-full items-center"
          >
            {TIMELINE.map((place, index) => (
              <li key={place} className={`flex min-w-0 items-center ${index < TIMELINE.length - 1 ? 'flex-1' : ''}`}>
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
                    className="min-h-11 w-[132px] rounded-lg border border-[#1E7BA8]/30 bg-gradient-to-b from-[#F0FAFE] to-[#DBF1FC] px-5 py-2 font-sans text-[14px] font-extrabold uppercase tracking-[0.1em] text-[#0d3a5a] shadow-[0_2px_0_rgba(30,123,168,0.16)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#1E7BA8]"
                  >
                    {place}
                  </button>
                ) : (
                  <span className="inline-flex min-h-11 w-[132px] items-center justify-center rounded-lg border border-[#1E7BA8]/30 bg-gradient-to-b from-[#F0FAFE] to-[#DBF1FC] px-5 py-2 font-sans text-[14px] font-extrabold uppercase tracking-[0.1em] text-[#0d3a5a] shadow-[0_2px_0_rgba(30,123,168,0.16)]">
                    {place}
                  </span>
                )}
                {index < TIMELINE.length - 1 && (
                  <svg className="h-[14px] min-w-[28px] flex-1" viewBox="0 0 100 14" preserveAspectRatio="none" fill="none" aria-hidden="true">
                    <path d="M0 7 H99" stroke="rgba(30,123,168,0.45)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                    <path d="M94 2 L99 7 L94 12" stroke="rgba(30,123,168,0.45)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                  </svg>
                )}
              </li>
            ))}
          </ol>

          <ul aria-label="About Eliahu" className="mt-12 grid grid-cols-2 gap-x-10 gap-y-6">
            {BULLETS.map((bullet) => (
              <li
                key={bullet}
                className="font-sans text-[18px] font-bold leading-snug text-[#1A1A1A]"
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
