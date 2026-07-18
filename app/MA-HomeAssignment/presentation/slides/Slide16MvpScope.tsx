'use client'

import { useCallback, useState } from 'react'
import { SCOPE_IN, SCOPE_OUT } from '@/app/MA-HomeAssignment/content/mvp'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import { useDeckReset } from '../useDeckReset'
import type { OpeningSlideProps } from './Slide01Cover'

function ScopeList({ items, muted = false, active, setActive }: { items: readonly string[]; muted?: boolean; active: string | null; setActive: (value: string | null) => void }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li
          key={item}
          tabIndex={0}
          data-scope-item={item}
          onMouseEnter={() => setActive(item)}
          onMouseLeave={() => setActive(null)}
          onFocus={() => setActive(item)}
          onBlur={() => setActive(null)}
          className={`flex gap-3 font-sans text-[16px] leading-snug transition-opacity duration-300 ${active && active !== item ? 'opacity-20' : 'opacity-100'} ${muted ? 'text-charcoal/60' : 'text-charcoal'}`}
        >
          <span className={`font-black ${muted ? 'text-charcoal/35' : 'text-cm-gold'}`} aria-hidden="true">
            {muted ? '×' : '✓'}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function Slide16MvpScope({ slideKey }: OpeningSlideProps) {
  const [active, setActive] = useState<string | null>(null)
  useDeckReset(useCallback(() => setActive(null), []), slideKey)
  return (
    <SlideShell>
      <Eyebrow>MVP</Eyebrow>
      <SlideTitle>Scope</SlideTitle>
      <div className="mt-6 grid flex-1 grid-cols-2 gap-14">
        <section data-scope-column="in">
          <h3 className="mb-4 font-sans text-[12px] font-extrabold uppercase tracking-[0.12em] text-cm-violet-deep">
            In scope
          </h3>
          <ScopeList items={SCOPE_IN} active={active} setActive={setActive} />
        </section>
        <section data-scope-column="out">
          <h3 className="mb-4 font-sans text-[12px] font-extrabold uppercase tracking-[0.12em] text-charcoal/50">
            Out of scope
          </h3>
          <ScopeList items={SCOPE_OUT} muted active={active} setActive={setActive} />
        </section>
      </div>
    </SlideShell>
  )
}
