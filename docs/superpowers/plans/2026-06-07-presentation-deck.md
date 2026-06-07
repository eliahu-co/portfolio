# Presentation Deck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 17-slide, keyboard-navigable, print-friendly executive presentation deck at `/HA-DrawingAnalyzer/presentation` that reuses the existing site's data, tokens, and typography — without modifying any existing route.

**Architecture:** A server `page.tsx` sets unlisted metadata and renders one client component, `PresentationDeck`, which owns slide state, keyboard navigation, a CSS crossfade, a slide counter, and responsive/print behavior via a scoped inline `<style>` block (the codebase's established pattern). Slides are small presentational components composed from slide-local primitives (`primitives.tsx`) and real data (`deckData.ts`, which imports the already-exported `USE_CASE_1..4` and copies the module-local values from the section files). Navigation math is isolated in a pure module (`nav.ts`) and unit-tested.

**Tech Stack:** Next.js 14 App Router, React client components, TypeScript, Tailwind (existing tokens: `autodesk-blue`, `charcoal`, `font-serif`/`font-sans`), Jest (`next/jest`, jsdom).

**Branch:** `feature/presentation` (already created). Nothing is committed to `main`.

**Hard safety rule (every task):** Only files under `app/HA-DrawingAnalyzer/presentation/` and `__tests__/presentation-*.test.ts` are created/modified. Existing section files are imported, never edited. The guard command `git diff --name-only main -- app/HA-DrawingAnalyzer | grep -v '/presentation/'` must print **nothing**.

---

## File Structure

```
app/HA-DrawingAnalyzer/presentation/
  page.tsx              Server. noindex/nofollow metadata + <PresentationDeck/>.
  PresentationDeck.tsx  'use client'. State, keyboard, crossfade, counter, responsive/print.
  nav.ts                Pure navigation helpers (clamp/step/hash). Unit-tested.
  deckData.ts           Imports USE_CASE_1..4; copies real values from section consts.
  primitives.tsx        SlideShell, Counter, MiniWorkflow, MiniCard, ScoreTable.
  slides/
    Slide01Cover.tsx
    Slide02AboutMe.tsx        (TODO content)
    Slide03Approach.tsx
    Slide04SelectedUseCases.tsx
    SlideUseCase.tsx          (parametrized; rendered for slides 5–8)
    Slide09Assumptions.tsx
    Slide10Framework.tsx
    Slide11Results.tsx
    Slide12Recommendation.tsx
    Slide13Workflow.tsx
    Slide14ValueRisks.tsx
    Slide15MvpScope.tsx
    Slide16Prototype.tsx
    Slide17KeyUnknowns.tsx
__tests__/presentation-nav.test.ts
```

---

## Task 1: Route scaffold + deck skeleton (placeholder slides) + nav + safety guard

Establishes the additive route, working keyboard navigation, crossfade, counter, and print/mobile behavior using 17 trivial placeholder slides. Proves the existing route is untouched.

**Files:**
- Create: `app/HA-DrawingAnalyzer/presentation/page.tsx`
- Create: `app/HA-DrawingAnalyzer/presentation/PresentationDeck.tsx`

- [ ] **Step 1: Create the server page**

`app/HA-DrawingAnalyzer/presentation/page.tsx`:

```tsx
// app/HA-DrawingAnalyzer/presentation/page.tsx
// Unlisted executive presentation deck. Additive route — does not affect
// /HA-DrawingAnalyzer or any other page.
import type { Metadata } from 'next'
import PresentationDeck from './PresentationDeck'

export const metadata: Metadata = {
  title: 'AI Drawing Analyzer — Presentation',
  robots: { index: false, follow: false },
}

export default function PresentationPage() {
  return <PresentationDeck />
}
```

- [ ] **Step 2: Create the deck skeleton with placeholder slides**

`app/HA-DrawingAnalyzer/presentation/PresentationDeck.tsx`:

```tsx
// app/HA-DrawingAnalyzer/presentation/PresentationDeck.tsx
'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'

// Temporary placeholder slides — replaced by real slide components in later tasks.
const SLIDES: ReactNode[] = Array.from({ length: 17 }, (_, i) => (
  <div className="flex h-full w-full items-center justify-center">
    <span className="font-serif text-[64px] text-black">Slide {i + 1}</span>
  </div>
))

export default function PresentationDeck() {
  const router = useRouter()
  const total = SLIDES.length
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && /^(VIDEO|BUTTON|A|INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return
      if (e.key === 'ArrowRight' || (e.key === ' ' && !e.shiftKey)) {
        e.preventDefault(); setCurrent((c) => (c >= total - 1 ? c : c + 1))
      } else if (e.key === 'ArrowLeft' || (e.key === ' ' && e.shiftKey)) {
        e.preventDefault(); setCurrent((c) => (c <= 0 ? c : c - 1))
      } else if (e.key === 'Escape') {
        router.push('/HA-DrawingAnalyzer')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [router, total])

  useEffect(() => {
    window.history.replaceState(null, '', `#slide-${current + 1}`)
  }, [current])

  return (
    <div className="deck-root bg-white text-charcoal">
      {/* Desktop: crossfading overlay */}
      <div className="hidden lg:block">
        <div className="fixed inset-0 overflow-hidden">
          {SLIDES.map((slide, i) => (
            <section
              key={i}
              id={`slide-${i + 1}`}
              aria-hidden={i !== current}
              className={`absolute inset-0 transition-opacity duration-[250ms] ${
                i === current ? 'z-10 opacity-100' : 'z-0 pointer-events-none opacity-0'
              }`}
            >
              {slide}
            </section>
          ))}
          <p className="deck-counter fixed bottom-5 right-6 z-20 font-sans text-[12px] tracking-[0.12em] text-charcoal/60">
            {current + 1} / {total}
          </p>
        </div>
      </div>

      {/* Mobile / print: linear vertical stack */}
      <div className="deck-linear lg:hidden">
        {SLIDES.map((slide, i) => (
          <section key={i} id={`slide-${i + 1}`} className="flex min-h-screen w-full">
            {slide}
          </section>
        ))}
      </div>

      <style>{`
        .deck-root, .deck-root * { cursor: auto; }
        @media print {
          .deck-root .hidden.lg\\:block { display: none !important; }
          .deck-root .deck-linear { display: block !important; }
          .deck-counter { display: none !important; }
          .deck-root section { break-after: page; min-height: 100vh; }
        }
      `}</style>
    </div>
  )
}
```

- [ ] **Step 3: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Verify the route renders and existing route is untouched**

Run: `npm run dev` then open `http://localhost:3000/HA-DrawingAnalyzer/presentation`.
Expected: "Slide 1" centered; arrows/space change slides; counter updates "1 / 17"; Escape navigates to `/HA-DrawingAnalyzer`.

Run the safety guard:
`git diff --name-only main -- app/HA-DrawingAnalyzer | grep -v "/presentation/"`
Expected: prints nothing (only files under `presentation/` differ from main).

