// app/MA-HomeAssignment/sections/PlayerFlow.tsx
// Card Bounty player-flow diagram, shown before the MVP "Scope & metrics"
// section. Reuses the hero core-loop diagram's visual language:
//   • each phase (Entry / Target / Progress / Resolution) is a soft card framing
//     its pills — the "Value delivered" card treatment (light-blue gradient,
//     thin sky-blue stroke, soft drop shadow), without the bold left accent bar.
//   • screen pills use the workflow-lane "loop" pill style (blue gradient, thin
//     #1E7BA8 stroke, soft drop edge).
//   • core-game outcomes (Receive Spins) use the gold Rewards-pill style.
//   • decision points are plain, loose questions with Yes/No branches.
// Solid navy arrows are the main path; dashed navy arrows are return paths; a
// small crimson accent marks the guaranteed reward. Entry → Target → Progress
// run as columns on desktop and stack on mobile; the decision branches stay
// contained inside the full-width Resolution plaque.

import { type ReactNode } from 'react'
import { ArrowDown, ArrowRight, Pill, ResolutionBranches } from '../components/ResolutionBranches'

// Between-phase connectors use a bolder, darker navy variant of the in-plaque
// ("loop") arrows shared with the Resolution tree.
const ARROW_BOLD = '#0F3D54'

// Between phases: right arrow on desktop, down arrow on mobile — bolder/darker.
function PhaseArrow() {
  return (
    <div className="flex items-center justify-center md:self-center md:px-1">
      <div className="md:hidden">
        <ArrowDown color={ARROW_BOLD} width={1.3} />
      </div>
      <div className="hidden md:block">
        <ArrowRight color={ARROW_BOLD} width={1.3} />
      </div>
    </div>
  )
}

// Desktop-only elbow from the Progress plaque (right column, ~84% across) down,
// left to the diagram centre, then down into the middle of Resolution.
function ElbowToResolution() {
  return (
    <div className="relative hidden md:block" style={{ height: 30 }} aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 30" preserveAspectRatio="none" fill="none">
        <path d="M84 0 V13 H50 V30" stroke={ARROW_BOLD} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2">
        <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
          <path d="M1.5 1 L6 5.5 L10.5 1" stroke={ARROW_BOLD} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}

/* ─── plaque (HTML replica of the hero diagram's Meta rectangle) ──────────── */

// Soft card framing its pills — a thin sky-blue stroke only, no background fill
// or shadow (keeps the phase visually grouped without competing with the pills).
function Plaque({ children }: { children: ReactNode }) {
  return (
    <div data-player-flow-plaque="true" data-blue-surface="true" className="rounded-[10px] border px-3 py-3">
      {children}
    </div>
  )
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

export default function PlayerFlow() {
  return (
    <div id="player-flow" className="scroll-mt-8">
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
          <Pill title="Bounty Progress" action="Buy a Chest with Coins" actionItalic tone="highlight" />
          <ArrowDown />
          <Pill title="Chest Results" action="Reveal contents and update meter" />
        </Phase>
      </div>

      {/* connector to Resolution — centered down arrow on mobile (Progress is
          last in the stack); an elbow from the Progress column on desktop */}
      <div className="md:hidden">
        <ArrowDown color={ARROW_BOLD} width={1.3} />
      </div>
      <ElbowToResolution />

      {/* Resolution — full-width plaque containing the decision branches */}
      <Phase label="Resolution">
        <ResolutionBranches size="report" />
      </Phase>
    </div>
  )
}
