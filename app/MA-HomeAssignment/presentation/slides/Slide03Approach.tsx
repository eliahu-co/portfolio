'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'
import CoreLoopDiagram from '@/app/MA-HomeAssignment/sections/CoreLoopDiagram'
import { APPROACH_STEPS, CONCEPTS } from '../deckData'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import { useDeckReset } from '../useDeckReset'
import type { OpeningSlideProps } from './Slide01Cover'
import { FlowArrow } from '../components/FlowArrow'

const SURFACE_CLASSES = 'flex min-h-[96px] w-full items-center justify-center rounded-lg border px-4 py-3 text-center font-sans text-[16px] font-normal leading-snug text-[#0d3a5a]'

type Reveal = 'play' | 'map' | 'research' | 'benchmark' | 'create' | 'decide' | 'test' | null

const VALIDATION_TESTS = [
  'Feature validation',
  'Meter goal calibration',
  'Paid progress carryover',
  'Chest tier weighting',
  'Multiple milestones',
] as const

const ECONOMY_ITEMS = [
  { label: 'Spin', definition: 'Primary action and monetized energy.', src: '/coinmaster/resources/spin-emoji.png' },
  { label: 'Coin', definition: 'Core progression currency.', src: '/coinmaster/resources/coin-emoji.png' },
  { label: 'Star', definition: 'Status and progression signal.', src: '/coinmaster/resources/star-emoji.png' },
  { label: 'Gem', definition: 'Premium acceleration currency.', src: '/coinmaster/resources/gem-emoji.png' },
] as const

const RESEARCH_SCREENSHOTS = [
  { label: 'Support', src: '/coinmaster/research/research-support.jpeg', alt: 'Coin Master official support pages research' },
  { label: 'Discord', src: '/coinmaster/research/research-discord.webp', alt: 'Coin Master advanced-play discussion on Discord' },
  { label: 'Reddit', src: '/coinmaster/research/research-reddit.webp', alt: 'Coin Master team recruitment discussion on Reddit' },
  { label: 'Facebook', src: '/coinmaster/research/research-facebook.webp', alt: 'Coin Master card-trading request on Facebook' },
  { label: 'YouTube', src: '/coinmaster/research/research-youtube.webp', alt: 'Coin Master advanced gameplay research on YouTube' },
] as const

const BENCHMARK_SCREENSHOTS = [
  { label: 'Royal Match', src: '/coinmaster/benchmark/benchmark-cauldron.webp', alt: 'Royal Match Magic Cauldron game mechanic benchmark' },
  { label: 'Monopoly GO!', src: '/coinmaster/benchmark/benchmark-community-chest.webp', alt: 'Monopoly GO! Community Chest cooperative mechanic benchmark' },
  { label: 'Dice Dreams', src: '/coinmaster/benchmark/benchmark-diner.webp', alt: 'Dice Dreams timed collection mini-game benchmark' },
] as const

// Piled vertically in the Create left column, Pet Equips on top.
const REJECTED_CONCEPTS = ['Pet Equips', 'Daily Memory Card'] as const

const PRESENTED_CONCEPTS = [
  { concept: CONCEPTS[2], logo: '/coinmaster/hot-trail-logo.png' },
  { concept: CONCEPTS[1], logo: '/coinmaster/card-bounty-logo.png' },
  { concept: CONCEPTS[0], logo: '/coinmaster/hometown-logo.png' },
] as const

