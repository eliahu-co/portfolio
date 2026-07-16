import { SCOPE_IN, SCOPE_OUT } from '@/app/MA-HomeAssignment/content/mvp'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

function ScopeList({ items, muted = false }: { items: readonly string[]; muted?: boolean }) {
  return <ul className="flex flex-col gap-3">{items.map((item) => <li key={item} className={`flex gap-3 font-sans text-[16px] leading-snug ${muted ? 'text-charcoal/60' : 'text-charcoal'}`}><span className={`font-black ${muted ? 'text-charcoal/35' : 'text-cm-gold'}`} aria-hidden="true">{muted ? '×' : '✓'}</span><span>{item}</span></li>)}</ul>
}

export default function Slide16MvpScope(_props: OpeningSlideProps) {
  return (
    <SlideShell className="!py-8">
      <Eyebrow>MVP</Eyebrow>
      <SlideTitle className="text-[48px]">Scope</SlideTitle>
      <div className="mt-7 grid flex-1 grid-cols-2 gap-14">
        <section><h3 className="mb-4 font-sans text-[12px] font-extrabold uppercase tracking-[0.12em] text-cm-violet-deep">In scope</h3><ScopeList items={SCOPE_IN} /></section>
        <section><h3 className="mb-4 font-sans text-[12px] font-extrabold uppercase tracking-[0.12em] text-charcoal/50">Out of scope</h3><ScopeList items={SCOPE_OUT} muted /></section>
      </div>
    </SlideShell>
  )
}
