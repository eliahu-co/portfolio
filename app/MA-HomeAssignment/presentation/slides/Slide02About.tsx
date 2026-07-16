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
      <div className="absolute right-[-72px] top-[-82px] h-[230px] w-[230px] rounded-full border-[32px] border-cm-gold/25" aria-hidden="true" />
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
            Architect, Product Manager
          </p>

          <figure className="mt-7 overflow-hidden rounded-[26px] border-4 border-cm-wood bg-white p-2 shadow-[10px_10px_0_rgba(245,168,0,0.32)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/presentation/family.jpeg"
              alt="Eliahu and family"
              className="h-[270px] w-full rounded-[17px] object-cover"
            />
          </figure>
        </div>

        <div className="flex h-full max-h-[500px] flex-col justify-between py-3">
          <ol
            aria-label="Personal timeline"
            className="flex items-center rounded-2xl border-2 border-cm-violet-deep/20 bg-white/70 px-5 py-4 shadow-[0_8px_24px_rgba(42,27,84,0.08)]"
          >
            {TIMELINE.map((place, index) => (
              <li key={place} className="flex min-w-0 flex-1 items-center">
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
                    className="min-h-11 rounded-full border-2 border-cm-crimson bg-cm-crimson px-4 py-2 font-sans text-[14px] font-extrabold uppercase tracking-[0.1em] text-white transition-colors hover:border-cm-wood hover:bg-cm-gold hover:text-cm-violet-deep focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#1E7BA8]"
                  >
                    {place}
                  </button>
                ) : (
                  <span className="inline-flex min-h-11 items-center rounded-full border-2 border-cm-violet-deep/25 bg-cm-cream px-4 py-2 font-sans text-[14px] font-extrabold uppercase tracking-[0.1em] text-cm-violet-deep">
                    {place}
                  </span>
                )}
                {index < TIMELINE.length - 1 && (
                  <span aria-hidden="true" className="mx-2 text-[22px] font-black text-[#1E7BA8]">→</span>
                )}
              </li>
            ))}
          </ol>

          <ul aria-label="About Eliahu" className="mt-7 grid grid-cols-2 gap-4">
            {BULLETS.map((bullet, index) => (
              <li
                key={bullet}
                className="flex min-h-[70px] items-center gap-3 rounded-2xl border border-cm-wood/25 bg-white/70 px-4 py-3 font-sans text-[17px] font-bold leading-snug text-[#1A1A1A] shadow-[0_6px_18px_rgba(42,27,84,0.07)]"
              >
                <span
                  aria-hidden="true"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cm-gold text-[14px] font-black text-cm-violet-deep"
                >
                  {index + 1}
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SlideShell>
  )
}
