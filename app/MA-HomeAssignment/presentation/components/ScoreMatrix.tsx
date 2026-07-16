'use client'

import { useCallback, useState } from 'react'
import {
  CRITERIA_DEFS,
  OPPORTUNITY_SCORE_FORMULA,
} from '@/app/MA-HomeAssignment/content/prioritization'
import { SCORE_STORIES } from '../deckData'
import { PrintDetails } from '../primitives'
import { useDeckReset, type DeckSlideKey } from '../useDeckReset'

type ActiveMode = 'hover' | 'focus' | 'pinned'

type ActiveCell = {
  readonly rowId: string
  readonly criterionId: string
  readonly mode: ActiveMode
}

type ScoreMatrixProps = {
  readonly slideKey: DeckSlideKey
}

const TOTAL_ID = 'total'

const CRITERIA = CRITERIA_DEFS.map((criterion, index) => ({
  criterion,
  index,
  id: criterion.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
}))

function classNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ')
}

function isSameCell(
  active: ActiveCell | null,
  rowId: string,
  criterionId: string,
): boolean {
  return active?.rowId === rowId && active.criterionId === criterionId
}

export function ScoreMatrix({ slideKey }: ScoreMatrixProps) {
  const [active, setActive] = useState<ActiveCell | null>(null)
  const reset = useCallback(() => setActive(null), [])

  useDeckReset(reset, slideKey)

  const activate = (rowId: string, criterionId: string, mode: Exclude<ActiveMode, 'pinned'>) => {
    setActive((current) => (
      current?.mode === 'pinned'
        ? current
        : { rowId, criterionId, mode }
    ))
  }

  const clearTransient = (
    rowId: string,
    criterionId: string,
    mode: Exclude<ActiveMode, 'pinned'>,
  ) => {
    setActive((current) => (
      isSameCell(current, rowId, criterionId) && current?.mode === mode
        ? null
        : current
    ))
  }

  const togglePinned = (rowId: string, criterionId: string) => {
    setActive((current) => (
      isSameCell(current, rowId, criterionId) && current?.mode === 'pinned'
        ? null
        : { rowId, criterionId, mode: 'pinned' }
    ))
  }

  const activeStory = active
    ? SCORE_STORIES.find(({ row }) => row.useCase === active.rowId)
    : undefined
  const activeCriterion = active?.criterionId === TOTAL_ID
    ? undefined
    : CRITERIA.find(({ id }) => id === active?.criterionId)

  const scoreControlProps = (rowId: string, criterionId: string) => {
    const cellIsActive = isSameCell(active, rowId, criterionId)

    return {
      type: 'button' as const,
      'data-deck-interactive': 'true',
      'data-active-cell': cellIsActive ? 'true' : 'false',
      'aria-controls': 'comparative-score-detail',
      'aria-expanded': cellIsActive,
      'aria-pressed': cellIsActive && active?.mode === 'pinned',
      onMouseEnter: () => activate(rowId, criterionId, 'hover'),
      onMouseLeave: () => clearTransient(rowId, criterionId, 'hover'),
      onFocus: () => activate(rowId, criterionId, 'focus'),
      onBlur: () => clearTransient(rowId, criterionId, 'focus'),
      onClick: () => togglePinned(rowId, criterionId),
      onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          event.stopPropagation()
          togglePinned(rowId, criterionId)
          return
        }

        if (event.key !== 'Escape' || active === null) return
        event.preventDefault()
        event.stopPropagation()
        reset()
      },
    }
  }

  return (
    <section aria-label="Comparative scoring matrix">
      <div className="overflow-hidden rounded-2xl border-2 border-cm-wood/30 bg-white/75 shadow-[0_10px_28px_rgba(42,27,84,0.09)]">
        <table
          aria-label="Comparative opportunity scoring"
          className="w-full table-fixed border-collapse text-left"
        >
          <thead>
            <tr className="border-b-2 border-cm-wood/45 bg-cm-violet-deep/[0.04]">
              <th
                scope="col"
                className="w-[20%] px-5 py-3 font-sans text-[12px] font-extrabold uppercase tracking-[0.1em] text-charcoal"
              >
                Feature
              </th>
              {CRITERIA.map(({ criterion, id }) => (
                <th
                  key={id}
                  scope="col"
                  data-active-column={active?.criterionId === id ? 'true' : 'false'}
                  className={classNames(
                    'w-[16%] px-2 py-3 text-center font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] text-charcoal transition-colors',
                    active?.criterionId === id && 'bg-[#1E7BA8]/15 text-cm-violet-deep',
                  )}
                >
                  {criterion.title}
                </th>
              ))}
              <th
                scope="col"
                data-active-column={active?.criterionId === TOTAL_ID ? 'true' : 'false'}
                className={classNames(
                  'w-[16%] px-3 py-3 text-center font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] text-charcoal transition-colors',
                  active?.criterionId === TOTAL_ID && 'bg-[#1E7BA8]/15 text-cm-violet-deep',
                )}
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {SCORE_STORIES.map(({ row }) => {
              const rowIsActive = active?.rowId === row.useCase

              return (
                <tr
                  key={row.useCase}
                  data-score-row={row.useCase}
                  data-winner={row.winner ? 'true' : 'false'}
                  data-winner-band={row.winner ? 'true' : 'false'}
                  data-active-row={rowIsActive ? 'true' : 'false'}
                  className={classNames(
                    'border-b border-charcoal/15 transition-[background-color,box-shadow] last:border-b-0',
                    row.winner && 'bg-cm-gold/20',
                    rowIsActive && 'shadow-[inset_5px_0_0_#1E7BA8]',
                    rowIsActive && !row.winner && 'bg-[#1E7BA8]/[0.07]',
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
                      {row.winner && (
                        <span aria-hidden="true" className="text-cm-crimson">★</span>
                      )}
                      {row.useCase}
                    </span>
                  </th>
                  {row.scores.map((score, criterionIndex) => {
                    const { criterion, id } = CRITERIA[criterionIndex]
                    const cellIsActive = isSameCell(active, row.useCase, id)
                    const columnIsActive = active?.criterionId === id

                    return (
                      <td
                        key={id}
                        data-active-column={columnIsActive ? 'true' : 'false'}
                        className={classNames(
                          'px-2 py-2 text-center transition-colors',
                          columnIsActive && 'bg-[#1E7BA8]/[0.08]',
                        )}
                      >
                        <button
                          {...scoreControlProps(row.useCase, id)}
                          aria-label={`${row.useCase}: ${criterion.title} score ${score}`}
                          className={classNames(
                            'mx-auto grid h-11 w-12 place-items-center rounded-xl border-2 border-cm-wood/25 bg-white font-sans text-[19px] font-black tabular-nums text-cm-violet-deep transition-[color,background-color,border-color,transform] hover:border-[#1E7BA8] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#1E7BA8]',
                            cellIsActive && 'scale-110 border-[#1E7BA8] bg-[#1E7BA8] text-white',
                          )}
                        >
                          {score}
                        </button>
                      </td>
                    )
                  })}
                  <td
                    data-active-column={active?.criterionId === TOTAL_ID ? 'true' : 'false'}
                    className={classNames(
                      'px-3 py-2 text-center transition-colors',
                      active?.criterionId === TOTAL_ID && 'bg-[#1E7BA8]/[0.08]',
                    )}
                  >
                    <button
                      {...scoreControlProps(row.useCase, TOTAL_ID)}
                      aria-label={`${row.useCase}: total opportunity score ${Math.round(row.total)}`}
                      className={classNames(
                        'mx-auto grid h-11 min-w-14 place-items-center rounded-xl border-2 border-cm-gold/60 bg-cm-gold/15 px-2 font-sans text-[19px] font-black tabular-nums text-cm-crimson transition-[color,background-color,border-color,transform] hover:border-cm-crimson focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#1E7BA8]',
                        isSameCell(active, row.useCase, TOTAL_ID) && 'scale-110 border-cm-crimson bg-cm-crimson text-white',
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

      <p className="mt-2 border-l-4 border-cm-gold pl-3 font-sans text-[13px] leading-relaxed text-charcoal">
        <span className="font-bold text-cm-violet-deep">Relative comparison: </span>
        {OPPORTUNITY_SCORE_FORMULA}
      </p>

      <div className="mt-2 min-h-[142px]">
        {active && activeStory && (
          <section
            id="comparative-score-detail"
            role="status"
            aria-label="Score detail"
            className="rounded-2xl border border-[#1E7BA8]/45 bg-[#1E7BA8]/[0.08] px-5 py-3 font-sans text-[13px] leading-snug text-[#1A1A1A]"
          >
            {active.criterionId === TOTAL_ID ? (
              <div className="grid grid-cols-[0.7fr_1.3fr] items-center gap-5">
                <div>
                  <p className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-cm-crimson">
                    {activeStory.row.useCase}
                  </p>
                  <h3 className="mt-1 font-serif text-[23px] font-black leading-tight text-cm-violet-deep">
                    Relative opportunity score
                  </h3>
                </div>
                <div>
                  <p>
                    This total compares the three opportunities directionally; it is not a claim of precise forecast accuracy.
                  </p>
                  <p className="mt-2 font-bold text-cm-violet-deep">{OPPORTUNITY_SCORE_FORMULA}</p>
                </div>
              </div>
            ) : activeCriterion ? (
              <div className="grid grid-cols-[0.9fr_1.1fr] gap-5">
                <div>
                  <p className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-cm-crimson">
                    {activeStory.row.useCase} · score {activeStory.row.scores[activeCriterion.index]}
                  </p>
                  <h3 className="mt-1 font-serif text-[21px] font-black leading-tight text-cm-violet-deep">
                    {activeCriterion.criterion.title}
                  </h3>
                  <p className="mt-1 text-[13px] italic text-charcoal">
                    {activeCriterion.criterion.body}
                  </p>
                  <p className="mt-2 font-bold text-cm-violet-deep">
                    {activeStory.rationales[activeCriterion.index]}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-1 border-l border-[#1E7BA8]/30 pl-5">
                  {activeCriterion.criterion.rubric.map(([score, description]) => (
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
              </div>
            ) : null}
          </section>
        )}
      </div>

      <PrintDetails
        data-score-print-summary="true"
        className="grid grid-cols-4 gap-2"
        style={{ fontSize: 9, lineHeight: 1.15 }}
      >
        {CRITERIA_DEFS.map(({ title, body, rubric }) => (
          <section key={title} className="rounded-lg border border-cm-wood/25 p-2">
            <h4 className="font-bold text-cm-violet-deep">{title}</h4>
            <p className="mt-1 italic">{body}</p>
            <div className="mt-1 border-t border-charcoal/15 pt-1">
              {rubric.map(([score, description]) => (
                <p
                  key={score}
                  data-score-rubric-item="true"
                  data-rubric-score={score}
                >
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
