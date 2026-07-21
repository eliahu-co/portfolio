'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'
import CoreLoopDiagram from '@/app/MA-HomeAssignment/sections/CoreLoopDiagram'
import { APPROACH_STEPS, CONCEPTS } from '../deckData'
import { Eyebrow, SlideShell } from '../primitives'
import { useDeckReset } from '../useDeckReset'
import type { OpeningSlideProps } from './Slide01Cover'
import { FlowArrow } from '../components/FlowArrow'
import { ZoomableNotes } from '../components/ZoomableNotes'

const SURFACE_CLASSES = 'flex min-h-[67px] w-auto shrink-0 items-center justify-center whitespace-nowrap text-center font-serif text-[34px] font-black leading-[1.04] text-cm-violet-deep'

type EvidenceScreenshot = {
  readonly label: string
  readonly src: string
  readonly alt: string
  readonly width: number
  readonly height: number
}

/**
 * The Research and Benchmark panels are both rows of captioned phone
 * screenshots sitting in the same reveal box. They were written separately and
 * drifted — one capped images at 310px inside a five-column grid, the other
 * sized them off the panel height in a flex row — so the same five items read
 * at very different scales. They share this component so that cannot recur.
 *
 * Height, not width, drives the layout: every image is set to one height and
 * takes whatever width its own ratio implies, so captures of different shapes
 * still line up on a single baseline. Two things keep the frames tight:
 *
 * - Each image is declared at its true pixel size. A shared placeholder ratio
 *   makes the frame the wrong shape and the image letterboxes inside it.
 * - The height is in pixels, not a percentage of the row. A percentage cannot
 *   be resolved while the browser computes intrinsic width, so it falls back to
 *   the image's raw pixel width and every figure claims far more room than it
 *   draws in — which flexbox then takes back by squeezing the frames unevenly.
 * - `shrink-0`, so a row that does outgrow its box overflows visibly instead of
 *   quietly letterboxing. The ratio-sum check in the dimensions test is what
 *   keeps this height and the row width compatible as screenshots change.
 */
function EvidenceScreenshotRow({ kind, screenshots }: { kind: 'research' | 'benchmark'; screenshots: readonly EvidenceScreenshot[] }) {
  // hovering one capture holds it and dims the rest, the same way hovering a
  // concept works in the Create panel
  const [active, setActive] = useState<string | null>(null)

  return (
    <>
      {screenshots.map((screenshot) => (
        <figure
          key={screenshot.src}
          {...{ [`data-${kind}-screenshot`]: 'true' }}
          data-screenshot-active={active === screenshot.src ? 'true' : 'false'}
          onMouseEnter={() => setActive(screenshot.src)}
          onMouseLeave={() => setActive((current) => (current === screenshot.src ? null : current))}
          className={`m-0 flex shrink-0 flex-col items-center gap-2 transition-opacity duration-300 motion-reduce:transition-none ${active && active !== screenshot.src ? 'opacity-20' : 'opacity-100'}`}
        >
          <div data-screenshot-frame="true" className="relative flex items-center justify-center">
            <Image
              src={screenshot.src}
              alt={screenshot.alt}
              width={screenshot.width}
              height={screenshot.height}
              sizes="(min-width: 1280px) 360px, 30vw"
              style={{ borderColor: 'rgb(30, 123, 168)' }}
              className="h-[412px] w-auto rounded-2xl border-[1.5px] object-contain"
            />
          </div>
          <figcaption className="font-sans text-[13px] font-normal uppercase tracking-[0.14em] text-cm-charcoal">
            {screenshot.label}
          </figcaption>
        </figure>
      ))}
    </>
  )
}

// the row box itself: both panels reveal on hover and centre the same way
const EVIDENCE_ROW_CLASSES = 'absolute inset-0 flex items-center justify-center gap-4 transition-opacity duration-300 motion-reduce:transition-none'

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

