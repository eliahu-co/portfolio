import { FeatureSlide } from '../components/FeatureSlide'
import { CONCEPTS } from '../deckData'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide10HotTrailThesis({ slideKey }: OpeningSlideProps) {
  const concept = CONCEPTS[2]
  return <SlideShell><Eyebrow>Feature 3</Eyebrow><SlideTitle>{concept.title}</SlideTitle><div data-feature-body="true" className="mt-8 min-h-0 flex-1"><FeatureSlide concept={concept} loop={concept.loop} title={concept.title} slideKey={slideKey} /></div></SlideShell>
}
