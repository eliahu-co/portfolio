import PlayerFlow from '@/app/MA-HomeAssignment/sections/PlayerFlow'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide15PlayerFlow(_props: OpeningSlideProps) {
  return (
    <SlideShell>
      <Eyebrow>Expanded feature</Eyebrow>
      <SlideTitle>Card Bounty player flow</SlideTitle>
      <div
        data-source-component="player-flow"
        className="mx-auto mt-3 h-[410px] max-h-[410px] w-full max-w-[1080px] overflow-hidden"
      >
        <div className="w-[128%] origin-top-left scale-[0.78]">
          <PlayerFlow />
        </div>
      </div>
    </SlideShell>
  )
}