- [ ] **Step 5: Commit**

```bash
git add app/HA-DrawingAnalyzer/presentation/page.tsx app/HA-DrawingAnalyzer/presentation/PresentationDeck.tsx
git commit -m "feat(presentation): scaffold route + deck skeleton with nav, crossfade, print"
```

---

## Task 2: Extract navigation math into `nav.ts` (TDD)

The clamp/step/hash logic is the only real logic in the deck. Isolate and test it, then wire the deck to use it.

**Files:**
- Create: `app/HA-DrawingAnalyzer/presentation/nav.ts`
- Test: `__tests__/presentation-nav.test.ts`
- Modify: `app/HA-DrawingAnalyzer/presentation/PresentationDeck.tsx`

- [ ] **Step 1: Write the failing test**

`__tests__/presentation-nav.test.ts`:

```ts
import { TOTAL_SLIDES, clampIndex, step, hashForIndex, indexFromHash } from '@/app/HA-DrawingAnalyzer/presentation/nav'

describe('presentation nav', () => {
  it('has 17 slides', () => {
    expect(TOTAL_SLIDES).toBe(17)
  })

  it('clamps below and above range', () => {
    expect(clampIndex(-3)).toBe(0)
    expect(clampIndex(99)).toBe(TOTAL_SLIDES - 1)
    expect(clampIndex(5)).toBe(5)
  })

  it('steps forward and backward, clamped at ends', () => {
    expect(step(0, 1)).toBe(1)
    expect(step(0, -1)).toBe(0)
    expect(step(TOTAL_SLIDES - 1, 1)).toBe(TOTAL_SLIDES - 1)
    expect(step(4, -1)).toBe(3)
  })

  it('round-trips index <-> hash (1-based)', () => {
    expect(hashForIndex(0)).toBe('#slide-1')
    expect(hashForIndex(16)).toBe('#slide-17')
    expect(indexFromHash('#slide-1')).toBe(0)
    expect(indexFromHash('slide-17')).toBe(16)
  })

  it('returns null for invalid or out-of-range hashes', () => {
    expect(indexFromHash('')).toBeNull()
    expect(indexFromHash('#about')).toBeNull()
    expect(indexFromHash('#slide-0')).toBeNull()
    expect(indexFromHash('#slide-99')).toBeNull()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx jest presentation-nav`
Expected: FAIL — cannot find module `nav` / functions undefined.

- [ ] **Step 3: Implement `nav.ts`**

`app/HA-DrawingAnalyzer/presentation/nav.ts`:

```ts
// app/HA-DrawingAnalyzer/presentation/nav.ts
// Pure navigation helpers for the presentation deck (no React, no DOM).

export const TOTAL_SLIDES = 17

export function clampIndex(i: number, total: number = TOTAL_SLIDES): number {
  if (i < 0) return 0
  if (i > total - 1) return total - 1
  return i
}

export function step(current: number, dir: 1 | -1, total: number = TOTAL_SLIDES): number {
  return clampIndex(current + dir, total)
}

export function hashForIndex(i: number): string {
  return `#slide-${i + 1}`
}

