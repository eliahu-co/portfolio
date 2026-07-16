import CoreLoopDiagram from '@/app/MA-HomeAssignment/sections/CoreLoopDiagram'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide04Economy(_props: OpeningSlideProps) {
  return (
    <SlideShell>
      <Eyebrow>Game model</Eyebrow>
      <SlideTitle>Core loop and meta</SlideTitle>
      <div className="mt-6 flex flex-1 items-center justify-center">
        <div className="w-full max-w-[1020px]">
          <CoreLoopDiagram />
        </div>
      </div>
    </SlideShell>
  )
}
