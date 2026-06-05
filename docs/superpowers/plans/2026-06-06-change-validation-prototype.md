# Change Validation Prototype — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive, mocked "Change Validation / Drawing Pull Requests" prototype that feels embedded in Autodesk Forma, at the route `/HA-DrawingAnalyzer/demo`, linked from the portfolio's Prototype section.

**Architecture:** A single full-screen client component (`FormaPrototype`) runs a small state machine (version V1→V2, screen files↔review, status). It renders a lightweight Forma chrome (`FormaShell`), a `FilesScreen` with an interactive target row, an `UploadDialog`, and the hero `ChangeValidation` screen, which compares two `FloorPlan` SVGs (Current/Incoming) with a detected-changes rail. No backend, no AI, no real diffing — all mocked.

**Tech Stack:** Next.js 14 App Router, React client components, TypeScript, Tailwind CSS (utility classes inline), inline SVG. No new dependencies.

**Verification model:** This is a throwaway visual prototype — no automated tests (per spec). Each task is verified by running the dev server (`npm run dev`, already typically running on :3000) and clicking through, plus `npx tsc --noEmit` must stay clean. Use the `verify`/`run` skills or browser to eyeball each increment.

**Reference assets (read these during implementation):**
- `/public/demo/page1_file browser.png`, `page2_fileleftclick.png`, `page3_submitforreview.png` — Forma Files chrome.
- `/public/demo/ChangeValidation_Ref2.png` — the hero (two-pane compare + change rail + actions).
- `/public/demo/CurrentPlan.pdf` (sheet A102) — the floor-plan line-work reference.
- Spec: `docs/superpowers/specs/2026-06-06-change-validation-prototype-design.md`.

**Forma palette (use these exact values):**
- top bar `#1a1a1a`; page bg `#fafafa`; surfaces `#ffffff`; borders `#e6e6e6` / `#d9d9d9`; text `#1a1a1a`, muted `#5a5a5a`.
- ACC UI blue `#0d66d0` (links, primary buttons, version pills).
- tags: Added `#2e7d32`, Modified `#b8860b`, Removed `#c62828`.

---

### Task 1: Route scaffold, mobile guard, cursor restore

**Files:**
- Create: `app/HA-DrawingAnalyzer/demo/page.tsx`
- Create: `app/HA-DrawingAnalyzer/demo/FormaPrototype.tsx` (temporary stub)
- Reference: `app/layout.tsx` (check for global chrome/cursor), `app/globals.css` (the `* { cursor: none !important }` rule)

- [ ] **Step 1: Read `app/layout.tsx`** to confirm whether any global nav/cursor wraps all routes. The demo must render clean and full-screen. (The `/HA-DrawingAnalyzer` page handles the cursor via a `.ha-page` wrapper + a scoped `<style>`; replicate that pattern.)

- [ ] **Step 2: Create the stub client component** `app/HA-DrawingAnalyzer/demo/FormaPrototype.tsx`:

```tsx
'use client'

export default function FormaPrototype() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] grid place-items-center">
      <p className="font-sans text-sm">Forma prototype — coming up.</p>
    </div>
  )
}
```

- [ ] **Step 3: Create the route** `app/HA-DrawingAnalyzer/demo/page.tsx` with metadata, the mobile guard, and the cursor restore. The `demo-root` class + scoped style restores the OS cursor that `globals.css` hides:

```tsx
import type { Metadata } from 'next'
import FormaPrototype from './FormaPrototype'

export const metadata: Metadata = {
  title: 'Change Validation — Interactive Prototype',
  robots: { index: false, follow: false },
}

export default function ChangeValidationDemoPage() {
  return (
    <div className="demo-root">
      {/* Desktop prototype */}
      <div className="hidden lg:block">
        <FormaPrototype />
      </div>

      {/* Mobile guard */}
      <div className="lg:hidden min-h-screen bg-[#fafafa] text-[#1a1a1a] grid place-items-center px-8 text-center">
        <p className="font-sans text-[15px] leading-relaxed text-[#5a5a5a]">
          The Change Validation demo is only available on desktop.
        </p>
      </div>

      <style>{`
        .demo-root, .demo-root * { cursor: auto !important; }
        .demo-root a, .demo-root button, .demo-root [role="button"] { cursor: pointer !important; }
      `}</style>
    </div>
  )
}
```

- [ ] **Step 4: Verify** — run dev server, open `http://localhost:3000/HA-DrawingAnalyzer/demo`. Expected: the stub renders full-screen on desktop with a visible cursor; resize narrow (<1024px) → the "only available on desktop" message appears. `npx tsc --noEmit` clean.

