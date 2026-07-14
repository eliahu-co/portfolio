// app/MA-HomeAssignment/sections/UseCase.tsx
// Reusable case-study block. Every use-case section renders one of these with
// its own anchor id, so all use cases share the same structure. Drive content
// from the `UseCaseData` objects in ./useCaseData.ts — never edit layout here
// to change copy.

import Section from './Section'
import LoopReturn from './LoopReturn'
import { type ReactNode } from 'react'

/* ─── data shape ──────────────────────────────────────────────────────────── */

export interface NamedRole {
  role?:        string   // single-line role title (serif heading)
  description?: string   // single-line role summary
  list?:        string[] // alternative to description — a bulleted set of people/roles
  pill?:        string   // short tag shown above the role (e.g. 'Designer', 'Reviewer')
}

export interface TitledItem {
  title:    string
  body:     string
  bullets?: string[] // optional sub-bullets (e.g. the audit-trail value item)
  primary?: boolean  // highlight as the headline value (thicker bar + star + pill)
}

// Workflow steps carry a semantic kind so the comparison lanes can highlight
// the meaningful moments (AI actions, where the error is caught, rework, etc.).
export type StepKind = 'normal' | 'ai' | 'catch' | 'reject' | 'approve' | 'repeat'

export interface WorkflowStep {
  label:     string
  kind?:     StepKind             // defaults to 'normal'
  note?:     string               // small annotation under the step (e.g. "Caught late")
  actor?:    'reviewer' | 'designer' | 'owner' // tags the step with the persona performing it
  tag?:      string               // gold pill shown on the step (e.g. "Core loop")
  coreLoop?: boolean              // style the step as the gold core-loop plaque (with shine sweep)
  emphasis?: boolean              // force the bold treatment on an otherwise-normal step
}

export interface Workflow {
  stat:  string // headline metric for the lane (e.g. "2 review cycles")
  loop?: boolean // draw a loop-back arrow from the last step up to the first
  steps: WorkflowStep[]
}

export interface UseCaseData {
  id:      string // anchor id (e.g. 'feature-1')
  eyebrow: string // e.g. 'Feature 1'
  title:   string // e.g. 'AI-Assisted Design Revision Validation'
  conceptAsSubtitle?: boolean // render opportunity.statement as the title subtitle instead of a Concept block
  mockup?: string // concept mockup image beside the loop (defaults to the placeholder)
  arpdauMechanism?: string // text shown in the block between Concept and Loop
  mechanismLabel?: string  // label for that block (defaults to "ARPDAU Mechanism")
  kpi?: { primary: string; supporting: string[] } // KPI block: one primary + supporting metrics as cards

  constructionPhase: { name: string; description: string }
  primaryUser:   NamedRole
  secondaryUser: NamedRole | NamedRole[] // one or more secondary-user groups

  problem: {
    heading?:     string   // block label override (defaults to "Opportunity")
    intro:        string
    examples?:    string[]
    body?:        string   // optional paragraph after the examples, before "As a result"
    body2?:       string   // optional third concept paragraph
    consequences: string[]
  }

  currentWorkflow:  Workflow
  proposedWorkflow: Workflow
  legendAiOnly?:    boolean // show only the AI Drawing Analyzer entry in the workflow legend

  opportunity: {
    statement: string   // headline opportunity statement
    intro?:    string   // optional lead-in paragraph (often ends with a colon)
    quotes?:   string[] // optional example quotes (rendered as blockquotes)
    outro?:    string   // optional paragraph after the quotes
    image?:    string   // optional image shown with the text
    imageAside?: boolean // portrait images: render beside the text instead of below
  }

  value:     TitledItem[]
  tradeoffs: TitledItem[]
  tradeoff?: { gain: string; cost: string } // one-line value⇄cost summary under the risks
}

/* ─── generic helpers ─────────────────────────────────────────────────────── */

function BlockLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-sans text-[10px] font-extrabold uppercase tracking-[0.14em] text-black mb-3">
      {children}
    </p>
  )
}

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-6">
      <BlockLabel>{label}</BlockLabel>
      {children}
    </div>
  )
}

function Para({ children }: { children: ReactNode }) {
  return <p className="font-sans text-[14px] leading-relaxed text-charcoal">{children}</p>
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((b, i) => (
        <li key={i} className="font-sans text-[14px] leading-relaxed text-charcoal flex gap-2">
          <span className="text-cm-gold mt-1 shrink-0">—</span>
          <span>{b}</span>
        </li>
      ))}
    </ul>
  )
}

