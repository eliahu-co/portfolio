import { MetricMatrix } from '../components/MetricMatrix'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide19Metrics({ slideKey }: OpeningSlideProps) {
  return (
    <SlideShell>
      <Eyebrow>Validation · Success criteria</Eyebrow>
      <SlideTitle className="text-[46px]">ARPDAU leads the decision</SlideTitle>
      <p className="mt-1 max-w-[1080px] font-sans text-[15px] leading-relaxed text-charcoal">
        Supporting signals explain the mechanism; long-term guardrails protect demand, progression, and revenue quality.
      </p>
      <div className="mt-3 flex-1">
        <MetricMatrix slideKey={slideKey} />
      </div>
    </SlideShell>
  )
}
