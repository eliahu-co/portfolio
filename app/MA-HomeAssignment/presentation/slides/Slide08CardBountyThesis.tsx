import { ConceptThesis } from '../components/ConceptThesis'
import { CONCEPTS } from '../deckData'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide08CardBountyThesis({ slideKey }: OpeningSlideProps) {
  return (
    <SlideShell>
      <Eyebrow>Concept 2 · Product thesis</Eyebrow>
      <SlideTitle className="text-[48px]">Card Bounty thesis</SlideTitle>
      <div className="mt-5 flex-1">
        <ConceptThesis concept={CONCEPTS[1]} slideKey={slideKey} />
      </div>
    </SlideShell>
  )
}
