# Change Validation — Interactive Prototype (Design)

Date: 2026-06-06
Author: Eliahu Cohen (with Claude)
Status: Approved — ready for implementation plan

## Context

Part of the AI Drawing Analyzer PM home-assignment deliverable at `app/HA-DrawingAnalyzer`.
This prototype demonstrates **Use Case #1: Change Validation / "Drawing Pull Requests"** as it
would feel inside **Autodesk Forma / Autodesk Construction Cloud (ACC)** — a believable enterprise
SaaS workflow, not a futuristic AI mockup.

Visual references in `/public/demo/`:
- `page1_file browser.png`, `page2_fileleftclick.png`, `page3_submitforreview.png` — the Forma Files browser, row context menu, and Submit-for-review modal.
- `ChangeValidation_Ref.png` (Bananaz two-pane V1/V2 diff + categorized changes list), `ChangeValidation_Ref2.png` (floor-plan Incoming/Currently compare + change review list + Approve/Discard).
- `CurrentPlan.pdf` — a real Veev CD sheet **A102 "Floor Plan – Second Floor"** used as the line-work reference.

## Goal & non-goals

**Goal:** a polished, interactive, *mocked* prototype that walks through upload → version bump →
submit-for-review → **Change Validation** → confirm/submit, understandable in 30–45 seconds, credible
enough that an architect believes it. No real file processing, no AI, no backend.

**Non-goals:** real PDF/CAD parsing, real diffing, persistence, auth, multi-sheet, editing tools,
production-grade Forma fidelity for peripheral chrome, automated tests.

## Where it lives & entry point

- New full-screen route: **`app/HA-DrawingAnalyzer/demo`** (full-bleed; not inside the portfolio's
  narrow column). Renders a single client component that simulates the Forma app.
- The portfolio's **Prototype section** (`sections/PrototypeDemo.tsx`) replaces the placeholder
  `<video>` with a framed teaser + a primary **"Open interactive prototype ↗"** button that opens
  `/HA-DrawingAnalyzer/demo` in a new tab. No inline iframe (a desktop UI in the 768px column reads small).
- **Mobile guard:** on phones/small screens the route shows a centered message
  **"The Change Validation demo is only available on desktop."** instead of the prototype.
  Pure-CSS: prototype `hidden lg:block`, message `lg:hidden` (no JS/hydration concerns).

## Flow (state machine)

One screen driven by a small state machine. Five beats:

1. **Files browser (V1).** Forma Files screen. Target row = *"…Bulletin 1 – Drawings.pdf"*, Version **V1**.
   The action lives **inline on the target row** (right side), visible — not in a context menu, per brief:
   initial button **"Upload new version"**. A subtle "start here" cue (soft pulse/ring) marks the current
   next-step button.
2. **Upload.** Clicking opens `UploadDialog` — drop-zone + "Browse", a mock filename, ~1s progress bar.
   On finish → the row's **Version** cell flips V1 → **V2** with a brief highlight.
3. **V2 ready → Submit.** The inline button becomes the primary **"Submit for review"**.
   Clicking it does **not** submit — it runs the analyzer: a brief **"Generating change review…"** (~1s).
4. **Change Validation screen** (hero — see below). Actions: **Return to drawing** (loops back to V2 state)
   and **Confirm & submit review** (happy path).
5. **Submitted.** Lightweight success: a toast ("Submitted for review") + the row's **Review status** cell
   shows an **"In review"** badge.

A small floating **"↺ Restart demo"** control resets to beat 1 for repeat live demos. A subtle **"Prototype"**
tag signals it's a concept demo.

## Change Validation screen (the hero)

Modeled on `ChangeValidation_Ref2`. Three zones:

- **Top bar:** `← Back to Files` · sheet title **"A102 — Second Floor Plan"** · version chips
  **"Current · V1"** vs **"Incoming · V2"** · decorative **"Show changes only"** toggle. Thesis line
  (italic, small): *"Changes detected from drawing objects and their relationships — not a pixel overlay."*
- **Center — two plan panes (Current | Incoming):** both render `<FloorPlan>`. The Incoming pane adds
  the changed objects + a highlight layer (translucent rounded rects + numbered marker chips ①②③).
  Legend: **Added** (green) · **Modified** (amber) · **Removed** (red).
- **Right rail — "Change Validation Review · 3 changes detected":** three cards, each with a colored
  **type tag**, **title + one-liner**, and a **small SVG thumbnail crop** (same `<FloorPlan>` with a cropped
  `viewBox`). Clicking a card sets `focusedChange` → its highlight/marker emphasizes in the Incoming pane.
- **Footer:** **Return to drawing** (secondary) + **Confirm & submit review** (primary blue).

