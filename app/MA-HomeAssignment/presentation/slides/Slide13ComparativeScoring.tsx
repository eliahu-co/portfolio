import { ScoreMatrix } from '../components/ScoreMatrix'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide13ComparativeScoring({ slideKey }: OpeningSlideProps) {
  return (
    <SlideShell>
      <Eyebrow>Decision</Eyebrow>
      <SlideTitle>Comparative scoring</SlideTitle>
      <div className="mt-2 flex-1">
        <ScoreMatrix slideKey={slideKey} />
      </div>
    </SlideShell>
  )
}
