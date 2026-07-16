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
const DESCRIPTION = 'A 21-slide product presentation for the Moon Active PM home assignment.'
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
      <PresentationDeck />
    </main>
  )
}
