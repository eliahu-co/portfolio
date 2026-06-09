// app/HA-DrawingAnalyzer/presentation/slides/Slide04SelectedUseCases.tsx
'use client'

import { useState } from 'react'
import { SlideShell } from '../primitives'
import { USE_CASES } from '../deckData'

const MEDALS = ['🥇', '🥈', '🥉', '']
const YELLOW = '#ffff00'

// Plain-language title for the cover row (strips the parenthetical subtitle).
function shortTitle(t: string): string {
  return t.split('\n')[0].replace(/\s*\(.*\)\s*$/, '')
}

export default function Slide04SelectedUseCases() {
  // hovered column index (0=Use case, 1=Primary user, 2=Phase); null = none
  const [col, setCol] = useState<number | null>(null)
  const on = (c: number) => col === c

  return (
    <SlideShell eyebrow="Use cases" title="Four opportunities">
      <table className="w-full border-collapse text-left" onMouseLeave={() => setCol(null)}>
        <thead>
          <tr className="border-b-2 border-black">
            <th onMouseEnter={() => setCol(0)} style={{ backgroundColor: on(0) ? YELLOW : undefined }} className={`py-3 pr-4 font-sans text-[11px] uppercase tracking-[0.12em] ${on(0) ? 'text-black' : 'text-charcoal/70'}`}>Use case</th>
            <th onMouseEnter={() => setCol(1)} style={{ backgroundColor: on(1) ? YELLOW : undefined }} className={`px-4 py-3 font-sans text-[11px] uppercase tracking-[0.12em] ${on(1) ? 'text-black' : 'text-charcoal/70'}`}>Primary user</th>
            <th onMouseEnter={() => setCol(2)} style={{ backgroundColor: on(2) ? YELLOW : undefined }} className={`pl-4 py-3 font-sans text-[11px] uppercase tracking-[0.12em] ${on(2) ? 'text-black' : 'text-charcoal/70'}`}>Phase</th>
          </tr>
        </thead>
        <tbody>
          {USE_CASES.map((uc, i) => (
            <tr key={uc.id} className="border-b border-charcoal/15">
              <td onMouseEnter={() => setCol(0)} style={{ backgroundColor: on(0) ? YELLOW : undefined }} className="py-4 pr-4 text-[20px] font-semibold text-black">
                <span className="mr-2 inline-block w-7 text-center" aria-hidden="true">{MEDALS[i]}</span>{shortTitle(uc.title)}
              </td>
              <td onMouseEnter={() => setCol(1)} style={{ backgroundColor: on(1) ? YELLOW : undefined }} className={`px-4 py-4 font-sans text-[14px] ${on(1) ? 'text-black' : 'text-charcoal'}`}>{uc.primaryUser.pill}</td>
              <td onMouseEnter={() => setCol(2)} style={{ backgroundColor: on(2) ? YELLOW : undefined }} className={`pl-4 py-4 font-sans text-[14px] ${on(2) ? 'text-black' : 'text-charcoal/70'}`}>{uc.constructionPhase.name.split('/')[0].trim()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </SlideShell>
  )
}
