import { ValidationTable } from '../components/ValidationTable'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide19Metrics({ slideKey }: OpeningSlideProps) {
  return (
    <SlideShell className="!py-4">
      <Eyebrow className="!mb-1">Success criteria</Eyebrow>
      <SlideTitle className="text-[40px]">ARPDAU leads the decision</SlideTitle>
      <div className="mt-1 min-h-0 flex-1"><ValidationTable slideKey={slideKey} /></div>
    </SlideShell>
  )
}
