# Use-Case Tradeoff Reveal — Design Spec

**Date:** 2026-06-08
**Branch:** `feature/presentation-hovers`
**Scope:** `app/HA-DrawingAnalyzer/presentation/slides/SlideUseCase.tsx` only.

## Goal

On each use-case detail slide, make the tradeoff line (`gain ⇄ cost`) a discrete, click-to-toggle
reveal: clicking it shows the use case's **values** stacked above the gain side and its **risks**
stacked above the cost side, and dims the workflow behind them. Click again to hide.

## Decisions (confirmed)

- **Content:** titles only (from the existing data), not descriptions.
- **On reveal:** the two-lane workflow dims to ~20% opacity so the lists read clearly over it.
- **Trigger:** click the tradeoff line to toggle; **no visible cue** (the line looks exactly as it
  does now — fully hidden affordance, default cursor, no caret/underline/pointer).

## Data

Pulled directly from the existing `USE_CASES` data (`@/app/HA-DrawingAnalyzer/sections/useCaseData`
via `presentation/deckData`), no data changes:

- Values: `data.value.map(v => v.title)` — e.g. UC1: Fewer Review Cycles, Reduced Context Switching,
  Faster Approvals, Reduced Reviewer Effort, Structured Change History.
- Risks: `data.tradeoffs.map(t => t.title)` — e.g. UC1: False Confidence, Change Noise, Workflow Friction.

## Implementation (`SlideUseCase.tsx`)

1. Add `'use client'` and `import { useState } from 'react'`. Add `const [revealed, setRevealed] = useState(false)`.
   (Reveal state is per-slide instance; persists while mounted, which is fine.)
2. **Dim the workflow:** wrap the `<ExecWorkflow>` in a div with
   `transition-opacity duration-300 ${revealed ? 'opacity-20' : ''}`.
3. **Tradeoff line → toggle + anchors.** Replace the current tradeoff `<p>` with a clickable element
   (a `<div onClick={() => setRevealed(v => !v)}>`, keeping the existing `mt-auto pt-8 font-sans
   text-[11px] uppercase leading-relaxed tracking-[0.1em] text-charcoal` styling so it looks
   unchanged). Inside, three inline parts:
   - **gain** — wrapped in `<span className="relative">`; its values popover is an absolutely
     positioned list anchored `bottom-full left-0` (stacks upward, left-aligned to the gain text).
   - the `⇄` glyph (unchanged, `mx-1.5`).
   - **cost** — wrapped in `<span className="relative">`; its risks popover anchored `bottom-full left-0`.
4. **Popover lists** (one for values above gain, one for risks above cost):
   ```tsx
   <span className={`absolute bottom-full left-0 mb-2 flex flex-col gap-1 transition-opacity ${revealed ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
     {items.map((t) => (
       <span key={t} className="whitespace-nowrap font-sans text-[11px] font-semibold uppercase leading-tight tracking-[0.08em] text-black">{t}</span>
     ))}
   </span>
   ```
   Items render top-to-bottom (first item highest, last just above the tradeoff). Always rendered
   (so no layout shift); only opacity/pointer-events change.
5. The whole tradeoff `<div>` keeps `mt-auto` so it stays pinned to the bottom of the left column;
   the popovers grow up over the (now dimmed) workflow.

No pointer cursor / caret is added (per "no visible cue"). The click target is the tradeoff line.

## Acceptance criteria

- On each use-case detail slide, clicking the `gain ⇄ cost` line reveals value titles above the gain
  side and risk titles above the cost side; the workflow dims to ~20%. Clicking again hides them and
  restores the workflow.
- Titles come from `data.value` / `data.tradeoffs` (no hard-coded copy).
- The tradeoff line looks unchanged until clicked (no added cue).
- No layout shift when toggling (lists are always mounted, opacity-toggled).
- `npx tsc --noEmit` clean. Only `SlideUseCase.tsx` changes.

## Out of scope

- Problem-intro slides (no tradeoff line) — unchanged.
- Any data/file changes outside `SlideUseCase.tsx`.
- Keyboard accessibility of the click target (acceptable for a presentation deck).