function MiniLabel({ children }: { children: ReactNode }) {
  return <p className="font-sans text-[10px] uppercase tracking-[0.12em] text-charcoal mt-4 mb-1.5">{children}</p>
}

function OpportunityText({ opp }: { opp: UseCaseData['opportunity'] }) {
  return (
    <>
      <Para>{opp.statement}</Para>
      {opp.intro && <div className="mt-3"><Para>{opp.intro}</Para></div>}
      {opp.quotes && opp.quotes.length > 0 && (
        <div className="flex flex-col gap-2 mt-3">
          {opp.quotes.map((q, i) => (
            <blockquote
              key={i}
              className="border-l-2 border-cm-gold pl-3 py-0.5 font-sans italic text-[14px] leading-relaxed text-charcoal"
            >
              “{q}”
            </blockquote>
          ))}
        </div>
      )}
      {opp.outro && <div className="mt-3"><Para>{opp.outro}</Para></div>}
    </>
  )
}

// Framed concept mockup shown beside the "current" workflow, in place of the
// proposed lane. Rounded frame with a wood stroke and a hard drop edge — the
// same treatment as the pills.
const DEFAULT_MOCKUP = '/coinmaster/placeholder.jpg'
function MockupFrame({ src = DEFAULT_MOCKUP }: { src?: string }) {
  return (
    <div className="mx-auto max-w-[240px] overflow-hidden rounded-2xl border-2 border-cm-wood/50 shadow-[0_3px_0_rgba(144,57,0,0.28)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="Coin Master concept mockup" className="block w-full h-auto" />
    </div>
  )
}

// Filled crimson warning triangle with a white exclamation — marks the primary
// risk card (matches the risk-card crimson accent).
function WarningBadge() {
  return (
    <svg viewBox="0 0 16 16" className="inline-block w-3 h-3 align-middle" fill="none" aria-hidden="true">
      <path d="M8 1.8 L14.7 13.6 Q15 14.2 14.3 14.2 H1.7 Q1 14.2 1.3 13.6 Z" fill="#C8102E" />
      <rect x="7.3" y="5.8" width="1.4" height="4.2" rx="0.7" fill="#fff" />
      <circle cx="8" cy="11.6" r="0.9" fill="#fff" />
    </svg>
  )
}

// Small uppercase tag used to label a user/actor. `tone` picks the colour and
// `className` controls placement (e.g. `inline-block mb-2` vs `ml-1.5 align-middle`).
export function Pill({
  children,
  tone = 'charcoal',
  className = '',
}: {
  children: ReactNode
  tone?: 'charcoal' | 'blue' | 'solid'
  className?: string
}) {
  const toneClass =
    tone === 'solid' ? 'bg-gradient-to-b from-cm-gold-bright to-cm-gold text-cm-violet-deep border-cm-wood/60'
    : tone === 'blue' ? 'text-cm-violet border-cm-violet/50'
    : 'text-charcoal border-charcoal/50'
  return (
    <span className={`font-sans text-[8px] font-bold uppercase tracking-wider rounded px-1 py-px border-2 ${toneClass} ${className}`}>
      {children}
    </span>
  )
}

// Compact card grid for the Value / Risks sections. Each item is a left
// accent-bar card (gold for value, amber for risks) with the body styled like
// the workflow step notes (small + italic). A `primary` value item renders
// full-width with a thicker bar, a star, and a "Primary" pill.
export type CardVariant = 'value' | 'risk' | 'neutral'

function Card({
  item,
  variant,
  fullWidth = false,
}: {
  item: TitledItem
  variant: CardVariant
  fullWidth?: boolean
}) {
  const edge = variant === 'neutral'
    ? 'border-charcoal/30 border-l-charcoal border-l-4'
    : variant === 'value'
      ? `border-cm-gold/45 border-l-cm-gold ${item.primary ? 'border-l-[5px]' : 'border-l-4'}`
      : `border-cm-crimson/35 border-l-cm-crimson ${item.primary ? 'border-l-[5px]' : 'border-l-4'}`
  // card surface — tinted per variant so cards sit warm on the cream page
  // (plain white reads cold against bg-cm-cream)
  const surface = variant === 'neutral'
    ? 'bg-gradient-to-b from-[#FBF7F0] to-[#F3ECDF]'
    : variant === 'value'
      ? ''
      : 'bg-gradient-to-b from-[#FFF4F1] to-[#FBE9E7]'
  const span = item.primary || fullWidth ? 'sm:col-span-2' : ''
  return (
    <div className={`rounded-lg border px-2.5 py-2 shadow-[0_2px_6px_rgba(42,27,84,0.08)] ${surface} ${edge} ${span}`}>
      <p className="font-serif text-[12px] font-semibold leading-tight text-cm-violet-deep mb-1 flex items-center gap-1.5">
        {item.primary && variant === 'value' && <span className="shrink-0 text-[11px] leading-none text-cm-gold" aria-hidden="true">★</span>}
        {item.primary && variant === 'risk' && <WarningBadge />}
        <span className="min-w-0">{item.title}</span>
      </p>
      <p className="font-sans text-[10px] italic leading-snug text-charcoal/80">{item.body}</p>
      {item.bullets && (
        <div className="mt-1.5">
          <Bullets items={item.bullets} />
        </div>
      )}
    </div>
  )
}

