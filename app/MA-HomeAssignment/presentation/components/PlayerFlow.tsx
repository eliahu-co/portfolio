'use client'

import { useCallback, useState } from 'react'
import { PLAYER_FLOW } from '../deckData'
import styles from '../PresentationStage.module.css'
import { PrintDetails, RevealControl } from '../primitives'
import { useDeckReset, type DeckSlideKey } from '../useDeckReset'

export type PlayerFlowProps = {
  readonly slideKey: DeckSlideKey
}

type FlowInteraction = {
  hovered: number | null
  focused: number | null
}

const IDLE: FlowInteraction = {
  hovered: null,
  focused: null,
}

export function PlayerFlow({ slideKey }: PlayerFlowProps) {
  const [interaction, setInteraction] = useState<FlowInteraction>(IDLE)
  const reset = useCallback(() => setInteraction(IDLE), [])
  const activeIndex = interaction.focused ?? interaction.hovered
  const activeStory = activeIndex === null ? null : PLAYER_FLOW[activeIndex]

  useDeckReset(reset, slideKey)

  return (
    <section aria-label="Card Bounty player journey">
      <ol
        aria-label="Card Bounty player flow"
        className="grid grid-cols-6 items-start gap-3"
      >
        {PLAYER_FLOW.map(({ label }, index) => {
          const pathActive = activeIndex !== null && index <= activeIndex
          const nodeActive = activeIndex === index

          return (
            <li
              key={label}
              data-flow-node={index + 1}
              data-path-active={pathActive ? 'true' : 'false'}
              data-node-active={nodeActive ? 'true' : 'false'}
              className="relative min-w-0"
            >
              <p className="mb-2 font-sans text-[12px] font-extrabold uppercase tracking-[0.12em] text-cm-crimson">
                Stage {index + 1}
              </p>
              <RevealControl
                summary={label}
                active={nodeActive}
                aria-controls="card-bounty-flow-detail"
                aria-current={nodeActive ? 'step' : undefined}
                className={[
                  'min-h-[92px] w-full justify-center px-3 text-center text-[14px] leading-snug transition-colors',
                  nodeActive
                    ? 'border-[#1E7BA8] bg-[#1E7BA8]/15 shadow-[0_0_0_2px_rgba(30,123,168,0.35)]'
                    : pathActive
                      ? 'border-cm-gold/70 bg-cm-gold/20'
                      : 'border-cm-wood/45 bg-white/85',
                ].join(' ')}
                onMouseEnter={() => setInteraction((current) => ({ ...current, hovered: index }))}
                onMouseLeave={() => setInteraction((current) => ({
                  ...current,
                  hovered: current.hovered === index ? null : current.hovered,
                }))}
                onFocus={() => setInteraction((current) => ({ ...current, focused: index }))}
                onBlur={() => setInteraction((current) => ({
                  ...current,
                  focused: current.focused === index ? null : current.focused,
                }))}
              />
              {index < PLAYER_FLOW.length - 1 && (
                <span
                  aria-hidden="true"
                  data-flow-connector={index + 1}
                  data-path-active={activeIndex !== null && index < activeIndex ? 'true' : 'false'}
                  className={[
                    'pointer-events-none absolute -right-[13px] top-[76px] z-10 text-[20px] font-black transition-colors',
                    activeIndex !== null && index < activeIndex ? 'text-[#1E7BA8]' : 'text-cm-wood/35',
                  ].join(' ')}
                >
                  →
                </span>
              )}
            </li>
          )
        })}
      </ol>

      <div
        id="card-bounty-flow-detail"
        data-player-flow-detail-rail="true"
        className={`${styles.flowDetailRail} mt-5 h-[104px] overflow-hidden rounded-2xl border-2 border-[#1E7BA8]/35 bg-[#1E7BA8]/10 px-5 py-3`}
        aria-live="polite"
      >
        {activeStory ? (
          <div role="status" data-player-flow-detail="true">
            <p className="font-sans text-[13px] font-extrabold uppercase tracking-[0.1em] text-cm-violet-deep">
              {activeStory.label}
            </p>
            <p className="mt-1 font-sans text-[16px] leading-relaxed text-[#1A1A1A]">
              {activeStory.branchNote}
            </p>
          </div>
        ) : (
          <p className="font-sans text-[15px] leading-relaxed text-charcoal">
            Hover or focus a stage to inspect its eligibility, progress, or completion branch.
          </p>
        )}
      </div>

      <PrintDetails
        data-flow-print-summary="true"
        className={styles.flowPrintSummary}
      >
        {PLAYER_FLOW.map(({ label, branchNote }, index) => (
          <div
            key={label}
            data-flow-print-item={index + 1}
            className="rounded-lg border border-cm-wood/25 bg-white/70 p-2 text-[11px] leading-tight"
          >
            <p className="font-bold text-cm-violet-deep">{index + 1}. {label}</p>
            <p className="mt-1">{branchNote}</p>
          </div>
        ))}
      </PrintDetails>
    </section>
  )
}
