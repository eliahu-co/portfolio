import PlayerFlow from '@/app/MA-HomeAssignment/sections/PlayerFlow'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide15PlayerFlow(_props: OpeningSlideProps) {
  return (
    <SlideShell className="!py-8">
      <Eyebrow>Expanded feature</Eyebrow>
      <SlideTitle className="text-[46px]">Card Bounty player flow</SlideTitle>
      <div
        data-source-component="player-flow"
        className="mx-auto mt-4 h-[520px] max-h-[520px] w-full max-w-[1120px] overflow-hidden"
      >
        <div className="w-[125%] origin-top-left scale-[0.8]">
          <PlayerFlow />
        </div>
      </div>
    </SlideShell>
  )
}
