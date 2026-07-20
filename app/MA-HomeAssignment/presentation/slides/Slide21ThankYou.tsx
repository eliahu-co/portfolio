import { SlideShell, SlideTitle } from '../primitives'
import { closingMenuTargets, type ClosingMenuTarget } from '../slideRegistry'
import type { OpeningSlideProps } from './Slide01Cover'

type ThankYouProps = OpeningSlideProps & { readonly chapterLinks?: readonly ClosingMenuTarget[] }

const celebrationAssets = [
  { src: '/coinmaster/resources/coin-emoji.png', className: 'left-[7%] top-[16%] h-16 w-16 -rotate-12' },
  { src: '/coinmaster/resources/gem-emoji.png', className: 'left-[15%] bottom-[14%] h-12 w-12 rotate-12' },
  { src: '/coinmaster/resources/spin-emoji.png', className: 'left-[4%] bottom-[34%] h-[72px] w-[72px] rotate-[22deg]' },
  { src: '/coinmaster/resources/coin-emoji.png', className: 'right-[8%] top-[17%] h-14 w-14 rotate-[18deg]' },
  { src: '/coinmaster/resources/gem-emoji.png', className: 'right-[5%] bottom-[19%] h-16 w-16 -rotate-12' },
  { src: '/coinmaster/resources/spin-emoji.png', className: 'right-[16%] bottom-[34%] h-14 w-14 -rotate-[20deg]' },
] as const

const confettiPieces = [
  'left-[4%] top-[9%] rotate-12 bg-cm-gold-bright',
  'left-[12%] top-[28%] -rotate-[24deg] bg-cm-cyan',
  'left-[20%] top-[12%] rotate-[42deg] bg-fuchsia-400',
  'left-[7%] top-[55%] -rotate-12 bg-lime-400',
  'left-[24%] bottom-[10%] rotate-[28deg] bg-orange-400',
  'left-[30%] top-[21%] -rotate-[36deg] bg-red-400',
  'left-[18%] bottom-[30%] rotate-[58deg] bg-cm-gold-bright',
  'left-[32%] bottom-[16%] -rotate-[18deg] bg-cm-cyan',
  'left-[11%] bottom-[7%] rotate-[35deg] bg-fuchsia-400',
  'right-[5%] top-[10%] -rotate-12 bg-cm-gold-bright',
  'right-[13%] top-[29%] rotate-[24deg] bg-cm-cyan',
  'right-[21%] top-[13%] -rotate-[42deg] bg-fuchsia-400',
  'right-[7%] top-[56%] rotate-12 bg-lime-400',
  'right-[25%] bottom-[9%] -rotate-[28deg] bg-orange-400',
  'right-[31%] top-[22%] rotate-[36deg] bg-red-400',
  'right-[19%] bottom-[30%] -rotate-[58deg] bg-cm-gold-bright',
  'right-[33%] bottom-[15%] rotate-[18deg] bg-cm-cyan',
  'right-[12%] bottom-[7%] -rotate-[35deg] bg-fuchsia-400',
] as const

export default function Slide21ThankYou({ chapterLinks = closingMenuTargets }: ThankYouProps) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-cm-violet-deep">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/coinmaster-sky.webp" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-r from-cm-violet-deep/95 via-cm-violet-deep/72 to-cm-violet-deep/20" />
      <div data-celebration-layer="true" aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        {celebrationAssets.map(({ src, className }, index) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${src}-${index}`}
            src={src}
            alt=""
            className={`absolute object-contain drop-shadow-[0_8px_12px_rgba(18,8,52,0.38)] ${className}`}
          />
        ))}
        {confettiPieces.map((className, index) => (
          <span
            key={className}
            data-confetti-piece="true"
            className={`absolute h-3 w-1.5 rounded-[2px] shadow-[0_3px_5px_rgba(18,8,52,0.28)] ${className} ${index % 3 === 0 ? 'motion-safe:animate-pulse' : ''}`}
          />
        ))}
      </div>
      <SlideShell align="centered" className="relative z-10 !bg-transparent text-center">
        <div className="mx-auto max-w-[1040px]">
          <SlideTitle className="text-[72px] text-white">Thank you</SlideTitle>
          <nav aria-label="Jump to a slide" className="mt-10">
            <ul className="mx-auto flex max-w-[860px] flex-wrap items-center justify-center gap-x-6 gap-y-1">
              {chapterLinks.map(({ label, href }) => (
                <li key={href}>
                  <a href={href} data-deck-interactive="true" className="inline-flex min-h-11 items-center px-1 py-2 font-sans text-[14px] font-bold text-white/85 transition-colors duration-300 hover:text-cm-gold-bright focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-cm-gold">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </SlideShell>
    </div>
  )
}
