import PrototypePreview from '@/app/MA-HomeAssignment/sections/PrototypePreview'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide17Prototype(_props: OpeningSlideProps) {
  return (
    <SlideShell className="!py-8">
      <Eyebrow>Prototype</Eyebrow>
      <SlideTitle className="text-[48px]">Card Bounty, interactive</SlideTitle>
      <div
        data-source-component="prototype-preview"
        className="mx-auto mt-5 max-h-[500px] w-full max-w-[900px] overflow-hidden"
      >
        <PrototypePreview />
      </div>
    </SlideShell>
  )
}