- [ ] **Step 5: Commit**

```bash
git add app/HA-DrawingAnalyzer/demo
git commit -m "feat(demo): route scaffold with mobile guard and cursor restore"
```

---

### Task 2: Data model (`data.ts`)

**Files:**
- Create: `app/HA-DrawingAnalyzer/demo/data.ts`

- [ ] **Step 1: Define the file rows and change data.** `crop` is the SVG `viewBox` string for the thumbnail; `marker` is the ①②③ chip position in the plan's coordinate space (set precisely in Task 7, leave best-guess now and tune later).

```ts
export type FileRow = {
  id: string
  name: string
  version: 1 | 2          // the target row will be driven by live state instead
  updated: string
  by: string
  isTarget?: boolean      // the row the demo acts on
}

export const FILE_ROWS: FileRow[] = [
  { id: 'narrative', name: '2025-0829 - P1016 Bulletin 1 - Change Narrative.pdf', version: 1, updated: 'Sep 4, 2025 10:59', by: 'Ronit Haquim' },
  { id: 'drawings',  name: '2025-0829 - P1016 Bulletin 1 - Drawings.pdf',          version: 1, updated: 'Sep 4, 2025 11:00', by: 'Ronit Haquim', isTarget: true },
  { id: 'approved',  name: '2025-0829 - P1016 Bulletin 1 - Drawings - APPROVED.pdf', version: 1, updated: 'Sep 10, 2025 12:04', by: 'Ronit Haquim' },
]

export type ChangeType = 'added' | 'modified' | 'removed'

export type Change = {
  id: string
  type: ChangeType
  title: string
  description: string
  crop: string            // SVG viewBox "minX minY w h" for the thumbnail
  marker: { x: number; y: number } // marker chip center in plan coords
}

export const CHANGES: Change[] = [
  {
    id: 'doors', type: 'added',
    title: 'Doors added',
    description: '2 doors added to Corridor.',
    crop: '0 0 100 100', marker: { x: 0, y: 0 },
  },
  {
    id: 'bedroom3', type: 'modified',
    title: 'Bedroom 3 boundary modified',
    description: 'Partition shifted — area 138 SF → 149 SF (+8%).',
    crop: '0 0 100 100', marker: { x: 0, y: 0 },
  },
  {
    id: 'toilet', type: 'removed',
    title: 'Toilet removed',
    description: 'Toilet removed from Bath 2.',
    crop: '0 0 100 100', marker: { x: 0, y: 0 },
  },
]

export const TYPE_META: Record<ChangeType, { label: string; color: string }> = {
  added:    { label: 'Added',    color: '#2e7d32' },
  modified: { label: 'Modified', color: '#b8860b' },
  removed:  { label: 'Removed',  color: '#c62828' },
}
```

- [ ] **Step 2: Verify** — `npx tsc --noEmit` clean (file is imported in later tasks; nothing renders yet).

- [ ] **Step 3: Commit**

```bash
git add app/HA-DrawingAnalyzer/demo/data.ts
git commit -m "feat(demo): file-row and change data model"
```

---

### Task 3: Forma chrome (`FormaShell`)

**Files:**
- Create: `app/HA-DrawingAnalyzer/demo/FormaShell.tsx`
- Modify: `app/HA-DrawingAnalyzer/demo/FormaPrototype.tsx`

- [ ] **Step 1: Build `FormaShell`** — black top bar (wordmark + right icons), sub-bar (Data Management + breadcrumb), left nav list, and a `children` content area. Match `page1` layout; keep it lightweight. Left nav items: Files (active), Specifications, Reviews, Transmittals, Issues, Boards, Reports, Members, Bridge. Use simple inline SVG/emoji-free glyphs or small squares as icons (no icon lib). Signature:

```tsx
export default function FormaShell({ children }: { children: React.ReactNode }) { /* ... */ }
```

Structure: a `flex flex-col h-screen`. Top bar `h-9 bg-[#1a1a1a] text-white`. Sub-bar `h-11 bg-white border-b border-[#e6e6e6]`. Body `flex flex-1 min-h-0`: left nav `w-[200px] border-r border-[#e6e6e6] bg-white`, content `flex-1 min-w-0 overflow-auto bg-[#fafafa]`.

- [ ] **Step 2: Render it** in `FormaPrototype` with placeholder content:

