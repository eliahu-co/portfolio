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
        .demo-root, .demo-root * { cursor: default !important; }
        .demo-root a, .demo-root button, .demo-root [role="button"] { cursor: pointer !important; }
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
