// app/HA-DrawingAnalyzer/presentation/page.tsx
// Unlisted executive presentation deck. Additive route — does not affect
// /HA-DrawingAnalyzer or any other page.
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import PresentationDeck from './PresentationDeck'

const inter = localFont({
  src: [
    { path: '../../fonts/inter-latin-variable.woff2', weight: '400', style: 'normal' },
    { path: '../../fonts/inter-latin-variable.woff2', weight: '500', style: 'normal' },
    { path: '../../fonts/inter-latin-variable.woff2', weight: '600', style: 'normal' },
    { path: '../../fonts/inter-latin-variable.woff2', weight: '700', style: 'normal' },
    { path: '../../fonts/inter-latin-variable.woff2', weight: '800', style: 'normal' },
    { path: '../../fonts/inter-latin-variable.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-deck',
  display: 'swap',
})

const OG_IMAGE = 'https://eliahu.co/presentation/thumb.png'
const OG_DESCRIPTION = 'Four product opportunities for AI Drawing Analyzer, from concept to interactive prototype.'

export const metadata: Metadata = {
  title: 'AI Drawing Analyzer — Presentation',
  description: OG_DESCRIPTION,
  robots: { index: false, follow: false },
  openGraph: {
    title: 'AI Drawing Analyzer — Presentation',
    description: OG_DESCRIPTION,
    url: 'https://eliahu.co/HA-DrawingAnalyzer/presentation',
    type: 'article',
    images: [{ url: OG_IMAGE, width: 1912, height: 982, alt: 'AI Drawing Analyzer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Drawing Analyzer — Presentation',
    description: OG_DESCRIPTION,
    images: [OG_IMAGE],
  },
}

export default function PresentationPage() {
  return (
    <div className={inter.variable}>
      <PresentationDeck />
    </div>
  )
}
