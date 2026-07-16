import { SlideShell, SlideTitle } from '../primitives'
import {
  closingMenuTargets,
  type ClosingMenuTarget,
} from '../slideRegistry'
import type { OpeningSlideProps } from './Slide01Cover'

type ThankYouProps = OpeningSlideProps & {
  readonly chapterLinks?: readonly ClosingMenuTarget[]
}

export default function Slide21ThankYou({
  chapterLinks = closingMenuTargets,
}: ThankYouProps) {
  return (
    <SlideShell align="centered" className="text-center">
      <div className="mx-auto max-w-[1040px]">
        <p className="font-sans text-[14px] font-extrabold uppercase tracking-[0.14em] text-cm-crimson">
          Card Bounty · From recommendation to learning
        </p>
        <SlideTitle className="mt-3 text-[72px] text-cm-violet-deep">
          Thank you
        </SlideTitle>
        <p
          data-closing-message="true"
          className="mx-auto mt-6 max-w-[900px] font-sans text-[24px] font-medium leading-relaxed text-charcoal"
        >
          Recommend Card Bounty: it turns familiar Chest and Collection behavior into measurable
          Coin demand, with a validation plan that protects long-term economy health.
        </p>

        <nav aria-label="Jump to a presentation chapter" className="mt-10">
          <ul className="flex items-center justify-center gap-5">
            {chapterLinks.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  data-deck-interactive="true"
                  className="inline-flex min-h-11 items-center px-1 py-2 font-sans text-[14px] font-bold text-cm-violet-deep underline decoration-cm-violet-deep/35 decoration-2 underline-offset-4 transition-colors duration-300 motion-reduce:transition-none hover:text-cm-crimson hover:decoration-cm-crimson focus-visible:text-cm-crimson focus-visible:decoration-cm-crimson focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-cm-gold"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </SlideShell>
  )
}
