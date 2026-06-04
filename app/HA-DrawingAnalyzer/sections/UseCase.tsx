// app/HA-DrawingAnalyzer/sections/UseCase.tsx
// Reusable case-study block. Every use-case section renders one of these with
// its own anchor id, so all use cases share the same structure. Drive content
// from the `UseCaseData` objects in ./useCaseData.ts — never edit layout here
// to change copy.

import Section from './Section'
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
  actor?:    'reviewer' | 'designer' // tags the step with the persona performing it
  emphasis?: boolean              // force the bold treatment on an otherwise-normal step
}

export interface Workflow {
  stat:  string // headline metric for the lane (e.g. "2 review cycles")
  steps: WorkflowStep[]
}

export interface UseCaseData {
  id:      string // anchor id (e.g. 'use-case-1')
  eyebrow: string // e.g. 'Use Case 1'
  title:   string // e.g. 'AI-Assisted Design Revision Validation'

  constructionPhase: { name: string; description: string }
  primaryUser:   NamedRole
  secondaryUser: NamedRole | NamedRole[] // one or more secondary-user groups

  problem: {
    intro:        string
    examples?:    string[]
    consequences: string[]
  }

  currentWorkflow:  Workflow
  proposedWorkflow: Workflow

  whyAnalyzer: {
    intro:            string[] // paragraphs before the examples
    examples?:        string[] // bullet examples (optional)
    body:             string[] // paragraphs after the examples, before the quotes
    quotes?:          string[] // quotes (rendered as blockquotes)
    quotesAfterIntro?: boolean // place quotes right after the intro instead of after the body
    closing:          string   // final paragraph
  }

  value:     TitledItem[]
  tradeoffs: TitledItem[]
}

/* ─── generic helpers ─────────────────────────────────────────────────────── */

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-9">
      <p className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-charcoal mb-3">
        {label}
      </p>
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
          <span className="text-autodesk-blue mt-1 shrink-0">—</span>
          <span>{b}</span>
        </li>
      ))}
    </ul>
  )
}

function MiniLabel({ children }: { children: ReactNode }) {
  return <p className="font-sans text-[11px] text-charcoal/60 mt-4 mb-1.5">{children}</p>
}

// Filled yellow warning triangle with a white exclamation — marks the primary
// risk card.
function WarningBadge() {
  return (
    <svg viewBox="0 0 16 16" className="inline-block w-3 h-3 align-middle" fill="none" aria-hidden="true">
      <path d="M8 1.8 L14.7 13.6 Q15 14.2 14.3 14.2 H1.7 Q1 14.2 1.3 13.6 Z" fill="#f4b400" />
      <rect x="7.3" y="5.8" width="1.4" height="4.2" rx="0.7" fill="#fff" />
      <circle cx="8" cy="11.6" r="0.9" fill="#fff" />
    </svg>
  )
}

function WhyQuotes({ quotes }: { quotes?: string[] }) {
  if (!quotes || quotes.length === 0) return null
  return (
    <div className="flex flex-col gap-2 mt-3">
      {quotes.map((q, i) => (
        <blockquote
          key={i}
          className="border-l-2 border-autodesk-blue pl-3 py-0.5 font-sans italic text-[14px] leading-relaxed text-charcoal"
        >
          “{q}”
        </blockquote>
      ))}
    </div>
  )
}

// Small uppercase tag used to label a user/actor. `tone` picks the colour and
// `className` controls placement (e.g. `inline-block mb-2` vs `ml-1.5 align-middle`).
function Pill({
  children,
  tone = 'charcoal',
  className = '',
}: {
  children: ReactNode
  tone?: 'charcoal' | 'blue'
  className?: string
}) {
  const toneClass =
    tone === 'blue' ? 'text-autodesk-blue border-autodesk-blue/50' : 'text-charcoal border-charcoal/50'
  return (
    <span className={`text-[8px] font-bold uppercase tracking-wider rounded px-1 py-px border-2 ${toneClass} ${className}`}>
      {children}
    </span>
  )
}

function Role({ data }: { data: NamedRole }) {
  return (
    <div>
      {data.pill && <Pill className="inline-block mb-2">{data.pill}</Pill>}
      {data.role && <p className="font-serif text-[16px] text-black mb-1">{data.role}</p>}
      {data.description && (
        <p className="font-sans text-[13px] leading-relaxed text-charcoal">{data.description}</p>
      )}
      {data.list && (
        <div className="mt-1">
          <Bullets items={data.list} />
        </div>
      )}
    </div>
  )
}

