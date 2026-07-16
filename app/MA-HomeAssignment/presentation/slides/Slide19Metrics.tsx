import { MetricMatrix } from '../components/MetricMatrix'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide19Metrics({ slideKey }: OpeningSlideProps) {
  return (
    <SlideShell className="!py-7">
      <Eyebrow className="!mb-1">Validation · Success criteria</Eyebrow>
      <SlideTitle className="text-[44px]">ARPDAU leads the decision</SlideTitle>
      <p className="mt-1 max-w-[1080px] font-sans text-[14px] leading-snug text-charcoal">
        Supporting signals explain the mechanism; long-term guardrails protect demand, progression, and revenue quality.
      </p>
      <div className="mt-2 flex-1">
        <MetricMatrix slideKey={slideKey} />
      </div>
    </SlideShell>
  )
}
