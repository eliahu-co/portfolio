import { PrototypeCard } from '../components/PrototypeCard'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide17Prototype(_props: OpeningSlideProps) {
  return (
    <SlideShell>
      <Eyebrow>Deep dive · Interaction model</Eyebrow>
      <SlideTitle className="text-[48px]">Prototype</SlideTitle>
      <div className="mt-6 flex-1">
        <PrototypeCard />
      </div>
    </SlideShell>
  )
}
