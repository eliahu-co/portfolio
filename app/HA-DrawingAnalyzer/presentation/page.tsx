// app/HA-DrawingAnalyzer/presentation/page.tsx
// Unlisted executive presentation deck. Additive route — does not affect
// /HA-DrawingAnalyzer or any other page.
import type { Metadata } from 'next'
import PresentationDeck from './PresentationDeck'

export const metadata: Metadata = {
  title: 'AI Drawing Analyzer — Presentation',
  robots: { index: false, follow: false },
}

export default function PresentationPage() {
  return <PresentationDeck />
}
