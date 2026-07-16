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

function ExactRationale({ active }: { readonly active: ActiveScore }) {
  const story = SCORE_STORIES[active.row]

  if (active.criterion === 'total') {
    return (
      <section
        id="comparative-score-detail"
        role="status"
        aria-label="Score detail"
        className="border-l-4 border-cm-gold pl-5 font-sans text-[13px] leading-snug text-[#1A1A1A]"
      >
        <p className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-cm-crimson">
          {story.row.useCase} · score {Math.round(story.row.total)}
        </p>
        <h3 className="mt-1 font-serif text-[21px] font-black leading-tight text-cm-violet-deep">
          Relative opportunity score
        </h3>
        <p className="mt-2">This total compares the opportunities directionally; it is not a precise forecast.</p>
      </section>
    )
  }

  const criterion = CRITERIA.find(({ key }) => key === active.criterion)!

  return (
    <section
      id="comparative-score-detail"
      role="status"
      aria-label="Score detail"
      className="grid grid-cols-[1.25fr_0.75fr] gap-7 border-l-4 border-cm-gold pl-5 font-sans text-[13px] leading-snug text-[#1A1A1A]"
    >
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
            data-score-rubric-item="true"
            data-rubric-score={score}
            className="flex gap-2"
          >
            <span className="font-black text-cm-crimson">{score}</span>
            <span>{description}</span>
          </p>
        ))}
      </div>
    </section>
  )
}

export function ScoreMatrix({ slideKey }: ScoreMatrixProps) {
  const [active, setActive] = useState<ActiveScore | null>(null)
  const reset = useCallback(() => setActive(null), [])

  useDeckReset(reset, slideKey)

  const scoreControlProps = (row: number, criterion: CriterionKey) => {
    const cellIsActive = active?.row === row && active.criterion === criterion
    const activate = () => setActive({ row, criterion })
    const clear = () => setActive((current) => (
      current?.row === row && current.criterion === criterion ? null : current
    ))

    return {
      type: 'button' as const,
      'data-deck-interactive': 'true',
      'data-active-cell': cellIsActive ? 'true' : 'false',
      'aria-controls': 'comparative-score-detail',
      'aria-expanded': cellIsActive,
      onMouseEnter: activate,
      onMouseLeave: clear,
      onFocus: activate,
      onBlur: clear,
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
                      'w-[16%] px-2 py-3 text-center font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] text-charcoal transition-colors',
                      columnIsActive && 'bg-[#1E7BA8]/10',
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
                  'w-[16%] px-3 py-3 text-center font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] text-charcoal transition-colors',
                  active?.criterion === 'total' && 'bg-[#1E7BA8]/10',
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
                    'border-b border-charcoal/15 transition-[background-color,box-shadow] last:border-b-0',
                    row.winner && !active && 'animate-shimmer bg-[linear-gradient(90deg,rgba(245,168,0,0.08),rgba(245,168,0,0.28),rgba(245,168,0,0.08))] bg-[length:200%_100%] motion-reduce:animate-none',
                    rowIsActive && 'shadow-[inset_3px_0_0_#1E7BA8]',
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
                      {row.winner && <span aria-hidden="true" className="text-cm-crimson">★</span>}
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
                          'px-2 py-2 text-center transition-colors',
                          columnIsActive && 'bg-[#1E7BA8]/10',
                        )}
                      >
                        <button
                          {...scoreControlProps(rowIndex, key)}
                          aria-label={`${row.useCase}: ${definition.title} score ${score}`}
                          className={classNames(
                            'mx-auto grid h-11 w-12 place-items-center border-0 bg-transparent font-sans text-[19px] font-medium tabular-nums text-charcoal transition-colors hover:text-cm-crimson focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-1 focus-visible:outline-[#1E7BA8]',
                            cellIsActive && 'font-black text-cm-crimson underline decoration-cm-gold decoration-4 underline-offset-4',
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
                      'px-3 py-2 text-center transition-colors',
                      active?.criterion === 'total' && 'bg-[#1E7BA8]/10',
                    )}
                  >
                    <button
                      {...scoreControlProps(rowIndex, 'total')}
                      aria-label={`${row.useCase}: total opportunity score ${Math.round(row.total)}`}
                      className={classNames(
                        'mx-auto grid h-11 min-w-14 place-items-center border-0 bg-transparent px-2 font-sans text-[20px] font-black tabular-nums text-cm-crimson transition-colors hover:text-cm-violet-deep focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-1 focus-visible:outline-[#1E7BA8]',
                        active?.row === rowIndex && active.criterion === 'total' && 'underline decoration-cm-gold decoration-4 underline-offset-4',
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

      <div className="mt-8 min-h-[150px]">
        <div className="min-h-10">{active && <ExactRationale active={active} />}</div>
        <div className={active ? 'opacity-20' : 'opacity-100'}>
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
