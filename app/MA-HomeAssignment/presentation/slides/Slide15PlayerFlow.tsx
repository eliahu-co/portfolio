import { PhaseFocusFlow } from '../components/PhaseFocusFlow'
import { Eyebrow, SlideShell } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide15PlayerFlow({ slideKey }: OpeningSlideProps) {
  return (
    <SlideShell>
      <Eyebrow>Player flow</Eyebrow>
      <PhaseFocusFlow slideKey={slideKey} />
    </SlideShell>
  )
}
