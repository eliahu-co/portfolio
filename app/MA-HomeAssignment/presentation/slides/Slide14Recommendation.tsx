import { CONCEPTS, RECOMMENDATION } from '../deckData'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

export default function Slide14Recommendation(_props: OpeningSlideProps) {
  return (
    <SlideShell>
      <Eyebrow>Recommendation</Eyebrow>
      <SlideTitle>Card Bounty</SlideTitle>
      <div className="mt-4 grid flex-1 grid-cols-[0.82fr_1.18fr] items-start gap-12">
        <div className="overflow-hidden rounded-2xl border-2 border-cm-wood/50 bg-white shadow-[0_4px_0_rgba(144,57,0,0.28)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CONCEPTS[1].mockup} alt="Card Bounty feature mockup" className="h-[320px] w-full object-contain" />
        </div>
        <div>
          <p className="font-serif text-[24px] font-black leading-snug text-cm-violet-deep">
            Card Bounty extends familiar Chest and Collection behavior, creates additional Coin demand, and can be tested as a bounded LiveOps event.
          </p>
          <ol aria-label="Why Card Bounty wins" className="mt-5 space-y-2">
            {RECOMMENDATION.evidence.map(({ reason, evidence }) => (
              <li key={reason} className="border-b border-charcoal/20 pb-2">
                <h3 className="font-sans text-[16px] font-extrabold text-cm-violet-deep">{reason}</h3>
                <p className="mt-1 font-sans text-[15px] leading-relaxed text-charcoal">{evidence}</p>
              </li>
            ))}
          </ol>
          <p className="mt-3 font-sans text-[14px] leading-relaxed text-charcoal">
            <span className="font-extrabold text-cm-crimson">Primary risk: </span>
            {RECOMMENDATION.risk.evidence}
          </p>
        </div>
      </div>
    </SlideShell>
  )
}