export function CardList({
  items,
  variant,
  columns = 2,
}: {
  items: TitledItem[]
  variant: CardVariant
  columns?: 1 | 2
}) {
  if (columns === 1) {
    return (
      <div className="flex flex-col gap-4">
        {items.map((it, i) => <Card key={i} item={it} variant={variant} />)}
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      {items.map((it, i) => (
        <Card key={i} item={it} variant={variant} />
      ))}
    </div>
  )
}

// KPI block — a gold "primary" card (with a star) for the headline metric, a
// divider, then grey "supporting" cards in the same 3-column grid as the
// value/risk cards.
function KpiCards({ kpi }: { kpi: { primary: string; supporting: string[] } }) {
  return (
    <div>
      <div className="rounded-lg border border-cm-gold/45 border-l-4 border-l-cm-gold px-2.5 py-1 shadow-[0_2px_6px_rgba(42,27,84,0.08)] flex items-center gap-2">
        <span className="shrink-0 text-[13px] leading-none text-cm-wood/70" aria-hidden="true">★</span>
        <span className="font-sans text-[11px] md:text-[12px] leading-snug text-cm-wood">{kpi.primary}</span>
      </div>
      <div className="mt-2 mb-2 border-t border-charcoal/10" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {kpi.supporting.map((s, i) => (
          <div key={i} className="rounded-lg border border-charcoal/25 border-l-4 border-l-charcoal/45 px-2.5 py-1 flex items-center shadow-[0_2px_6px_rgba(42,27,84,0.08)]">
            <span className="font-sans text-[11px] md:text-[12px] leading-snug text-charcoal">{s}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── workflow comparison lanes ───────────────────────────────────────────── */

function markerGlyph(kind: StepKind): string {
  switch (kind) {
    case 'ai':      return '⚡︎'
    case 'catch':   return '⚑'
    case 'reject':  return '✕'
    case 'approve': return '✓'
    case 'repeat':  return '⟲'
    default:        return '●'
  }
}

// Drawn connector between two step boxes. The SVG fills its box exactly
// (display:block, no padding/margin) so the shaft starts at the box above and
// the arrowhead tip ends at the box below — no glyph line-box gap to fight.
function Connector({ proposed }: { proposed: boolean }) {
  const color = proposed ? 'rgba(30,123,168,0.75)' : 'rgba(30,123,168,0.45)'
  return (
    <div className="flex justify-center">
      <svg width="14" height="15" viewBox="0 0 14 15" fill="none" aria-hidden="true" style={{ display: 'block' }}>
        <path d="M7 0 V14" stroke={color} strokeWidth="1" strokeLinecap="round" />
        <path d="M2 10 L7 14 L12 10" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}


function StepCell({
  step,
  proposed,
  isLast,
}: {
  step?: WorkflowStep
  proposed: boolean
  isLast: boolean
}) {
  if (!step) return <div aria-hidden="true" />

  const kind = step.kind ?? 'normal'

  // Only the outcome steps (caught / rejected / approved) get the heavier
  // treatment: thick border, filled emphasis, bold label. The AI step stays
  // light — its shine carries the emphasis instead.
  const isEmphasis = step.emphasis ?? (kind === 'catch' || kind === 'reject' || kind === 'approve' || kind === 'repeat')

  // box background + border — each step is its own small card with a blue panel
  // wash and a matching drop edge (the proposed lane's blue is deeper than the
  // current's paler tint)
  const panel      = 'bg-gradient-to-b from-[#DCF1FC] to-[#BFE6FA]'
  const panelLight = 'bg-gradient-to-b from-[#F0FAFE] to-[#DBF1FC]'
  const blueEdge      = 'shadow-[0_2px_0_rgba(30,123,168,0.28)]'
  const blueEdgeLight = 'shadow-[0_2px_0_rgba(30,123,168,0.16)]'
  let box = proposed
    ? `${panel} border-[#1E7BA8]/50 ${blueEdge}`
    : `${panelLight} border-[#1E7BA8]/30 ${blueEdgeLight}`
  if (kind === 'catch') box = isEmphasis
    ? (proposed ? `${panel} border-[#1E7BA8]/70 ${blueEdge}` : `${panelLight} border-[#1E7BA8]/60 ${blueEdgeLight}`)
    : (proposed ? `${panel} border-[#1E7BA8]/50 ${blueEdge}` : `${panelLight} border-[#1E7BA8]/30 ${blueEdgeLight}`)
  else if (kind === 'repeat') box = `${panelLight} border-[#1E7BA8]/45 ${blueEdgeLight}`
  else if (step.emphasis) box = proposed ? `${panel} border-[#1E7BA8]/70 ${blueEdge}` : `${panelLight} border-[#1E7BA8]/60 ${blueEdgeLight}`

  // core-loop step: same shape as the other loop steps, wearing the colours of
  // the "Rewards" (parchment) pill from the hero core-loop diagram (text/marker
  // stay identical to the other steps).
  const coreLoop = step.coreLoop ?? false
  if (coreLoop) box = 'bg-gradient-to-b from-[#FFE9C4] to-[#FFDCA3] border-cm-wood/50 shadow-[0_2px_0_rgba(144,57,0,0.3)]'

  // border thickness — matches the connector stroke; thicker for emphasis steps
  const borderW = isEmphasis ? 'border-2' : 'border'

  // marker colour
  let marker = proposed ? 'text-[#1E7BA8]/80' : 'text-[#1E7BA8]/50'
  if (kind === 'repeat') marker = 'text-[#1E7BA8]'
  else if (kind === 'catch') marker = proposed ? 'text-[#1E7BA8]' : 'text-charcoal'
  if (coreLoop) marker = 'text-cm-wood'

  const labelColor = coreLoop
    ? 'text-cm-wood'
    : kind === 'ai'
      ? 'text-[#0F3D54] font-bold'
      : isEmphasis ? 'text-black font-medium' : 'text-charcoal'

  const noteColor = proposed ? 'text-[#1E7BA8]' : 'text-charcoal/60'

  return (
    <div className="flex flex-col">
      <div data-loop-step className={`relative overflow-hidden rounded-lg ${borderW} px-2.5 py-1 flex items-center gap-2 ${box}`}>
        <span className={`relative shrink-0 leading-none ${kind === 'ai' ? 'text-[16px] md:text-[17px] font-bold' : 'text-[11px] md:text-[12px]'} ${marker}`} aria-hidden="true">
          {markerGlyph(kind)}
        </span>
        <span className="relative min-w-0 text-[11px] md:text-[12px] leading-snug">
          <span className={`font-sans ${labelColor}`}>
            {step.label}
          </span>
          {step.note && (
            <span className={`block mt-px font-sans text-[10px] italic whitespace-pre-line ${noteColor}`}>{step.note}</span>
          )}
        </span>
        {(kind === 'ai' || step.actor || step.tag) && (
          <span className="relative ml-auto shrink-0 flex items-center gap-1.5">
            {kind === 'ai' && <Pill tone="solid">DA</Pill>}
            {step.tag && <Pill tone="solid">{step.tag}</Pill>}
            {step.actor && (
              <Pill tone={proposed ? 'blue' : 'charcoal'}>
                {step.actor.charAt(0).toUpperCase() + step.actor.slice(1)}
              </Pill>
            )}
          </span>
        )}
      </div>
      {!isLast && <Connector proposed={proposed} />}
    </div>
  )
}

// Only show legend entries for the step kinds that actually appear in this use
// case's lanes, so e.g. a workflow with no rejected step doesn't list "Rejected".
function Legend({ current, proposed, aiOnly }: { current: Workflow; proposed: Workflow; aiOnly?: boolean }) {
  const used = new Set<StepKind>()
  for (const s of [...current.steps, ...proposed.steps]) used.add(s.kind ?? 'normal')

  const items = ([
    { kind: 'ai',      glyph: '⚡︎', label: 'Powered by AI Drawing Analyzer' },
    { kind: 'catch',   glyph: '⚑', label: 'Issue caught' },
    { kind: 'reject',  glyph: '✕', label: 'Rejected' },
    { kind: 'approve', glyph: '✓', label: 'Approved' },
    { kind: 'repeat',  glyph: '⟲', label: 'Repeat review cycle' },
  ] as const).filter(it => used.has(it.kind) && (!aiOnly || it.kind === 'ai'))

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-1 mt-5">
      {items.map(({ kind, glyph, label }) => {
        const isAi = kind === 'ai'
        return (
          <span key={label} className={`inline-flex items-center font-sans text-[10px] leading-none ${isAi ? 'text-[#1D5E7E]' : 'text-[#1E7BA8]/80'}`}>
            <span
              className={`mr-1 leading-none ${isAi ? 'text-[#1D5E7E] font-bold text-[13px]' : 'text-[#1E7BA8]'}`}
              aria-hidden="true"
            >
              {glyph}
            </span>
            {label}
          </span>
        )
      })}
    </div>
  )
}

// One vertical lane of steps. Each box is its own content height (boxes are not
// stretched to match the other lane), and connectors join steps within the lane.
function Lane({ workflow, proposed }: { workflow: Workflow; proposed: boolean }) {
  return (
    <div className="relative flex flex-col">
      {workflow.steps.map((step, i) => (
        <StepCell key={i} step={step} proposed={proposed} isLast={i === workflow.steps.length - 1} />
      ))}
      {workflow.loop && <LoopReturn />}
    </div>
  )
}

// One workflow per use case: the "current" lane on the left, and the concept
// mockup image on the right (in place of the old "proposed" lane).

/* ─── the use case ────────────────────────────────────────────────────────── */

export default function UseCase({ data }: { data: UseCaseData }) {
  const opp = data.opportunity

  const problemSection = (
    <Block label={data.problem.heading ?? 'Opportunity'}>
      <Para>{data.problem.intro}</Para>
      {data.problem.examples && data.problem.examples.length > 0 && (
        <>
          <MiniLabel>Examples include</MiniLabel>
          <Bullets items={data.problem.examples} />
        </>
      )}
      {data.problem.body && <div className="mt-3"><Para>{data.problem.body}</Para></div>}
      {data.problem.body2 && <div className="mt-3"><Para>{data.problem.body2}</Para></div>}
      {data.problem.consequences.length > 0 && (
        <>
          <MiniLabel>As a result</MiniLabel>
          <Bullets items={data.problem.consequences} />
        </>
      )}
    </Block>
  )

  const conceptHead = (
    <>
      <BlockLabel>Concept</BlockLabel>
      <OpportunityText opp={opp} />
    </>
  )

  return (
    <Section
      id={data.id}
      eyebrow={data.eyebrow}
      title={data.title}
      subtitle={data.conceptAsSubtitle ? opp.statement : undefined}
    >
      {!data.conceptAsSubtitle && (
        <div className="mb-6">
          {conceptHead}
        </div>
      )}
      {problemSection}

      {/* KPI + Loop stacked in the left column, the concept mockup beside them */}
      <div className="grid grid-cols-2 gap-x-7 md:gap-x-6 items-start">
        <div>
          {data.kpi ? (
            <Block label={data.mechanismLabel ?? 'KPI'}>
              <KpiCards kpi={data.kpi} />
            </Block>
          ) : data.arpdauMechanism ? (
            <Block label={data.mechanismLabel ?? 'ARPDAU Mechanism'}>
              <p className="font-sans text-[14px] leading-relaxed text-charcoal whitespace-pre-line">{data.arpdauMechanism}</p>
            </Block>
          ) : null}

          <Block label="Loop">
            <Lane workflow={data.currentWorkflow} proposed={false} />
            <Legend current={data.currentWorkflow} proposed={data.currentWorkflow} aiOnly={data.legendAiOnly} />
          </Block>
        </div>
        <MockupFrame src={data.mockup} />
      </div>

      {(data.value.length > 0 || data.tradeoffs.length > 0) && (
        <Block label="Value delivered & risks">
          {data.value.length > 0 && <CardList items={data.value} variant="value" />}
          {data.tradeoffs.length > 0 && (
            <div className={data.value.length > 0 ? 'mt-3' : ''}>
              <CardList items={data.tradeoffs} variant="risk" />
              {data.tradeoff && (
                <p className="mt-8 font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-cm-wood">
                  <span className="mr-2 font-extrabold text-cm-crimson">Tradeoff</span>
                  {data.tradeoff.gain}
                  <span className="mx-1" aria-hidden="true">⇄</span>
                  {data.tradeoff.cost}
                </p>
              )}
            </div>
          )}
        </Block>
      )}
    </Section>
  )
}
