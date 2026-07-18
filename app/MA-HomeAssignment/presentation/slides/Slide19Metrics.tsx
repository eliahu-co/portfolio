import { ValidationTable } from '../components/ValidationTable'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide19Metrics({ slideKey }: OpeningSlideProps) {
  return (
    <SlideShell>
      <Eyebrow>Success criteria</Eyebrow>
      <SlideTitle>ARPDAU ≥5% lift</SlideTitle>
      <div className="mt-2 min-h-0 flex-1"><ValidationTable slideKey={slideKey} /></div>
    </SlideShell>
  )
}
