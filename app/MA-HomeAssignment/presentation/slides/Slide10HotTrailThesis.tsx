import { ConceptThesis } from '../components/ConceptThesis'
import { CONCEPTS } from '../deckData'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide10HotTrailThesis({ slideKey }: OpeningSlideProps) {
  return (
    <SlideShell>
      <Eyebrow>Concept 3 · Product thesis</Eyebrow>
      <SlideTitle className="text-[48px]">Hot Trail thesis</SlideTitle>
      <div className="mt-5 flex-1">
        <ConceptThesis concept={CONCEPTS[2]} slideKey={slideKey} />
      </div>
    </SlideShell>
  )
}
