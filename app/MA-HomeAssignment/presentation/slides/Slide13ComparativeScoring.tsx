import { ScoreMatrix } from '../components/ScoreMatrix'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide13ComparativeScoring({ slideKey }: OpeningSlideProps) {
  return (
    <SlideShell>
      <Eyebrow>Decision</Eyebrow>
      <SlideTitle>Score</SlideTitle>
      <div data-score-matrix-wrap="true" className="mt-6 flex-1">
        <ScoreMatrix slideKey={slideKey} />
      </div>
    </SlideShell>
  )
}
