import type { Metadata } from 'next'
import FormaPrototype from './FormaPrototype'

const OG_IMAGE = 'https://eliahu.co/drawinganalyzer/ha-drawing-analyzer-poster.jpg'

export const metadata: Metadata = {
  title: 'Change Validation — Interactive Prototype',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Change Validation — Interactive Prototype',
    description: 'Interactive concept prototype of Change Validation, embedded within Autodesk Forma.',
    url: 'https://eliahu.co/HA-DrawingAnalyzer/demo',
    type: 'article',
    images: [{ url: OG_IMAGE, width: 1212, height: 681, alt: 'AI Drawing Analyzer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Change Validation — Interactive Prototype',
    description: 'Interactive concept prototype of Change Validation, embedded within Autodesk Forma.',
    images: [OG_IMAGE],
  },
}

export default function ChangeValidationDemoPage() {
  return (
    <div className="demo-root">
      <div className="hidden lg:block">
        <FormaPrototype />
      </div>
      <div className="lg:hidden min-h-screen bg-[#fafafa] text-[#1a1a1a] grid place-items-center px-8 text-center">
        <div className="flex flex-col items-center gap-6">
          <p className="font-sans text-[15px] leading-relaxed text-[#5a5a5a]">
            The Change Validation demo is only available on desktop.
          </p>
          <a
            href="https://eliahu.co/HA-DrawingAnalyzer#prototype"
            className="font-sans text-[11px] uppercase tracking-[0.06em] no-underline border-2 border-autodesk-blue/60 text-autodesk-blue rounded-sm px-3.5 py-2 hover:bg-autodesk-blue/10 hover:border-autodesk-blue transition-colors"
          >
            ← Home assignment
          </a>
        </div>
      </div>
      <style>{`
        .demo-root, .demo-root * { cursor: default !important; }
        .demo-root a, .demo-root button { cursor: pointer !important; }
        .demo-root .demo-mock, .demo-root .demo-mock * { cursor: not-allowed !important; }
        @keyframes demo-shake {
          0%, 86%, 100% { transform: translateX(0); }
          88% { transform: translateX(-3px); }
          90% { transform: translateX(3px); }
          92% { transform: translateX(-3px); }
          94% { transform: translateX(2px); }
          96% { transform: translateX(-2px); }
          98% { transform: translateX(1px); }
        }
        .demo-root .demo-shake { animation: demo-shake 3s ease-in-out infinite; }
      `}</style>
    </div>
  )
}