```tsx
'use client'
import FormaShell from './FormaShell'

export default function FormaPrototype() {
  return <FormaShell><div className="p-8 text-sm text-[#5a5a5a]">Files screen goes here.</div></FormaShell>
}
```

- [ ] **Step 3: Verify** — reload `/HA-DrawingAnalyzer/demo`; the Forma chrome reads believably against `page1.png` (black bar, left nav, breadcrumb). `npx tsc --noEmit` clean.

- [ ] **Step 4: Commit**

```bash
git add app/HA-DrawingAnalyzer/demo
git commit -m "feat(demo): Forma chrome shell (top bar, sub-bar, left nav)"
```

---

### Task 4: Files screen — static table + folder tree (`FilesScreen`)

**Files:**
- Create: `app/HA-DrawingAnalyzer/demo/FilesScreen.tsx`
- Modify: `app/HA-DrawingAnalyzer/demo/FormaPrototype.tsx`

- [ ] **Step 1: Build `FilesScreen`** as a presentational component driven by props (state comes from `FormaPrototype` in Task 5). Signature:

```tsx
import type { ReactNode } from 'react'

export default function FilesScreen({
  version, status, onUpload, onSubmit, busyHint,
}: {
  version: 1 | 2
  status: 'none' | 'in-review'
  onUpload: () => void
  onSubmit: () => void
  busyHint?: string | null   // e.g. "Generating change review…"
}) { /* ... */ }
```

Render: "Files" heading, Folders/Packages tabs, a two-column body — a lightweight folder tree (the P1016 tree from `page1`, with "04 NTA Approved" highlighted) and the file table. Table columns: Name · Revision · Version · Review status · Last updated · Updated by. Map `FILE_ROWS`; for the **target row** (`isTarget`) drive Version + Review status from props and render the inline action button.

- [ ] **Step 2: Version pill** — small outlined blue pill: `V1` (or `V2`) `text-[11px] text-[#0d66d0] border border-[#0d66d0]/50 rounded-full px-1.5`. When `version === 2`, wrap in a brief highlight (a `bg-[#0d66d0]/10` flash class is fine).

- [ ] **Step 3: Inline action button** on the target row (right-aligned cell). Logic:
  - `version === 1`: secondary button **"Upload new version"** → `onUpload`.
  - `version === 2`: primary button **"Submit for review"** (`bg-[#0d66d0] text-white`) → `onSubmit`.
  - Add a soft "start here" pulse ring on the active button (`animate-pulse` ring or a subtle keyframe — keep gentle).
  - When `busyHint` is set, show it inline (small spinner + text) instead of the button.
  - `status === 'in-review'`: Review status cell shows an **"In review"** badge (`text-[#b8860b] bg-[#b8860b]/10 rounded px-1.5 text-[11px]`).

- [ ] **Step 4: Wire a static instance** in `FormaPrototype` (hardcode `version={1} status="none"` and no-op handlers) to verify layout.

- [ ] **Step 5: Verify** — the file table matches `page1` (3 rows, V1 badges); the target row shows the "Upload new version" button with the pulse cue. `npx tsc --noEmit` clean.

- [ ] **Step 6: Commit**

```bash
git add app/HA-DrawingAnalyzer/demo
git commit -m "feat(demo): Files screen with table, folder tree, target-row action"
```

---

### Task 5: State machine + upload flow (`FormaPrototype`, `UploadDialog`)

**Files:**
- Modify: `app/HA-DrawingAnalyzer/demo/FormaPrototype.tsx`
- Create: `app/HA-DrawingAnalyzer/demo/UploadDialog.tsx`

- [ ] **Step 1: Build `UploadDialog`** — a centered modal over a dim backdrop (match `page3` modal styling: white card, title "Upload new version", a dashed drop-zone "Drag a file here or browse", and on "Browse"/drop a mock file chip `…Bulletin 1 - Drawings.pdf` + a progress bar that fills ~1s, then calls `onComplete`). Props:

```tsx
export default function UploadDialog({ onComplete, onCancel }: { onComplete: () => void; onCancel: () => void }) { /* ... */ }
```

Use a `useState` progress + `useEffect`/`setInterval` to animate 0→100 over ~900ms once the user clicks Browse; cleanup on unmount.

- [ ] **Step 2: Add the state machine** to `FormaPrototype`:

