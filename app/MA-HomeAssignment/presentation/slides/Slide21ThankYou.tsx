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
    <div className="relative h-full w-full overflow-hidden bg-cm-violet-deep">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/coinmaster-sky.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-cm-violet-deep/95 via-cm-violet-deep/88 to-cm-crimson/65" />

      <SlideShell align="centered" className="relative z-10 !bg-transparent text-center">
        <div className="mx-auto max-w-[1040px]">
          <p className="font-sans text-[14px] font-extrabold uppercase tracking-[0.14em] text-cm-gold">
            Card Bounty · From recommendation to learning
          </p>
          <SlideTitle className="mt-3 text-[72px] text-white drop-shadow-[0_5px_0_rgba(42,27,84,0.25)]">
            Thank you
          </SlideTitle>
          <p
            data-closing-message="true"
            className="mx-auto mt-6 max-w-[900px] font-sans text-[24px] font-medium leading-relaxed text-white"
          >
            Card Bounty turns familiar Chest and Collection behavior into measurable Coin demand,
            with a validation plan that protects long-term economy health.
          </p>

          <nav aria-label="Jump to a presentation chapter" className="mt-10">
            <ul className="flex items-center justify-center gap-3">
              {chapterLinks.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    data-deck-interactive="true"
                    className="inline-flex min-h-11 items-center border-b border-white/55 px-1 py-2 font-sans text-[14px] font-bold text-white transition-colors hover:border-cm-gold hover:text-cm-gold focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-cm-gold"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </SlideShell>
    </div>
  )
}
