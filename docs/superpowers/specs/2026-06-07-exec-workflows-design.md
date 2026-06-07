# Executive Workflows on Use-Case Slides — Design Spec

**Date:** 2026-06-07
**Branch:** `feature/presentation-finetune`
**Scope:** `app/HA-DrawingAnalyzer/presentation/` only. No existing site files are edited (the website workflow styling is *recreated* inside `presentation/`, not imported/modified).

## Goal

Replace the problem-statement paragraph on each use-case spotlight slide (5–8) with an
executive **Current vs Proposed** workflow diagram, styled like the workflow lanes on
`/HA-DrawingAnalyzer` (bordered step boxes, SVG down-arrow connectors, a serif lane
"stat"/footer), with ⚡ on the AI/product step and ✓ on the final positive step.

## Decisions (confirmed)

- **Layout:** keep the mockup image **at its current size** (do NOT shrink it). Instead of
  stealing width from the image, **widen the whole slide**: `SlideShell` gains a `wide` variant
  (`max-w-7xl`, `px-12 lg:px-16`) used by the use-case slides. The image column is pinned to its
  current width (`minmax(0, 560px)`) and the workflow takes the added width on the left. The
  workflow replaces the problem text.
- **Markers:** include ⚡ (blue AI glyph) on the product step and ✓ on the final proposed
  step. Current lanes stay plain.
- **Slide 13** (standalone Change Validation workflow) is **kept** as-is.

## Component — `presentation/ExecWorkflow.tsx`

Recreates the site's workflow look (no dependency on `sections/UseCase.tsx`).

Props:
```ts
type ExecStep = { label: string; kind?: 'ai' | 'approve' }
type ExecLane = { steps: ExecStep[]; footer: string }
function ExecWorkflow({ current, proposed }: { current: ExecLane; proposed: ExecLane }): JSX.Element
```

Rendering:
- Two lanes side by side (`grid grid-cols-2 gap-x-4`).
- **Lane header:** uppercase sans `text-[10px]` tracked — "Current" (charcoal) / "Proposed" (autodesk-blue).
- **Step box:** `rounded-sm border px-2.5 py-1.5 bg-white`, label `font-sans text-[12px] text-charcoal`.
  - current border `border-charcoal/25`; proposed border `border-autodesk-blue/30`.
  - marker (when `kind`): `ai` → `⚡︎` autodesk-blue; `approve` → `✓` (proposed: autodesk-blue, current: charcoal). `ai` box gets a faint blue tint `bg-autodesk-blue/10` like the site.
- **Connector** between steps: inline SVG (14×15) vertical line + arrowhead, copied from the
  site's `Connector`; color proposed `rgba(6,150,215,0.7)`, current `rgba(102,102,102,0.45)`.
- **Footer:** the lane's `footer` string under the last step — `font-serif text-[14px]`,
  proposed autodesk-blue / current charcoal (mirrors the site's lane "stat").

## Data — `presentation/execWorkflows.ts`

Keyed by use-case id; `SlideUseCase` looks up by `data.id`.

```ts
export const EXEC_WORKFLOWS: Record<string, { current: ExecLane; proposed: ExecLane }> = {
  'use-case-1': { // Change Validation
    current:  { steps: [{label:'Design Change'},{label:'Review'},{label:'Issue Found'},{label:'Rework'},{label:'Review Again'}], footer: 'Repeated Review Cycles' },
    proposed: { steps: [{label:'Design Change'},{label:'Change Validation',kind:'ai'},{label:'Issue Found'},{label:'Correction'},{label:'Review',kind:'approve'}], footer: 'First-Pass Approval' },
  },
  'use-case-2': { // Context Link
    current:  { steps: [{label:'Issue Identified'},{label:'RFI Submitted'},{label:'Designer Tries to Guess Context'},{label:'Clarification Required'},{label:'Back and Forth'},{label:'Response'}], footer: 'Missing Context' },
    proposed: { steps: [{label:'Issue Identified'},{label:'Context Link',kind:'ai'},{label:'RFI Submitted'},{label:'Response',kind:'approve'}], footer: 'Complete Context' },
  },
  'use-case-3': { // Coordination Lock
    current:  { steps: [{label:'Discipline A Changes Design'},{label:'Impact Not Visible'},{label:'Conflict Discovered Later'},{label:'Coordination Rework'}], footer: 'Hidden Dependencies' },
    proposed: { steps: [{label:'Discipline A Changes Design'},{label:'Impacted Dependencies Identified',kind:'ai'},{label:'Teams Notified'},{label:'Issue Resolved Early',kind:'approve'}], footer: 'Visible Dependencies' },
  },
  'use-case-4': { // Program Conformance Review
    current:  { steps: [{label:'Design Progresses'},{label:'Manual Program Review'},{label:'Limited Review Capacity'},{label:'Inconsistent Enforcement'}], footer: 'Periodic Validation' },
    proposed: { steps: [{label:'Design Progresses'},{label:'Program Continuously Evaluated',kind:'ai'},{label:'Requirements Tracked'},{label:'Consistent Enforcement',kind:'approve'}], footer: 'Continuous Validation' },
  },
}
```

## `SlideShell` change (primitives.tsx)

Add an optional `wide?: boolean` prop. When true, the inner container uses `max-w-7xl px-12
lg:px-16` instead of `max-w-5xl px-12 lg:px-20`. Default (false) unchanged, so every other slide
is untouched.

## `SlideUseCase.tsx` change

- Pass `wide` to `SlideShell`.
- Columns: `lg:grid-cols-[1fr_minmax(0,560px)]` — image column pinned to ~its current width
  (so the image is **not** smaller), workflow gets the rest on the left.
- Left column: keep `title`, `User`, `Phase`; **remove** the `problem.intro` paragraph and render
  `<ExecWorkflow {...EXEC_WORKFLOWS[data.id]} />` in its place.
- Right column: image unchanged (`max-h-[78vh] w-full object-contain`, UC2 keeps no border).
- If a use case has no entry in `EXEC_WORKFLOWS`, render nothing in that slot (defensive).

## Acceptance criteria

- Slides 5–8 each show a two-lane Current/Proposed exec workflow with bordered boxes, SVG
  down-arrows, ⚡ on the product step, ✓ on the final proposed step, and the footer label.
- The mockup image remains visible on each slide (medium-large).
- Slide 13 unchanged; all other slides unchanged.
- `git diff --name-only feature/presentation-finetune` (vs branch base) shows only files under
  `app/HA-DrawingAnalyzer/presentation/` (+ this spec / the plan).
- `npx tsc --noEmit` clean.

## Out of scope

- Editing any file outside `presentation/`.
- Changing the real workflow data in `sections/useCaseData.ts` (the exec steps are a separate,
  simplified set living in `presentation/`).
- Legend, actor pills, and the `repeat`/`reject` markers from the full site workflow (executive
  version uses only ⚡ and ✓).