```tsx
'use client'
import { useState } from 'react'
import FormaShell from './FormaShell'
import FilesScreen from './FilesScreen'
import UploadDialog from './UploadDialog'

export default function FormaPrototype() {
  const [screen, setScreen] = useState<'files' | 'review'>('files')
  const [version, setVersion] = useState<1 | 2>(1)
  const [status, setStatus] = useState<'none' | 'in-review'>('none')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [validating, setValidating] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  function handleUploadComplete() {
    setUploadOpen(false)
    setVersion(2)
  }
  function handleSubmit() {
    setValidating(true)
    setTimeout(() => { setValidating(false); setScreen('review') }, 1100)
  }
  // confirm / return / restart added in Task 8

  return (
    <FormaShell>
      <FilesScreen
        version={version}
        status={status}
        onUpload={() => setUploadOpen(true)}
        onSubmit={handleSubmit}
        busyHint={validating ? 'Generating change review…' : null}
      />
      {uploadOpen && (
        <UploadDialog onComplete={handleUploadComplete} onCancel={() => setUploadOpen(false)} />
      )}
    </FormaShell>
  )
}
```

- [ ] **Step 3: Verify** — click "Upload new version" → dialog → Browse → progress → closes → row shows **V2** + the button becomes **"Submit for review"**. Click it → "Generating change review…" for ~1s (screen does not switch yet — `review` screen lands in Task 8). `npx tsc --noEmit` clean.

- [ ] **Step 4: Commit**

```bash
git add app/HA-DrawingAnalyzer/demo
git commit -m "feat(demo): upload dialog + state machine (V1→V2→validating)"
```

---

### Task 6: Floor plan SVG (`FloorPlan`)

**Files:**
- Create: `app/HA-DrawingAnalyzer/demo/FloorPlan.tsx`

This is the credibility-critical piece. Reproduce the A102 layout faithfully in monochrome CD convention. Build it iteratively against `CurrentPlan.pdf` and verify visually.

- [ ] **Step 1: Set up the component + coordinate system.** Signature:

```tsx
import { CHANGES, TYPE_META } from './data'

export default function FloorPlan({
  version, focus, viewBox,
}: {
  version: 'current' | 'incoming'
  focus?: string | null          // change id to emphasize
  viewBox?: string               // override for thumbnail crops
}) { /* ... */ }
```

Use a fixed plan coordinate space, e.g. `0 0 1000 720` (landscape, matching A102 proportions). Root `<svg viewBox={viewBox ?? '0 0 1000 720'} className="w-full h-full" >` on a white background.

- [ ] **Step 2: Draw the shell + grid.** Exterior walls as double lines with wall poché (thin hatch or solid `#1a1a1a` fill at ~6px wall thickness). Grid lines 1–9 (vertical) and A–E (horizontal) as thin `#9aa0a6` lines ending in circular grid bubbles with the number/letter. Match A102 spacing approximately.

- [ ] **Step 3: Draw the rooms.** Partitions + each room's label (name) and SF, using the A102 set: Primary Bdrm 254, Primary Bath 163, Bath 2 (×2 per sheet — keep one as "Bath 2" with the toilet), Laundry 52, Linen 9, Walk-in Closet 98, Corridor 144, Bedroom 2 126, Bedroom 3 138, Bonus Room 366, Shafts. Door openings with **swing arcs**, numbered **door tags** in small circles, **window tags** (e.g. `W2-0`) as small rounded-rect labels on exterior walls. Text: a small monospace-ish sans at ~12–14 plan units, `#1a1a1a`.

- [ ] **Step 4: Add the version diff.** Encapsulate the three changes so `version === 'incoming'` renders them:
  - **doors:** two extra door openings + swing arcs in the Corridor.
  - **bedroom3:** the Bedroom 3 partition drawn at a shifted position, and the SF label reading **149 SF** (vs **138 SF** in `current`).
  - **toilet:** the Bath 2 toilet fixture is present in `current`, absent in `incoming` (optionally a dashed "ghost" rectangle at the old location).

- [ ] **Step 5: Add the highlight layer (incoming only).** For each change, a translucent rounded rect in the type color (`TYPE_META[type].color` at ~12% fill + 70% stroke) around the changed area, plus a numbered marker chip (①②③) at `change.marker`. When `focus === change.id`, thicken the stroke / add a subtle pulse. Update each `Change.marker` and `Change.crop` in `data.ts` to the real coordinates as you place them.

- [ ] **Step 6: Verify** — temporarily render `<FloorPlan version="incoming" />` full-width in `FormaPrototype` (or a scratch). It reads as a believable A102 sheet; the three highlights sit on the right rooms. Compare side-by-side with `CurrentPlan.pdf`. Revert the scratch render. `npx tsc --noEmit` clean.

