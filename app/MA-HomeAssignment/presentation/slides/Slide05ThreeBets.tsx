import { ConceptOverview } from '../components/ConceptOverview'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide05ThreeBets({ slideKey }: OpeningSlideProps) {
  return (
    <SlideShell>
      <Eyebrow>Concept landscape</Eyebrow>
      <SlideTitle>Three bets</SlideTitle>
      <p className="mt-3 max-w-[820px] font-sans text-[18px] leading-relaxed text-charcoal">
        One new spend surface, one resource-demand loop, and one re-engagement trigger — considered on equal footing.
      </p>
      <div className="mt-7 flex-1">
        <ConceptOverview slideKey={slideKey} />
      </div>
    </SlideShell>
  )
}
