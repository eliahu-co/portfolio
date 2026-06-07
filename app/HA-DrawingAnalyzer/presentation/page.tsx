// app/HA-DrawingAnalyzer/presentation/page.tsx
// Unlisted executive presentation deck. Additive route — does not affect
// /HA-DrawingAnalyzer or any other page.
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import PresentationDeck from './PresentationDeck'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-deck',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AI Drawing Analyzer — Presentation',
  robots: { index: false, follow: false },
}

export default function PresentationPage() {
  return (
    <div className={inter.variable}>
      <PresentationDeck />
    </div>
  )
}
