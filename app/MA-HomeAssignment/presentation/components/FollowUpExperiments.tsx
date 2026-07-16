'use client'

import { useCallback, useState } from 'react'
import { ADDITIONAL_TESTS } from '../../content/validation'
import styles from '../PresentationStage.module.css'
import { PrintDetails, RevealControl } from '../primitives'
import { useDeckReset, type DeckSlideKey } from '../useDeckReset'

export type FollowUpExperimentsProps = {
  readonly slideKey: DeckSlideKey
}

type ExperimentTitle = (typeof ADDITIONAL_TESTS)[number]['title']

type FollowUpDetail = {
  readonly treatment: string
  readonly uncertainty: string
  readonly decision: string
}

type FollowUpStory = (typeof ADDITIONAL_TESTS)[number] & FollowUpDetail

type FollowUpInteraction = {
  readonly hovered: ExperimentTitle | null
  readonly focused: ExperimentTitle | null
}

const IDLE: FollowUpInteraction = {
  hovered: null,
  focused: null,
}

const FOLLOW_UP_DETAILS = {
  'Meter Goal Calibration': {
    treatment: 'Lower the meter requirement while leaving the remaining event rules unchanged.',
    uncertainty: 'Is the baseline goal attainable enough to motivate spend without over-releasing Cards?',
    decision: 'Choose the meter goal that raises Chest spend while keeping Collection completion inside its guardrail.',
  },
  'Paid Progress Carryover': {
    treatment: 'Allow players to spend Gems to carry existing meter progress to a newly selected target.',
    uncertainty: 'Does preserving earned progress create incremental Gem spend without weakening continued participation?',
    decision: 'Ship paid carryover only if Gem spend is incremental and participation and Collection guardrails hold.',
  },
  'Chest Tier Weighting': {
    treatment: 'Increase only the Magical Chest contribution to the meter.',
    uncertainty: 'Will stronger progress shift spend toward the highest-value Chest rather than merely substitute purchases?',
    decision: 'Adopt weighting if the Chest mix moves upward without reducing total Chest activity or Coin demand.',
  },
} as const satisfies Readonly<Record<ExperimentTitle, FollowUpDetail>>

const FOLLOW_UP_STORIES: readonly FollowUpStory[] = ADDITIONAL_TESTS.map((experiment) => ({
  ...experiment,
  ...FOLLOW_UP_DETAILS[experiment.title],
}))

function DetailField({
  field,
  label,
  children,
}: {
  readonly field: keyof FollowUpDetail
  readonly label: string
  readonly children: string
}) {
  return (
    <div data-follow-up-detail-field={field}>
      <p className="font-sans text-[10px] font-extrabold uppercase tracking-[0.1em] text-cm-crimson">
        {label}
      </p>
      <p className="mt-1 font-sans text-[12px] leading-snug text-[#1A1A1A]">{children}</p>
    </div>
  )
}