export default function Slide03Approach({ slideKey }: OpeningSlideProps) {
  const [activeReveal, setActiveReveal] = useState<Reveal>(null)
  const [activeStep, setActiveStep] = useState<string | null>(null)
  const reset = useCallback(() => {
    setActiveReveal(null)
    setActiveStep(null)
  }, [])
  const showDiagram = activeReveal === 'map'
  const showPlayDrawing = activeReveal === 'play'
  const showResearchEvidence = activeReveal === 'research'
  const showBenchmarkEvidence = activeReveal === 'benchmark'
  const showCreateEvidence = activeReveal === 'create'
  const showDecisionEvidence = activeReveal === 'decide'
  const showTestEvidence = activeReveal === 'test'
  useDeckReset(reset, slideKey)

  return (
    <SlideShell>
      {/* invisible kicker reserves the same height as other slides' <Eyebrow>
          so the title aligns vertically with them */}
      <Eyebrow aria-hidden="true" className="invisible">Approach</Eyebrow>
      <SlideTitle>Approach</SlideTitle>
      <section aria-label="Product approach" className="mt-16 flex min-h-0 flex-1 flex-col">
        <ol className="relative z-20 flex shrink-0 items-center gap-5">
          {APPROACH_STEPS.map((step, index) => {
            const triggersDiagram = step.label === 'Map'
            const triggersPlayDrawing = step.label === 'Play'
            const triggersResearchEvidence = step.label === 'Research'
            const triggersBenchmarkEvidence = step.label === 'Benchmark'
            const triggersCreateEvidence = step.label === 'Create'
            const triggersDecisionEvidence = step.label === 'Decide'
            const triggersTestEvidence = step.label === 'Test'
            const reveal: Reveal = triggersDiagram ? 'map' : triggersPlayDrawing ? 'play' : triggersResearchEvidence ? 'research' : triggersBenchmarkEvidence ? 'benchmark' : triggersCreateEvidence ? 'create' : triggersDecisionEvidence ? 'decide' : triggersTestEvidence ? 'test' : null
            const revealId = triggersDiagram
              ? 'approach-core-loop-diagram'
              : triggersPlayDrawing
                ? 'approach-play-game-drawing'
                : triggersResearchEvidence
                  ? 'approach-research-evidence'
                  : triggersBenchmarkEvidence
                    ? 'approach-benchmark-evidence'
                    : triggersCreateEvidence
                      ? 'approach-create-evidence'
                      : triggersDecisionEvidence
                        ? 'approach-decision-evidence'
                        : 'approach-test-evidence'
            const revealIsVisible = triggersDiagram
              ? showDiagram
              : triggersPlayDrawing
                ? showPlayDrawing
                : triggersResearchEvidence
                  ? showResearchEvidence
                  : triggersBenchmarkEvidence
                    ? showBenchmarkEvidence
                    : triggersCreateEvidence
                      ? showCreateEvidence
                      : triggersDecisionEvidence
                        ? showDecisionEvidence
                        : showTestEvidence
            const isActive = activeStep === step.label
            const focusClass = activeStep && !isActive ? 'opacity-30' : 'opacity-100'
            return (
              <li
                key={step.label}
                data-approach-active={isActive}
                className="relative min-w-0 flex-1"
                onMouseEnter={() => {
                  setActiveStep(step.label)
                  setActiveReveal(reveal)
                }}
              >
                {reveal ? (
                  <button
                    type="button"
                    data-deck-interactive="true"
                    data-approach-pill="true"
                    data-blue-surface="true"
                    aria-expanded={revealIsVisible}
                    aria-controls={revealId}
                    onFocus={() => {
                      setActiveStep(step.label)
                      setActiveReveal(reveal)
                    }}
                    className={`${SURFACE_CLASSES} ${focusClass} transition-opacity duration-200 motion-reduce:transition-none focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#1E7BA8]`}
                  >
                    {step.label}
                  </button>
                ) : (
                  <div data-approach-pill="true" data-blue-surface="true" className={`${SURFACE_CLASSES} ${focusClass} transition-opacity duration-200 motion-reduce:transition-none`}>
                    {step.label}
                  </div>
                )}
                {index < APPROACH_STEPS.length - 1 && (
                  <FlowArrow
                    data-approach-connector="true"
                    className={`absolute left-full top-1/2 h-[14px] w-5 -translate-y-1/2 transition-opacity duration-200 motion-reduce:transition-none ${activeStep ? 'opacity-30' : 'opacity-100'}`}
                    color="#1E7BA8"
                  />
                )}
              </li>
            )
          })}
        </ol>

        <div data-approach-reveal-stage="true" className="relative mb-14 mt-8 min-h-0 w-full flex-1">
          <div
            id="approach-play-game-drawing"
            data-play-game-drawing="true"
            aria-hidden={!showPlayDrawing}
            className={`absolute inset-0 transition-opacity duration-300 motion-reduce:transition-none ${showPlayDrawing ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          >
            <Image
              src="/coinmaster/approach-notes.webp"
              alt=""
              fill
              sizes="(min-width: 1280px) 1152px, 90vw"
              className="object-contain object-left-top"
            />
          </div>

          <div
            id="approach-core-loop-diagram"
            data-approach-diagram="true"
            aria-hidden={!showDiagram}
            className={`absolute left-0 right-0 top-0 flex items-start gap-14 transition-opacity duration-300 motion-reduce:transition-none ${showDiagram ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          >
            <div className="w-[min(720px,74vh)] shrink-0">
              <CoreLoopDiagram />
            </div>
            <div data-economy-legend="true" role="list" aria-label="Coin Master economy signals" className="grid flex-1 gap-4 pt-3">
              {ECONOMY_ITEMS.map((item) => (
                <div key={item.label} data-economy-item="true" role="listitem" className="flex items-center gap-4">
                  <Image src={item.src} alt={item.label} width={56} height={56} className="h-14 w-14 shrink-0 object-contain" />
                  <p className="whitespace-nowrap font-sans text-[15px] leading-tight text-cm-charcoal">
                    {item.definition}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            id="approach-research-evidence"
            data-research-evidence="true"
            aria-hidden={!showResearchEvidence}
            className={`absolute inset-0 grid grid-cols-5 gap-5 transition-opacity duration-300 motion-reduce:transition-none ${showResearchEvidence ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          >
            {RESEARCH_SCREENSHOTS.map((screenshot) => (
              <figure key={screenshot.src} data-research-screenshot="true" className="m-0 flex h-full min-h-0 flex-col items-center gap-2">
                <div data-screenshot-frame="true" style={{ borderColor: 'rgb(30, 123, 168)' }} className="relative min-h-0 max-w-full flex-1 overflow-hidden rounded-2xl border-[1.5px] aspect-[1/2]">
                  <Image
                    src={screenshot.src}
                    alt={screenshot.alt}
                    fill
                    sizes="(min-width: 1280px) 270px, 22vw"
                    className="object-cover object-top"
                  />
                </div>
                <figcaption className="font-sans text-[13px] font-normal uppercase tracking-[0.14em] text-cm-charcoal">
                  {screenshot.label}
                </figcaption>
              </figure>
            ))}
          </div>

          <div
            id="approach-benchmark-evidence"
            data-benchmark-evidence="true"
            aria-hidden={!showBenchmarkEvidence}
            className={`absolute inset-0 flex items-stretch justify-center gap-3 transition-opacity duration-300 motion-reduce:transition-none ${showBenchmarkEvidence ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          >
            {BENCHMARK_SCREENSHOTS.map((screenshot) => (
              <figure key={screenshot.src} data-benchmark-screenshot="true" className="m-0 flex min-h-0 flex-col items-center gap-2">
                <div data-screenshot-frame="true" className="relative flex min-h-0 flex-1 items-center justify-center">
                  <Image
                    src={screenshot.src}
                    alt={screenshot.alt}
                    width={800}
                    height={1600}
                    sizes="(min-width: 1280px) 360px, 30vw"
                    style={{ borderColor: 'rgb(30, 123, 168)' }}
                    className="h-full w-auto rounded-2xl border-[1.5px] object-contain"
                  />
                </div>
                <figcaption className="font-sans text-[13px] font-normal uppercase tracking-[0.14em] text-cm-charcoal">
                  {screenshot.label}
                </figcaption>
              </figure>
            ))}
          </div>

          <div
            id="approach-decision-evidence"
            data-decision-evidence="true"
            aria-hidden={!showDecisionEvidence}
            className={`absolute inset-0 transition-opacity duration-300 motion-reduce:transition-none ${showDecisionEvidence ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          >
            <figure className="relative m-0 mx-auto h-full max-w-full overflow-hidden rounded-2xl aspect-[16/9]">
              <Image
                src="/coinmaster/decision/feature-ranking.png"
                alt="Feature ranking: Card Bounty first, Hot Trail second, and Hometown third"
                fill
                sizes="(min-width: 1280px) 900px, 75vw"
                className="object-cover"
              />
            </figure>
          </div>

          <div
            id="approach-create-evidence"
            data-create-evidence="true"
            aria-hidden={!showCreateEvidence}
            className={`absolute inset-0 grid grid-cols-[0.68fr_repeat(3,1fr)] gap-5 transition-opacity duration-300 motion-reduce:transition-none ${showCreateEvidence ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          >
            <div className="flex flex-col gap-8 pt-5">
              {REJECTED_CONCEPTS.map((title) => (
                <section key={title} data-create-concept="true" data-rejected="true" className="opacity-45">
                  <h3 className="font-serif text-[22px] font-black leading-tight text-cm-violet-deep line-through decoration-2">
                    {title}
                  </h3>
                </section>
              ))}
            </div>
            {PRESENTED_CONCEPTS.map(({ concept: feature, logo }) => (
              <section key={feature.id} data-create-concept="true" data-rejected="false" className="pt-5">
                <h3 className="sr-only">{feature.title}</h3>
                <div className="relative h-[92px] w-full">
                  <Image
                    src={logo}
                    alt=""
                    data-concept-logo={feature.title}
                    fill
                    sizes="(min-width: 1280px) 240px, 20vw"
                    className="object-contain object-center"
                  />
                </div>
                <p className="mt-4 font-sans text-[13px] font-normal leading-relaxed text-[#1A1A1A]">
                  {feature.monetizationSummary}
                </p>
              </section>
            ))}
          </div>

          <div
            id="approach-test-evidence"
            data-test-evidence="true"
            aria-hidden={!showTestEvidence}
            className={`absolute inset-0 flex items-center transition-opacity duration-300 motion-reduce:transition-none ${showTestEvidence ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          >
            <ul className="flex flex-col gap-5">
              {VALIDATION_TESTS.map((name) => (
                <li key={name} data-validation-test="true" className="flex items-center gap-4 font-sans text-[24px] font-normal leading-tight text-cm-violet-deep">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-7 w-7 shrink-0 text-cm-gold"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-4-4" />
                  </svg>
                  <span>{name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </SlideShell>
  )
}
