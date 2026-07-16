import { ScoreMatrix } from '../components/ScoreMatrix'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide13ComparativeScoring({ slideKey }: OpeningSlideProps) {
  return (
    <SlideShell>
      <Eyebrow>Decision</Eyebrow>
      <SlideTitle className="text-[48px]">Comparative scoring</SlideTitle>
      <p className="mt-2 max-w-[920px] font-sans text-[16px] leading-relaxed text-charcoal">
        Compare monetization upside, natural loop fit, confidence, and the effort required to learn.
      </p>
      <div className="mt-4 flex-1">
        <ScoreMatrix slideKey={slideKey} />
      </div>
    </SlideShell>
  )
}
