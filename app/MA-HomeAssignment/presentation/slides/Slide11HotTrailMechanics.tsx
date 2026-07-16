import { MechanicsLoop } from '../components/MechanicsLoop'
import { CONCEPTS } from '../deckData'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide11HotTrailMechanics({ slideKey }: OpeningSlideProps) {
  return (
    <SlideShell>
      <Eyebrow>Concept 3 · Economy loop</Eyebrow>
      <SlideTitle className="text-[48px]">Hot Trail mechanics</SlideTitle>
      <div className="mt-5 flex-1">
        <MechanicsLoop concept={CONCEPTS[2]} slideKey={slideKey} />
      </div>
    </SlideShell>
  )
}
