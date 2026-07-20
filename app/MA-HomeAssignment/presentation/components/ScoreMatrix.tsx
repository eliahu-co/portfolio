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

// Typographically identical to the cell explanations — it inherits the slot's
// font, size and leading — and differs only by staying grey instead of violet.
function DecisionSummary() {
  return <p data-testid="score-formula" className="font-bold text-charcoal">{OPPORTUNITY_SCORE_FORMULA}</p>
}

function ExactRationale({ active }: { readonly active: ActiveScore }) {
  const story = SCORE_STORIES[active.row]

  if (active.criterion === 'total') {
    return <p>This total compares the opportunities directionally; it is not a precise forecast.</p>
  }

  const criterion = CRITERIA.find(({ key }) => key === active.criterion)!

  return <p className="font-bold text-cm-violet-deep">{story.rationales[criterion.index]}</p>
}

export function ScoreMatrix({ slideKey }: ScoreMatrixProps) {
  const [hovered, setHovered] = useState<ActiveScore | null>(null)
  const [focused, setFocused] = useState<ActiveScore | null>(null)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const [hoveredHeader, setHoveredHeader] = useState<Exclude<CriterionKey, 'total'> | null>(null)
  const active = focused ?? hovered
  const activeRow = hoveredRow ?? active?.row ?? null
  // whichever column is under the cursor, whether via a cell or the header itself
  const activeCriterion: CriterionKey | null = active?.criterion ?? hoveredHeader ?? null
  const reset = useCallback(() => {
    setHovered(null)
    setFocused(null)
    setHoveredRow(null)
    setHoveredHeader(null)
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
              {/* headers dim alongside the rows, so the live column is the only
                  one left at full strength — no fill needed to mark it */}
              <th
                scope="col"
                data-active="false"
                className={classNames(
                  'w-[20%] px-5 py-3 font-sans text-[12px] font-extrabold uppercase tracking-[0.1em] text-charcoal transition-opacity duration-300 motion-reduce:transition-none',
                  activeCriterion !== null ? 'opacity-20' : 'opacity-100',
                )}
              >
                Feature
              </th>
              {CRITERIA.map(({ key, definition }) => {
                const columnIsActive = active?.criterion === key || hoveredHeader === key
                return (
                  <th
                    key={key}
                    scope="col"
                    data-testid={`score-column-${key}`}
                    data-active={columnIsActive ? 'true' : 'false'}
                    className={classNames(
                      'w-[16%] px-2 py-3 text-center font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] text-charcoal transition-opacity duration-300 motion-reduce:transition-none',
                      activeCriterion !== null && !columnIsActive ? 'opacity-20' : 'opacity-100',
                    )}
                  >
                    <button type="button" aria-label={`Explain ${definition.title}`} data-deck-interactive="true" onMouseEnter={() => setHoveredHeader(key)} onMouseLeave={() => setHoveredHeader(null)} onFocus={() => setHoveredHeader(key)} onBlur={() => setHoveredHeader(null)} className="w-full border-0 bg-transparent font-inherit text-inherit">
                      {definition.title}
                    </button>
                  </th>
                )
              })}
              <th
                scope="col"
                data-testid="score-column-total"
                data-active={activeCriterion === 'total' ? 'true' : 'false'}
                className={classNames(
                  'w-[16%] px-3 py-3 text-center font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] text-charcoal transition-opacity duration-300 motion-reduce:transition-none',
                  activeCriterion !== null && activeCriterion !== 'total' ? 'opacity-20' : 'opacity-100',
                )}
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {SCORE_STORIES.map(({ row }, rowIndex) => {
              const rowIsActive = activeRow === rowIndex

              return (
                <tr
                  key={row.useCase}
                  data-score-row={row.useCase}
                  data-winner={row.winner ? 'true' : 'false'}
                  data-winner-band={row.winner ? 'true' : 'false'}
                  data-active-row={rowIsActive ? 'true' : 'false'}
                  onMouseEnter={() => setHoveredRow(rowIndex)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={classNames(
                    'border-b border-charcoal/15 transition-[background-color,opacity] duration-300 motion-reduce:transition-none last:border-b-0',
                    row.winner && activeRow === null && !hoveredHeader && 'bg-cm-gold/20',
                    activeRow !== null && !rowIsActive ? 'opacity-20' : 'opacity-100',
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
                          'p-0 text-center transition-[background-color] duration-300 motion-reduce:transition-none',
                          columnIsActive && 'bg-cm-gold/45',
                        )}
                      >
                        {/* fills the cell: the hover handlers live here, so a
                            narrow button would leave most of the cell inert */}
                        <button
                          {...scoreControlProps(rowIndex, key)}
                          aria-label={`${row.useCase}: ${definition.title} score ${score}`}
                          className={classNames(
                            'grid min-h-[60px] w-full place-items-center border-0 bg-transparent px-2 py-2 font-sans text-[18px] font-medium tabular-nums text-charcoal transition-[font-size,color] duration-300 motion-reduce:transition-none hover:text-cm-crimson focus-visible:outline focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-[#1E7BA8]',
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
                      'p-0 text-center transition-[background-color] duration-300 motion-reduce:transition-none',
                      active?.criterion === 'total' && 'bg-cm-gold/45',
                    )}
                  >
                    <button
                      {...scoreControlProps(rowIndex, 'total')}
                      aria-label={`${row.useCase}: total opportunity score ${Math.round(row.total)}`}
                      className={classNames(
                        'grid min-h-[60px] w-full place-items-center border-0 bg-transparent px-3 py-2 font-sans text-[18px] font-black tabular-nums text-cm-crimson transition-[font-size,color] duration-300 motion-reduce:transition-none hover:text-cm-violet-deep focus-visible:outline focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-[#1E7BA8]',
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
        className="mt-8 h-[200px]"
      >
        {/* one slot: the formula is the resting state and each explanation
            replaces it in place, so nothing shifts as you move across the table */}
        <section
          id="comparative-score-detail"
          role="status"
          aria-label="Score detail"
          className="h-[200px] overflow-hidden font-sans text-[13px] leading-snug text-[#1A1A1A]"
        >
          {hoveredHeader
            ? <p>{CRITERIA.find(({ key }) => key === hoveredHeader)!.definition.body}</p>
            : active
              ? <ExactRationale active={active} />
              : <DecisionSummary />}
        </section>
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
