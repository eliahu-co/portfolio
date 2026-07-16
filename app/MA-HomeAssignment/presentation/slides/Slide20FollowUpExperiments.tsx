import { FollowUpExperiments } from '../components/FollowUpExperiments'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide20FollowUpExperiments({ slideKey }: OpeningSlideProps) {
  return (
    <SlideShell>
      <Eyebrow>Validation · Learning roadmap</Eyebrow>
      <SlideTitle className="text-[46px]">Three tests turn uncertainty into decisions</SlideTitle>
      <p className="mt-2 max-w-[1040px] font-sans text-[16px] leading-relaxed text-charcoal">
        Start with the core event result, then tune attainability, carryover monetization, and Chest mix independently.
      </p>
      <div className="mt-6 flex-1">
        <FollowUpExperiments slideKey={slideKey} />
      </div>
    </SlideShell>
  )
}
