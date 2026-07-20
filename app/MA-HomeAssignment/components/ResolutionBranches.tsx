// app/MA-HomeAssignment/components/ResolutionBranches.tsx
// The Card Bounty "Resolution" decision tree, shared by the report's player-flow
// diagram (sections/PlayerFlow.tsx) and the presentation's Player flow slide
// (presentation/components/PhaseFocusFlow.tsx) so the two cannot drift apart.
//
// Visual language is unchanged from the original report diagram: screen pills use
// the blue "loop" treatment, core-game outcomes (Receive Spins) use the gold
// Rewards pill, decision points are loose italic questions with Yes/No branches,
// and dashed arrows mark return paths. Inside the presentation viewport the
// data-blue-surface / data-wood-surface hooks are restyled by
// PresentationStage.module.css into the deck's outline-first treatment.
//
// `size` only scales type and spacing — never structure — so both surfaces render
// the same tree.

import { type ReactNode } from 'react'

export const ARROW = 'rgba(30,123,168,0.45)'

export type FlowSize = 'report' | 'slide'

type Scale = {
  readonly pillTitle: string
  readonly pillAction: string
  readonly pillPad: string
  readonly question: string
  readonly branch: string
  readonly note: string
  readonly arrowLen: number
  readonly colGap: string
  readonly maxWidth: string
}

const SCALES: Record<FlowSize, Scale> = {
  report: {
    pillTitle: 'text-[11px]',
    pillAction: 'text-[9px] mt-0.5',
    pillPad: 'px-2.5 py-1',
    question: 'text-[11px] py-1',
    branch: 'text-[9px]',
    note: 'text-[10px]',
    arrowLen: 14,
    colGap: 'gap-3',
    maxWidth: 'max-w-md',
  },
  slide: {
    pillTitle: 'text-[15px]',
    pillAction: 'text-[12px] mt-1',
    pillPad: 'px-4 py-2.5',
    question: 'text-[14px] py-1.5',
    branch: 'text-[11px]',
    note: 'text-[13px]',
    arrowLen: 20,
    colGap: 'gap-6',
    maxWidth: 'max-w-3xl',
  },
}

/* ─── arrows ──────────────────────────────────────────────────────────────── */

