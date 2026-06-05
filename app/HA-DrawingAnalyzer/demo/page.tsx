import type { Metadata } from 'next'
import FormaPrototype from './FormaPrototype'

export const metadata: Metadata = {
  title: 'Change Validation — Interactive Prototype',
  robots: { index: false, follow: false },
}

export default function ChangeValidationDemoPage() {
  return (
    <div className="demo-root">
      <div className="hidden lg:block">
        <FormaPrototype />
      </div>
      <div className="lg:hidden min-h-screen bg-[#fafafa] text-[#1a1a1a] grid place-items-center px-8 text-center">
        <p className="font-sans text-[15px] leading-relaxed text-[#5a5a5a]">
          The Change Validation demo is only available on desktop.
        </p>
      </div>
      <style>{`
        .demo-root, .demo-root * { cursor: auto !important; }
        .demo-root a, .demo-root button, .demo-root [role="button"] { cursor: pointer !important; }
      `}</style>
    </div>
  )
}
