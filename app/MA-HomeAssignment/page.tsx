// app/MA-HomeAssignment/page.tsx
// Presentation page for the AI Drawing Analyzer PM home assignment.
// Scrollable "slides" with a sticky left-sidebar anchor nav. Reuses the site's
// existing layout (app/layout.tsx fonts + globals.css tokens) and the custom
// Cursor. Each section is its own component under ./sections so content can be
// edited without touching layout.

import type { Metadata } from 'next'
import { Nunito, Nunito_Sans } from 'next/font/google'
import SideNav from './SideNav'

import Hero from './sections/Hero'
import Intro from './sections/Intro'
import UseCase from './sections/UseCase'
import { USE_CASE_1, USE_CASE_2, USE_CASE_3 } from './sections/useCaseData'
import Prioritization from './sections/Prioritization'
import MVP from './sections/MVP'
import PrototypeDemo from './sections/PrototypeDemo'
import KeyUnknowns from './sections/KeyUnknowns'
import AssumptionsSources from './sections/AssumptionsSources'
import Approach from './sections/Approach'

// Page-scoped Moon Active-style type: their site runs Filson Pro/Soft (Adobe
// Fonts) — Nunito (headings) + Nunito Sans (body) are the closest free
// counterparts. Scoped via CSS vars + the .ma-page overrides below so the
// rest of the portfolio keeps its own fonts.
const nunito = Nunito({ subsets: ['latin'], variable: '--font-cm-display', display: 'swap' })
const nunitoSans = Nunito_Sans({ subsets: ['latin'], variable: '--font-cm-body', display: 'swap' })

const OG_IMAGE = 'https://eliahu.co/drawinganalyzer/ha-drawing-analyzer-poster.jpg'

export const metadata: Metadata = {
  title: 'AI Drawing Analyzer — Product Strategy · Eliahu Cohen',
  description: 'Three product features for AI Drawing Analyzer, from concept to interactive prototype.',
  // assignment deliverable — keep out of search engines and AI crawlers
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  openGraph: {
    title: 'AI Drawing Analyzer — Product Strategy',
    description: 'Three product features for AI Drawing Analyzer, from concept to interactive prototype.',
    url: 'https://eliahu.co/MA-HomeAssignment',
    type: 'article',
    images: [{ url: OG_IMAGE, width: 1212, height: 681, alt: 'AI Drawing Analyzer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Drawing Analyzer — Product Strategy',
    description: 'Three product features for AI Drawing Analyzer, from concept to interactive prototype.',
    images: [OG_IMAGE],
  },
}

export default function MAHomeAssignmentPage() {
  return (
    <>
      <div className={`ma-page ${nunito.variable} ${nunitoSans.variable} min-h-screen bg-cm-cream text-charcoal`}>
        <Hero />

        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 py-10 md:py-16 grid md:grid-cols-[180px_1fr] gap-10 md:gap-16">
          <SideNav />

          <main className="min-w-0">
            <Intro />
            <UseCase data={USE_CASE_1} />
            <UseCase data={USE_CASE_2} />
            <UseCase data={USE_CASE_3} />
            <Prioritization />
            <MVP />
            <PrototypeDemo />
            <KeyUnknowns />
            <AssumptionsSources />
            <Approach />

            <div className="mt-4">
              <a
                href="#top"
                className="inline-flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-[0.12em] text-charcoal/70 hover:text-cm-crimson transition-colors no-underline"
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
      <style dangerouslySetInnerHTML={{ __html: `
        .ma-page, .ma-page * { cursor: auto !important; }
        .ma-page a, .ma-page button { cursor: pointer !important; }
        .ma-page video, .ma-page video * { cursor: auto !important; }

        /* Moon Active-style type: remap this page's serif headings to Nunito
           (chunky, rounded ~ Filson Soft) and sans body to Nunito Sans
           (~ Filson Pro). The hero title keeps its own Lilita One face. */
        .ma-page .font-serif {
          font-family: var(--font-cm-display), 'Nunito', ui-rounded, sans-serif;
          font-weight: 700;
        }
        /* only the big section headings carry the heaviest weight */
        .ma-page h2.font-serif {
          font-weight: 800;
        }
        .ma-page .font-sans {
          font-family: var(--font-cm-body), 'Nunito Sans', system-ui, sans-serif;
        }

        @media print {
          .ma-page { background: #fff !important; }
          .ma-page .ma-sidenav { display: none !important; }
          .ma-page .grid { display: block !important; }
          .ma-page section { break-inside: avoid; }
          * { cursor: auto !important; }
        }
      ` }} />
    </>
  )
}
