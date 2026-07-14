// app/MA-HomeAssignment/sections/PlayerFlow.tsx
// Card Bounty player-flow diagram, shown before the MVP "Scope & metrics"
// section. Reuses the hero core-loop diagram's visual language:
//   • each phase (Entry / Target / Progress / Resolution) is a soft card framing
//     its pills — the "Value delivered" card treatment (light-blue gradient,
//     thin sky-blue stroke, soft drop shadow), without the bold left accent bar.
//   • screen pills use the diagram's "meta" pill style (bg #F2FAFE, navy border
//     and text), without the glyphs.
//   • core-game outcomes (Receive Spins) use the gold Rewards-pill style.
//   • decision nodes are diamonds (flowchart standard).
// Solid navy arrows are the main path; dashed navy arrows are return paths; a
// small crimson accent marks the guaranteed reward. Entry → Target → Progress
// run as columns on desktop and stack on mobile; the decision branches stay
// contained inside the full-width Resolution plaque.

import { type ReactNode } from 'react'

const ARROW = '#0F3D54' // navy

/* ─── arrows ──────────────────────────────────────────────────────────────── */

function ArrowDown({ dashed = false }: { dashed?: boolean }) {
  return (
    <div className="flex justify-center py-1" aria-hidden="true">
      <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
        <path d="M7 1 V13" stroke={ARROW} strokeWidth="1.4" strokeLinecap="round" strokeDasharray={dashed ? '3 2.5' : undefined} />
        <path d="M2.5 9 L7 13.5 L11.5 9" stroke={ARROW} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </div>
  )
}

