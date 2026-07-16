import { ScopeBoard } from '../components/ScopeBoard'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide16MvpScope({ slideKey }: OpeningSlideProps) {
  return (
    <SlideShell className="px-14 py-10">
      <Eyebrow>Deep dive · Test boundary</Eyebrow>
      <SlideTitle className="text-[46px]">MVP scope</SlideTitle>
      <p className="mt-2 max-w-[980px] font-sans text-[16px] leading-relaxed text-charcoal">
        Isolate whether a chosen guarantee creates incremental Chest demand before expanding rewards, offers, or eligibility.
      </p>
      <div className="mt-5 flex-1">
        <ScopeBoard slideKey={slideKey} />
      </div>
    </SlideShell>
  )
}
