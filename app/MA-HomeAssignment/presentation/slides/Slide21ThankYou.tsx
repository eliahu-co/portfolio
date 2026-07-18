import { SlideShell, SlideTitle } from '../primitives'
import { closingMenuTargets, type ClosingMenuTarget } from '../slideRegistry'
import type { OpeningSlideProps } from './Slide01Cover'

type ThankYouProps = OpeningSlideProps & { readonly chapterLinks?: readonly ClosingMenuTarget[] }

export default function Slide21ThankYou({ chapterLinks = closingMenuTargets }: ThankYouProps) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-cm-violet-deep">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/coinmaster-sky.webp" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-r from-cm-violet-deep/95 via-cm-violet-deep/72 to-cm-violet-deep/20" />
      <SlideShell align="centered" className="relative z-10 !bg-transparent text-center">
        <div className="mx-auto max-w-[1040px]">
          <SlideTitle className="text-[72px] text-white">Thank you</SlideTitle>
          <nav aria-label="Jump to a presentation chapter" className="mt-10">
            <ul className="flex items-center justify-center gap-5">
              {chapterLinks.map(({ label, href }) => (
                <li key={href}>
                  <a href={href} data-deck-interactive="true" className="inline-flex min-h-11 items-center px-1 py-2 font-sans text-[14px] font-bold text-white/85 underline decoration-white/35 decoration-2 underline-offset-4 transition-colors duration-300 hover:text-cm-gold-bright focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-cm-gold">
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
