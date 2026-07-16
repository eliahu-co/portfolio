import { CONCEPTS } from '../deckData'
import { SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide05ThreeBets(_props: OpeningSlideProps) {
  return (
    <SlideShell>
      <SlideTitle>Three bets</SlideTitle>
      <div className="mt-12 grid flex-1 grid-cols-3 gap-10">
        {CONCEPTS.map((feature) => (
          <section key={feature.id} data-flat-bet="true" className="border-t-4 border-cm-gold pt-6">
            <h3 className="font-serif text-[34px] font-black text-cm-violet-deep">{feature.title}</h3>
            <p className="mt-5 font-sans text-[19px] font-bold leading-relaxed text-[#1A1A1A]">
              {feature.monetizationSummary}
            </p>
          </section>
        ))}
      </div>
    </SlideShell>
  )
}
