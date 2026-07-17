import type { DeckSlideKey } from '../useDeckReset'
import { SlideShell, SlideTitle } from '../primitives'

export type OpeningSlideProps = {
  readonly slideKey: DeckSlideKey
  readonly isActive?: boolean
}

export default function Slide01Cover(_props: OpeningSlideProps) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-cm-violet-deep">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/coinmaster-sky.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-cm-violet-deep/95 via-cm-violet-deep/72 to-cm-violet-deep/20" />
      <SlideShell align="centered" className="relative z-10 !bg-transparent">
        <div className="max-w-[820px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/coinmaster/coinmaster-logo.webp"
            alt="Coin Master"
            className="mb-8 h-[72px] w-auto object-contain object-left drop-shadow-[0_5px_12px_rgba(42,27,84,0.35)]"
          />
          <p className="mb-4 font-sans text-[17px] font-extrabold uppercase tracking-[0.13em] text-cm-gold-bright">
            Product Manager - Home Assignment
          </p>
          <SlideTitle as="h1" className="max-w-[780px] text-white drop-shadow-[0_5px_0_rgba(42,27,84,0.25)]">
            Increasing ARPDAU
          </SlideTitle>
          <p className="mt-8 font-sans text-[18px] font-bold uppercase tracking-[0.14em] text-white">
            Eliahu Cohen
          </p>
        </div>
      </SlideShell>
    </div>
  )
}
