import PrototypePreview from '@/app/MA-HomeAssignment/sections/PrototypePreview'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide17Prototype(_props: OpeningSlideProps) {
  return (
    <SlideShell>
      <Eyebrow>Prototype</Eyebrow>
      <SlideTitle>Card Bounty, interactive</SlideTitle>
      <div data-prototype-stage="true" className="flex min-h-0 flex-1 items-center justify-center">
        <div
          data-source-component="prototype-preview"
          className="aspect-video max-h-[349px] w-full max-w-[620px]"
        >
          <PrototypePreview />
        </div>
      </div>
    </SlideShell>
  )
}
