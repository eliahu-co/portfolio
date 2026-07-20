import type { Metadata } from 'next'
import localFont from 'next/font/local'
import PresentationDeck from './PresentationDeck'

const nunito = localFont({
  src: '../../fonts/nunito-latin-variable.woff2',
  weight: '200 1000',
  style: 'normal',
  variable: '--font-cm-display',
  display: 'swap',
})

const nunitoSans = localFont({
  src: '../../fonts/nunito-sans-latin-variable.woff2',
  weight: '200 1000',
  style: 'normal',
  variable: '--font-cm-body',
  display: 'swap',
})

const TITLE = 'Increasing ARPDAU - Presentation by Eliahu Cohen'
const DESCRIPTION = 'A 16-slide product presentation for the Moon Active PM home assignment.'
const CANONICAL = 'https://eliahu.co/MA-HomeAssignment/presentation/'
const OG_IMAGE = 'https://eliahu.co/coinmaster/OGMiniature.jpg'

export const revalidate = 0

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    type: 'article',
    images: [{
      url: OG_IMAGE,
      width: 1200,
      height: 630,
      alt: 'Increasing ARPDAU product presentation',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
}

export default function PresentationPage() {
  return (
    <main className={`ma-presentation-page ${nunito.variable} ${nunitoSans.variable}`}>
      {/* print: keeps the slide export working even from a narrow window */}
      <div className="hidden lg:block print:block">
        <PresentationDeck />
      </div>
      {/* Tailwind's font-sans resolves to Inter, and the deck's Nunito mapping is
          scoped to the stage, so the family is set explicitly here. */}
      <div
        className="lg:hidden print:hidden min-h-screen bg-cm-cream grid place-items-center px-8 text-center"
        style={{ fontFamily: 'var(--font-cm-body), "Nunito Sans", system-ui, sans-serif' }}
      >
        <div className="flex flex-col items-center gap-7">
          <p
            className="text-[26px] font-black leading-[1.1] tracking-[-0.01em] text-cm-violet-deep"
            style={{ fontFamily: 'var(--font-cm-display), Nunito, ui-rounded, sans-serif' }}
          >
            Desktop only
          </p>
          <p className="max-w-[320px] text-[15px] leading-relaxed text-charcoal">
            The presentation needs a wider screen. The written assignment reads well here.
          </p>
          <a
            href="/MA-HomeAssignment"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-cm-wood/70 bg-cm-gold px-6 py-3 text-[16px] font-extrabold text-cm-violet-deep no-underline shadow-[0_8px_0_rgba(73,45,20,0.35)] transition-transform motion-reduce:transition-none hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#1E7BA8]"
          >
            <span aria-hidden="true" className="mr-2">←</span>
            Home assignment
          </a>
        </div>
      </div>
    </main>
  )
}
