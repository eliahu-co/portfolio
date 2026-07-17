import CardBountyPrototype from '@/app/MA-HomeAssignment/demo/CardBountyPrototype'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide17Prototype({ isActive = false }: OpeningSlideProps) {
  return (
    <SlideShell>
      <Eyebrow>Prototype</Eyebrow>
      <SlideTitle>Card Bounty, interactive</SlideTitle>
      <div data-prototype-stage="true" className="flex min-h-0 flex-1 items-center justify-center pt-4">
        {isActive ? (
          <div className="h-full max-h-[680px] w-full">
            <CardBountyPrototype mode="presentation" />
          </div>
        ) : null}
      </div>
    </SlideShell>
  )
}
