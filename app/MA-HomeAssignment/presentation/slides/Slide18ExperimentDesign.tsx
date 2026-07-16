import { PROTOCOL } from '@/app/MA-HomeAssignment/content/validation'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

function ProtocolText({ label, body }: { label: string; body: string }) {
  return <div><h3 className="font-sans text-[12px] font-extrabold uppercase tracking-[0.12em] text-cm-crimson">{label}</h3><p className="mt-2 font-sans text-[18px] leading-relaxed text-[#1A1A1A]">{body}</p></div>
}

export default function Slide18ExperimentDesign(_props: OpeningSlideProps) {
  const [population, control, treatment, hypothesis] = PROTOCOL
  return (
    <SlideShell>
      <Eyebrow>A/B test</Eyebrow>
      <SlideTitle className="text-[48px]">Card Bounty validation</SlideTitle>
      <div className="mt-8 max-w-[1120px]">
        <ProtocolText {...population} />
        <div className="my-7 grid grid-cols-2 gap-12 border-y-2 border-cm-wood/25 py-7">
          <ProtocolText {...control} />
          <ProtocolText {...treatment} />
        </div>
        <ProtocolText {...hypothesis} />
      </div>
    </SlideShell>
  )
}