- [ ] **Step 7: Commit**

```bash
git add app/HA-DrawingAnalyzer/demo/FloorPlan.tsx app/HA-DrawingAnalyzer/demo/data.ts
git commit -m "feat(demo): A102 floor plan SVG with current/incoming diff + highlights"
```

---

### Task 7: Change Validation hero screen (`ChangeValidation`)

**Files:**
- Create: `app/HA-DrawingAnalyzer/demo/ChangeValidation.tsx`

- [ ] **Step 1: Build the screen** per `ChangeValidation_Ref2`. Signature:

```tsx
import { useState } from 'react'
import FloorPlan from './FloorPlan'
import { CHANGES, TYPE_META } from './data'

export default function ChangeValidation({
  onReturn, onConfirm,
}: {
  onReturn: () => void
  onConfirm: () => void
}) {
  const [focus, setFocus] = useState<string | null>(null)
  /* ... */
}
```

- [ ] **Step 2: Top bar** — `← Back to Files` (calls `onReturn`), sheet title "A102 — Second Floor Plan", version chips "Current · V1" / "Incoming · V2", a decorative "Show changes only" toggle, and the italic thesis line: *"Changes detected from drawing objects and their relationships — not a pixel overlay."*

- [ ] **Step 3: Two panes** — a `grid grid-cols-2 gap-4` (stacks to 1 col under `xl`): left pane label "Current · V1" → `<FloorPlan version="current" />`; right pane label "Incoming · V2" → `<FloorPlan version="incoming" focus={focus} />`. Each pane is a white card with a border; the plan fills it. A small legend (Added/Modified/Removed color chips) under the panes.

- [ ] **Step 4: Right rail** — heading "Change Validation Review · 3 changes detected". Map `CHANGES` to cards: colored type tag (`TYPE_META`), title, description, and a thumbnail = `<FloorPlan version="incoming" viewBox={change.crop} />` in a small fixed box. Card `onMouseEnter`/`onClick` sets `focus = change.id`; active card gets a highlighted border.

- [ ] **Step 5: Footer actions** — **Return to drawing** (secondary → `onReturn`) and **Confirm & submit review** (primary `bg-[#0d66d0] text-white` → `onConfirm`).

- [ ] **Step 6: Verify** — temporarily render `<ChangeValidation onReturn={()=>{}} onConfirm={()=>{}} />` in `FormaPrototype`; matches Ref2; hovering a card focuses its highlight in the Incoming pane. Revert scratch. `npx tsc --noEmit` clean.

- [ ] **Step 7: Commit**

```bash
git add app/HA-DrawingAnalyzer/demo/ChangeValidation.tsx
git commit -m "feat(demo): Change Validation hero — two-pane compare + change rail"
```

---

### Task 8: Wire the full flow + toast + restart + Prototype tag

**Files:**
- Modify: `app/HA-DrawingAnalyzer/demo/FormaPrototype.tsx`

- [ ] **Step 1: Switch screens and add the remaining handlers.** Render `ChangeValidation` when `screen === 'review'`; otherwise the Files screen. Add:

```tsx
function handleConfirm() {
  setScreen('files')
  setStatus('in-review')
  setToast('Submitted for review')
  setTimeout(() => setToast(null), 3200)
}
function handleReturn() { setScreen('files') }
function handleRestart() {
  setScreen('files'); setVersion(1); setStatus('none')
  setUploadOpen(false); setValidating(false); setToast(null)
}
```

Render logic:

```tsx
return (
  <div className="relative">
    {screen === 'review' ? (
      <ChangeValidation onReturn={handleReturn} onConfirm={handleConfirm} />
    ) : (
      <FormaShell>
        <FilesScreen version={version} status={status}
          onUpload={() => setUploadOpen(true)} onSubmit={handleSubmit}
          busyHint={validating ? 'Generating change review…' : null} />
        {uploadOpen && <UploadDialog onComplete={handleUploadComplete} onCancel={() => setUploadOpen(false)} />}
      </FormaShell>
    )}

    {/* Toast */}
    {toast && (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1a1a1a] text-white text-[13px] px-4 py-2 rounded shadow-lg">
        {toast}
      </div>
    )}

    {/* Restart + Prototype tag */}
    <div className="fixed top-2 right-3 flex items-center gap-2 z-50">
      <span className="text-[10px] uppercase tracking-wider text-[#5a5a5a] bg-white/80 border border-[#d9d9d9] rounded px-1.5 py-0.5">Prototype</span>
      <button onClick={handleRestart} className="text-[11px] text-[#0d66d0] hover:underline">↺ Restart demo</button>
    </div>
  </div>
)
```

