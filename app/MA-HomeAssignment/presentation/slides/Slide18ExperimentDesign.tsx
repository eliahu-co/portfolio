import { PROTOCOL } from '@/app/MA-HomeAssignment/content/validation'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

function ProtocolText({ label, body }: { label: string; body: string }) {
  return (
    <section data-protocol-section={label} className="border-t-2 border-cm-wood/25 pt-3">
      <h3 className="font-sans text-[12px] font-extrabold uppercase tracking-[0.12em] text-cm-crimson">
        {label}
      </h3>
      <p className="mt-1 font-sans text-[16px] leading-relaxed text-[#1A1A1A]">{body}</p>
    </section>
  )
}

export default function Slide18ExperimentDesign(_props: OpeningSlideProps) {
  const [population, control, treatment, hypothesis] = PROTOCOL
  return (
    <SlideShell>
      <Eyebrow>A/B test</Eyebrow>
      <SlideTitle>Card Bounty validation</SlideTitle>
      <div className="mt-5 max-w-[1120px]">
        <ProtocolText {...population} />
        <div className="my-5 grid grid-cols-2 gap-12">
          <ProtocolText {...control} />
          <ProtocolText {...treatment} />
        </div>
        <ProtocolText {...hypothesis} />
      </div>
    </SlideShell>
  )
}