**The three changes (Current → Incoming), on real A102 rooms:**
1. **Added** (green) — 2 doors added to **Corridor** (new door tags + swing arcs, only in Incoming).
2. **Modified** (amber) — **Bedroom 3** partition shifted; SF label updates **138 SF → 149 SF**.
3. **Removed** (red) — **toilet removed from Bath 2** (present in Current, gone in Incoming; faint ghost at old location).

## Forma host UI & Files screen (hybrid — Approach 3)

Lightweight recreation of the chrome, real engineering on the file row + interactions.

- **Black top bar:** "AUTODESK Forma" wordmark; AI-spark / "?" help / "EC" avatar on the right.
- **Sub-bar:** "Data Management ▾" + breadcrumb "P1016 · SFH2X".
- **Left nav:** icon+label list (Files active, Specifications, Reviews, Transmittals, Issues, Boards, …
  Reports, Members, Bridge) — believable, static scaffolding.
- **Folder tree:** the P1016 tree with "04 NTA Approved" selected, rendered lightweight.
- **File table (crisp/interactive):** columns Name · Revision · Version · Review status · Last updated ·
  Updated by; the three rows from the screenshot. The target row carries the inline action button, the
  Version cell (V1→V2), and the Review status badge.

## Floor plan (SVG)

One reusable `FloorPlan.tsx` inline-SVG component: `version: 'current' | 'incoming'`, optional `focus`.
Drawn in proper CD/monochrome convention, faithfully reproducing the **A102** layout: same room
arrangement and **names + SF** (Primary Bdrm 254, Primary Bath 163, Bath 2, Laundry 52, Linen, Walk-in
Closet 98, Corridor 144, Bedroom 2 126, Bedroom 3 138, Bonus Room 366, shafts), **grid 1–9 / A–E with
bubbles**, door tags in circles, door-swing arcs, window tags (W2-0 etc.), wall poché. Panes show the plan
only (sheet identity is in the top bar). The densest minor annotations may be simplified for legibility,
nothing that breaks the illusion for an architect. The `incoming` variant adds the door swings (Corridor),
the shifted Bedroom 3 partition + updated SF, and removes the Bath 2 toilet; plus the highlight layer.

## Architecture

Files under `app/HA-DrawingAnalyzer/demo/`:
- `page.tsx` — route, full-bleed, `noindex`, mobile guard, renders `<FormaPrototype/>`.
- `FormaPrototype.tsx` — `'use client'`; state machine, screen switching, toast, restart, cursor-restore wrapper.
- `FormaShell.tsx` — top bar + sub-bar + left nav.
- `FilesScreen.tsx` — folder tree + file table + target-row states + inline action + upload trigger.
- `UploadDialog.tsx` — upload modal (drop-zone, mock file, progress).
- `ChangeValidation.tsx` — hero screen (top bar, two panes, change rail, footer actions).
- `FloorPlan.tsx` — the SVG plan.
- `data.ts` — file rows + the three changes (id, type, title, description, crop `viewBox`, marker position).

**State** (in `FormaPrototype`): `screen: 'files' | 'review'`, `version: 1 | 2`,
`status: 'none' | 'in-review'`, transient `uploading` / `validating` / `toast`, `focusedChange: string | null`.
Restart resets all.

## Styling

A Forma/ACC palette kept **separate** from the portfolio's `autodesk-blue`:
- top bar near-black (`#1a1a1a`), surfaces white, page bg `#fafafa`, borders `~#e6e6e6`/`#d9d9d9`,
  text `#1a1a1a` / muted `#5a5a5a`.
- ACC-style UI blue `~#0d66d0` for links, primary buttons, version pills (V1/V2 outlined blue).
- buttons: primary = solid blue; secondary = white + gray border.
- tags: Added `#2e7d32`, Modified `#b8860b`, Removed `#c62828`.
- font: Inter (already loaded; close to Autodesk Artifakt).

All styling scoped to the demo; the portfolio is untouched.

## Gotchas to handle

- `globals.css` sets `* { cursor: none !important }` (site hides the OS cursor) — the demo root must
  restore `cursor: auto` (same approach `.ha-page` uses), or the prototype has no pointer.
- Ensure the demo route renders clean/full-screen without portfolio chrome — verify `app/layout.tsx`
  for any global nav/cursor and scope around it.

## Verification

Throwaway concept prototype → no automated tests (YAGNI). Verify by running the dev server and clicking:
- happy path: upload → V2 → Submit for review → Change Validation → Confirm & submit → success toast + "In review" badge.
- return path: Change Validation → Return to drawing → back at V2 state.
- card → pane focus interaction works.
- mobile guard shows the desktop-only message.
- `npx tsc --noEmit` passes.

Desktop-first; the two compare panes stack gracefully on narrower (but still ≥lg) screens.