export function indexFromHash(hash: string, total: number = TOTAL_SLIDES): number | null {
  const m = /^#?slide-(\d+)$/.exec(hash)
  if (!m) return null
  const n = parseInt(m[1], 10) - 1
  if (Number.isNaN(n) || n < 0 || n > total - 1) return null
  return n
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx jest presentation-nav`
Expected: PASS (5 tests).

- [ ] **Step 5: Wire the deck to use `nav.ts`**

In `PresentationDeck.tsx`, replace the hand-rolled clamping with the helpers and add hash-on-mount sync. Replace the imports line and the three relevant blocks:

Change the import block to:

```tsx
import { useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { TOTAL_SLIDES, step as stepIndex, hashForIndex, indexFromHash } from './nav'
```

Replace the key handler and hash effects with:

```tsx
  const total = TOTAL_SLIDES
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const fromHash = indexFromHash(window.location.hash, total)
    if (fromHash !== null) setCurrent(fromHash)
  }, [total])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && /^(VIDEO|BUTTON|A|INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return
      if (e.key === 'ArrowRight' || (e.key === ' ' && !e.shiftKey)) {
        e.preventDefault(); setCurrent((c) => stepIndex(c, 1, total))
      } else if (e.key === 'ArrowLeft' || (e.key === ' ' && e.shiftKey)) {
        e.preventDefault(); setCurrent((c) => stepIndex(c, -1, total))
      } else if (e.key === 'Escape') {
        router.push('/HA-DrawingAnalyzer')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [router, total])

  useEffect(() => {
    window.history.replaceState(null, '', hashForIndex(current))
  }, [current])
```

- [ ] **Step 6: Verify**

Run: `npx tsc --noEmit` (expected: clean) and `npx jest presentation-nav` (expected: PASS).

- [ ] **Step 7: Commit**

```bash
git add app/HA-DrawingAnalyzer/presentation/nav.ts __tests__/presentation-nav.test.ts app/HA-DrawingAnalyzer/presentation/PresentationDeck.tsx
git commit -m "feat(presentation): pure nav helpers with unit tests; hash sync on mount"
```

---

## Task 3: `deckData.ts` — real data (imported + copied)

**Files:**
- Create: `app/HA-DrawingAnalyzer/presentation/deckData.ts`

- [ ] **Step 1: Create the data module**

`app/HA-DrawingAnalyzer/presentation/deckData.ts`:

```ts
// app/HA-DrawingAnalyzer/presentation/deckData.ts
// Real content for the deck. USE_CASES are imported from the live source of
// truth. The remaining blocks are COPIED from module-local consts in the
// section files (which must stay untouched) — keep them in sync by hand.

import { USE_CASE_1, USE_CASE_2, USE_CASE_3, USE_CASE_4 } from '@/app/HA-DrawingAnalyzer/sections/useCaseData'
import type { UseCaseData } from '@/app/HA-DrawingAnalyzer/sections/UseCase'

export const USE_CASES: UseCaseData[] = [USE_CASE_1, USE_CASE_2, USE_CASE_3, USE_CASE_4]

// SOURCE: sections/Prioritization.tsx CRITERIA / ROWS — keep in sync.
export const CRITERIA = ['Impact', 'Platform Leverage', 'Confidence', 'Feasibility'] as const

export type ScoreRow = { useCase: string; scores: number[]; total: number; winner?: boolean }
export const SCORE_ROWS: ScoreRow[] = [
  { useCase: 'Change Validation',          scores: [5, 5, 5, 3], total: 18, winner: true },
  { useCase: 'Context Link',               scores: [5, 5, 4, 3], total: 17 },
  { useCase: 'Coordination Lock',          scores: [5, 4, 3, 2], total: 14 },
  { useCase: 'Program Conformance Review', scores: [4, 5, 2, 2], total: 13 },
]

export type CriterionDef = { title: string; body: string; rubric: [string, string][] }
export const CRITERIA_DEFS: CriterionDef[] = [
  { title: 'Impact', body: 'Magnitude of value delivered if successful.', rubric: [['5', 'Significant user and business impact.'], ['3', 'Meaningful but limited impact.'], ['1', 'Nice-to-have improvement.']] },
  { title: 'Platform Leverage', body: 'Degree to which the use case depends on the unique capabilities of the AI Drawing Analyzer.', rubric: [['5', 'Impossible without drawing intelligence.'], ['3', 'Somewhat benefits from it.'], ['1', 'Mostly unrelated.']] },
  { title: 'Confidence', body: 'Confidence that users will understand, adopt, and realize value from the workflow.', rubric: [['5', 'Clear pain point and obvious value.'], ['3', 'Some adoption or behavior-change risk.'], ['1', 'Significant uncertainty around adoption or value.']] },
  { title: 'Feasibility', body: 'Estimated effort required to deliver a valuable MVP.', rubric: [['5', 'Low effort and limited dependencies.'], ['3', 'Moderate effort or coordination required.'], ['1', 'Significant effort or complexity required.']] },
]

// SOURCE: sections/MVP.tsx SCOPE_IN / SCOPE_OUT — keep in sync.
export const SCOPE_IN = [
  'Compare two versions of a single drawing sheet.',
  'Detect added, removed, and modified objects.',
  'Generate visual previews of detected changes.',
  'Approve detected changes and submit review.',
  'Cancel review submission and return to editing.',
]
export const SCOPE_OUT = [
  'Manual addition of undetected changes.',
  'Approval or rejection of individual detected changes.',
  'Generate human-readable change descriptions.',
  'Automatic filtering of cosmetic or low-impact changes.',
  'Change severity scoring and risk classification.',
  'Historical change reports.',
  'Multi-sheet drawing sets.',
]

// SOURCE: sections/AssumptionsSources.tsx ASSUMPTIONS — keep in sync.
export const ASSUMPTIONS = [
  'The AI Drawing Analyzer can reliably identify and relate common drawing objects across revisions.',
  'The AI Drawing Analyzer can process drawings quickly enough to fit within existing user workflows.',
  'Forma has reliable integration with the AI Drawing Analyzer’s structured output.',
  'Target users already work within Autodesk construction and design workflows.',
  'Most analyzed drawings follow standard industry conventions and contain sufficient quality for automated interpretation.',
  'Drawings remain the project source of truth; structured outputs generated by the AI Drawing Analyzer augment existing workflows rather than replace the underlying drawings and documents.',
  'The AI Drawing Analyzer is assumed to analyze and interpret drawings, not create or modify design content.',
]

// SOURCE: sections/KeyUnknowns.tsx VARIABLES — keep in sync.
export const VARIABLES = [
  { label: 'Accuracy', body: 'What confidence threshold should be required before a detected change is surfaced to the user?' },
  { label: 'Latency',  body: 'What response time is required for Change Validation to fit naturally into the review submission workflow?' },
  { label: 'Cost',     body: 'Can change validation run on every review initiated while remaining economically viable at project scale?' },
]

// Six construction-lifecycle phases for slide 3. Labels are adjustable — confirm with author.
export const APPROACH_PHASES = ['Conception', 'Design & Planning', 'Permitting', 'Pre-Construction', 'Construction', 'Operations & Handover']
export const APPROACH_FLOW = ['Lifecycle', 'Bottlenecks', 'Use Cases', 'Prioritization', 'MVP']

// Recommendation pillars (titles from brief; supporting lines adjustable).
export const RECOMMENDATION_PILLARS = [
  { title: 'Highest Confidence', body: 'Clear pain point, obvious value, minimal behavior change.' },
  { title: 'Highest Platform Leverage', body: 'Depends directly on object-level change detection.' },
  { title: 'Fastest Learning', body: 'Lowest-effort MVP that validates the core hypothesis quickly.' },
]

// Demo assets (already committed under /public).
export const DEMO_POSTER = '/drawinganalyzer/ha-drawing-analyzer-poster.jpg'
export const DEMO_HREF = '/HA-DrawingAnalyzer/demo'
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add app/HA-DrawingAnalyzer/presentation/deckData.ts
git commit -m "feat(presentation): deckData — imported use cases + copied real values"
```

---

## Task 4: `primitives.tsx` — slide-local visual building blocks

**Files:**
- Create: `app/HA-DrawingAnalyzer/presentation/primitives.tsx`

- [ ] **Step 1: Create the primitives**

`app/HA-DrawingAnalyzer/presentation/primitives.tsx`:

```tsx
// app/HA-DrawingAnalyzer/presentation/primitives.tsx
// Slide-local presentational building blocks, sized for projection. These are
// deliberately independent of sections/UseCase.tsx (which must stay untouched).
import type { ReactNode } from 'react'
import type { WorkflowStep } from '@/app/HA-DrawingAnalyzer/sections/UseCase'

export function SlideShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string
  title?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="mx-auto flex h-full w-full max-w-5xl flex-col justify-center px-12 py-16 lg:px-20">
      {eyebrow && (
        <p className="mb-4 font-sans text-[12px] font-bold uppercase tracking-[0.14em] text-autodesk-blue">{eyebrow}</p>
      )}
      {title && (
        <h2 className="mb-8 font-serif text-[clamp(28px,4vw,52px)] leading-[1.05] text-black whitespace-pre-line">{title}</h2>
      )}
      {children}
    </div>
  )
}

export function Counter({ index, total }: { index: number; total: number }) {
  return (
    <p className="deck-counter fixed bottom-5 right-6 z-20 font-sans text-[12px] tracking-[0.12em] text-charcoal/60">
      {index + 1} / {total}
    </p>
  )
}

const GLYPH: Record<string, string> = {
  normal: '●', ai: '⚡︎', catch: '⚑', reject: '✕', approve: '✓', repeat: '⟲',
}

function Lane({ steps, proposed }: { steps: WorkflowStep[]; proposed: boolean }) {
  const accent = proposed ? 'text-autodesk-blue' : 'text-charcoal'
  const border = proposed ? 'border-autodesk-blue/40' : 'border-charcoal/25'
  return (
    <div className="flex flex-1 flex-col gap-2">
      <p className={`mb-1 font-sans text-[12px] uppercase tracking-[0.12em] ${accent}`}>
        {proposed ? 'Proposed' : 'Current'}
      </p>
      {steps.map((s, i) => {
        const kind = s.kind ?? 'normal'
        return (
          <div key={i} className={`flex items-center gap-2 rounded-sm border ${border} bg-white px-3 py-2`}>
            <span className={`shrink-0 text-[13px] ${kind === 'ai' ? 'text-autodesk-blue' : 'text-charcoal/70'}`} aria-hidden="true">
              {GLYPH[kind]}
            </span>
            <span className="font-sans text-[13px] leading-snug text-charcoal">{s.label}</span>
          </div>
        )
      })}
    </div>
  )
}

