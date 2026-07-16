import { FeatureSlide } from '../components/FeatureSlide'
import { CONCEPTS } from '../deckData'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide10HotTrailThesis(_props: OpeningSlideProps) {
  const concept = CONCEPTS[2]
  return <SlideShell className="!py-8"><Eyebrow>Feature 3</Eyebrow><SlideTitle className="text-[48px]">{concept.title}</SlideTitle><div className="mt-5 min-h-0 flex-1"><FeatureSlide concept={concept} loop={concept.loop} title={concept.title} /></div></SlideShell>
}
