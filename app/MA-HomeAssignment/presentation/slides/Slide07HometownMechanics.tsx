import { MechanicsLoop } from '../components/MechanicsLoop'
import { CONCEPTS } from '../deckData'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide07HometownMechanics({ slideKey }: OpeningSlideProps) {
  return (
    <SlideShell>
      <Eyebrow>Concept 1 · Economy loop</Eyebrow>
      <SlideTitle className="text-[48px]">Hometown mechanics</SlideTitle>
      <div className="mt-5 flex-1">
        <MechanicsLoop concept={CONCEPTS[0]} slideKey={slideKey} />
      </div>
    </SlideShell>
  )
}
