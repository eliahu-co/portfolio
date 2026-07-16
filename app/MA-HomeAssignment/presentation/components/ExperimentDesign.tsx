'use client'

import { useCallback, useState } from 'react'
import { PROTOCOL } from '../../content/validation'
import styles from '../PresentationStage.module.css'
import { PrintDetails, RevealControl } from '../primitives'
import { useDeckReset, type DeckSlideKey } from '../useDeckReset'

export type ExperimentDesignProps = {
  readonly slideKey: DeckSlideKey
}

type ArmName = 'Control' | 'Treatment'

type ArmStory = {
  readonly name: ArmName
  readonly body: string
  readonly difference: string
  readonly interpretation: string
}

type ArmInteraction = {
  readonly hovered: ArmName | null
  readonly focused: ArmName | null
}

const IDLE: ArmInteraction = {
  hovered: null,
  focused: null,
}

const [population, control, treatment, hypothesis] = PROTOCOL

const ARMS: readonly ArmStory[] = [
  {
    name: 'Control',
    body: control.body,
    difference: 'No Card Bounty event.',
    interpretation: 'Establishes the baseline behavior of eligible Cards Center players.',
  },
  {
    name: 'Treatment',
    body: treatment.body,
    difference: 'Card Bounty runs as a time-limited LiveOps event.',
    interpretation: 'Measures the incremental effect of the event while the Cards Center stays constant.',
  },
] as const

function ProtocolCopy({ label, body }: { readonly label: string; readonly body: string }) {
  return (
    <div data-protocol-item={label}>
      <p className="font-sans text-[12px] font-extrabold uppercase tracking-[0.12em] text-cm-crimson">
        {label}
      </p>
      <p className="mt-1 font-sans text-[16px] leading-snug text-[#1A1A1A]">{body}</p>
    </div>
  )
}

export function ExperimentDesign({ slideKey }: ExperimentDesignProps) {
  const [interaction, setInteraction] = useState<ArmInteraction>(IDLE)
  const reset = useCallback(() => setInteraction(IDLE), [])
  const activeName = interaction.focused ?? interaction.hovered
  const activeArm = activeName === null
    ? null
    : ARMS.find(({ name }) => name === activeName) ?? null

  useDeckReset(reset, slideKey)

  return (
    <section aria-label="Card Bounty A/B test design">
      <div
        data-experiment-screen-board="true"
        className={styles.experimentScreenBoard}
      >
        <div className="rounded-2xl border border-cm-wood/25 bg-white/70 px-5 py-3">
          <ProtocolCopy label={population.label} body={population.body} />
        </div>

        <div
          data-single-difference="true"
          className="my-3 flex items-center justify-center gap-3 rounded-full border border-cm-gold/55 bg-cm-gold/15 px-4 py-2 font-sans text-[14px] text-cm-violet-deep"
        >
          <span className="font-extrabold uppercase tracking-[0.08em]">
            Single experimental difference
          </span>
          <span aria-hidden="true" className="text-cm-gold">◆</span>
          <span>Card Bounty as a time-limited LiveOps event</span>
        </div>

        <div className="grid grid-cols-2 gap-5" aria-label="Experiment arms">
          {ARMS.map((arm) => {
            const active = activeName === arm.name

            return (
              <div
                key={arm.name}
                data-experiment-arm={arm.name}
                data-shared-baseline={control.body}
                className="min-w-0"
              >
                <RevealControl
                  summary={(
                    <span className="block text-left">
                      <span className="block font-serif text-[24px] font-black leading-none text-cm-violet-deep">
                        {arm.name}
                      </span>
                      <span className="mt-2 block font-sans text-[16px] font-medium leading-snug text-[#1A1A1A]">
                        {arm.body}
                      </span>
                    </span>
                  )}
                  active={active}
                  aria-controls="experiment-arm-detail"
                  data-experiment-arm-control="true"
                  data-experiment-arm={arm.name}
                  data-active={active ? 'true' : 'false'}
                  className={[
                    'min-h-[104px] w-full items-start justify-start !rounded-2xl !px-5 !py-4 text-left',
                    active
                      ? 'border-[#1E7BA8] bg-[#1E7BA8]/15 shadow-[0_0_0_2px_rgba(30,123,168,0.25)]'
                      : 'border-cm-wood/40 bg-white/80',
                  ].join(' ')}
                  onMouseEnter={() => setInteraction((current) => ({
                    ...current,
                    hovered: arm.name,
                  }))}
                  onMouseLeave={() => setInteraction((current) => ({
                    ...current,
                    hovered: current.hovered === arm.name ? null : current.hovered,
                  }))}
                  onFocus={() => setInteraction((current) => ({
                    ...current,
                    focused: arm.name,
                  }))}
                  onBlur={() => setInteraction((current) => ({
                    ...current,
                    focused: current.focused === arm.name ? null : current.focused,
                  }))}
                />
              </div>
            )
          })}
        </div>

        <div
          id="experiment-arm-detail"
          data-experiment-detail-rail="true"
          className="mt-3 h-[88px] overflow-hidden rounded-2xl border-2 border-[#1E7BA8]/35 bg-[#1E7BA8]/10 px-5 py-2"
          aria-live="polite"
        >
          {activeArm ? (
            <div role="status" aria-label="Experiment arm detail">
              <p className="font-sans text-[12px] font-extrabold uppercase tracking-[0.1em] text-cm-violet-deep">
                {activeArm.name} arm
              </p>
              <div className="mt-1 grid grid-cols-[0.72fr_1fr_1.28fr] gap-4 font-sans text-[13px] leading-snug text-[#1A1A1A]">
                <p><strong>Shared baseline:</strong> {control.body}</p>
                <p><strong>Single experimental difference:</strong> {activeArm.difference}</p>
                <p><strong>Interpretation:</strong> {activeArm.interpretation}</p>
              </div>
            </div>
          ) : (
            <p className="font-sans text-[14px] leading-snug text-charcoal">
              Hover or focus an arm to isolate the shared baseline and the one experimental change.
            </p>
          )}
        </div>

        <aside
          data-hypothesis="true"
          className="mt-3 rounded-2xl border-2 border-cm-gold/60 bg-cm-gold/15 px-5 py-3"
        >
          <ProtocolCopy label={hypothesis.label} body={hypothesis.body} />
        </aside>
      </div>

      <PrintDetails
        data-experiment-print-summary="true"
        className={styles.experimentPrintSummary}
      >
        {PROTOCOL.map(({ label, body }) => (
          <div
            key={label}
            className="rounded-lg border border-cm-wood/25 bg-white/70 p-3 text-[11px] leading-tight"
          >
            <p className="font-bold uppercase tracking-[0.08em] text-cm-crimson">{label}</p>
            <p className="mt-1 text-[#1A1A1A]">{body}</p>
          </div>
        ))}
        <p className="col-span-2 rounded-lg border border-cm-gold/50 bg-cm-gold/10 p-2 text-center text-[11px] font-bold text-cm-violet-deep">
          Single experimental difference: Card Bounty as a time-limited LiveOps event.
        </p>
      </PrintDetails>
    </section>
  )
}
