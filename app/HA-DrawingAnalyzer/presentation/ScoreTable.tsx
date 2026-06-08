// app/HA-DrawingAnalyzer/presentation/ScoreTable.tsx
// Prioritization scoring table. Default: the winner row is highlighted yellow.
// On hover, the yellow moves to the hovered score column, and the exact cell
// under the cursor goes bold. Leaving the table restores the winner highlight.
'use client'

import { useEffect, useState } from 'react'

const MEDALS = ['🥇', '🥈', '🥉', '']
const YELLOW = '#ffff00'

export default function ScoreTable({
  criteria,
  rows,
  onHoverChange,
}: {
  criteria: readonly string[]
  rows: { useCase: string; scores: number[]; total: number; winner?: boolean }[]
  onHoverChange?: (cell: { row: number; col: number } | null) => void
}) {
  const [hover, setHover] = useState<{ row: number; col: number } | null>(null)
  useEffect(() => { onHoverChange?.(hover) }, [hover, onHoverChange])
  const totalCol = criteria.length

  // a cell is yellow if its column is hovered; with no hover, the winner row is yellow
  const yellow = (rowIdx: number, col: number) =>
    hover ? col === hover.col : !!rows[rowIdx]?.winner
  const headerYellow = (col: number) => hover?.col === col

  return (
    <table className="w-full border-collapse text-left" onMouseLeave={() => setHover(null)}>
      <thead>
        <tr className="border-b-2 border-black">
          <th className="py-3 pr-4 font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-charcoal">Use case</th>
          {criteria.map((c, ci) => (
            <th key={c} style={{ backgroundColor: headerYellow(ci) ? YELLOW : undefined }} className="px-3 py-3 text-center font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-charcoal">{c}</th>
          ))}
          <th style={{ backgroundColor: headerYellow(totalCol) ? YELLOW : undefined }} className="pl-3 py-3 text-center font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-charcoal">Total</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, ri) => (
          <tr key={r.useCase} className="border-b border-charcoal/15">
            <td onMouseEnter={() => setHover(null)} className={`py-3 pr-4 font-sans text-[16px] ${r.winner ? 'text-black' : 'text-charcoal'} ${r.winner && !hover ? 'font-bold' : ''}`}>
              <span className="mr-2 inline-block w-7 text-center" aria-hidden="true">{MEDALS[ri]}</span>{r.useCase}
            </td>
            {r.scores.map((s, ci) => {
              const bold = hover?.row === ri && hover?.col === ci
              const on = yellow(ri, ci)
              return (
                <td
                  key={ci}
                  onMouseEnter={() => setHover({ row: ri, col: ci })}
                  style={{ backgroundColor: on ? YELLOW : undefined }}
                  className={`px-3 py-3 text-center font-sans ${bold ? 'text-[18px] font-extrabold' : 'text-[16px]'} ${on ? 'text-black' : 'text-charcoal/70'}`}
                >
                  {s}
                </td>
              )
            })}
            <td
              onMouseEnter={() => setHover({ row: ri, col: totalCol })}
              style={{ backgroundColor: yellow(ri, totalCol) ? YELLOW : undefined }}
              className={`pl-3 py-3 text-center font-sans text-[18px] text-black ${hover?.row === ri && hover?.col === totalCol ? 'font-extrabold' : 'font-bold'}`}
            >
              {r.total}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