// Compact card grid for the Value / Risks sections. Each item is a left
// accent-bar card (blue for value, amber for risks) with the body styled like
// the workflow step notes (small + italic). A `primary` value item renders
// full-width with a thicker bar, a star, and a "Primary" pill.
function Card({
  item,
  variant,
  fullWidth = false,
}: {
  item: TitledItem
  variant: 'value' | 'risk'
  fullWidth?: boolean
}) {
  const bar = item.primary
    ? (variant === 'value' ? 'border-l-4 border-autodesk-blue' : 'border-l-4 border-[#f4b400]')
    : (variant === 'value' ? 'border-l-2 border-autodesk-blue/55' : 'border-l-2 border-[#f4b400]/70')
  const span = item.primary || fullWidth ? 'sm:col-span-2' : ''
  return (
    <div className={`pl-3 ${bar} ${span}`}>
      <p className="font-serif text-[14px] text-black mb-0.5 flex items-center gap-1.5">
        {item.primary && variant === 'value' && <span className="shrink-0 text-[13px] leading-none text-autodesk-blue" aria-hidden="true">★</span>}
        {item.primary && variant === 'risk' && <WarningBadge />}
        <span className="min-w-0">{item.title}</span>
      </p>
      <p className="font-sans text-[11px] italic leading-relaxed text-charcoal/80">{item.body}</p>
      {item.bullets && (
        <div className="mt-1.5">
          <Bullets items={item.bullets} />
        </div>
      )}
    </div>
  )
}

function CardList({ items, variant }: { items: TitledItem[]; variant: 'value' | 'risk' }) {
  const primary = items.find(it => it.primary)
  const rest = items.filter(it => it !== primary)
  return (
    <div className="grid sm:grid-cols-2 gap-x-3.5 gap-y-4">
      {primary && <Card item={primary} variant={variant} />}
      {rest.map((it, i) => (
        // avoid a lonely half-width card on the last row
        <Card key={i} item={it} variant={variant} fullWidth={i === rest.length - 1 && rest.length % 2 === 1} />
      ))}
    </div>
  )
}

/* ─── workflow comparison lanes ───────────────────────────────────────────── */

