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

// In-plaque arrows match the workflow-lane ("loop") connectors: thin faint blue
// line + chevron. Between-phase connectors use a bolder, darker navy variant.
const ARROW = 'rgba(30,123,168,0.45)'
const ARROW_BOLD = '#0F3D54'

/* ─── arrows ──────────────────────────────────────────────────────────────── */

function ArrowDown({ dashed = false, color = ARROW, width = 1, len = 14 }: { dashed?: boolean; color?: string; width?: number; len?: number }) {
  const h = len + 1
  return (
    <div className="flex justify-center py-0.5" aria-hidden="true">
      <svg width="14" height={h} viewBox={`0 0 14 ${h}`} fill="none" style={{ display: 'block' }}>
        <path d={`M7 0 V${len}`} stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dashed ? '2.5 2' : undefined} />
        <path d={`M2 ${len - 4} L7 ${len} L12 ${len - 4}`} stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function ArrowRight({ color = ARROW, width = 1 }: { color?: string; width?: number }) {
  return (
    <svg width="15" height="14" viewBox="0 0 15 14" fill="none" aria-hidden="true" style={{ display: 'block' }}>
      <path d="M0 7 H14" stroke={color} strokeWidth={width} strokeLinecap="round" />
      <path d="M10 2 L14 7 L10 12" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// A thin arrow that stretches to fill the remaining column height, so success
// terminals at different depths (Card acquired, Guaranteed Card) bottom out on
// the same line and leave an equal gap above Collection Updated.
function StretchArrow() {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-end pt-1" aria-hidden="true">
      {/* line overlaps the arrowhead so its end lands on the chevron vertex */}
      <span className="w-px flex-1" style={{ background: ARROW, minHeight: 16 }} />
      <svg width="14" height="6" viewBox="0 0 14 6" fill="none" style={{ display: 'block', marginTop: '-5px' }}>
        <path d="M2 1 L7 5 L12 1" stroke={ARROW} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

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

/* ─── plaque (HTML replica of the hero diagram's Meta rectangle) ──────────── */

// Soft card framing its pills — a thin sky-blue stroke only, no background fill
// or shadow (keeps the phase visually grouped without competing with the pills).
function Plaque({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[10px] border border-cm-sky/40 px-3 py-3">
      {children}
    </div>
  )
}

/* ─── pills ───────────────────────────────────────────────────────────────── */

// screen = light "meta"/loop pill; highlight = bolder blue (e.g. the guaranteed
// reward), same stroke; outcome = gold Rewards pill.
function Pill({
  title,
  action,
  tone = 'screen',
}: {
  title: string
  action?: string
  tone?: 'screen' | 'highlight' | 'outcome'
}) {
  const skin =
    tone === 'outcome'
      ? 'bg-gradient-to-b from-[#FFE9C4] to-[#FFDCA3] border-cm-wood/50 text-cm-wood shadow-[0_2px_0_rgba(144,57,0,0.3)]'
      : tone === 'highlight'
        ? 'bg-gradient-to-b from-[#7FCFF0] to-cm-sky border-[#1E7BA8]/30 text-[#0d3a5a] shadow-[0_2px_0_rgba(30,123,168,0.3)]'
        : 'bg-gradient-to-b from-[#F0FAFE] to-[#DBF1FC] border-[#1E7BA8]/30 text-[#0d3a5a] shadow-[0_2px_0_rgba(30,123,168,0.16)]'
  return (
    <div className={`w-full rounded-lg border px-2.5 py-1 text-center ${skin}`}>
      <p className="font-sans text-[11px] font-extrabold leading-tight">{title}</p>
      {action && <p className="font-sans text-[9px] font-normal leading-snug opacity-70 mt-0.5">{action}</p>}
    </div>
  )
}

/* ─── decision diamond + branch labels ────────────────────────────────────── */

// Decision point — a plain, loose question above its Yes/No branches.
function Question({ children }: { children: ReactNode }) {
  return <p className="text-center font-sans text-[11px] italic leading-snug text-charcoal/70 py-1">{children}</p>
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
          <Pill title="Active Card Bounty" action="Open a Coin-purchased Chest" />
          <ArrowDown />
          <Pill title="Chest Results" action="Reveal contents and update meter" />
        </Phase>
      </div>

      <ArrowDown color={ARROW_BOLD} width={1.3} />

      {/* Resolution — full-width plaque containing the decision branches */}
      <Phase label="Resolution">
        <div className="mx-auto max-w-md">
          <Question>Is the target obtained?</Question>
          <div className="grid grid-cols-2 gap-3 items-stretch">
            <div className="flex h-full flex-col items-center">
              <BranchLabel>Yes</BranchLabel>
              <ArrowDown />
              <Pill title="Card acquired" />
              {/* stretches down to Collection Updated */}
              <StretchArrow />
            </div>
            <div className="flex h-full flex-col items-center">
              <BranchLabel>No</BranchLabel>
              <ArrowDown />
              <Question>Is the meter full?</Question>
              <div className="grid grid-cols-2 gap-2 w-full flex-1 items-stretch">
                <div className="flex h-full flex-col items-center">
                  <BranchLabel>Yes</BranchLabel>
                  <ArrowDown />
                  <Pill title="Guaranteed Card" tone="highlight" />
                  {/* stretches down to Collection Updated (same gap as Card acquired) */}
                  <StretchArrow />
                </div>
                <div className="flex flex-col items-center">
                  <BranchLabel>No</BranchLabel>
                  <ArrowDown dashed />
                  <ReturnNote>Return to Active Bounty</ReturnNote>
                </div>
              </div>
            </div>
          </div>

          <Pill title="Collection Updated" />
          <Question>Collection completed?</Question>
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
