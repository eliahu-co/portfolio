import { FeatureSlide } from '../components/FeatureSlide'
import { CONCEPTS } from '../deckData'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide08CardBountyThesis(_props: OpeningSlideProps) {
  return <SlideShell className="!py-8"><Eyebrow>Feature 2</Eyebrow><SlideTitle className="text-[48px]">Card Bounty</SlideTitle><div className="mt-5 min-h-0 flex-1"><FeatureSlide feature={CONCEPTS[1]} /></div></SlideShell>
}