export function MiniWorkflow({ current, proposed }: { current: WorkflowStep[]; proposed: WorkflowStep[] }) {
  return (
    <div className="flex gap-8">
      <Lane steps={current} proposed={false} />
      <Lane steps={proposed} proposed />
    </div>
  )
}

export function MiniCard({ title, tone }: { title: string; tone: 'value' | 'risk' }) {
  const bar = tone === 'value' ? 'border-autodesk-blue' : 'border-[#f4b400]'
  return (
    <div className={`border-l-4 ${bar} pl-4 py-2`}>
      <p className="font-serif text-[20px] leading-snug text-black">{title}</p>
    </div>
  )
}

export function ScoreTable({
  criteria,
  rows,
}: {
  criteria: readonly string[]
  rows: { useCase: string; scores: number[]; total: number; winner?: boolean }[]
}) {
  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-b-2 border-autodesk-blue">
          <th className="py-3 pr-4 font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/70">Use case</th>
          {criteria.map((c) => (
            <th key={c} className="px-3 py-3 text-center font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/70">{c}</th>
          ))}
          <th className="pl-3 py-3 text-center font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/70">Total</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr
            key={r.useCase}
            className="border-b border-charcoal/15"
            style={r.winner ? { backgroundImage: 'linear-gradient(90deg, rgba(6,150,215,0.06) 0%, rgba(6,150,215,0.20) 50%, rgba(6,150,215,0.06) 100%)' } : undefined}
          >
            <td className={`py-3 pr-4 font-sans text-[16px] ${r.winner ? 'font-medium text-black' : 'text-charcoal'}`}>{r.useCase}</td>
            {r.scores.map((s, i) => (
              <td key={i} className="px-3 py-3 text-center font-sans text-[16px] text-charcoal/70">{s}</td>
            ))}
            <td className={`pl-3 py-3 text-center font-sans text-[18px] font-medium ${r.winner ? 'text-autodesk-blue' : 'text-black'}`}>{r.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add app/HA-DrawingAnalyzer/presentation/primitives.tsx
git commit -m "feat(presentation): slide-local primitives (shell, workflow, card, table, counter)"
```

---

## Task 5: Wire slide components into the deck + build Slide 1 (Cover)

From here, each slide task creates a component and swaps it into the deck's `SLIDES` array (replacing the matching placeholder). This task also replaces the placeholder `SLIDES` array and the inline counter with the `Counter` primitive.

**Files:**
- Create: `app/HA-DrawingAnalyzer/presentation/slides/Slide01Cover.tsx`
- Modify: `app/HA-DrawingAnalyzer/presentation/PresentationDeck.tsx`

- [ ] **Step 1: Create the Cover slide**

`app/HA-DrawingAnalyzer/presentation/slides/Slide01Cover.tsx`:

```tsx
// app/HA-DrawingAnalyzer/presentation/slides/Slide01Cover.tsx
import { SlideShell } from '../primitives'

export default function Slide01Cover() {
  return (
    <SlideShell eyebrow="Autodesk · Product Manager">
      <h1 className="font-serif text-[clamp(40px,7vw,84px)] leading-[1.02] text-black">AI Drawing Analyzer</h1>
      <p className="mt-4 font-serif text-[clamp(18px,2.4vw,30px)] text-charcoal">Product Opportunities &amp; MVP Recommendation</p>
      <p className="mt-10 font-sans text-[14px] uppercase tracking-[0.12em] text-charcoal/60">Eliahu Cohen</p>
    </SlideShell>
  )
}
```

- [ ] **Step 2: Replace the placeholder `SLIDES` array and counter in the deck**

In `PresentationDeck.tsx`, add imports near the top (after the nav import):

```tsx
import { Counter } from './primitives'
import Slide01Cover from './slides/Slide01Cover'
```

Replace the placeholder `SLIDES` definition with a typed array that we fill in over subsequent tasks (placeholders remain for not-yet-built slides):

```tsx
const placeholder = (n: number) => (
  <div className="flex h-full w-full items-center justify-center">
    <span className="font-serif text-[64px] text-black">Slide {n}</span>
  </div>
)

const SLIDES: ReactNode[] = [
  <Slide01Cover key="1" />,
  ...Array.from({ length: 16 }, (_, i) => placeholder(i + 2)),
]
```

Replace the inline `<p className="deck-counter …">{current + 1} / {total}</p>` line with:

```tsx
          <Counter index={current} total={total} />
```

(Keep the mobile/print stack mapping as-is.)

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` (clean). `npm run dev` → slide 1 shows the cover; slides 2–17 still show placeholders.

- [ ] **Step 4: Commit**

```bash
git add app/HA-DrawingAnalyzer/presentation/slides/Slide01Cover.tsx app/HA-DrawingAnalyzer/presentation/PresentationDeck.tsx
git commit -m "feat(presentation): slide 1 cover + wire slide array and Counter"
```

---

## Task 6: Slide 4 — Selected Use Cases (table with medals)

**Files:**
- Create: `app/HA-DrawingAnalyzer/presentation/slides/Slide04SelectedUseCases.tsx`
- Modify: `app/HA-DrawingAnalyzer/presentation/PresentationDeck.tsx`

- [ ] **Step 1: Create the slide**

`app/HA-DrawingAnalyzer/presentation/slides/Slide04SelectedUseCases.tsx`:

```tsx
// app/HA-DrawingAnalyzer/presentation/slides/Slide04SelectedUseCases.tsx
import { SlideShell } from '../primitives'
import { USE_CASES } from '../deckData'

const MEDALS = ['🥇', '🥈', '🥉', '']

// Plain-language title for the cover row (strips the parenthetical subtitle).
function shortTitle(t: string): string {
  return t.split('\n')[0].replace(/\s*\(.*\)\s*$/, '')
}

export default function Slide04SelectedUseCases() {
  return (
    <SlideShell eyebrow="Use cases" title="Four opportunities, one framework">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b-2 border-autodesk-blue">
            <th className="py-3 pr-4 font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/70">Use case</th>
            <th className="px-4 py-3 font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/70">Primary user</th>
            <th className="pl-4 py-3 font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/70">Phase</th>
          </tr>
        </thead>
        <tbody>
          {USE_CASES.map((uc, i) => (
            <tr key={uc.id} className="border-b border-charcoal/15">
              <td className="py-4 pr-4 font-serif text-[20px] text-black">
                <span className="mr-2" aria-hidden="true">{MEDALS[i]}</span>{shortTitle(uc.title)}
              </td>
              <td className="px-4 py-4 font-sans text-[14px] text-charcoal">{uc.primaryUser.pill}</td>
              <td className="pl-4 py-4 font-sans text-[14px] text-charcoal/70">{uc.constructionPhase.name.split('/')[0].trim()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </SlideShell>
  )
}
```

- [ ] **Step 2: Wire into the deck**

In `PresentationDeck.tsx` add `import Slide04SelectedUseCases from './slides/Slide04SelectedUseCases'` and set index 3 of `SLIDES` to `<Slide04SelectedUseCases key="4" />` (replace the corresponding `placeholder(4)`). The cleanest pattern: build the array explicitly. After this task `SLIDES` reads:

```tsx
const SLIDES: ReactNode[] = [
  <Slide01Cover key="1" />,
  placeholder(2),
  placeholder(3),
  <Slide04SelectedUseCases key="4" />,
  ...Array.from({ length: 13 }, (_, i) => placeholder(i + 5)),
]
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` (clean). Dev: slide 4 shows the four use cases with 🥇🥈🥉.

- [ ] **Step 4: Commit**

```bash
git add app/HA-DrawingAnalyzer/presentation/slides/Slide04SelectedUseCases.tsx app/HA-DrawingAnalyzer/presentation/PresentationDeck.tsx
git commit -m "feat(presentation): slide 4 selected use cases table"
```

---

## Task 7: Slides 5–8 — Use-case spotlights (one parametrized component)

**Files:**
- Create: `app/HA-DrawingAnalyzer/presentation/slides/SlideUseCase.tsx`
- Modify: `app/HA-DrawingAnalyzer/presentation/PresentationDeck.tsx`

- [ ] **Step 1: Create the parametrized spotlight**

`app/HA-DrawingAnalyzer/presentation/slides/SlideUseCase.tsx`:

```tsx
// app/HA-DrawingAnalyzer/presentation/slides/SlideUseCase.tsx
import { SlideShell } from '../primitives'
import type { UseCaseData } from '@/app/HA-DrawingAnalyzer/sections/UseCase'

export default function SlideUseCase({ data, index }: { data: UseCaseData; index: number }) {
  const title = data.title.split('\n')[0]
  return (
    <SlideShell eyebrow={`Use Case ${index}`}>
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <h2 className="font-serif text-[clamp(28px,3.5vw,46px)] leading-[1.05] text-black">{title}</h2>
          <div className="mt-6 flex flex-col gap-3">
            <p className="font-sans text-[13px]"><span className="font-bold uppercase tracking-[0.12em] text-charcoal">User</span><span className="ml-3 text-charcoal">{data.primaryUser.pill}</span></p>
            <p className="font-sans text-[13px]"><span className="font-bold uppercase tracking-[0.12em] text-charcoal">Phase</span><span className="ml-3 text-charcoal">{data.constructionPhase.name}</span></p>
          </div>
          <p className="mt-6 font-sans text-[17px] leading-relaxed text-charcoal">{data.problem.intro}</p>
        </div>
        {data.opportunity.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.opportunity.image} alt="" className="w-full rounded-lg border-2 border-autodesk-blue/60" />
        )}
      </div>
    </SlideShell>
  )
}
```

- [ ] **Step 2: Wire slides 5–8 into the deck**

In `PresentationDeck.tsx` add:

```tsx
import SlideUseCase from './slides/SlideUseCase'
import { USE_CASES } from './deckData'
```

Set the array indices 4–7 (slides 5–8) to the four spotlights:

```tsx
const SLIDES: ReactNode[] = [
  <Slide01Cover key="1" />,
  placeholder(2),
  placeholder(3),
  <Slide04SelectedUseCases key="4" />,
  <SlideUseCase key="5" data={USE_CASES[0]} index={1} />,
  <SlideUseCase key="6" data={USE_CASES[1]} index={2} />,
  <SlideUseCase key="7" data={USE_CASES[2]} index={3} />,
  <SlideUseCase key="8" data={USE_CASES[3]} index={4} />,
  ...Array.from({ length: 9 }, (_, i) => placeholder(i + 9)),
]
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` (clean). Dev: slides 5–8 each show a use case (text left, mockup right, using the existing `/drawinganalyzer/use-case-N.png` images).

- [ ] **Step 4: Commit**

```bash
git add app/HA-DrawingAnalyzer/presentation/slides/SlideUseCase.tsx app/HA-DrawingAnalyzer/presentation/PresentationDeck.tsx
git commit -m "feat(presentation): slides 5-8 use-case spotlights"
```

---

## Task 8: Slide 9 — Assumptions

**Files:**
- Create: `app/HA-DrawingAnalyzer/presentation/slides/Slide09Assumptions.tsx`
- Modify: `PresentationDeck.tsx`

- [ ] **Step 1: Create the slide**

`app/HA-DrawingAnalyzer/presentation/slides/Slide09Assumptions.tsx`:

```tsx
// app/HA-DrawingAnalyzer/presentation/slides/Slide09Assumptions.tsx
import { SlideShell } from '../primitives'
import { ASSUMPTIONS } from '../deckData'

export default function Slide09Assumptions() {
  return (
    <SlideShell eyebrow="Assumptions" title="What this rests on">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {ASSUMPTIONS.map((a, i) => (
          <div key={i} className="border-l-4 border-charcoal/30 pl-4">
            <p className="font-sans text-[15px] leading-relaxed text-charcoal">{a}</p>
          </div>
        ))}
      </div>
    </SlideShell>
  )
}
```

- [ ] **Step 2: Wire index 8 (slide 9)** — add `import Slide09Assumptions from './slides/Slide09Assumptions'` and set `SLIDES[8] = <Slide09Assumptions key="9" />` by replacing `placeholder(9)` in the explicit array.

- [ ] **Step 3: Verify** — `npx tsc --noEmit` clean; dev slide 9 shows assumption cards.

- [ ] **Step 4: Commit**

```bash
git add app/HA-DrawingAnalyzer/presentation/slides/Slide09Assumptions.tsx app/HA-DrawingAnalyzer/presentation/PresentationDeck.tsx
git commit -m "feat(presentation): slide 9 assumptions"
```

---

## Task 9: Slide 10 — Prioritization Framework

**Files:**
- Create: `app/HA-DrawingAnalyzer/presentation/slides/Slide10Framework.tsx`
- Modify: `PresentationDeck.tsx`

- [ ] **Step 1: Create the slide**

`app/HA-DrawingAnalyzer/presentation/slides/Slide10Framework.tsx`:

```tsx
// app/HA-DrawingAnalyzer/presentation/slides/Slide10Framework.tsx
import { SlideShell } from '../primitives'
import { CRITERIA_DEFS } from '../deckData'

export default function Slide10Framework() {
  return (
    <SlideShell eyebrow="Prioritization" title="Four criteria, scored 1–5">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {CRITERIA_DEFS.map(({ title, body, rubric }) => (
          <div key={title} className="border-l-4 border-charcoal pl-4">
            <p className="font-serif text-[20px] text-black">{title}</p>
            <p className="mt-1 font-sans text-[13px] italic leading-relaxed text-charcoal/80">{body}</p>
            <div className="mt-2 flex flex-col gap-0.5">
              {rubric.map(([score, desc]) => (
                <p key={score} className="font-sans text-[13px] leading-relaxed text-charcoal/70">
                  <span className="font-bold text-charcoal">{score}</span>
                  <span className="text-charcoal/40"> — </span>{desc}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SlideShell>
  )
}
```

- [ ] **Step 2: Wire index 9 (slide 10)** — import and replace `placeholder(10)` with `<Slide10Framework key="10" />`.

- [ ] **Step 3: Verify** — `npx tsc --noEmit` clean; dev slide 10.

- [ ] **Step 4: Commit**

```bash
git add app/HA-DrawingAnalyzer/presentation/slides/Slide10Framework.tsx app/HA-DrawingAnalyzer/presentation/PresentationDeck.tsx
git commit -m "feat(presentation): slide 10 prioritization framework"
```

---

## Task 10: Slide 11 — Prioritization Results

**Files:**
- Create: `app/HA-DrawingAnalyzer/presentation/slides/Slide11Results.tsx`
- Modify: `PresentationDeck.tsx`

- [ ] **Step 1: Create the slide**

`app/HA-DrawingAnalyzer/presentation/slides/Slide11Results.tsx`:

```tsx
// app/HA-DrawingAnalyzer/presentation/slides/Slide11Results.tsx
import { SlideShell, ScoreTable } from '../primitives'
import { CRITERIA, SCORE_ROWS } from '../deckData'

export default function Slide11Results() {
  return (
    <SlideShell eyebrow="Prioritization" title="Change Validation scores highest">
      <ScoreTable criteria={CRITERIA} rows={SCORE_ROWS} />
    </SlideShell>
  )
}
```

- [ ] **Step 2: Wire index 10 (slide 11)** — import and replace `placeholder(11)` with `<Slide11Results key="11" />`.

- [ ] **Step 3: Verify** — `npx tsc --noEmit` clean; dev slide 11 shows the table with the Change Validation row highlighted blue.

- [ ] **Step 4: Commit**

```bash
git add app/HA-DrawingAnalyzer/presentation/slides/Slide11Results.tsx app/HA-DrawingAnalyzer/presentation/PresentationDeck.tsx
git commit -m "feat(presentation): slide 11 prioritization results"
```

---

## Task 11: Slide 12 — Recommendation

**Files:**
- Create: `app/HA-DrawingAnalyzer/presentation/slides/Slide12Recommendation.tsx`
- Modify: `PresentationDeck.tsx`

- [ ] **Step 1: Create the slide**

`app/HA-DrawingAnalyzer/presentation/slides/Slide12Recommendation.tsx`:

```tsx
// app/HA-DrawingAnalyzer/presentation/slides/Slide12Recommendation.tsx
import { SlideShell } from '../primitives'
import { RECOMMENDATION_PILLARS } from '../deckData'

export default function Slide12Recommendation() {
  return (
    <SlideShell eyebrow="Recommendation">
      <h2 className="font-serif text-[clamp(34px,5.5vw,68px)] leading-[1.04] text-black">
        Build <span className="text-autodesk-blue">Change Validation</span> first.
      </h2>
      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {RECOMMENDATION_PILLARS.map((p) => (
          <div key={p.title} className="border-t-2 border-autodesk-blue pt-4">
            <p className="font-serif text-[22px] text-black">{p.title}</p>
            <p className="mt-2 font-sans text-[14px] leading-relaxed text-charcoal">{p.body}</p>
          </div>
        ))}
      </div>
    </SlideShell>
  )
}
```

- [ ] **Step 2: Wire index 11 (slide 12)** — import and replace `placeholder(12)` with `<Slide12Recommendation key="12" />`.

- [ ] **Step 3: Verify** — `npx tsc --noEmit` clean; dev slide 12.

- [ ] **Step 4: Commit**

```bash
git add app/HA-DrawingAnalyzer/presentation/slides/Slide12Recommendation.tsx app/HA-DrawingAnalyzer/presentation/PresentationDeck.tsx
git commit -m "feat(presentation): slide 12 recommendation"
```

---

## Task 12: Slide 13 — Workflow (Current vs Proposed)

**Files:**
- Create: `app/HA-DrawingAnalyzer/presentation/slides/Slide13Workflow.tsx`
- Modify: `PresentationDeck.tsx`

- [ ] **Step 1: Create the slide**

`app/HA-DrawingAnalyzer/presentation/slides/Slide13Workflow.tsx`:

```tsx
// app/HA-DrawingAnalyzer/presentation/slides/Slide13Workflow.tsx
import { SlideShell, MiniWorkflow } from '../primitives'
import { USE_CASES } from '../deckData'

export default function Slide13Workflow() {
  const cv = USE_CASES[0]
  return (
    <SlideShell eyebrow="Change Validation" title="From repeated cycles to first-pass approval">
      <MiniWorkflow current={cv.currentWorkflow.steps} proposed={cv.proposedWorkflow.steps} />
    </SlideShell>
  )
}
```

- [ ] **Step 2: Wire index 12 (slide 13)** — import and replace `placeholder(13)` with `<Slide13Workflow key="13" />`.

- [ ] **Step 3: Verify** — `npx tsc --noEmit` clean; dev slide 13 shows two lanes with glyphs.

- [ ] **Step 4: Commit**

```bash
git add app/HA-DrawingAnalyzer/presentation/slides/Slide13Workflow.tsx app/HA-DrawingAnalyzer/presentation/PresentationDeck.tsx
git commit -m "feat(presentation): slide 13 workflow comparison"
```

---

## Task 13: Slide 14 — Value & Risks (headings only)

**Files:**
- Create: `app/HA-DrawingAnalyzer/presentation/slides/Slide14ValueRisks.tsx`
- Modify: `PresentationDeck.tsx`

- [ ] **Step 1: Create the slide**

`app/HA-DrawingAnalyzer/presentation/slides/Slide14ValueRisks.tsx`:

```tsx
// app/HA-DrawingAnalyzer/presentation/slides/Slide14ValueRisks.tsx
import { SlideShell, MiniCard } from '../primitives'
import { USE_CASES } from '../deckData'

export default function Slide14ValueRisks() {
  const cv = USE_CASES[0]
  return (
    <SlideShell eyebrow="Change Validation" title="Value & risks">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <p className="mb-4 font-sans text-[12px] font-bold uppercase tracking-[0.12em] text-autodesk-blue">Value</p>
          <div className="flex flex-col gap-3">
            {cv.value.map((v) => <MiniCard key={v.title} title={v.title} tone="value" />)}
          </div>
        </div>
        <div>
          <p className="mb-4 font-sans text-[12px] font-bold uppercase tracking-[0.12em] text-[#caa000]">Risks</p>
          <div className="flex flex-col gap-3">
            {cv.tradeoffs.map((r) => <MiniCard key={r.title} title={r.title} tone="risk" />)}
          </div>
        </div>
      </div>
    </SlideShell>
  )
}
```

- [ ] **Step 2: Wire index 13 (slide 14)** — import and replace `placeholder(14)` with `<Slide14ValueRisks key="14" />`.

- [ ] **Step 3: Verify** — `npx tsc --noEmit` clean; dev slide 14 shows heading-only cards.

- [ ] **Step 4: Commit**

```bash
git add app/HA-DrawingAnalyzer/presentation/slides/Slide14ValueRisks.tsx app/HA-DrawingAnalyzer/presentation/PresentationDeck.tsx
git commit -m "feat(presentation): slide 14 value & risks"
```

---

## Task 14: Slide 15 — MVP Scope

**Files:**
- Create: `app/HA-DrawingAnalyzer/presentation/slides/Slide15MvpScope.tsx`
- Modify: `PresentationDeck.tsx`

- [ ] **Step 1: Create the slide**

`app/HA-DrawingAnalyzer/presentation/slides/Slide15MvpScope.tsx`:

```tsx
// app/HA-DrawingAnalyzer/presentation/slides/Slide15MvpScope.tsx
import { SlideShell } from '../primitives'
import { SCOPE_IN, SCOPE_OUT } from '../deckData'

export default function Slide15MvpScope() {
  return (
    <SlideShell eyebrow="MVP" title="Scope">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div>
          <p className="mb-4 font-sans text-[12px] font-bold uppercase tracking-[0.12em] text-autodesk-blue">In scope</p>
          <ul className="flex flex-col gap-3">
            {SCOPE_IN.map((s, i) => (
              <li key={i} className="flex gap-2 font-sans text-[16px] leading-relaxed text-charcoal">
                <span className="mt-0.5 shrink-0 font-bold text-autodesk-blue" aria-hidden="true">✓</span><span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-4 font-sans text-[12px] font-bold uppercase tracking-[0.12em] text-charcoal/50">Out of scope</p>
          <ul className="flex flex-col gap-3">
            {SCOPE_OUT.map((s, i) => (
              <li key={i} className="flex gap-2 font-sans text-[16px] leading-relaxed text-charcoal/60">
                <span className="mt-0.5 shrink-0 font-bold text-charcoal/40" aria-hidden="true">✕</span><span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SlideShell>
  )
}
```

- [ ] **Step 2: Wire index 14 (slide 15)** — import and replace `placeholder(15)` with `<Slide15MvpScope key="15" />`.

- [ ] **Step 3: Verify** — `npx tsc --noEmit` clean; dev slide 15.

- [ ] **Step 4: Commit**

```bash
git add app/HA-DrawingAnalyzer/presentation/slides/Slide15MvpScope.tsx app/HA-DrawingAnalyzer/presentation/PresentationDeck.tsx
git commit -m "feat(presentation): slide 15 mvp scope"
```

---

## Task 15: Slide 16 — Interactive Prototype (reused DemoVideo + button)

**Files:**
- Create: `app/HA-DrawingAnalyzer/presentation/slides/Slide16Prototype.tsx`
- Modify: `PresentationDeck.tsx`

- [ ] **Step 1: Create the slide**

`app/HA-DrawingAnalyzer/presentation/slides/Slide16Prototype.tsx`:

```tsx
// app/HA-DrawingAnalyzer/presentation/slides/Slide16Prototype.tsx
import { SlideShell } from '../primitives'
import DemoVideo from '@/app/HA-DrawingAnalyzer/sections/DemoVideo'
import { DEMO_HREF } from '../deckData'

export default function Slide16Prototype() {
  return (
    <SlideShell eyebrow="Prototype" title="Change Validation, interactive">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
        <DemoVideo />
        <div className="flex flex-col items-start gap-5">
          <p className="font-sans text-[16px] leading-relaxed text-charcoal">
            A working prototype that simulates the Change Validation flow inside Autodesk Forma.
          </p>
          <a
            href={DEMO_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-sm bg-autodesk-blue px-5 py-3 font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-white no-underline hover:opacity-90"
          >
            Open interactive prototype ↗
          </a>
          <p className="font-sans text-[12px] tracking-[0.06em] text-charcoal/60">eliahu.co/HA-DrawingAnalyzer/demo</p>
        </div>
      </div>
    </SlideShell>
  )
}
```

- [ ] **Step 2: Wire index 15 (slide 16)** — import and replace `placeholder(16)` with `<Slide16Prototype key="16" />`.

- [ ] **Step 3: Verify** — `npx tsc --noEmit` clean. Dev: slide 16 shows the poster/play video and the button (opens the demo in a new tab). Confirm pressing Space while the video is focused/playing does NOT advance the slide (the keydown guard skips `VIDEO`/`BUTTON`/`A` targets).

- [ ] **Step 4: Commit**

```bash
git add app/HA-DrawingAnalyzer/presentation/slides/Slide16Prototype.tsx app/HA-DrawingAnalyzer/presentation/PresentationDeck.tsx
git commit -m "feat(presentation): slide 16 prototype (DemoVideo + button)"
```

---

## Task 16: Slide 17 — Key Unknowns to Validate

**Files:**
- Create: `app/HA-DrawingAnalyzer/presentation/slides/Slide17KeyUnknowns.tsx`
- Modify: `PresentationDeck.tsx`

- [ ] **Step 1: Create the slide**

`app/HA-DrawingAnalyzer/presentation/slides/Slide17KeyUnknowns.tsx`:

```tsx
// app/HA-DrawingAnalyzer/presentation/slides/Slide17KeyUnknowns.tsx
import { SlideShell } from '../primitives'
import { VARIABLES } from '../deckData'

export default function Slide17KeyUnknowns() {
  return (
    <SlideShell eyebrow="Feasibility" title="Key unknowns to validate">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {VARIABLES.map(({ label, body }) => (
          <div key={label}>
            <p className="mb-2 font-serif text-[24px] text-autodesk-blue">{label}</p>
            <p className="font-sans text-[15px] leading-relaxed text-charcoal">{body}</p>
          </div>
        ))}
      </div>
    </SlideShell>
  )
}
```

- [ ] **Step 2: Wire index 16 (slide 17)** — import and replace `placeholder(17)` with `<Slide17KeyUnknowns key="17" />`.

- [ ] **Step 3: Verify** — `npx tsc --noEmit` clean; dev slide 17.

- [ ] **Step 4: Commit**

```bash
git add app/HA-DrawingAnalyzer/presentation/slides/Slide17KeyUnknowns.tsx app/HA-DrawingAnalyzer/presentation/PresentationDeck.tsx
git commit -m "feat(presentation): slide 17 key unknowns"
```

---

## Task 17: Slide 3 — Approach

**Files:**
- Create: `app/HA-DrawingAnalyzer/presentation/slides/Slide03Approach.tsx`
- Modify: `PresentationDeck.tsx`

- [ ] **Step 1: Create the slide**

`app/HA-DrawingAnalyzer/presentation/slides/Slide03Approach.tsx`:

```tsx
// app/HA-DrawingAnalyzer/presentation/slides/Slide03Approach.tsx
import { SlideShell } from '../primitives'
import { APPROACH_PHASES, APPROACH_FLOW } from '../deckData'

export default function Slide03Approach() {
  return (
    <SlideShell eyebrow="Approach" title="From lifecycle to MVP">
      <div className="mb-10">
        <p className="mb-3 font-sans text-[12px] uppercase tracking-[0.12em] text-charcoal/60">Construction lifecycle</p>
        <div className="flex flex-wrap gap-2">
          {APPROACH_PHASES.map((p) => (
            <span key={p} className="rounded-sm border-2 border-charcoal/40 px-3 py-1 font-sans text-[13px] text-charcoal">{p}</span>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {APPROACH_FLOW.map((f, i) => (
          <span key={f} className="flex items-center gap-3">
            <span className="font-serif text-[22px] text-black">{f}</span>
            {i < APPROACH_FLOW.length - 1 && <span className="text-autodesk-blue" aria-hidden="true">→</span>}
          </span>
        ))}
      </div>
    </SlideShell>
  )
}
```

- [ ] **Step 2: Wire index 2 (slide 3)** — import and replace `placeholder(3)` with `<Slide03Approach key="3" />`.

- [ ] **Step 3: Verify** — `npx tsc --noEmit` clean; dev slide 3 shows phase chips + the flow.

- [ ] **Step 4: Commit**

```bash
git add app/HA-DrawingAnalyzer/presentation/slides/Slide03Approach.tsx app/HA-DrawingAnalyzer/presentation/PresentationDeck.tsx
git commit -m "feat(presentation): slide 3 approach"
```

---

## Task 18: Slide 2 — About Me (placeholder content stub)

This slide's copy/photo are author-supplied. Build the layout with clearly-marked TODO content so it's ready to fill in.

**Files:**
- Create: `app/HA-DrawingAnalyzer/presentation/slides/Slide02AboutMe.tsx`
- Modify: `PresentationDeck.tsx`

- [ ] **Step 1: Create the slide**

`app/HA-DrawingAnalyzer/presentation/slides/Slide02AboutMe.tsx`:

```tsx
// app/HA-DrawingAnalyzer/presentation/slides/Slide02AboutMe.tsx
// NOTE: copy and photo are author-supplied. Values below are placeholders
// marked TODO — replace before presenting.
import { SlideShell } from '../primitives'

const TIMELINE = ['Brazil', 'Netherlands', 'Israel'] // TODO: confirm/expand

export default function Slide02AboutMe() {
  return (
    <SlideShell eyebrow="About" title="Architect · Product Manager · Builder">
      <div className="flex flex-wrap items-center gap-3">
        {TIMELINE.map((place, i) => (
          <span key={place} className="flex items-center gap-3">
            <span className="font-serif text-[26px] text-black">{place}</span>
            {i < TIMELINE.length - 1 && <span className="text-autodesk-blue" aria-hidden="true">→</span>}
          </span>
        ))}
      </div>
      <p className="mt-8 font-sans text-[18px] leading-relaxed text-charcoal">
        {/* TODO: replace with real bio */}
        Six years in ConTech across product and engineering — owning product
        lifecycles and shipping production code alongside the team.
      </p>
    </SlideShell>
  )
}
```

- [ ] **Step 2: Wire index 1 (slide 2)** — import and replace `placeholder(2)` with `<Slide02AboutMe key="2" />`. After this task there are no `placeholder(...)` calls left; remove the now-unused `placeholder` helper from `PresentationDeck.tsx`.

The final `SLIDES` array:

```tsx
const SLIDES: ReactNode[] = [
  <Slide01Cover key="1" />,
  <Slide02AboutMe key="2" />,
  <Slide03Approach key="3" />,
  <Slide04SelectedUseCases key="4" />,
  <SlideUseCase key="5" data={USE_CASES[0]} index={1} />,
  <SlideUseCase key="6" data={USE_CASES[1]} index={2} />,
  <SlideUseCase key="7" data={USE_CASES[2]} index={3} />,
  <SlideUseCase key="8" data={USE_CASES[3]} index={4} />,
  <Slide09Assumptions key="9" />,
  <Slide10Framework key="10" />,
  <Slide11Results key="11" />,
  <Slide12Recommendation key="12" />,
  <Slide13Workflow key="13" />,
  <Slide14ValueRisks key="14" />,
  <Slide15MvpScope key="15" />,
  <Slide16Prototype key="16" />,
  <Slide17KeyUnknowns key="17" />,
]
```

- [ ] **Step 3: Verify** — `npx tsc --noEmit` clean; dev: all 17 slides real, no "Slide N" placeholders remain.

- [ ] **Step 4: Commit**

```bash
git add app/HA-DrawingAnalyzer/presentation/slides/Slide02AboutMe.tsx app/HA-DrawingAnalyzer/presentation/PresentationDeck.tsx
git commit -m "feat(presentation): slide 2 about me (placeholder copy); finalize slide array"
```

---

## Task 19: Full verification + acceptance

**Files:** none (verification only) — fix-ups land in the relevant file if a check fails.

- [ ] **Step 1: Types + tests + production build**

Run: `npx tsc --noEmit` → clean.
Run: `npx jest presentation-nav` → PASS.
Run: `npm run build` → builds successfully and lists `/HA-DrawingAnalyzer/presentation` in the route output.

- [ ] **Step 2: Existing-route safety guard**

Run: `git diff --name-only main -- app/HA-DrawingAnalyzer | grep -v "/presentation/"`
Expected: prints nothing.

Run: `git diff --stat main -- app/ components/ lib/ | grep -v "presentation"`
Expected: no existing app/component/lib files changed (only new presentation files and the nav test appear in the full diff).

- [ ] **Step 3: Manual acceptance pass (`npm run dev`)**

Open `http://localhost:3000/HA-DrawingAnalyzer/presentation` and confirm:
- 17 slides, all with real content (slide 2 has placeholder copy as intended).
- ←/→, Space/Shift+Space navigate; Escape returns to `/HA-DrawingAnalyzer`.
- Counter reads "n / 17" and updates; URL hash updates to `#slide-n`; loading `…/presentation#slide-11` starts on slide 11.
- Crossfade ~250ms.
- Print preview (Ctrl+P): slides linearize one-per-page, counter hidden.
- Narrow viewport (<1024px): slides stack and scroll vertically.
- Open `/HA-DrawingAnalyzer` and confirm it is visually unchanged.

- [ ] **Step 4: Final commit (if any fix-ups were needed)**

```bash
git add -A
git commit -m "chore(presentation): final verification fix-ups"
```

(If no fix-ups, skip.)

---

## Notes for the executor

- **Never edit files outside `app/HA-DrawingAnalyzer/presentation/` and `__tests__/presentation-nav.test.ts`.** Reuse existing components/data by import only.
- **Do not commit to `main`.** All commits land on `feature/presentation`.
- **TODO content** (slide 2 bio/photo, recommendation pillar wording, approach phase labels) is intentionally placeholder — leave the `TODO` comments so the author can find them.
- The `MEDALS` array on slide 4 has a trailing empty string so the 4th row renders no medal; matches the page's top-3 treatment.
