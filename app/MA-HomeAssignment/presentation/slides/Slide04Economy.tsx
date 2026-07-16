import CoreLoopDiagram from '@/app/MA-HomeAssignment/sections/CoreLoopDiagram'
import { SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide04Economy(_props: OpeningSlideProps) {
  return (
    <SlideShell>
      <SlideTitle>Core loop and meta</SlideTitle>
      <div className="mt-6 flex min-h-0 flex-1 items-center justify-center">
        <div className="w-full max-w-[840px]">
          <CoreLoopDiagram />
        </div>
      </div>
    </SlideShell>
  )
}