export function ArrowDown({
  dashed = false,
  color = ARROW,
  width = 1,
  len = 14,
}: { dashed?: boolean; color?: string; width?: number; len?: number }) {
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

export function ArrowRight({ color = ARROW, width = 1 }: { color?: string; width?: number }) {
  return (
    <svg width="15" height="14" viewBox="0 0 15 14" fill="none" aria-hidden="true" style={{ display: 'block' }}>
      <path d="M0 7 H14" stroke={color} strokeWidth={width} strokeLinecap="round" />
      <path d="M10 2 L14 7 L10 12" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// A thin arrow that stretches to fill the remaining column height, so success
// terminals at different depths (Card acquired, Guaranteed Card) bottom out on
// the same line and leave an equal gap above Bounty Completed.
export function StretchArrow() {
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

/* ─── pills ───────────────────────────────────────────────────────────────── */

// screen = light "meta"/loop pill; highlight = bolder blue (e.g. the guaranteed
// reward), same stroke; outcome = gold Rewards pill.
export function Pill({
  title,
  action,
  actionItalic = false,
  tone = 'screen',
  size = 'report',
}: {
  title: string
  action?: string
  actionItalic?: boolean
  tone?: 'screen' | 'highlight' | 'outcome'
  size?: FlowSize
}) {
  const scale = SCALES[size]
  const skin =
    tone === 'outcome'
      ? 'bg-gradient-to-b from-[#FFE9C4] to-[#FFDCA3] border-cm-wood/50 text-cm-wood shadow-[0_2px_0_rgba(144,57,0,0.3)]'
      : tone === 'highlight'
        ? 'bg-gradient-to-b from-[#C4E9FA] to-[#9BD7F2] border-[#1E7BA8]/30 text-[#0d3a5a] shadow-[0_2px_0_rgba(30,123,168,0.3)]'
        : 'bg-gradient-to-b from-[#F0FAFE] to-[#DBF1FC] border-[#1E7BA8]/30 text-[#0d3a5a] shadow-[0_2px_0_rgba(30,123,168,0.16)]'
  return (
    <div
      data-player-flow-screen={tone === 'screen' ? 'true' : undefined}
      data-blue-surface={tone === 'screen' ? 'true' : undefined}
      data-player-flow-outcome={tone === 'outcome' ? 'true' : undefined}
      data-wood-surface={tone === 'outcome' ? 'true' : undefined}
      className={`w-full rounded-lg border text-center ${scale.pillPad} ${skin}`}
    >
      <p className={`font-sans font-extrabold leading-tight ${scale.pillTitle}`}>{title}</p>
      {action && <p className={`font-sans font-normal leading-snug opacity-70 ${scale.pillAction} ${actionItalic ? 'italic' : ''}`}>{action}</p>}
    </div>
  )
}

/* ─── decision questions + branch labels ──────────────────────────────────── */

// Decision point — a plain, loose question above its Yes/No branches.
export function Question({ children, size = 'report' }: { children: ReactNode; size?: FlowSize }) {
  return <p className={`text-center font-sans italic leading-snug text-charcoal/70 ${SCALES[size].question}`}>{children}</p>
}

export function BranchLabel({ children, size = 'report' }: { children: ReactNode; size?: FlowSize }) {
  return <p className={`text-center font-sans font-extrabold uppercase tracking-[0.14em] text-[#1E7BA8] ${SCALES[size].branch}`}>{children}</p>
}

export function ReturnNote({ children, size = 'report' }: { children: ReactNode; size?: FlowSize }) {
  return <p className={`text-center font-sans italic leading-snug text-charcoal/55 ${SCALES[size].note}`}>{children}</p>
}

/* ─── the tree ────────────────────────────────────────────────────────────── */

export function ResolutionBranches({ size = 'report' }: { size?: FlowSize }) {
  const scale = SCALES[size]
  const len = scale.arrowLen

  return (
    <div data-resolution-branches={size} className={`mx-auto ${scale.maxWidth}`}>
      <Question size={size}>Is the target obtained?</Question>
      <div className={`grid grid-cols-2 items-stretch ${scale.colGap}`}>
        <div className="flex h-full flex-col items-center">
          <BranchLabel size={size}>Yes</BranchLabel>
          <ArrowDown len={len} />
          <Pill title="Card acquired" size={size} />
          {/* stretches down to Bounty Completed */}
          <StretchArrow />
        </div>
        <div className="flex h-full flex-col items-center">
          <BranchLabel size={size}>No</BranchLabel>
          <ArrowDown len={len} />
          <Question size={size}>Is the meter full?</Question>
          <div className="grid w-full flex-1 grid-cols-2 items-stretch gap-2">
            <div className="flex h-full flex-col items-center">
              <BranchLabel size={size}>Yes</BranchLabel>
              <ArrowDown len={len} />
              <Pill title="Guaranteed Card" tone="highlight" size={size} />
              {/* stretches down to Bounty Completed (same gap as Card acquired) */}
              <StretchArrow />
            </div>
            <div className="flex flex-col items-center">
              <BranchLabel size={size}>No</BranchLabel>
              <ArrowDown dashed len={len} />
              <ReturnNote size={size}>Return to Bounty Progress</ReturnNote>
            </div>
          </div>
        </div>
      </div>

      <Pill title="Bounty Completed" size={size} />
      <Question size={size}>Collection completed?</Question>
      <div className={`grid grid-cols-2 items-start ${scale.colGap}`}>
        <div className="flex flex-col items-center">
          <BranchLabel size={size}>Yes</BranchLabel>
          <ArrowDown len={len} />
          <Pill title="Receive Spins" tone="outcome" size={size} />
        </div>
        <div className="flex flex-col items-center">
          <BranchLabel size={size}>No</BranchLabel>
          <ArrowDown dashed len={len} />
          <Pill title="Cards Center" size={size} />
        </div>
      </div>
    </div>
  )
}