// width/height are each file's real pixel size. They must stay true to the file:
// the row sizes every image to the same height and lets width follow the ratio,
// so a wrong pair here reshapes the frame and leaves dead space inside its border.
const RESEARCH_SCREENSHOTS = [
  { label: 'Support', src: '/coinmaster/research/research-support.jpeg', alt: 'Coin Master official support pages research', width: 1008, height: 2048 },
  { label: 'Discord', src: '/coinmaster/research/research-discord.webp', alt: 'Coin Master advanced-play discussion on Discord', width: 789, height: 1600 },
  { label: 'Reddit', src: '/coinmaster/research/research-reddit.webp', alt: 'Coin Master team recruitment discussion on Reddit', width: 780, height: 1600 },
  { label: 'Facebook', src: '/coinmaster/research/research-facebook.webp', alt: 'Coin Master card-trading request on Facebook', width: 784, height: 1600 },
  { label: 'YouTube', src: '/coinmaster/research/research-youtube.webp', alt: 'Coin Master advanced gameplay research on YouTube', width: 777, height: 1600 },
] as const

const BENCHMARK_SCREENSHOTS = [
  { label: 'Royal Match', src: '/coinmaster/benchmark/benchmark-cauldron.webp', alt: 'Royal Match Magic Cauldron game mechanic benchmark', width: 774, height: 1600 },
  { label: 'Monopoly GO!', src: '/coinmaster/benchmark/benchmark-styletoken.webp', alt: 'Monopoly GO! Style Token cosmetic collection benchmark', width: 640, height: 1390 },
  { label: 'Dice Dreams', src: '/coinmaster/benchmark/benchmark-diner.webp', alt: 'Dice Dreams timed collection mini-game benchmark', width: 798, height: 1600 },
  { label: 'Animals & Coins', src: '/coinmaster/benchmark/benchmark-animals.webp', alt: 'Animals & Coins village build step priced in Coins benchmark', width: 689, height: 1440 },
  { label: 'Pirate Kings', src: '/coinmaster/benchmark/benchmark-piratekings.webp', alt: 'Pirate Kings piggy bank accumulating savings behind a paid break benchmark', width: 664, height: 1440 },
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
  const [activeConcept, setActiveConcept] = useState<string | null>(null)
  const reset = useCallback(() => {
    setActiveReveal(null)
    setActiveStep(null)
    setActiveConcept(null)
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
      <Eyebrow role="heading" aria-level={2}>Approach</Eyebrow>
      <section aria-label="Product approach" className="mt-0 flex min-h-0 flex-1 flex-col">
        <ol className="relative z-20 flex shrink-0 items-center">
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
                className="contents"
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
                  <div data-approach-pill="true" className={`${SURFACE_CLASSES} ${focusClass} transition-opacity duration-200 motion-reduce:transition-none`}>
                    {step.label}
                  </div>
                )}
                {index < APPROACH_STEPS.length - 1 && (
                  <FlowArrow
                    data-approach-connector="true"
                    className={`mx-4 h-[14px] min-w-[24px] flex-1 transition-opacity duration-200 motion-reduce:transition-none ${activeStep ? 'opacity-30' : 'opacity-100'}`}
                    color="#2D1B69"
                  />
                )}
              </li>
            )
          })}
        </ol>

        <div data-approach-reveal-stage="true" className="relative mb-14 mt-8 flex min-h-0 w-full flex-1 items-center">
          <div
            id="approach-play-game-drawing"
            data-play-game-drawing="true"
            aria-hidden={!showPlayDrawing}
            className={`absolute inset-0 transition-opacity duration-300 motion-reduce:transition-none ${showPlayDrawing ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          >
            <ZoomableNotes
              src="/coinmaster/approach-notes.webp"
              alt="Research notes taken while playing Coin Master"
              active={showPlayDrawing}
            />
          </div>

          <div
            id="approach-core-loop-diagram"
            data-approach-diagram="true"
            aria-hidden={!showDiagram}
            className={`absolute inset-0 flex items-center gap-14 transition-opacity duration-300 motion-reduce:transition-none ${showDiagram ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
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
            className={`${EVIDENCE_ROW_CLASSES} ${showResearchEvidence ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          >
            <EvidenceScreenshotRow kind="research" screenshots={RESEARCH_SCREENSHOTS} />
          </div>

          <div
            id="approach-benchmark-evidence"
            data-benchmark-evidence="true"
            aria-hidden={!showBenchmarkEvidence}
            className={`${EVIDENCE_ROW_CLASSES} ${showBenchmarkEvidence ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          >
            <EvidenceScreenshotRow kind="benchmark" screenshots={BENCHMARK_SCREENSHOTS} />
          </div>

          <div
            id="approach-decision-evidence"
            data-decision-evidence="true"
            aria-hidden={!showDecisionEvidence}
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 motion-reduce:transition-none ${showDecisionEvidence ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          >
            <figure className="relative m-0 mx-auto h-[56%] max-w-full overflow-hidden rounded-2xl aspect-[16/9]">
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
            onMouseLeave={() => setActiveConcept(null)}
            className={`absolute inset-0 grid grid-cols-[0.68fr_repeat(3,1fr)] items-center gap-5 transition-opacity duration-300 motion-reduce:transition-none ${showCreateEvidence ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          >
            <div className="flex flex-col gap-8">
              {REJECTED_CONCEPTS.map((title) => (
                <section
                  key={title}
                  data-create-concept="true"
                  data-rejected="true"
                  className={`transition-opacity duration-300 motion-reduce:transition-none ${activeConcept ? 'opacity-20' : 'opacity-45'}`}
                >
                  <h3 className="font-serif text-[22px] font-black leading-tight text-cm-violet-deep line-through decoration-2">
                    {title}
                  </h3>
                </section>
              ))}
            </div>
            {PRESENTED_CONCEPTS.map(({ concept: feature, logo }) => (
              // hovering anywhere over a concept — logo or label — holds it at
              // full strength and dims its peers and the rejected pile
              <section
                key={feature.id}
                data-create-concept="true"
                data-rejected="false"
                data-concept-active={activeConcept === feature.id ? 'true' : 'false'}
                onMouseEnter={() => setActiveConcept(feature.id)}
                className={`transition-opacity duration-300 motion-reduce:transition-none ${activeConcept && activeConcept !== feature.id ? 'opacity-20' : 'opacity-100'}`}
              >
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
                <p className="mt-4 text-center font-sans text-[18px] font-normal leading-relaxed text-[#1A1A1A]">
                  {feature.monetizationLabel}
                </p>
                {/* the player drive, set in the caption register so it reads as a
                    second axis rather than a continuation of the business lever */}
                <p
                  data-concept-motivation="true"
                  className="mt-2 text-center font-sans text-[13px] font-normal uppercase tracking-[0.14em] text-cm-charcoal/60"
                >
                  {feature.motivationLabel}
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
            <div className="mx-auto flex items-center justify-center">
              <ul className="flex flex-col gap-0">
                {VALIDATION_TESTS.map((name, index) => (
                  <li
                    key={name}
                    data-validation-test="true"
                    data-primary-validation-test={index === 0 ? 'true' : undefined}
                    data-secondary-validation-test={index > 0 ? 'true' : undefined}
                    className={`grid grid-cols-[80px_auto] items-center gap-4 font-sans text-[24px] font-normal leading-tight ${index === 0 ? 'min-h-20 text-cm-violet-deep' : 'min-h-8 text-charcoal/35'}`}
                  >
                    {index === 0 ? (
                      <Image
                        data-validation-test-icon="true"
                        src="/coinmaster/resources/ab-test-emoji.png"
                        alt="A/B test"
                        width={80}
                        height={80}
                        className="h-20 w-20 shrink-0 object-contain"
                      />
                    ) : (
                      <span aria-hidden="true" className="h-0 w-20" />
                    )}
                    <span>{name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </SlideShell>
  )
}
