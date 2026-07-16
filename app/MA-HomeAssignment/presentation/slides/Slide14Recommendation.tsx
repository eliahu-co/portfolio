import { RECOMMENDATION } from '../deckData'
import { RecommendationReasons } from '../components/RecommendationReasons'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide14Recommendation({ slideKey }: OpeningSlideProps) {
  return (
    <SlideShell>
      <Eyebrow>Conclusion</Eyebrow>
      <SlideTitle className="text-[48px]">{RECOMMENDATION.title}</SlideTitle>
      <p className="mt-2 max-w-[900px] font-sans text-[17px] leading-relaxed text-charcoal">
        Advance the clearest familiar-loop opportunity as a measured LiveOps test, with economy health as a release gate.
      </p>
      <div className="mt-6 flex-1">
        <RecommendationReasons slideKey={slideKey} />
      </div>
    </SlideShell>
  )
}
