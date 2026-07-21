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

/**
 * The title is the roadmap's own summary: each word names a stage, and the rows
 * below are what that stage actually tests. Hovering a word holds it and its
 * tests and drops everything else, so the grouping the sentence implies can be
 * seen rather than inferred. Every row belongs to exactly one word.
 */
const ROADMAP_STAGES = [
  { word: 'Validate', tests: ['Feature Validation'] },
  { word: 'calibrate', tests: ['Meter Goal Calibration', 'Chest Tier Weighting'] },
  { word: 'evolve', tests: ['Multiple Milestones', 'Paid Progress Carryover'] },
] as const

type Stage = (typeof ROADMAP_STAGES)[number]['word']

export default function SlideValidationRoadmap({ slideKey }: OpeningSlideProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [focused, setFocused] = useState<string | null>(null)
  const [hoveredStage, setHoveredStage] = useState<Stage | null>(null)
  const [focusedStage, setFocusedStage] = useState<Stage | null>(null)
  const activeRow = focused ?? hovered
  const activeStage = focusedStage ?? hoveredStage
  // a stage lights its whole group; a row on its own lights only itself
  const activeTests = activeStage
    ? ROADMAP_STAGES.find((stage) => stage.word === activeStage)!.tests
    : activeRow
      ? [activeRow]
      : []
  const reset = useCallback(() => {
    setHovered(null)
    setFocused(null)
    setHoveredStage(null)
    setFocusedStage(null)
  }, [])

  useDeckReset(reset, slideKey)

  return (
    <SlideShell>
      <Eyebrow>Test Plan</Eyebrow>
      {/* splitting the sentence into buttons makes the accessible name assemble
          from three separate nodes, so it is stated here to stay one sentence */}
      <SlideTitle aria-label="Validate, calibrate, evolve">
        {ROADMAP_STAGES.map((stage, index) => (
          <span key={stage.word}>
            {/* the separators belong to no stage, so they recede with the sentence */}
            {index > 0 ? (
              <span
                data-roadmap-separator="true"
                className={`transition-opacity duration-300 motion-reduce:transition-none ${activeStage ? 'opacity-20' : 'opacity-100'}`}
              >
                {', '}
              </span>
            ) : null}
            <button
              type="button"
              data-deck-interactive="true"
              data-roadmap-stage={stage.word}
              data-stage-active={activeStage === stage.word ? 'true' : 'false'}
              className={`border-0 bg-transparent p-0 font-serif font-black leading-[inherit] tracking-[inherit] text-inherit transition-opacity duration-300 motion-reduce:transition-none focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#1E7BA8] ${activeStage && activeStage !== stage.word ? 'opacity-20' : 'opacity-100'}`}
              onMouseEnter={() => setHoveredStage(stage.word)}
              onMouseLeave={() => setHoveredStage((current) => (current === stage.word ? null : current))}
              onFocus={() => setFocusedStage(stage.word)}
              onBlur={() => setFocusedStage((current) => (current === stage.word ? null : current))}
            >
              {stage.word}
            </button>
          </span>
        ))}
      </SlideTitle>

      <div className="mt-7 max-w-[1120px] divide-y divide-charcoal/15">
        {VALIDATION_ROADMAP.map((test) => {
          const selected = (activeTests as readonly string[]).includes(test.title)
          const faded = activeTests.length > 0 && !selected

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
