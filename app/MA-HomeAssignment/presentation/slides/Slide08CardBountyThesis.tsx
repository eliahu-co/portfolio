import { FeatureSlide } from '../components/FeatureSlide'
import { CONCEPTS } from '../deckData'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide08CardBountyThesis({ slideKey }: OpeningSlideProps) {
  const concept = CONCEPTS[1]
  return <SlideShell><Eyebrow>Feature 2</Eyebrow><SlideTitle>{concept.title}</SlideTitle><div className="mt-4 min-h-0 flex-1"><FeatureSlide concept={concept} loop={concept.loop} title={concept.title} slideKey={slideKey} /></div></SlideShell>
}
