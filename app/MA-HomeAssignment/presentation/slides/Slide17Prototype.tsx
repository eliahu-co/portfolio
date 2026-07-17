import CardBountyPrototype from '@/app/MA-HomeAssignment/demo/CardBountyPrototype'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide17Prototype({ isActive = false }: OpeningSlideProps) {
  return (
    <div
      data-prototype-slide-backdrop="true"
      className="relative h-full w-full overflow-hidden bg-[#267cbb]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/coinmaster-sky.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.2),transparent_46%),linear-gradient(90deg,rgba(31,20,75,0.3),transparent_35%,transparent_65%,rgba(31,20,75,0.3))]" />

      <SlideShell className="relative z-10 !bg-transparent">
        <Eyebrow data-prototype-slide-eyebrow="true" className="text-white/80">
          Card Bounty
        </Eyebrow>
        <SlideTitle className="text-white drop-shadow-[0_4px_0_rgba(42,27,84,0.2)]">
          Prototype
        </SlideTitle>
        <div data-prototype-stage="true" className="absolute inset-x-20 bottom-20 top-20">
          {isActive ? (
            <div data-prototype-frame="true" className="h-full max-h-[720px] w-full">
              <CardBountyPrototype mode="presentation" />
            </div>
          ) : null}
        </div>
      </SlideShell>
    </div>
  )
}
