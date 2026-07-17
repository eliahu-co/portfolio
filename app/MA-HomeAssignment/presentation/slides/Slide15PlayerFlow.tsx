import { PhaseFocusFlow } from '../components/PhaseFocusFlow'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide15PlayerFlow({ slideKey }: OpeningSlideProps) {
  return (
    <SlideShell>
      <Eyebrow>Expanded feature</Eyebrow>
      <SlideTitle>Card Bounty player flow</SlideTitle>
      <PhaseFocusFlow slideKey={slideKey} />
    </SlideShell>
  )
}
