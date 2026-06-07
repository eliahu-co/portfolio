# Presentation — Autodesk Brand Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand the `/HA-DrawingAnalyzer/presentation` deck to Autodesk standards — Inter (no serif), bigger weight-driven type, black/white + Hello Yellow `#ffff00` (no blue), square images, heavier/neutral borders, user-as-pill, no repeated "Phase"/"User" labels.

**Architecture:** Inter is loaded via `next/font` inside `presentation/page.tsx` and applied deck-wide through the deck's existing scoped `<style>` (a `font-family … !important` rule on `.deck-root`), so the serif disappears without touching global config. Every `autodesk-blue` usage in `presentation/**` is recolored to black / slate / `#ffff00` per the spec's role map. Yellow is used only as fills/highlights with black on top.

**Tech Stack:** Next.js 14, React, TypeScript, Tailwind (arbitrary `#ffff00`, no new token), `next/font/google` Inter.

**Branch:** `feature/presentation-graphics`. No edits outside `app/HA-DrawingAnalyzer/presentation/**` (which includes `presentation/page.tsx`). Do NOT touch `sections/DemoVideo.tsx`, `app/layout.tsx`, `tailwind.config.ts`, or any other file.

**Spec:** `docs/superpowers/specs/2026-06-07-presentation-autodesk-brand-design.md`

---

## Task 1: Scoped Inter font + kill serif + heading scale

**Files:**
- Modify: `app/HA-DrawingAnalyzer/presentation/page.tsx`
- Modify: `app/HA-DrawingAnalyzer/presentation/PresentationDeck.tsx`
- Modify: `app/HA-DrawingAnalyzer/presentation/primitives.tsx`

- [ ] **Step 1: Load Inter (scoped) in `page.tsx`**

Replace the contents of `app/HA-DrawingAnalyzer/presentation/page.tsx` with:

```tsx
// app/HA-DrawingAnalyzer/presentation/page.tsx
// Unlisted executive presentation deck. Additive route. Inter is loaded here and
// scoped to the deck (the rest of the site is unaffected).
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import PresentationDeck from './PresentationDeck'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-deck',
  display: 'swap',
})

const OG_IMAGE = 'https://eliahu.co/drawinganalyzer/ha-drawing-analyzer-poster.jpg'

export const metadata: Metadata = {
  title: 'AI Drawing Analyzer — Presentation',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'AI Drawing Analyzer — Presentation',
    url: 'https://eliahu.co/HA-DrawingAnalyzer/presentation',
    type: 'article',
    images: [{ url: OG_IMAGE, width: 1212, height: 681, alt: 'AI Drawing Analyzer' }],
  },
}

export default function PresentationPage() {
  return (
    <div className={inter.variable}>
      <PresentationDeck />
    </div>
  )
}
```

(If the current `page.tsx` has no `openGraph`/metadata beyond title+robots, keep it minimal — the key additions are the `Inter` import, the `inter` instance, and wrapping `<PresentationDeck/>` in `<div className={inter.variable}>`.)

- [ ] **Step 2: Force Inter across the deck via the scoped `<style>`**

In `PresentationDeck.tsx`, inside the existing `<style>{`…`}</style>` block, add as the first rule:

```css
.deck-root, .deck-root * { font-family: var(--font-deck), system-ui, sans-serif !important; }
```

- [ ] **Step 3: Heading scale + black eyebrow in `SlideShell`**

In `primitives.tsx`, update the eyebrow and title classes inside `SlideShell`:

```tsx
{eyebrow && (
  <p className="mb-4 font-sans text-[12px] font-bold uppercase tracking-[0.14em] text-black">{eyebrow}</p>
)}
{title && (
  <h2 className="mb-8 text-[clamp(34px,5vw,64px)] font-extrabold leading-[1.04] tracking-[-0.01em] text-black whitespace-pre-line">{title}</h2>
)}
```

