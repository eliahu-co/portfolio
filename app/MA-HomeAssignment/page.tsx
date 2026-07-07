// app/MA-HomeAssignment/page.tsx
// Presentation page for the AI Drawing Analyzer PM home assignment.
// Scrollable "slides" with a sticky left-sidebar anchor nav. Reuses the site's
// existing layout (app/layout.tsx fonts + globals.css tokens) and the custom
// Cursor. Each section is its own component under ./sections so content can be
// edited without touching layout.

import type { Metadata } from 'next'
import SideNav from './SideNav'

import Hero from './sections/Hero'
import UseCase from './sections/UseCase'
import { USE_CASE_1, USE_CASE_2, USE_CASE_3, USE_CASE_4 } from './sections/useCaseData'
import Prioritization from './sections/Prioritization'
import MVP from './sections/MVP'
import PrototypeDemo from './sections/PrototypeDemo'
import KeyUnknowns from './sections/KeyUnknowns'
import AssumptionsSources from './sections/AssumptionsSources'
import Approach from './sections/Approach'

const OG_IMAGE = 'https://eliahu.co/drawinganalyzer/ha-drawing-analyzer-poster.jpg'

export const metadata: Metadata = {
  title: 'AI Drawing Analyzer — Product Strategy · Eliahu Cohen',
  description: 'Four product opportunities for AI Drawing Analyzer, from concept to interactive prototype.',
  robots: { index: false, follow: false }, // assignment deliverable — keep out of search
  openGraph: {
    title: 'AI Drawing Analyzer — Product Strategy',
    description: 'Four product opportunities for AI Drawing Analyzer, from concept to interactive prototype.',
    url: 'https://eliahu.co/MA-HomeAssignment',
    type: 'article',
    images: [{ url: OG_IMAGE, width: 1212, height: 681, alt: 'AI Drawing Analyzer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Drawing Analyzer — Product Strategy',
    description: 'Four product opportunities for AI Drawing Analyzer, from concept to interactive prototype.',
    images: [OG_IMAGE],
  },
}

export default function MAHomeAssignmentPage() {
  return (
    <>
      <div className="ma-page min-h-screen bg-white text-charcoal">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 py-10 md:py-16 grid md:grid-cols-[180px_1fr] gap-10 md:gap-16">
          <SideNav />

          <main className="min-w-0">
            <Hero />
            <UseCase data={USE_CASE_1} />
            <UseCase data={USE_CASE_2} />
            <UseCase data={USE_CASE_3} />
            <UseCase data={USE_CASE_4} />
            <Prioritization />
            <MVP />
            <PrototypeDemo />
            <KeyUnknowns />
            <AssumptionsSources />
            <Approach />

            <div className="mt-4">
              <a
                href="#hero"
                className="inline-flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-[0.12em] text-charcoal/70 hover:text-autodesk-blue transition-colors no-underline"
              >
                <span aria-hidden="true">↑</span> Back to top
              </a>
            </div>

            <p className="mt-8 font-sans text-[10px] leading-relaxed text-charcoal/40">
              This page was created specifically for the Autodesk interview process and is not publicly discoverable.
            </p>
          </main>
        </div>
      </div>

      {/* This page uses the native OS cursor, not the site's custom one.
          globals.css forces `* { cursor: none !important }`, so override it
          here (and restore pointer/text cursors on interactive elements). */}
      <style>{`
        .ma-page, .ma-page * { cursor: auto !important; }
        .ma-page a, .ma-page button { cursor: pointer !important; }
        .ma-page video, .ma-page video * { cursor: auto !important; }

        @media print {
          .ma-page { background: #fff !important; }
          .ma-page .ma-sidenav { display: none !important; }
          .ma-page .grid { display: block !important; }
          .ma-page section { break-inside: avoid; }
          * { cursor: auto !important; }
        }
      `}</style>
    </>
  )
}