export function FollowUpExperiments({ slideKey }: FollowUpExperimentsProps) {
  const [interaction, setInteraction] = useState<FollowUpInteraction>(IDLE)
  const reset = useCallback(() => setInteraction(IDLE), [])
  const activeTitle = interaction.focused ?? interaction.hovered
  const activeStory = activeTitle === null
    ? null
    : FOLLOW_UP_STORIES.find(({ title }) => title === activeTitle) ?? null

  useDeckReset(reset, slideKey)

  return (
    <section aria-label="Card Bounty follow-up experiments">
      <div
        data-follow-up-screen-board="true"
        className={styles.followUpScreenBoard}
      >
        <div className="grid grid-cols-3 gap-4" aria-label="Follow-up experiment cards">
          {FOLLOW_UP_STORIES.map((story, index) => {
            const active = activeTitle === story.title

            return (
              <RevealControl
                key={story.title}
                summary={(
                  <span className="block text-left">
                    <span className="block font-sans text-[11px] font-extrabold uppercase tracking-[0.11em] text-cm-crimson">
                      Experiment {index + 1}
                    </span>
                    <span className="mt-1 block font-serif text-[22px] font-black leading-tight text-cm-violet-deep">
                      {story.title}
                    </span>
                    <span className="mt-3 block font-sans text-[14px] leading-snug text-[#1A1A1A]">
                      <strong className="text-cm-violet-deep">Setup:</strong> {story.setup}
                    </span>
                    <span className="mt-2 block font-sans text-[14px] leading-snug text-charcoal">
                      <strong className="text-cm-violet-deep">Outcome:</strong> {story.outcome}
                    </span>
                  </span>
                )}
                active={active}
                aria-controls="follow-up-detail"
                data-follow-up-card="true"
                data-follow-up-title={story.title}
                data-active={active ? 'true' : 'false'}
                className={[
                  'min-h-[230px] w-full items-start justify-start !rounded-2xl !px-5 !py-4 text-left',
                  active
                    ? 'border-[#1E7BA8] bg-[#1E7BA8]/15 shadow-[0_0_0_2px_rgba(30,123,168,0.25)]'
                    : 'border-cm-wood/40 bg-white/80',
                ].join(' ')}
                onMouseEnter={() => setInteraction((current) => ({
                  ...current,
                  hovered: story.title,
                }))}
                onMouseLeave={() => setInteraction((current) => ({
                  ...current,
                  hovered: current.hovered === story.title ? null : current.hovered,
                }))}
                onFocus={() => setInteraction((current) => ({
                  ...current,
                  focused: story.title,
                }))}
                onBlur={() => setInteraction((current) => ({
                  ...current,
                  focused: current.focused === story.title ? null : current.focused,
                }))}
              />
            )
          })}
        </div>

        <div
          id="follow-up-detail"
          data-follow-up-detail-rail="true"
          className="mt-4 h-[128px] overflow-hidden rounded-2xl border-2 border-[#1E7BA8]/35 bg-[#1E7BA8]/10 px-5 py-3"
          aria-live="polite"
        >
          {activeStory ? (
            <div role="status" aria-label="Follow-up experiment detail">
              <p className="font-serif text-[16px] font-black leading-none text-cm-violet-deep">
                {activeStory.title}
              </p>
              <div className="mt-2 grid grid-cols-3 gap-5">
                <DetailField field="treatment" label="Treatment">
                  {activeStory.treatment}
                </DetailField>
                <DetailField field="uncertainty" label="Uncertainty">
                  {activeStory.uncertainty}
                </DetailField>
                <DetailField field="decision" label="Decision">
                  {activeStory.decision}
                </DetailField>
              </div>
            </div>
          ) : (
            <p className="font-sans text-[14px] leading-snug text-charcoal">
              Hover or focus a test to see the treatment, the uncertainty it isolates, and the decision it unlocks.
            </p>
          )}
        </div>
      </div>

      <PrintDetails
        data-follow-up-print-summary="true"
        className={styles.followUpPrintSummary}
      >
        {FOLLOW_UP_STORIES.map((story) => (
          <article
            key={story.title}
            data-follow-up-print-item="true"
            className="rounded-lg border border-cm-wood/25 bg-white/70 p-3 text-[10px] leading-tight text-[#1A1A1A]"
          >
            <h3 className="font-serif text-[16px] font-black text-cm-violet-deep">
              {story.title}
            </h3>
            <p className="mt-2"><strong>Setup:</strong> {story.setup}</p>
            <p className="mt-2"><strong>Outcome:</strong> {story.outcome}</p>
            <p className="mt-2"><strong>Treatment:</strong> {story.treatment}</p>
            <p className="mt-2"><strong>Uncertainty:</strong> {story.uncertainty}</p>
            <p className="mt-2"><strong>Decision:</strong> {story.decision}</p>
          </article>
        ))}
      </PrintDetails>
    </section>
  )
}
