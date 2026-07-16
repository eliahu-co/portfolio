'use client'

import { useCallback, useState } from 'react'
import {
  CRITERIA_DEFS,
  OPPORTUNITY_SCORE_FORMULA,
} from '@/app/MA-HomeAssignment/content/prioritization'
import styles from '../PresentationStage.module.css'
import { SCORE_STORIES } from '../deckData'
import { PrintDetails } from '../primitives'
import { useDeckReset, type DeckSlideKey } from '../useDeckReset'

type CriterionKey = 'arpdauImpact' | 'coreLoopFit' | 'confidence' | 'effort' | 'total'

type ActiveScore = {
  readonly row: number
  readonly criterion: CriterionKey
}

type ScoreMatrixProps = {
  readonly slideKey: DeckSlideKey
}

const CRITERIA: ReadonlyArray<{
  readonly key: Exclude<CriterionKey, 'total'>
  readonly index: number
  readonly definition: (typeof CRITERIA_DEFS)[number]
}> = [
  { key: 'arpdauImpact', index: 0, definition: CRITERIA_DEFS[0] },
  { key: 'coreLoopFit', index: 1, definition: CRITERIA_DEFS[1] },
  { key: 'confidence', index: 2, definition: CRITERIA_DEFS[2] },
  { key: 'effort', index: 3, definition: CRITERIA_DEFS[3] },
]

const MEDALS = ['🥇', '🥈', '🥉'] as const

function classNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ')
}

function DecisionSummary() {
  return (
    <div className="font-sans text-[13px] leading-relaxed text-charcoal">
      <p>
        <span className="font-bold text-cm-violet-deep">Relative comparison: </span>
        Card Bounty leads because it combines direct monetization upside with the strongest core-loop fit.
      </p>
      <p className="mt-2 font-bold text-cm-violet-deep">{OPPORTUNITY_SCORE_FORMULA}</p>
    </div>
  )
}

function DefaultScoreDetail() {
  return (
    <div data-testid="score-default-detail" className="max-w-[760px] font-sans text-[13px] leading-snug text-[#1A1A1A]">
      <p className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-cm-crimson">
        Highest opportunity
      </p>
      <h3 className="mt-1 font-serif text-[21px] font-black leading-tight text-cm-violet-deep">
        Card Bounty
      </h3>
      <p className="mt-2">
        The strongest combination of ARPDAU impact, core-loop fit, and confidence at a bounded learning cost.
      </p>
    </div>
  )
}

function ExactRationale({ active }: { readonly active: ActiveScore }) {
  const story = SCORE_STORIES[active.row]

  if (active.criterion === 'total') {
    return (
      <div>
        <p className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-cm-crimson">
          {story.row.useCase} · score {Math.round(story.row.total)}
        </p>
        <h3 className="mt-1 font-serif text-[21px] font-black leading-tight text-cm-violet-deep">
          Relative opportunity score
        </h3>
        <p className="mt-2">This total compares the opportunities directionally; it is not a precise forecast.</p>
      </div>
    )
  }

  const criterion = CRITERIA.find(({ key }) => key === active.criterion)!

  return (
    <div className="grid grid-cols-[1.25fr_0.75fr] gap-7">
      <div>
        <p className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-cm-crimson">
          {story.row.useCase} · score {story.row.scores[criterion.index]}
        </p>
        <h3 className="mt-1 font-serif text-[21px] font-black leading-tight text-cm-violet-deep">
          {criterion.definition.title}
        </h3>
        <p className="mt-1 italic text-charcoal">{criterion.definition.body}</p>
        <p className="mt-2 font-bold text-cm-violet-deep">{story.rationales[criterion.index]}</p>
      </div>
      <div className="grid content-start gap-1">
        {criterion.definition.rubric.map(([score, description]) => (
          <p
            key={score}
            data-testid="score-rubric-item"
            data-score-rubric-item="true"
            data-rubric-score={score}
            className="flex gap-2"
          >
            <span className="font-black text-cm-crimson">{score}</span>
            <span>{description}</span>
          </p>
        ))}
      </div>
    </div>
  )
}

