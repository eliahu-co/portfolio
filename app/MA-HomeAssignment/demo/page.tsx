import type { Metadata, Viewport } from 'next'
import CardBountyPrototype from './CardBountyPrototype'

const OG_IMAGE = 'https://eliahu.co/coinmaster/card-bounty-preview.jpg'

export const metadata: Metadata = {
  title: 'Card Bounty — Interactive Product Prototype',
  description: 'A deterministic Card Bounty concept inside Coin Master’s Cards Center.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Card Bounty — Interactive Product Prototype',
    description: 'Choose a missing Card, fill the Bounty meter with Coin-purchased Chests, and return to Spins.',
    url: 'https://eliahu.co/MA-HomeAssignment/demo',
    type: 'article',
    images: [{ url: OG_IMAGE, width: 860, height: 1864, alt: 'Card Bounty interactive prototype' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Card Bounty — Interactive Product Prototype',
    description: 'A deterministic Card Bounty concept inside Coin Master’s Cards Center.',
    images: [OG_IMAGE],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function CardBountyDemoPage() {
  return <CardBountyPrototype />
}