- [ ] **Step 2: Verify the full happy path** — Upload → V2 → Submit → "Generating…" → Change Validation → hover cards focus highlights → **Confirm & submit review** → back to Files with a "Submitted for review" toast and the row's **In review** badge. Then the **return path**: Submit again → **Return to drawing** → back at V2. **Restart** resets to V1. Resize narrow → desktop-only message. `npx tsc --noEmit` clean.

- [ ] **Step 3: Commit**

```bash
git add app/HA-DrawingAnalyzer/demo/FormaPrototype.tsx
git commit -m "feat(demo): wire full flow — review screen, confirm/return, toast, restart"
```

---

### Task 9: Link the prototype from the portfolio's Prototype section

**Files:**
- Modify: `app/HA-DrawingAnalyzer/sections/PrototypeDemo.tsx`

- [ ] **Step 1: Replace the placeholder video** with a teaser + link. Keep the existing `Section` wrapper (eyebrow "Prototype demo", title "Walkthrough"). Inside: a short caption describing the demo, and a primary button/link to the route opening in a new tab:

```tsx
import Section from './Section'

export default function PrototypeDemo() {
  return (
    <Section id="prototype" eyebrow="Prototype demo" title="Change Validation, interactive">
      <div className="max-w-2xl">
        <p className="font-sans text-[14px] leading-relaxed text-charcoal mb-4">
          An interactive concept prototype of the Change Validation flow, built to feel embedded in
          Autodesk Forma: upload a revised drawing, run change validation before submission, review the
          detected object-level changes, and confirm. Best viewed on desktop.
        </p>
        <a
          href="/HA-DrawingAnalyzer/demo"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-sans text-[12px] font-semibold uppercase tracking-[0.08em] text-white bg-autodesk-blue rounded-sm px-4 py-2 no-underline hover:opacity-90 transition-opacity"
        >
          Open interactive prototype ↗
        </a>
      </div>
    </Section>
  )
}
```

- [ ] **Step 2: Verify** — on the main `/HA-DrawingAnalyzer` page, the Prototype section shows the caption + button; clicking opens the demo in a new tab. `npx tsc --noEmit` clean.

- [ ] **Step 3: Commit**

```bash
git add app/HA-DrawingAnalyzer/sections/PrototypeDemo.tsx
git commit -m "feat(HA-DrawingAnalyzer): link Prototype section to the Change Validation demo"
```

---

### Task 10: Final polish pass & full verification

**Files:** (touch-ups only, as needed)

- [ ] **Step 1: Full manual run-through** at `/HA-DrawingAnalyzer/demo` — confirm all acceptance criteria from the spec: upload/drag, V1→V2, Submit for review, Change Validation appears before submit, visual change previews + concise descriptions + object-level framing, return-or-confirm both work, success state, Forma-consistent styling, restart, mobile guard.

- [ ] **Step 2: Polish** — spacing/typography against `page1` and `Ref2`; ensure the cursor shows everywhere in the demo; ensure no portfolio chrome leaks in; check it holds at ~1280–1920px and stacks acceptably at `lg`.

- [ ] **Step 3: Typecheck** — `npx tsc --noEmit` clean.

- [ ] **Step 4: Commit any polish, then push**

```bash
git add app/HA-DrawingAnalyzer
git commit -m "polish(demo): spacing, typography, final pass"
git push origin main
```

---

## Self-review notes

- **Spec coverage:** route + mobile guard (T1), data (T2), chrome (T3), files screen + inline action (T4), upload + state machine (T5), floor plan SVG + diff + highlights (T6), Change Validation hero (T7), full flow + toast + restart + Prototype tag (T8), Prototype-section link (T9), final verification incl. acceptance criteria (T10). Cursor/globals gotcha covered in T1; layout check in T1 Step 1.
- **No automated tests** is intentional (spec/YAGNI); verification is manual + `tsc`. Each task still ends in a working increment + commit.
- **Type consistency:** `version` is `1|2` everywhere; `screen` is `'files'|'review'`; `status` is `'none'|'in-review'`; `Change`/`ChangeType`/`TYPE_META` shared from `data.ts`; `FloorPlan` props (`version: 'current'|'incoming'`, `focus`, `viewBox`) consistent across T6/T7.
- **Known iteration point:** `Change.marker`/`Change.crop` are placeholders in T2 and finalized in T6 once real plan coordinates exist — flagged in both tasks.