(The `font-serif` class is removed from the title; the deck-wide `font-family` override already neutralizes any remaining `font-serif`/`font-sans`, so this is about weight/size.)

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit` → clean. View `/HA-DrawingAnalyzer/presentation`: no serif anywhere, headlines larger/heavier, eyebrows black.

- [ ] **Step 5: Commit**

```bash
git add app/HA-DrawingAnalyzer/presentation/page.tsx app/HA-DrawingAnalyzer/presentation/PresentationDeck.tsx app/HA-DrawingAnalyzer/presentation/primitives.tsx
git commit -m "feat(presentation): scoped Inter, kill serif, bigger heading scale, black eyebrow"
```

---

## Task 2: Rebrand `ExecWorkflow` (yellow AI step, black emphasis, no blue)

**Files:**
- Modify: `app/HA-DrawingAnalyzer/presentation/ExecWorkflow.tsx`

- [ ] **Step 1: Recolor the connector**

```tsx
function Connector({ proposed }: { proposed: boolean }) {
  const color = proposed ? '#000000' : 'rgba(102,102,102,0.6)'
  return (
    <div className="flex justify-center">
      <svg width="14" height="15" viewBox="0 0 14 15" fill="none" aria-hidden="true" style={{ display: 'block' }}>
        <path d="M7 0 V14" stroke={color} strokeWidth="1" strokeLinecap="round" />
        <path d="M2 10 L7 14 L12 10" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}
```

- [ ] **Step 2: Recolor the step box (yellow AI fill, black emphasis, black pills)**

Replace the `Step` component body's color logic + return with:

```tsx
function Step({ step, proposed }: { step: ExecStep; proposed: boolean }) {
  const kind = step.kind
  const isEmphasis = kind === 'approve'

  let box = proposed ? 'bg-white border-black/55' : 'bg-white border-charcoal/40'
  if (kind === 'ai') box = 'bg-[#ffff00] border-black'
  else if (kind === 'approve') box = 'bg-white border-black'

  const borderW = isEmphasis || kind === 'ai' ? 'border-2' : 'border'
  const labelColor = kind ? 'text-black font-semibold' : proposed ? 'text-black' : 'text-charcoal'

  return (
    <div className={`relative flex items-center gap-2 overflow-hidden rounded-none ${borderW} px-2 py-1.5 ${box}`}>
      <span
        className={`relative shrink-0 leading-none ${kind === 'ai' ? 'text-[16px] font-bold text-black' : 'text-[12px]'} ${
          kind === 'approve' ? 'text-black' : kind === 'ai' ? '' : 'text-transparent'
        }`}
        aria-hidden="true"
      >
        {kind === 'ai' ? '⚡︎' : kind === 'approve' ? '✓' : '•'}
      </span>
      <span className={`relative min-w-0 font-sans text-[10px] leading-snug ${labelColor}`}>{step.label}</span>
      {(kind === 'ai' || step.actor) && (
        <span className="relative ml-auto flex shrink-0 items-center gap-1.5">
          {kind === 'ai' && (
            <span className="rounded-none border border-black bg-black px-1 py-px text-[8px] font-bold uppercase tracking-wider text-white">DA</span>
          )}
          {step.actor && (
            <span className="rounded-none border border-black px-1 py-px text-[8px] font-bold uppercase tracking-wider text-black">{step.actor}</span>
          )}
        </span>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Recolor lane header + footer**

In `Lane`, replace the header/footer color logic:

```tsx
function Lane({ lane, proposed }: { lane: ExecLane; proposed: boolean }) {
  const accent = proposed ? 'text-black' : 'text-charcoal'
  return (
    <div className="flex h-full flex-col">
      <div className={`mb-3 border-b-2 pb-1.5 ${proposed ? 'border-black' : 'border-charcoal/40'}`}>
        <span className={`font-sans text-[10px] font-bold uppercase tracking-[0.12em] ${accent}`}>
          {proposed ? 'Proposed' : 'Current'}
        </span>
      </div>
      <div className="flex flex-col">
        {lane.steps.map((s, i) => (
          <div key={i}>
            <Step step={s} proposed={proposed} />
            {i < lane.steps.length - 1 && <Connector proposed={proposed} />}
          </div>
        ))}
      </div>
      <p className={`mt-auto pt-4 text-[15px] font-bold ${accent}`}>{lane.footer}</p>
    </div>
  )
}
```

- [ ] **Step 4: Verify** — `npx tsc --noEmit` clean; use-case slides show yellow AI step (black ⚡ + black DA pill), black emphasis box, square corners, no blue/glow.

- [ ] **Step 5: Commit**

```bash
git add app/HA-DrawingAnalyzer/presentation/ExecWorkflow.tsx
git commit -m "feat(presentation): rebrand workflow — yellow AI step, black emphasis, square, no blue"
```

---

## Task 3: `SlideUseCase` — user pill (fixed), drop Phase/User labels, square image

**Files:**
- Modify: `app/HA-DrawingAnalyzer/presentation/slides/SlideUseCase.tsx`

- [ ] **Step 1: Replace the meta row + image with a fixed user pill and a square image**

Replace the `SlideUseCase` return body with:

```tsx
export default function SlideUseCase({ data, index }: { data: UseCaseData; index: number }) {
  const title = data.title.split('\n')[0]
  const wf = EXEC_WORKFLOWS[data.id]
  return (
    <SlideShell eyebrow={`Use Case ${index}`} title={title}>
      {/* user pill — fixed top-right of the slide, consistent across use cases */}
      <span className="absolute right-12 top-16 rounded-none bg-black px-2.5 py-1 font-sans text-[11px] font-semibold uppercase tracking-wider text-white lg:right-20 lg:top-20">
        {data.primaryUser.pill}
      </span>

      <div className="mt-2 grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,380px)_1fr]">
        {wf && <ExecWorkflow current={wf.current} proposed={wf.proposed} />}
        {data.opportunity.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.opportunity.image}
            alt=""
            className={
              index === 2
                ? 'mx-auto max-h-[62vh] w-auto object-contain' // portrait — fit by height
                : 'max-h-[84vh] w-full object-contain'
            }
          />
        )}
      </div>
    </SlideShell>
  )
}
```

Notes: removed the `User`/`Phase` text rows; removed `rounded-lg` and the blue border from the image (square, borderless). The pill is positioned with `absolute` relative to the slide section (the slide `<section>` is the positioned ancestor in the deck).

- [ ] **Step 2: Verify** — `npx tsc --noEmit` clean; each use-case slide shows one black user pill top-right, no "USER"/"PHASE" labels, square borderless image.

- [ ] **Step 3: Commit**

```bash
git add app/HA-DrawingAnalyzer/presentation/slides/SlideUseCase.tsx
git commit -m "feat(presentation): user pill (fixed), drop Phase/User labels, square image"
```

---

## Task 4: Rebrand shared primitives (cards, table, mini-workflow)

**Files:**
- Modify: `app/HA-DrawingAnalyzer/presentation/primitives.tsx`

- [ ] **Step 1: `MiniWorkflow` glyph/colors**

In `primitives.tsx` `MiniWorkflow`'s `Lane`, change the proposed accent and AI glyph color from blue to black, and the box borders to black/charcoal (mirror Task 2's palette): proposed header/box `border-black`/`text-black`, current `border-charcoal/40`/`text-charcoal`; AI glyph `text-black`. Replace `text-autodesk-blue` → `text-black` and `border-autodesk-blue/40` → `border-black/55`, `border-autodesk-blue/30` → `border-black/40` within this file's `MiniWorkflow` lane.

- [ ] **Step 2: `MiniCard` — value black, risk yellow**

```tsx
export function MiniCard({ title, tone }: { title: string; tone: 'value' | 'risk' }) {
  const bar = tone === 'value' ? 'border-black' : 'border-[#ffff00]'
  return (
    <div className={`border-l-8 ${bar} pl-4 py-2`}>
      <p className="text-[20px] font-semibold leading-snug text-black">{title}</p>
    </div>
  )
}
```

- [ ] **Step 3: `ScoreTable` — yellow winner band, black accents**

Replace the winner styling and blue accents:

```tsx
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
        <tr className="border-b-2 border-black">
          <th className="py-3 pr-4 font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-charcoal">Use case</th>
          {criteria.map((c) => (
            <th key={c} className="px-3 py-3 text-center font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-charcoal">{c}</th>
          ))}
          <th className="pl-3 py-3 text-center font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-charcoal">Total</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.useCase} className="border-b border-charcoal/15" style={r.winner ? { backgroundColor: '#ffff00' } : undefined}>
            <td className={`py-3 pr-4 font-sans text-[16px] ${r.winner ? 'font-bold text-black' : 'text-charcoal'}`}>{r.useCase}</td>
            {r.scores.map((s, i) => (
              <td key={i} className={`px-3 py-3 text-center font-sans text-[16px] ${r.winner ? 'text-black' : 'text-charcoal/70'}`}>{s}</td>
            ))}
            <td className={`pl-3 py-3 text-center font-sans text-[18px] font-bold text-black`}>{r.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

- [ ] **Step 4: Verify** — `npx tsc --noEmit` clean; slide 11 winner row is a yellow band with black text; slide 14 value bars black, risk bars yellow.

- [ ] **Step 5: Commit**

```bash
git add app/HA-DrawingAnalyzer/presentation/primitives.tsx
git commit -m "feat(presentation): rebrand primitives — yellow winner band, value black/risk yellow, no blue"
```

---

## Task 5: Recolor slides — Cover, About, Approach

**Files:**
- Modify: `app/HA-DrawingAnalyzer/presentation/slides/Slide01Cover.tsx`
- Modify: `app/HA-DrawingAnalyzer/presentation/slides/Slide02AboutMe.tsx`
- Modify: `app/HA-DrawingAnalyzer/presentation/slides/Slide03Approach.tsx`

- [ ] **Step 1: Cover** — ensure title/subtitle are black and heavy; the cover image is already full-bleed `object-cover` (no rounding). If the `<h1>`/subtitle use `font-serif`, the deck override neutralizes it; bump the h1 to `font-extrabold`. No blue present. (Eyebrow already black via SlideShell? Cover passes its own markup — set eyebrow text `text-black`.) Keep the `bg-white/80` scrim.

- [ ] **Step 2: About** — square the family photo and drop shadow: change `rounded-lg shadow-sm` → `` (remove both; keep `w-full max-w-[300px]`). Timeline place text `text-autodesk-blue` → `text-black`; the `→` separators `text-autodesk-blue` → `text-black`; bullet `—` markers `text-autodesk-blue` → `text-black`. Keep the invisible-marker alignment span.

- [ ] **Step 3: Approach** — recolor lifecycle to black: circle border `border-autodesk-blue` → `border-black`; initials `text-autodesk-blue` → `text-black`; stage label `text-autodesk-blue` → `text-black`; bracket `border-autodesk-blue/70` → `border-black`; keep `opacity-30`/`opacity-50` muting on BP/BN/Pricing. Flow arrows already black. Phase names stay charcoal.

- [ ] **Step 4: Verify** — `npx tsc --noEmit` clean; cover/about/approach show square images and black (no blue) accents.

- [ ] **Step 5: Commit**

```bash
git add app/HA-DrawingAnalyzer/presentation/slides/Slide01Cover.tsx app/HA-DrawingAnalyzer/presentation/slides/Slide02AboutMe.tsx app/HA-DrawingAnalyzer/presentation/slides/Slide03Approach.tsx
git commit -m "feat(presentation): rebrand cover/about/approach — square images, black accents"
```

---

## Task 6: Recolor slides — Selected, Framework, Results, Recommendation, MVP, Prototype, Key Unknowns

**Files:**
- Modify: `app/HA-DrawingAnalyzer/presentation/slides/Slide04SelectedUseCases.tsx`
- Modify: `app/HA-DrawingAnalyzer/presentation/slides/Slide10Framework.tsx`
- Modify: `app/HA-DrawingAnalyzer/presentation/slides/Slide12Recommendation.tsx`
- Modify: `app/HA-DrawingAnalyzer/presentation/slides/Slide15MvpScope.tsx`
- Modify: `app/HA-DrawingAnalyzer/presentation/slides/Slide16Prototype.tsx`
- Modify: `app/HA-DrawingAnalyzer/presentation/slides/Slide17KeyUnknowns.tsx`
- (Slide11Results / Slide13Workflow / Slide14ValueRisks inherit from Task 4 primitives — no direct edits unless they carry blue classes; verify.)

- [ ] **Step 1: Selected Use Cases** — replace the winner row's blue shimmer with a static yellow band and remove the `cv-shine` `<style>`. Set the winner `<tr>`:

```tsx
<tr
  key={uc.id}
  className="border-b border-charcoal/15"
  style={i === 0 ? { backgroundColor: '#ffff00' } : undefined}
>
  <td className={`py-4 pr-4 text-[20px] font-semibold text-black`}>
    <span className="mr-2 inline-block w-7 text-center" aria-hidden="true">{MEDALS[i]}</span>{shortTitle(uc.title)}
  </td>
  …
</tr>
```

Also: table header underline `border-autodesk-blue` → `border-black`. Delete the entire `<style>{`… cv-shine …`}</style>` block.

- [ ] **Step 2: Framework** — criterion left bar `border-charcoal` stays; any `text-autodesk-blue` → `text-black`; numbers/labels black. (Mostly charcoal already — swap any blue.)

- [ ] **Step 3: Recommendation** — the highlighted word becomes black text on a yellow highlight:

```tsx
<h2 className="text-[clamp(34px,5.5vw,68px)] font-extrabold leading-[1.04] text-black">
  Build <span className="bg-[#ffff00] px-2 text-black">Change Validation</span> first.
</h2>
```

Pillar top border `border-autodesk-blue` → `border-black`; pillar titles black.

- [ ] **Step 4: MVP Scope** — "In scope" label `text-autodesk-blue` → `text-black`; check `✓` marker `text-autodesk-blue` → `text-black`. Out-of-scope stays charcoal.

- [ ] **Step 5: Prototype** — button `bg-autodesk-blue` → `bg-black`; keep `text-white`. URL/description text black/charcoal. `DemoVideo` import unchanged.

- [ ] **Step 6: Key Unknowns** — label `text-autodesk-blue` → `text-black`.

- [ ] **Step 7: Verify** — `npx tsc --noEmit` clean; slide 4 winner is a yellow band (no animation); recommendation key phrase is black-on-yellow; prototype button black; no blue anywhere.

- [ ] **Step 8: Commit**

```bash
git add app/HA-DrawingAnalyzer/presentation/slides/Slide04SelectedUseCases.tsx app/HA-DrawingAnalyzer/presentation/slides/Slide10Framework.tsx app/HA-DrawingAnalyzer/presentation/slides/Slide12Recommendation.tsx app/HA-DrawingAnalyzer/presentation/slides/Slide15MvpScope.tsx app/HA-DrawingAnalyzer/presentation/slides/Slide16Prototype.tsx app/HA-DrawingAnalyzer/presentation/slides/Slide17KeyUnknowns.tsx
git commit -m "feat(presentation): rebrand remaining slides — yellow winner/highlight, black button, no blue"
```

---

## Task 7: Sweep + verification

**Files:** none (verification; fix-ups land in the relevant `presentation/` file).

- [ ] **Step 1: No blue / no serif / no rounded images left in the deck**

Run (PowerShell-safe via Grep tool or rg):
- `rg "autodesk-blue" app/HA-DrawingAnalyzer/presentation` → **no matches**.
- `rg "font-serif" app/HA-DrawingAnalyzer/presentation` → **no matches** (or only neutralized; prefer none).
- `rg "rounded-(lg|md|xl|full|sm)" app/HA-DrawingAnalyzer/presentation/slides` → review each; images must be square (`rounded-none`/none). The lifecycle **circles** legitimately keep `rounded-full` — that is allowed (they are circles, not images). Confirm no *image* uses rounding.

Fix any stragglers, then re-run.

- [ ] **Step 2: Types + scope guard**

Run: `npx tsc --noEmit` → clean.
Run: `git diff --name-only main -- app/ components/ lib/ | grep -v "/presentation/"` → prints nothing (only `presentation/**` changed; `layout.tsx`, `tailwind.config.ts`, `DemoVideo.tsx` untouched).

- [ ] **Step 3: Manual pass (`npm run dev`)**

Open `/HA-DrawingAnalyzer/presentation`: confirm no serif; black/white + yellow only; yellow only as fills/highlights with black on top; square images; one user pill per use-case slide in a consistent spot; no "USER"/"PHASE" labels; headlines big/heavy.

- [ ] **Step 4: Final commit (if fix-ups were needed)**

```bash
git add -A
git commit -m "chore(presentation): brand-sweep fix-ups"
```

---

## Notes for the executor

- Never edit outside `app/HA-DrawingAnalyzer/presentation/**`. `DemoVideo`, `layout.tsx`, `tailwind.config.ts` are off-limits.
- Yellow `#ffff00` is **fills/highlights with black on top only** — never yellow text or thin yellow lines on white.
- Lifecycle **circles** keep `rounded-full` (they're circles); the "square images" rule applies to photos/mockups (cover, family, use-case images), not these shapes.
- Sentence case for titles where you touch them; don't add trailing periods.
