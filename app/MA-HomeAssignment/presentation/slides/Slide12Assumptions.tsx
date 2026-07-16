import { AssumptionGrid } from '../components/AssumptionGrid'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide12Assumptions({ slideKey }: OpeningSlideProps) {
  return (
    <SlideShell>
      <Eyebrow>Decision frame</Eyebrow>
      <SlideTitle className="text-[48px]">Assumptions</SlideTitle>
      <p className="mt-2 max-w-[900px] font-sans text-[17px] leading-relaxed text-charcoal">
        The comparison is directional: revenue is the outcome, core-loop and economy health are constraints,
        and internal data is still required to calibrate the decision.
      </p>
      <div className="mt-6 flex-1">
        <AssumptionGrid slideKey={slideKey} />
      </div>
    </SlideShell>
  )
}
