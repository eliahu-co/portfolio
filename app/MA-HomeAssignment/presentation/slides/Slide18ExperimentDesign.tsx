import { ExperimentDesign } from '../components/ExperimentDesign'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide18ExperimentDesign({ slideKey }: OpeningSlideProps) {
  return (
    <SlideShell>
      <Eyebrow>Validation · A/B test</Eyebrow>
      <SlideTitle className="text-[48px]">One change, one testable hypothesis</SlideTitle>
      <p className="mt-2 max-w-[1040px] font-sans text-[16px] leading-relaxed text-charcoal">
        Hold the Cards Center and eligibility constant; add only the time-limited Card Bounty event.
      </p>
      <div className="mt-5 flex-1">
        <ExperimentDesign slideKey={slideKey} />
      </div>
    </SlideShell>
  )
}
