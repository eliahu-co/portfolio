'use client'

import Image from 'next/image'
import { useCallback, useState } from 'react'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import { useDeckReset } from '../useDeckReset'
import type { OpeningSlideProps } from './Slide01Cover'

const VALIDATION_ROADMAP = [
  {
    title: 'Feature Validation',
    description: 'Test whether Card Bounty lifts Coin consumption and ARPDAU while Collection and Village progression remain healthy.',
    image: '/coinmaster/resources/ab-test-emoji.png',
    primary: true,
  },
  {
    title: 'Meter Goal Calibration',
    description: 'Compare the baseline meter with a lower requirement to find the goal that increases Chest spend without over-accelerating Collection completion.',
    image: '/coinmaster/resources/card-bounty-meter.png',
    primary: false,
  },
  {
    title: 'Chest Tier Weighting',
    description: 'Increase the Magical Chest contribution to test whether stronger progress shifts Coin spend toward the highest-value Chest.',
    image: '/coinmaster/resources/chest-tier-weighting.png',
    primary: false,
  },
  {
    title: 'Multiple Milestones',
    description: 'Compare one final guarantee with intermediate meter milestones to test whether visible progress sustains Chest purchasing without over-accelerating rewards.',
    image: '/coinmaster/resources/card-bounty-milestone-meter.png',
    primary: false,
  },
  {
    title: 'Paid Progress Carryover',
    description: 'Test whether spending Gems to preserve progress after selecting a new target creates incremental Gem demand without weakening participation.',
    image: '/coinmaster/resources/keep-progress-button.png',
    primary: false,
  },
] as const

export default function SlideValidationRoadmap({ slideKey }: OpeningSlideProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [focused, setFocused] = useState<string | null>(null)
  const active = focused ?? hovered
  const reset = useCallback(() => {
    setHovered(null)
    setFocused(null)
  }, [])

  useDeckReset(reset, slideKey)

  return (
    <SlideShell>
      <Eyebrow>Test Plan</Eyebrow>
      <SlideTitle>Validate, calibrate, evolve</SlideTitle>

      <div className="mt-7 max-w-[1120px] divide-y divide-charcoal/15">
        {VALIDATION_ROADMAP.map((test) => {
          const selected = active === test.title
          const faded = active !== null && !selected

          return (
            <button
              key={test.title}
              type="button"
              data-deck-interactive="true"
              data-validation-roadmap-test={test.title}
              data-primary-test={test.primary ? 'true' : 'false'}
              className={`grid min-h-[78px] w-full grid-cols-[128px_1fr] items-center gap-5 border-0 bg-transparent py-2 text-left transition-opacity duration-300 motion-reduce:transition-none focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#1E7BA8] ${faded ? 'opacity-20' : 'opacity-100'}`}
              onMouseEnter={() => setHovered(test.title)}
              onMouseLeave={() => setHovered((current) => current === test.title ? null : current)}
              onFocus={() => setFocused(test.title)}
              onBlur={() => setFocused((current) => current === test.title ? null : current)}
            >
              <span className="flex h-14 w-28 items-center justify-center">
                <Image
                  src={test.image}
                  alt=""
                  width={112}
                  height={56}
                  className="h-14 w-28 object-contain"
                />
              </span>
              <span className="min-w-0">
                <span className="flex items-baseline gap-3">
                  <span className={`font-serif leading-tight text-cm-violet-deep ${test.primary ? 'text-[22px] font-black' : 'text-[19px] font-bold'}`}>
                    {test.title}
                  </span>
                </span>
                <span className="mt-1 block max-w-[860px] font-sans text-[14px] leading-snug text-charcoal">
                  {test.description}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </SlideShell>
  )
}
