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

type Place = (typeof TIMELINE)[number]

// Each timeline place shows a matching photo on hover/focus; Israel keeps the
// current family photo (also the default when nothing is active).
const DEFAULT_IMAGE = '/presentation/family.jpeg'
const PLACE_IMAGES: Record<Place, string> = {
  Brazil: '/coinmaster/me-brazil.jpeg',
  Holland: '/coinmaster/me-holland.jpeg',
  Israel: DEFAULT_IMAGE,
}

const PLACE_IMAGE_ALTS: Record<Place, string> = {
  Brazil: 'Eliahu in Brazil',
  Holland: 'Eliahu in Holland',
  Israel: 'Eliahu and family',
}

export default function Slide02About({ slideKey }: OpeningSlideProps) {
  const [active, setActive] = useState<Place | null>(null)
  const reset = useCallback(() => setActive(null), [])
  const showEduardo = active === 'Brazil'
  const image = active ? PLACE_IMAGES[active] : DEFAULT_IMAGE

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
          style={{ borderColor: 'rgb(30, 123, 168)' }}
          className="self-start overflow-hidden rounded-2xl border-[1.5px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={active ? PLACE_IMAGE_ALTS[active] : 'Eliahu and family'}
            className="h-[300px] w-full object-cover"
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
                <button
                  type="button"
                  data-deck-interactive="true"
                  data-journey-surface="true"
                  data-blue-surface="true"
                  data-active={active === place ? 'true' : undefined}
                  aria-expanded={place === 'Brazil' ? showEduardo : undefined}
                  aria-controls={place === 'Brazil' ? 'about-name' : undefined}
                  onMouseEnter={() => setActive(place)}
                  onFocus={() => setActive(place)}
                  onClick={() => setActive(place)}
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border px-5 py-2 font-sans text-[14px] font-extrabold uppercase tracking-[0.1em] text-[#0d3a5a] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#1E7BA8]"
                >
                  {place}
                </button>
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

          <ul aria-label="About Eliahu" className="grid grid-cols-1 gap-y-2">
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
