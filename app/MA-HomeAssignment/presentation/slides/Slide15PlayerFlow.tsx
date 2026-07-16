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
        className="mx-auto mt-3 h-[360px] max-h-[360px] w-full max-w-[1000px] overflow-hidden"
      >
        <div className="w-[154%] origin-top-left scale-[0.65]">
          <PlayerFlow />
        </div>
      </div>
    </SlideShell>
  )
}
