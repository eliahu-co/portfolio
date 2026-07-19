'use client'

import { useCallback, useState } from 'react'
import { FlowArrow } from './FlowArrow'
import { ResolutionBranches } from '../../components/ResolutionBranches'
import { useDeckReset, type DeckSlideKey } from '../useDeckReset'

type PhaseName = 'Entry' | 'Target' | 'Progress' | 'Resolution'

type PhaseStep = {
  readonly title: string
  readonly action: string
  readonly tone?: 'blue' | 'gold'
}

type Phase = {
  readonly name: PhaseName
  readonly steps: readonly PhaseStep[]
}

const PHASES: readonly Phase[] = [
  {
    name: 'Entry',
    steps: [
      { title: 'Cards Center', action: 'Tap Card Bounty' },
      { title: 'Event Introduction', action: 'Review the timer and rules' },
    ],
  },
  {
    name: 'Target',
    steps: [
      { title: 'Card Selection', action: 'Browse eligible missing Cards' },
      { title: 'Target Confirmation', action: 'Confirm the Card and required progress' },
    ],
  },
  {
    name: 'Progress',
    steps: [
      { title: 'Bounty Progress', action: 'Buy a Chest with Coins' },
      { title: 'Chest Results', action: 'Reveal contents and update the meter' },
    ],
  },
  {
    name: 'Resolution',
    steps: [
      { title: 'Target Obtained?', action: 'Use the Card if it appeared naturally' },
      { title: 'Meter Full?', action: 'Guarantee the target when progress is complete' },
      { title: 'Collection Updated', action: 'Complete the set or return to Cards Center' },
      { title: 'Receive Spins', action: 'Release the Collection reward', tone: 'gold' },
    ],
  },
] as const

function PhaseSteps({ steps }: { readonly steps: readonly PhaseStep[] }) {
  return (
    <div data-phase-detail="true" className="mt-5 flex flex-col items-center">
      {steps.map((step, index) => (
        <div key={step.title} className="contents">
          <div
            data-blue-surface={step.tone === 'gold' ? undefined : 'true'}
            data-wood-surface={step.tone === 'gold' ? 'true' : undefined}
            className="w-full rounded-xl border px-4 py-3 text-center"
          >
            <p className="font-sans text-[15px] font-normal leading-tight text-cm-violet-deep">
              {step.title}
            </p>
            <p className="mt-1 font-sans text-[12px] font-normal leading-snug text-charcoal/65">
              {step.action}
            </p>
          </div>
          {index < steps.length - 1 && (
            <FlowArrow
              data-step-arrow="true"
              direction="down"
              color="rgba(30,123,168,0.65)"
              className="my-1 h-5 w-4 shrink-0"
            />
          )}
        </div>
      ))}
    </div>
  )
}

export function PhaseFocusFlow({ slideKey }: { readonly slideKey: DeckSlideKey }) {
  const [hovered, setHovered] = useState<PhaseName | null>(null)
  const [focused, setFocused] = useState<PhaseName | null>(null)
  const active = focused ?? hovered
  const reset = useCallback(() => {
    setHovered(null)
    setFocused(null)
  }, [])

  useDeckReset(reset, slideKey)

  return (
    <div
      data-phase-focus-flow="true"
      className="mt-7 min-h-[430px] w-full"
      onMouseLeave={() => setHovered(null)}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_56px_minmax(0,1fr)_56px_minmax(0,1fr)_56px_minmax(0,1fr)] items-start">
        {PHASES.map((phase, index) => {
          const selected = active === phase.name
          const faded = active !== null && !selected

          return (
            <div key={phase.name} className="contents">
              <section
                data-phase-column={phase.name}
                data-faded={faded ? 'true' : 'false'}
                className={`min-w-0 transition-opacity duration-300 motion-reduce:transition-none ${faded ? 'opacity-20' : 'opacity-100'}`}
              >
                <button
                  type="button"
                  data-phase-control={phase.name}
                  aria-expanded={selected}
                  className="min-h-[58px] w-full whitespace-nowrap px-2 font-serif text-[34px] font-black text-cm-violet-deep focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#1E7BA8]"
                  onMouseEnter={() => setHovered(phase.name)}
                  onFocus={() => setFocused(phase.name)}
                  onBlur={() => setFocused(null)}
                >
                  {phase.name}
                </button>
                {/* Resolution is a branching tree, not a linear stack — it breaks
                    out below the row where it has room for its Yes/No branches. */}
                {selected && phase.name !== 'Resolution' && <PhaseSteps steps={phase.steps} />}
              </section>

              {index < PHASES.length - 1 && (
                <div
                  data-phase-arrow="true"
                  className={`mt-[21px] flex justify-center transition-opacity duration-300 motion-reduce:transition-none ${active ? 'opacity-35' : 'opacity-100'}`}
                >
                  <FlowArrow direction="right" color="#1A1A1A" className="h-[14px] w-8" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {active === 'Resolution' && (
        <div data-resolution-panel="true" className="mt-4">
          <ResolutionBranches size="slide" />
        </div>
      )}
    </div>
  )
}