function ArrowRight() {
  return (
    <svg width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden="true">
      <path d="M1 7 H16" stroke={ARROW} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M12 2.5 L16.5 7 L12 11.5" stroke={ARROW} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

// Between phases: right arrow on desktop, down arrow on mobile.
function PhaseArrow() {
  return (
    <div className="flex items-center justify-center md:self-center md:px-1">
      <div className="md:hidden">
        <ArrowDown />
      </div>
      <div className="hidden md:block">
        <ArrowRight />
      </div>
    </div>
  )
}

/* ─── plaque (HTML replica of the hero diagram's Meta rectangle) ──────────── */

// Soft card framing its pills — the "Value delivered" card treatment (light-blue
// gradient, thin sky-blue stroke, soft drop shadow), without the left accent bar.
function Plaque({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[10px] border border-cm-sky/40 bg-gradient-to-b from-[#F4FBFF] to-[#E6F5FE] px-3 py-3 shadow-[0_2px_6px_rgba(42,27,84,0.08)]">
      {children}
    </div>
  )
}

/* ─── pills ───────────────────────────────────────────────────────────────── */

// screen = the diagram's "meta" pill (no glyph); outcome = gold Rewards pill.
function Pill({
  title,
  action,
  tone = 'screen',
  accent = false,
}: {
  title: string
  action?: string
  tone?: 'screen' | 'outcome'
  accent?: boolean
}) {
  const skin =
    tone === 'outcome'
      ? 'bg-gradient-to-b from-[#FFE9C4] to-[#FFDCA3] border-cm-wood/50 text-cm-wood shadow-[0_2px_0_rgba(144,57,0,0.3)]'
      : 'bg-[#F2FAFE] border-[#0F3D54]/60 text-[#0d3a5a] shadow-[0_2px_0_rgba(15,61,84,0.45)]'
  const accentSkin = accent ? 'border-cm-crimson/60 ring-1 ring-cm-crimson/25' : ''
  return (
    <div className={`w-full rounded-lg border px-2.5 py-1 text-center ${skin} ${accentSkin}`}>
      <p className="font-sans text-[11px] font-extrabold leading-tight">{title}</p>
      {action && <p className="font-sans text-[9px] font-normal leading-snug opacity-70 mt-0.5">{action}</p>}
    </div>
  )
}

/* ─── decision diamond + branch labels ────────────────────────────────────── */

function Diamond({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto my-1 flex max-w-[10rem] items-center justify-center">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <polygon
          points="50,1.5 98.5,50 50,98.5 1.5,50"
          fill="#FFFFFF"
          stroke="#0F3D54"
          strokeOpacity="0.6"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span className="relative block px-7 py-5 text-center font-sans text-[9.5px] font-semibold leading-tight text-[#0F3D54]">
        {children}
      </span>
    </div>
  )
}

function BranchLabel({ children }: { children: ReactNode }) {
  return <p className="text-center font-sans text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#1E7BA8]">{children}</p>
}

function ReturnNote({ children }: { children: ReactNode }) {
  return <p className="text-center font-sans text-[10px] italic leading-snug text-charcoal/55">{children}</p>
}

/* ─── phase (label above a plaque) ────────────────────────────────────────── */

function Phase({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex-1 min-w-0">
      <p className="text-center font-sans text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#0F3D54] mb-1.5">{label}</p>
      <Plaque>{children}</Plaque>
    </div>
  )
}

const SECONDARY_RULES = [
  'Returning player: Cards Center opens the active Bounty directly, skipping introduction and selection.',
  'Target obtained elsewhere: return to Card Selection and reset the meter.',
  'Event expires: unclaimed progress is lost.',
  'Target locks: after the first qualifying Chest is opened.',
]

export default function PlayerFlow() {
  return (
    <div id="player-flow" className="scroll-mt-8 mb-14">
      <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-cm-crimson mb-5">Player Flow</p>

      {/* Entry → Target → Progress (columns on desktop, stacked on mobile) */}
      <div className="flex flex-col md:flex-row md:items-stretch">
        <Phase label="Entry">
          <Pill title="Cards Center" action="Tap Card Bounty" />
          <ArrowDown />
          <Pill title="Event Introduction" action="Review timer and rules" />
        </Phase>
        <PhaseArrow />
        <Phase label="Target">
          <Pill title="Card Selection" action="Browse eligible missing Cards" />
          <ArrowDown />
          <Pill title="Target Confirmation" action="Confirm Card and required progress" />
        </Phase>
        <PhaseArrow />
        <Phase label="Progress">
          <Pill title="Active Card Bounty" action="Open a Coin-purchased Chest" />
          <ArrowDown />
          <Pill title="Chest Results" action="Reveal contents and update meter" />
        </Phase>
      </div>

      <ArrowDown />

      {/* Resolution — full-width plaque containing the decision branches */}
      <Phase label="Resolution">
        <div className="mx-auto max-w-md">
          <Diamond>Is the target obtained?</Diamond>
          <div className="grid grid-cols-2 gap-3 items-start">
            <div className="flex flex-col items-center">
              <BranchLabel>Yes</BranchLabel>
              <ArrowDown />
              <Pill title="Card acquired" />
            </div>
            <div className="flex flex-col items-center">
              <BranchLabel>No</BranchLabel>
              <ArrowDown />
              <Diamond>Is the meter full?</Diamond>
              <div className="grid grid-cols-2 gap-2 w-full items-start">
                <div className="flex flex-col items-center">
                  <BranchLabel>Yes</BranchLabel>
                  <ArrowDown />
                  <Pill title="Guaranteed Card" accent />
                </div>
                <div className="flex flex-col items-center">
                  <BranchLabel>No</BranchLabel>
                  <ArrowDown dashed />
                  <ReturnNote>Return to Active Bounty</ReturnNote>
                </div>
              </div>
            </div>
          </div>

          <ArrowDown />
          <Pill title="Collection Updated" />
          <Diamond>Collection completed?</Diamond>
          <div className="grid grid-cols-2 gap-3 items-start">
            <div className="flex flex-col items-center">
              <BranchLabel>Yes</BranchLabel>
              <ArrowDown />
              <Pill title="Receive Spins" tone="outcome" />
            </div>
            <div className="flex flex-col items-center">
              <BranchLabel>No</BranchLabel>
              <ArrowDown dashed />
              <Pill title="Cards Center" />
            </div>
          </div>
        </div>
      </Phase>

      {/* Secondary rules — small notes beside the flow, not branches */}
      <div className="mt-6 max-w-xl">
        <p className="font-sans text-[9px] font-bold uppercase tracking-[0.14em] text-charcoal/50 mb-2">Secondary rules</p>
        <ul className="flex flex-col gap-1.5">
          {SECONDARY_RULES.map((rule) => (
            <li key={rule} className="font-sans text-[11px] leading-relaxed text-charcoal/70 flex gap-2">
              <span className="text-[#1E7BA8] mt-px shrink-0" aria-hidden="true">•</span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
