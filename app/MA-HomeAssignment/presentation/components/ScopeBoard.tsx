'use client'

import { useCallback, useState } from 'react'
import { SCOPE_STORIES, type ScopeStory } from '../deckData'
import styles from '../PresentationStage.module.css'
import { PrintDetails, RevealControl } from '../primitives'
import { useDeckReset, type DeckSlideKey } from '../useDeckReset'

export type ScopeBoardProps = {
  readonly slideKey: DeckSlideKey
}

type ScopeSelection = {
  readonly key: string
  readonly story: ScopeStory
}

type ScopeInteraction = {
  hovered: ScopeSelection | null
  focused: ScopeSelection | null
}

const IDLE: ScopeInteraction = {
  hovered: null,
  focused: null,
}

type ScopeColumnProps = {
  readonly label: 'In scope' | 'Out of scope'
  readonly stories: readonly ScopeStory[]
  readonly tone: 'in' | 'out'
  readonly activeKey: string | null
  readonly onHover: (selection: ScopeSelection) => void
  readonly onHoverEnd: (key: string) => void
  readonly onFocus: (selection: ScopeSelection) => void
  readonly onBlur: (key: string) => void
}

function ScopeColumn({
  label,
  stories,
  tone,
  activeKey,
  onHover,
  onHoverEnd,
  onFocus,
  onBlur,
}: ScopeColumnProps) {
  const isInScope = tone === 'in'

  return (
    <section
      aria-labelledby={`scope-${tone}-heading`}
      className={isInScope
        ? 'rounded-2xl border-2 border-cm-gold/55 bg-cm-gold/10 p-2'
        : 'rounded-2xl border-2 border-cm-crimson/35 bg-cm-crimson/5 p-2'}
    >
      <h3
        id={`scope-${tone}-heading`}
        className={isInScope
          ? 'font-serif text-[24px] font-black text-cm-violet-deep'
          : 'font-serif text-[24px] font-black text-cm-crimson'}
      >
        {label}
      </h3>
      <ul aria-label={label} className="mt-1 grid gap-[2px]">
        {stories.map((story, index) => {
          const key = `${tone}-${index}`
          const selection = { key, story }
          const active = activeKey === key

          return (
            <li key={story.requirement}>
              <RevealControl
                summary={story.requirement}
                active={active}
                aria-controls="scope-rationale-detail"
                data-active={active ? 'true' : 'false'}
                className={[
                  'w-full justify-start !px-3 !py-1 text-left text-[14px] leading-snug',
                  active
                    ? 'border-[#1E7BA8] bg-[#1E7BA8]/15'
                    : isInScope
                      ? 'border-cm-gold/55 bg-white/85'
                      : 'border-cm-crimson/35 bg-white/85',
                ].join(' ')}
                onMouseEnter={() => onHover(selection)}
                onMouseLeave={() => onHoverEnd(key)}
                onFocus={() => onFocus(selection)}
                onBlur={() => onBlur(key)}
              />
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function ScopePrintColumn({
  label,
  stories,
  tone,
}: Pick<ScopeColumnProps, 'label' | 'stories' | 'tone'>) {
  return (
    <section data-scope-print-column={tone}>
      <h3 className="font-serif text-[18px] font-black text-cm-violet-deep">{label}</h3>
      <ul className="mt-1 grid gap-1">
        {stories.map(({ requirement, rationale }) => (
          <li
            key={requirement}
            data-scope-print-entry="true"
            className="border-l-2 border-cm-gold/60 pl-2 text-[10px] leading-tight"
          >
            <p className="font-bold text-[#1A1A1A]">{requirement}</p>
            <p className="mt-0.5 text-charcoal">{rationale}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function ScopeBoard({ slideKey }: ScopeBoardProps) {
  const [interaction, setInteraction] = useState<ScopeInteraction>(IDLE)
  const reset = useCallback(() => setInteraction(IDLE), [])
  const activeSelection = interaction.focused ?? interaction.hovered

  useDeckReset(reset, slideKey)

  return (
    <section aria-label="Card Bounty MVP scope board">
      <section
        data-scope-screen-board="true"
        className={styles.scopeScreenBoard}
      >
        <div className="grid grid-cols-2 gap-4">
          <ScopeColumn
            label="In scope"
            stories={SCOPE_STORIES.in}
            tone="in"
            activeKey={activeSelection?.key ?? null}
            onHover={(selection) => setInteraction((current) => ({
              ...current,
              hovered: selection,
            }))}
            onHoverEnd={(key) => setInteraction((current) => ({
              ...current,
              hovered: current.hovered?.key === key ? null : current.hovered,
            }))}
            onFocus={(selection) => setInteraction((current) => ({
              ...current,
              focused: selection,
            }))}
            onBlur={(key) => setInteraction((current) => ({
              ...current,
              focused: current.focused?.key === key ? null : current.focused,
            }))}
          />
          <ScopeColumn
            label="Out of scope"
            stories={SCOPE_STORIES.out}
            tone="out"
            activeKey={activeSelection?.key ?? null}
            onHover={(selection) => setInteraction((current) => ({
              ...current,
              hovered: selection,
            }))}
            onHoverEnd={(key) => setInteraction((current) => ({
              ...current,
              hovered: current.hovered?.key === key ? null : current.hovered,
            }))}
            onFocus={(selection) => setInteraction((current) => ({
              ...current,
              focused: selection,
            }))}
            onBlur={(key) => setInteraction((current) => ({
              ...current,
              focused: current.focused?.key === key ? null : current.focused,
            }))}
          />
        </div>

        <div
          id="scope-rationale-detail"
          data-scope-rationale-rail="true"
          className="mt-2 h-[76px] overflow-hidden rounded-xl border-2 border-[#1E7BA8]/35 bg-[#1E7BA8]/10 px-4 py-2"
          aria-live="polite"
        >
          {activeSelection ? (
            <div role="status" data-scope-rationale="true">
              <p className="font-sans text-[12px] font-extrabold text-cm-violet-deep">
                {activeSelection.story.requirement}
              </p>
              <p className="mt-0.5 font-sans text-[14px] leading-snug text-[#1A1A1A]">
                {activeSelection.story.rationale}
              </p>
            </div>
          ) : (
            <p className="font-sans text-[14px] leading-snug text-charcoal">
              Hover or focus a requirement to see the learning objective or MVP boundary behind it.
            </p>
          )}
        </div>
      </section>

      <PrintDetails
        data-scope-print-summary="true"
        className={styles.scopePrintGrid}
      >
        <ScopePrintColumn label="In scope" stories={SCOPE_STORIES.in} tone="in" />
        <ScopePrintColumn label="Out of scope" stories={SCOPE_STORIES.out} tone="out" />
      </PrintDetails>
    </section>
  )
}
