import PrototypePreview from '@/app/MA-HomeAssignment/sections/PrototypePreview'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide17Prototype(_props: OpeningSlideProps) {
  return (
    <SlideShell>
      <Eyebrow>Prototype</Eyebrow>
      <SlideTitle>Card Bounty, interactive</SlideTitle>
      <div
        data-source-component="prototype-preview"
        className="mx-auto mt-4 aspect-video max-h-[349px] w-full max-w-[620px]"
      >
        <PrototypePreview />
      </div>
    </SlideShell>
  )
}
