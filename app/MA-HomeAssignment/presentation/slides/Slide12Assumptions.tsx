import { ASSUMPTION_STORIES } from '../deckData'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide12Assumptions(_props: OpeningSlideProps) {
  return (
    <SlideShell>
      <Eyebrow>Assumptions</Eyebrow>
      <SlideTitle className="text-[48px]">Assumptions</SlideTitle>
      <div className="mt-8 flex max-w-[1040px] flex-col gap-5">
        {ASSUMPTION_STORIES.map(({ assumption }, index) => (
          <div key={assumption} className={`border-cm-violet-deep pl-5 ${index === 0 || index === ASSUMPTION_STORIES.length - 1 ? 'border-l-4' : 'border-l-8'}`}>
            <p className="font-sans text-[18px] leading-relaxed text-[#1A1A1A]">{assumption}</p>
          </div>
        ))}
      </div>
    </SlideShell>
  )
}