export function ScoreMatrix({ slideKey }: ScoreMatrixProps) {
  const [hovered, setHovered] = useState<ActiveScore | null>(null)
  const [focused, setFocused] = useState<ActiveScore | null>(null)
  const active = focused ?? hovered
  const reset = useCallback(() => {
    setHovered(null)
    setFocused(null)
  }, [])

  useDeckReset(reset, slideKey)

  const scoreControlProps = (row: number, criterion: CriterionKey) => {
    const cellIsActive = active?.row === row && active.criterion === criterion
    const score = { row, criterion }
    const clearHovered = () => setHovered((current) => (
      current?.row === row && current.criterion === criterion ? null : current
    ))
    const clearFocused = () => setFocused((current) => (
      current?.row === row && current.criterion === criterion ? null : current
    ))

    return {
      type: 'button' as const,
      'data-deck-interactive': 'true',
      'data-active-cell': cellIsActive ? 'true' : 'false',
      'aria-controls': 'comparative-score-detail',
      'aria-expanded': cellIsActive,
      onMouseEnter: () => setHovered(score),
      onMouseLeave: clearHovered,
      onFocus: () => setFocused(score),
      onBlur: clearFocused,
    }
  }

  return (
    <section aria-label="Comparative scoring matrix">
      <div className="overflow-visible">
        <table
          aria-label="Comparative opportunity scoring"
          className="w-full table-fixed border-collapse text-left"
        >
          <thead>
            <tr className="border-b-2 border-cm-wood">
              <th scope="col" className="w-[20%] px-5 py-3 font-sans text-[12px] font-extrabold uppercase tracking-[0.1em] text-charcoal">
                Feature
              </th>
              {CRITERIA.map(({ key, definition }) => {
                const columnIsActive = active?.criterion === key
                return (
                  <th
                    key={key}
                    scope="col"
                    data-testid={`score-column-${key}`}
                    data-active={columnIsActive ? 'true' : 'false'}
                    className={classNames(
                      'w-[16%] px-2 py-3 text-center font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] text-charcoal transition-[background-color] duration-300 motion-reduce:transition-none',
                      columnIsActive && 'bg-cm-gold/45',
                    )}
                  >
                    {definition.title}
                  </th>
                )
              })}
              <th
                scope="col"
                data-testid="score-column-total"
                data-active={active?.criterion === 'total' ? 'true' : 'false'}
                className={classNames(
                  'w-[16%] px-3 py-3 text-center font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] text-charcoal transition-[background-color] duration-300 motion-reduce:transition-none',
                  active?.criterion === 'total' && 'bg-cm-gold/45',
                )}
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {SCORE_STORIES.map(({ row }, rowIndex) => {
              const rowIsActive = active?.row === rowIndex

              return (
                <tr
                  key={row.useCase}
                  data-score-row={row.useCase}
                  data-winner={row.winner ? 'true' : 'false'}
                  data-winner-band={row.winner ? 'true' : 'false'}
                  data-active-row={rowIsActive ? 'true' : 'false'}
                  className={classNames(
                    'border-b border-charcoal/15 transition-[background-color,opacity] duration-300 motion-reduce:transition-none last:border-b-0',
                    row.winner && !active && 'bg-cm-gold/20',
                    active && !rowIsActive ? 'opacity-20' : 'opacity-100',
                  )}
                >
                  <th
                    scope="row"
                    className={classNames(
                      'px-5 py-3 font-sans text-[16px] leading-tight text-cm-violet-deep',
                      row.winner ? 'font-black' : 'font-bold',
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span data-rank-medal="true" aria-hidden="true">{MEDALS[rowIndex]}</span>
                      {row.winner && <span className="sr-only">Recommended winner: </span>}
                      {row.useCase}
                    </span>
                  </th>
                  {row.scores.map((score, criterionIndex) => {
                    const { key, definition } = CRITERIA[criterionIndex]
                    const cellIsActive = active?.row === rowIndex && active.criterion === key
                    const columnIsActive = active?.criterion === key

                    return (
                      <td
                        key={key}
                        data-active={columnIsActive ? 'true' : 'false'}
                        className={classNames(
                          'px-2 py-2 text-center transition-[background-color] duration-300 motion-reduce:transition-none',
                          columnIsActive && 'bg-cm-gold/45',
                        )}
                      >
                        <button
                          {...scoreControlProps(rowIndex, key)}
                          aria-label={`${row.useCase}: ${definition.title} score ${score}`}
                          className={classNames(
                            'mx-auto grid h-11 w-12 place-items-center border-0 bg-transparent font-sans text-[18px] font-medium tabular-nums text-charcoal transition-[font-size,color] duration-300 motion-reduce:transition-none hover:text-cm-crimson focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-1 focus-visible:outline-[#1E7BA8]',
                            cellIsActive && 'text-[20px] font-black text-cm-crimson',
                          )}
                        >
                          {score}
                        </button>
                      </td>
                    )
                  })}
                  <td
                    data-active={active?.criterion === 'total' ? 'true' : 'false'}
                    className={classNames(
                      'px-3 py-2 text-center transition-[background-color] duration-300 motion-reduce:transition-none',
                      active?.criterion === 'total' && 'bg-cm-gold/45',
                    )}
                  >
                    <button
                      {...scoreControlProps(rowIndex, 'total')}
                      aria-label={`${row.useCase}: total opportunity score ${Math.round(row.total)}`}
                      className={classNames(
                        'mx-auto grid h-11 w-12 place-items-center border-0 bg-transparent font-sans text-[18px] font-black tabular-nums text-cm-crimson transition-[font-size,color] duration-300 motion-reduce:transition-none hover:text-cm-violet-deep focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-1 focus-visible:outline-[#1E7BA8]',
                        active?.row === rowIndex && active.criterion === 'total' && 'text-[20px] font-black',
                      )}
                    >
                      {Math.round(row.total)}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div
        data-testid="score-disclosure-region"
        className="mt-8 grid h-[200px] grid-rows-[144px_56px]"
      >
        <section
          id="comparative-score-detail"
          role="status"
          aria-label="Score detail"
          className="h-[144px] overflow-hidden font-sans text-[13px] leading-snug text-[#1A1A1A]"
        >
          {active ? <ExactRationale active={active} /> : <DefaultScoreDetail />}
        </section>
        <div
          data-testid="score-decision-summary"
          className={classNames(
            'h-[56px] overflow-hidden transition-opacity duration-300 motion-reduce:transition-none',
            active ? 'opacity-20' : 'opacity-100',
          )}
        >
          <DecisionSummary />
        </div>
      </div>

      <PrintDetails
        data-score-print-summary="true"
        className={classNames(styles.scorePrintGrid, 'grid grid-cols-4 gap-2')}
        style={{ fontSize: 9, lineHeight: 1.15 }}
      >
        {CRITERIA_DEFS.map(({ title, body, rubric }) => (
          <section key={title} className="rounded-lg border border-cm-wood/25 p-2">
            <h4 className="font-bold text-cm-violet-deep">{title}</h4>
            <p className="mt-1 italic">{body}</p>
            <div className="mt-1 border-t border-charcoal/15 pt-1">
              {rubric.map(([score, description]) => (
                <p key={score} data-score-rubric-item="true" data-rubric-score={score}>
                  <span className="font-bold text-cm-crimson">{score} </span>
                  {description}
                </p>
              ))}
            </div>
          </section>
        ))}
      </PrintDetails>
    </section>
  )
}
