'use client'

import { useCallback, useState } from 'react'
import { PROTOCOL } from '@/app/MA-HomeAssignment/content/validation'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import { useDeckReset } from '../useDeckReset'
import type { OpeningSlideProps } from './Slide01Cover'

function ProtocolText({
  label,
  body,
  dimmed,
  onEnter,
}: {
  label: string
  body: string
  dimmed: boolean
  onEnter: () => void
}) {
  return (
    <section
      data-protocol-section={label}
      data-protocol-active={dimmed ? 'false' : 'true'}
      onMouseEnter={onEnter}
      className={`border-t-2 border-cm-wood/25 pt-3 transition-opacity duration-300 motion-reduce:transition-none ${dimmed ? 'opacity-20' : 'opacity-100'}`}
    >
      <h3 className="font-sans text-[12px] font-extrabold uppercase tracking-[0.12em] text-cm-crimson">
        {label}
      </h3>
      <p className="mt-1 font-sans text-[16px] leading-relaxed text-[#1A1A1A]">{body}</p>
    </section>
  )
}

export default function Slide18ExperimentDesign({ slideKey }: OpeningSlideProps) {
  const [active, setActive] = useState<string | null>(null)
  const reset = useCallback(() => setActive(null), [])
  useDeckReset(reset, slideKey)

  const [population, control, treatment, hypothesis] = PROTOCOL
  // hovering one section holds it and dims the rest; the whole section is the
  // target, not just its heading
  const props = (item: (typeof PROTOCOL)[number]) => ({
    ...item,
    dimmed: active !== null && active !== item.label,
    onEnter: () => setActive(item.label),
  })

  return (
    <SlideShell>
      <Eyebrow>A/B test</Eyebrow>
      <SlideTitle>Card Bounty validation</SlideTitle>
      <div className="mt-5 max-w-[1120px]" onMouseLeave={() => setActive(null)}>
        <ProtocolText {...props(population)} />
        <div className="my-5 grid grid-cols-2 gap-12">
          <ProtocolText {...props(control)} />
          <ProtocolText {...props(treatment)} />
        </div>
        <ProtocolText {...props(hypothesis)} />
      </div>
    </SlideShell>
  )
}
