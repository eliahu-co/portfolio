// app/MA-HomeAssignment/sections/UseCase.tsx
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
  actor?:    'reviewer' | 'designer' | 'owner' // tags the step with the persona performing it
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
    body?:        string   // optional paragraph after the examples, before "As a result"
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
const MOCKUP_SRC = '/coinmaster/placeholder.jpg'
function MockupFrame() {
  return (
    <div className="mx-auto max-w-[240px] overflow-hidden rounded-2xl border-2 border-cm-wood/50 shadow-[0_3px_0_rgba(144,57,0,0.28)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={MOCKUP_SRC} alt="Coin Master concept mockup" className="block w-full h-auto" />
    </div>
  )
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
      ? `border-cm-sky/40 border-l-cm-sky ${item.primary ? 'border-l-[5px]' : 'border-l-4'}`
      : `border-cm-crimson/35 border-l-cm-crimson ${item.primary ? 'border-l-[5px]' : 'border-l-4'}`
  // card surface — tinted per variant so cards sit warm on the cream page
  // (plain white reads cold against bg-cm-cream)
  const surface = variant === 'neutral'
    ? 'bg-gradient-to-b from-[#FBF7F0] to-[#F3ECDF]'
    : variant === 'value'
      ? 'bg-gradient-to-b from-[#F4FBFF] to-[#E6F5FE]'
      : 'bg-gradient-to-b from-[#FFF4F1] to-[#FBE9E7]'
  const span = item.primary || fullWidth ? 'sm:col-span-2' : ''
  return (
    <div className={`rounded-[10px] border px-3 py-2.5 shadow-[0_2px_6px_rgba(42,27,84,0.08)] ${surface} ${edge} ${span}`}>
      <p className="font-serif text-[14px] text-cm-violet-deep mb-0.5 flex items-center gap-1.5">
        {item.primary && variant === 'value' && <span className="shrink-0 text-[13px] leading-none text-cm-sky" aria-hidden="true">★</span>}
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
  const color = proposed ? 'rgba(144,57,0,0.75)' : 'rgba(144,57,0,0.35)'
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
  const accent = proposed ? 'text-cm-wood' : 'text-[#8a6a3f]'
  return (
    <div className={`pb-2 border-b-2 ${proposed ? 'border-cm-wood' : 'border-cm-wood/30'}`}>
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

  // box background + border — each step is its own small parchment card with a
  // wood drop edge (the proposed lane's parchment is warmer than the current's)
  const parchment      = 'bg-gradient-to-b from-[#FFE9C4] to-[#FFDCA3]'
  const parchmentLight = 'bg-gradient-to-b from-[#FFF6E5] to-[#FFEBC9]'
  const woodEdge       = 'shadow-[0_2px_0_rgba(144,57,0,0.25)]'
  const woodEdgeLight  = 'shadow-[0_2px_0_rgba(144,57,0,0.15)]'
  let box = proposed
    ? `${parchment} border-cm-wood/50 ${woodEdge}`
    : `${parchmentLight} border-cm-wood/30 ${woodEdgeLight}`
  if (kind === 'ai') box = 'bg-gradient-to-b from-[#5FC9F5] to-cm-sky border-[#1D5E7E] shadow-[0_0_12px_rgba(79,191,239,0.7)]'
  else if (kind === 'approve') box = `${parchment} border-[#4C9B3C] shadow-[0_2px_0_rgba(76,155,60,0.35)]`
  else if (kind === 'catch') box = isEmphasis
    ? (proposed ? `${parchment} border-cm-wood/70 ${woodEdge}` : `${parchmentLight} border-cm-wood/60 ${woodEdgeLight}`)
    : (proposed ? `${parchment} border-cm-wood/50 ${woodEdge}` : `${parchmentLight} border-cm-wood/30 ${woodEdgeLight}`)
  else if (kind === 'reject') box = `${parchmentLight} border-cm-crimson shadow-[0_2px_0_rgba(200,16,46,0.3)]`
  else if (kind === 'repeat') box = `${parchmentLight} border-cm-wood/45 ${woodEdgeLight}`
  else if (step.emphasis) box = proposed ? `${parchment} border-cm-wood/70 ${woodEdge}` : `${parchmentLight} border-cm-wood/60 ${woodEdgeLight}`

  // border thickness — matches the connector stroke; thicker for emphasis steps
  const borderW = isEmphasis ? 'border-2' : 'border'

  // marker colour
  let marker = proposed ? 'text-cm-wood/70' : 'text-cm-wood/40'
  if (kind === 'ai') marker = 'text-[#0F3D54]'
  else if (kind === 'approve') marker = 'text-[#3C7A2F]'
  else if (kind === 'reject') marker = 'text-cm-crimson'
  else if (kind === 'repeat') marker = 'text-cm-wood'
  else if (kind === 'catch') marker = proposed ? 'text-cm-wood' : 'text-charcoal'

  const labelColor = kind === 'ai'
    ? 'text-[#0F3D54] font-bold'
    : isEmphasis ? 'text-black font-medium' : 'text-charcoal'

  const noteColor = proposed ? 'text-cm-wood' : 'text-charcoal/60'

  return (
    <div className="flex flex-col">
      <div className={`relative overflow-hidden rounded-lg ${borderW} px-2.5 py-1 flex items-center gap-2 ${box}`}>
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
        {(kind === 'ai' || step.actor) && (
          <span className="relative ml-auto shrink-0 flex items-center gap-1.5">
            {kind === 'ai' && <Pill tone="solid">DA</Pill>}
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
          <span key={label} className={`inline-flex items-center font-sans text-[10px] leading-none ${isAi ? 'text-[#1D5E7E]' : 'text-cm-wood/80'}`}>
            <span
              className={`mr-1 leading-none ${isAi ? 'text-[#1D5E7E] font-bold text-[13px]' : 'text-cm-wood'}`}
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
    <div className="flex flex-col">
      {workflow.steps.map((step, i) => (
        <StepCell key={i} step={step} proposed={proposed} isLast={i === workflow.steps.length - 1} />
      ))}
    </div>
  )
}

// One workflow per use case: the "current" lane on the left, and the concept
// mockup image on the right (in place of the old "proposed" lane).
function WorkflowComparison({ current, legendAiOnly }: { current: Workflow; legendAiOnly?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 md:gap-x-6 items-start">
      <div>
        <div className="mb-4">
          <LaneHeader proposed={false} title="Current" stat={current.stat} />
        </div>
        <Lane workflow={current} proposed={false} />
        <Legend current={current} proposed={current} aiOnly={legendAiOnly} />
      </div>
      <div>
        <div className="mb-4 pb-2 border-b-2 border-cm-wood/30">
          <span className="font-sans text-[10px] uppercase tracking-[0.12em] text-cm-wood">Concept</span>
        </div>
        <MockupFrame />
      </div>
    </div>
  )
}

/* ─── the use case ────────────────────────────────────────────────────────── */

export default function UseCase({ data }: { data: UseCaseData }) {
  const opp = data.opportunity

  const problemSection = (
    <Block label="Problem">
      <Para>{data.problem.intro}</Para>
      {data.problem.examples && data.problem.examples.length > 0 && (
        <>
          <MiniLabel>Examples include</MiniLabel>
          <Bullets items={data.problem.examples} />
        </>
      )}
      {data.problem.body && <div className="mt-3"><Para>{data.problem.body}</Para></div>}
      <MiniLabel>As a result</MiniLabel>
      <Bullets items={data.problem.consequences} />
    </Block>
  )

  const opportunityHead = (
    <>
      <BlockLabel>
        <span className="inline-flex items-center gap-2 align-middle">
          The AI Drawing Analyzer Opportunity
          <Pill tone="solid">DA</Pill>
        </span>
      </BlockLabel>
      <OpportunityText opp={opp} />
    </>
  )

  return (
    <Section id={data.id} eyebrow={data.eyebrow} title={data.title}>
      <Block label="Phase">
        <div className="flex flex-wrap gap-2 mb-2">
          {data.constructionPhase.name.split(/[/→]/).map((p, i) => (
            <Pill key={i}>{p.trim()}</Pill>
          ))}
        </div>
        <Para>{data.constructionPhase.description}</Para>
      </Block>

      <Block label="User">
        <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.12em] text-charcoal -mb-0.5">Primary user</p>
            <Role data={data.primaryUser} />
          </div>
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.12em] text-charcoal -mb-0.5">
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

      {problemSection}
      <div className="mb-6">
        {opportunityHead}
      </div>

      <Block label="Workflow">
        <WorkflowComparison current={data.currentWorkflow} legendAiOnly={data.legendAiOnly} />
      </Block>

      <Block label="Value delivered">
        <CardList items={data.value} variant="value" />
      </Block>

      <Block label="Risks">
        <CardList items={data.tradeoffs} variant="risk" />
        {data.tradeoff && (
          <p className="mt-8 font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-cm-wood">
            <span className="mr-2 font-extrabold text-cm-crimson">Tradeoff</span>
            {data.tradeoff.gain}
            <span className="mx-1" aria-hidden="true">⇄</span>
            {data.tradeoff.cost}
          </p>
        )}
      </Block>
    </Section>
  )
}
