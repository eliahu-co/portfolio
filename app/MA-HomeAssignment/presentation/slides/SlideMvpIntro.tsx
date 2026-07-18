import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function SlideMvpIntro(_props: OpeningSlideProps) {
  return (
    <SlideShell>
      <Eyebrow>MVP</Eyebrow>
      <SlideTitle className="max-w-[1120px]">
        Target-selection, Chest-progress, guarantee mechanics
      </SlideTitle>
    </SlideShell>
  )
}