function markerGlyph(kind: StepKind): string {
  switch (kind) {
    case 'ai':      return '◆'
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
  const color = proposed ? 'rgba(6,150,215,0.7)' : 'rgba(102,102,102,0.45)'
  return (
    <div className="flex justify-center">
      <svg width="14" height="15" viewBox="0 0 14 15" fill="none" aria-hidden="true" style={{ display: 'block' }}>
        <path d="M7 0 V14" stroke={color} strokeWidth="1" strokeLinecap="round" />
        <path d="M2 10 L7 14 L12 10" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function LaneHeader({ proposed, title, stat }: { proposed: boolean; title: string; stat: string }) {
  const accent = proposed ? 'text-autodesk-blue' : 'text-charcoal'
  return (
    <div className={`pb-2 border-b-2 ${proposed ? 'border-autodesk-blue' : 'border-charcoal/40'}`}>
      <span className={`font-sans text-[10px] uppercase tracking-[0.12em] ${accent}`}>{title}</span>
      <span className={`block mt-1 font-serif text-[15px] ${accent}`}>{stat}</span>
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

  // box background + border
  let box = proposed ? 'bg-autodesk-blue/5 border-autodesk-blue/30' : 'bg-white border-charcoal/25'
  if (kind === 'ai') box = 'bg-autodesk-blue/5 border-autodesk-blue/45 shadow-[0_0_10px_-2px_rgba(6,150,215,0.3)]'
  else if (kind === 'approve') box = proposed ? 'bg-autodesk-blue/10 border-autodesk-blue/70' : 'bg-white border-charcoal/45'
  else if (kind === 'catch') box = isEmphasis
    ? (proposed ? 'bg-autodesk-blue/10 border-autodesk-blue/70' : 'bg-white border-charcoal/60')
    : (proposed ? 'bg-autodesk-blue/5 border-autodesk-blue/30' : 'bg-white border-charcoal/25')
  else if (kind === 'reject') box = 'bg-white border-charcoal/60'
  else if (kind === 'repeat') box = 'bg-white border-charcoal/45'
  else if (step.emphasis) box = proposed ? 'bg-autodesk-blue/10 border-autodesk-blue/70' : 'bg-white border-charcoal/60'

  // border thickness — matches the connector stroke; thicker for emphasis steps
  const borderW = isEmphasis ? 'border-2' : 'border'

  // marker colour
  let marker = proposed ? 'text-autodesk-blue/60' : 'text-charcoal/40'
  if (kind === 'ai') marker = 'text-autodesk-blue'
  else if (kind === 'approve') marker = proposed ? 'text-autodesk-blue' : 'text-charcoal'
  else if (kind === 'reject' || kind === 'repeat') marker = 'text-charcoal'
  else if (kind === 'catch') marker = proposed ? 'text-autodesk-blue' : 'text-charcoal'

  const labelColor = isEmphasis ? 'text-black font-medium' : 'text-charcoal'

  const noteColor = proposed ? 'text-autodesk-blue' : 'text-charcoal/60'

  return (
    <div className="flex flex-col">
      <div className={`relative overflow-hidden rounded-sm ${borderW} px-2.5 py-1 flex items-center gap-2 ${box}`}>
        <span className={`relative shrink-0 text-[11px] md:text-[12px] leading-none ${marker}`} aria-hidden="true">
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
        {(kind === 'ai' || step.actor) && (
          <span className="ml-auto shrink-0 flex items-center gap-1.5">
            {kind === 'ai' && <Pill tone="blue">AI</Pill>}
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
function Legend({ current, proposed }: { current: Workflow; proposed: Workflow }) {
  const used = new Set<StepKind>()
  for (const s of [...current.steps, ...proposed.steps]) used.add(s.kind ?? 'normal')

  const items = ([
    { kind: 'ai',      glyph: '◆', label: 'AI step' },
    { kind: 'catch',   glyph: '⚑', label: 'Issue caught' },
    { kind: 'reject',  glyph: '✕', label: 'Rejected' },
    { kind: 'approve', glyph: '✓', label: 'Approved' },
    { kind: 'repeat',  glyph: '⟲', label: 'Repeat review cycle' },
  ] as const).filter(it => used.has(it.kind))

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-1 mt-5">
      {items.map(({ glyph, label }) => (
        <span key={label} className="font-sans text-[10px] text-charcoal/70">
          <span className="text-charcoal mr-1" aria-hidden="true">{glyph}</span>
          {label}
        </span>
      ))}
    </div>
  )
}

// One vertical lane of steps. Each box is its own content height (boxes are not
// stretched to match the other lane), and connectors join steps within the lane.
function Lane({ workflow, proposed }: { workflow: Workflow; proposed: boolean }) {
  return (
    <div className="flex flex-col">
      {workflow.steps.map((step, i) => (
        <StepCell key={i} step={step} proposed={proposed} isLast={i === workflow.steps.length - 1} />
      ))}
    </div>
  )
}

function WorkflowComparison({ current, proposed }: { current: Workflow; proposed: Workflow }) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-x-4 md:gap-x-6 mb-4">
        <LaneHeader proposed={false} title="Current" stat={current.stat} />
        <LaneHeader proposed title="Proposed · Powered by AI Drawing Analyzer" stat={proposed.stat} />
      </div>

      <div className="grid grid-cols-2 gap-x-4 md:gap-x-6 items-start">
        <Lane workflow={current} proposed={false} />
        <Lane workflow={proposed} proposed />
      </div>

      <Legend current={current} proposed={proposed} />
    </div>
  )
}

/* ─── the use case ────────────────────────────────────────────────────────── */

export default function UseCase({ data }: { data: UseCaseData }) {
  return (
    <Section id={data.id} eyebrow={data.eyebrow} title={data.title}>
      <Block label="Phase">
        <div className="flex flex-wrap gap-2 mb-2">
          {data.constructionPhase.name.split('/').map((p, i) => (
            <Pill key={i}>{p.trim()}</Pill>
          ))}
        </div>
        <Para>{data.constructionPhase.description}</Para>
      </Block>

      <Block label="User">
        <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">
          <div>
            <p className="font-sans text-[9px] uppercase tracking-[0.12em] text-charcoal/50 -mb-0.5">Primary user</p>
            <Role data={data.primaryUser} />
          </div>
          <div>
            <p className="font-sans text-[9px] uppercase tracking-[0.12em] text-charcoal/50 -mb-0.5">
              {Array.isArray(data.secondaryUser) && data.secondaryUser.length > 1 ? 'Secondary users' : 'Secondary user'}
            </p>
            <div className="flex flex-col gap-2">
              {(Array.isArray(data.secondaryUser) ? data.secondaryUser : [data.secondaryUser]).map((u, i) => (
                <Role key={i} data={u} />
              ))}
            </div>
          </div>
        </div>
      </Block>

      <Block label="Problem">
        <Para>{data.problem.intro}</Para>
        {data.problem.examples && data.problem.examples.length > 0 && (
          <>
            <MiniLabel>Examples include</MiniLabel>
            <Bullets items={data.problem.examples} />
          </>
        )}
        <MiniLabel>As a result</MiniLabel>
        <Bullets items={data.problem.consequences} />
      </Block>

      <Block label="Workflow">
        <WorkflowComparison current={data.currentWorkflow} proposed={data.proposedWorkflow} />
      </Block>

      <Block label="Why the AI Drawing Analyzer is required">
        <div className="flex flex-col gap-3">
          {data.whyAnalyzer.intro.map((p, i) => <Para key={i}>{p}</Para>)}
        </div>
        {data.whyAnalyzer.quotesAfterIntro && <WhyQuotes quotes={data.whyAnalyzer.quotes} />}
        {data.whyAnalyzer.examples && data.whyAnalyzer.examples.length > 0 && (
          <>
            <MiniLabel>Examples</MiniLabel>
            <Bullets items={data.whyAnalyzer.examples} />
          </>
        )}
        <div className="flex flex-col gap-3 mt-4">
          {data.whyAnalyzer.body.map((p, i) => <Para key={i}>{p}</Para>)}
        </div>
        {!data.whyAnalyzer.quotesAfterIntro && <WhyQuotes quotes={data.whyAnalyzer.quotes} />}
        <div className="mt-4">
          <Para>{data.whyAnalyzer.closing}</Para>
        </div>
      </Block>

      <Block label="Value">
        <CardList items={data.value} variant="value" />
      </Block>

      <Block label="Risks & trade-offs">
        <CardList items={data.tradeoffs} variant="risk" />
      </Block>
    </Section>
  )
}
