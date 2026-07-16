import { PlayerFlow } from '../components/PlayerFlow'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide15PlayerFlow({ slideKey }: OpeningSlideProps) {
  return (
    <SlideShell>
      <Eyebrow>Deep dive · Player journey</Eyebrow>
      <SlideTitle className="text-[48px]">Card Bounty player flow</SlideTitle>
      <p className="mt-2 max-w-[980px] font-sans text-[17px] leading-relaxed text-charcoal">
        The full path stays visible; each stage surfaces the rule or branch that keeps the guarantee understandable.
      </p>
      <div className="mt-8 flex-1">
        <PlayerFlow slideKey={slideKey} />
      </div>
    </SlideShell>
  )
}
