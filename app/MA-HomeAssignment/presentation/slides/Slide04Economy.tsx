import { EconomyMap } from '../components/EconomyMap'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide04Economy({ slideKey }: OpeningSlideProps) {
  return (
    <SlideShell>
      <Eyebrow>Opportunity space</Eyebrow>
      <SlideTitle>Coin Master economy</SlideTitle>
      <p className="mt-3 max-w-[900px] font-sans text-[17px] leading-relaxed text-charcoal">
        The concepts enter through different systems, but each must connect familiar play to a credible monetization path.
      </p>
      <div className="mt-7 flex-1">
        <EconomyMap slideKey={slideKey} />
      </div>
    </SlideShell>
  )
}
