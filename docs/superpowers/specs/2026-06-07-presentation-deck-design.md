# Presentation Deck — Design Spec

**Date:** 2026-06-07
**Branch:** `feature/presentation`
**Route:** `/HA-DrawingAnalyzer/presentation` (additive, unlisted)

## Goal

Add an executive 17-slide presentation deck for an Autodesk PM interview that feels
like a natural extension of the existing `/HA-DrawingAnalyzer` page — same visual
language, typography, color palette, and content. The deck is keyboard-navigable,
crossfades between slides, linearizes cleanly for print/PDF, and falls back to a
vertical scroll on mobile.

## Hard constraints

- **Additive only.** New files live under `app/HA-DrawingAnalyzer/presentation/`.
  No existing route (`/`, `/HA-DrawingAnalyzer`, `/HA-DrawingAnalyzer/demo`, etc.)
  changes behavior or rendered output.
- **Existing section files are left untouched** (`sections/*.tsx`, `demo/*`). The deck
  does not add exports to or otherwise edit them.
- **Unlisted:** `robots: { index: false, follow: false }` on the route metadata.
- **Work stays on `feature/presentation`.** Nothing committed to `main` without
  explicit user confirmation.

## Decisions (confirmed with user)

1. **Content source:** Reuse real data, not placeholder copy, wherever it exists.
   - `USE_CASE_1..4` are already exported from `sections/useCaseData.ts` → import directly.
   - Scoring `ROWS`, `CRITERIA_DEFS`, `SCOPE_IN`/`SCOPE_OUT`, `ASSUMPTIONS`, `VARIABLES`,
     and the Approach phase content are **module-local** in their section files. Because
     those files must stay untouched, their **current real values are copied** into a new
     `presentation/deckData.ts`. Each copied block carries a comment naming its source of
     truth, e.g. `// SOURCE: sections/Prioritization.tsx ROWS — keep in sync`.
   - Genuinely new content is marked `TODO`: About Me timeline copy/photo, the four
     use-case mockup images, recommendation pillars wording, the QR code.
2. **Component reuse:** Existing visual blocks in `UseCase.tsx` (workflow lanes, the
   ●⚑✕✓⟲⚡︎ glyphs, `Card`) are **not** exported and must not be edited. The deck
   **rebuilds simplified slide-local copies** of those visuals in `presentation/primitives.tsx`.
   `Section`/`Pill`/`CardList` remain importable if convenient, but the deck favors its own
   larger-scale primitives sized for projection.
3. **Slide count:** 17, exactly as enumerated in the brief.

## File structure (all new)

```
app/HA-DrawingAnalyzer/presentation/
  page.tsx              Server component. Exports metadata (noindex/nofollow,
                        title "AI Drawing Analyzer — Presentation"). Renders <PresentationDeck/>.
  PresentationDeck.tsx  'use client'. Owns slide state + navigation + crossfade + counter
                        + responsive/print orchestration. Renders all 17 slides.
  deck.css              Crossfade classes + @media print linearization + mobile rules
                        (imported by PresentationDeck, scoped under a .deck root class).
  deckData.ts           Imports USE_CASE_1..4; holds copied real values (ROWS, CRITERIA,
                        SCOPE, ASSUMPTIONS, VARIABLES, APPROACH_PHASES) with source comments.
  primitives.tsx        Slide-local presentational building blocks (below).
  slides/
    Slide01Cover.tsx … Slide17KeyUnknowns.tsx   One component per slide.
```

### `primitives.tsx`

- `SlideShell({ index, eyebrow?, title?, children })` — full-viewport flex container,
  white bg, generous padding, optional blue eyebrow + serif title; wraps content centered.
  Used by every slide for consistent margins/typography.
- `MiniWorkflow({ current, proposed })` — simplified two-lane Current vs Proposed visual.
  Renders step boxes with the glyph set (`● ⚑ ✕ ✓ ⟲ ⚡︎`) and the blue accent for the
  proposed lane. Larger than the website version, fewer annotations. Self-contained
  (does not import from `UseCase.tsx`).
- `MiniCard({ title, tone })` — heading-only card (value=blue / risk=amber accent bar),
  larger type. For slide 14.
- `ScoreTable({ rows, criteria })` — projection-scale scoring table; winner row uses the
  same blue shimmer/highlight treatment as the website (slide 11).
- `Counter({ index, total })` — subtle "n / 17" bottom-right.

### Tokens & type (must match site)

- Colors via Tailwind tokens: `autodesk-blue` (#0696d7), `charcoal` (#666), `ink`/black,
  white bg; type accents green `#2e7d32`, amber `#f4b400`, red `#c62828`.
- `font-serif` (Cormorant Garamond) for headings/statements; `font-sans` (DM Sans) for
  labels/body. Eyebrows: blue, uppercase, bold, tracked — matching the page eyebrow style.

## Navigation & interaction (`PresentationDeck.tsx`)

- State: `const [current, setCurrent] = useState(0)` (0-indexed; 17 slides).
- On mount, sync from `location.hash` (`#slide-3` → index 2) if present.
- Keyboard (window listener, desktop layout only):
  - `ArrowRight` / `Space` (no shift) → next (clamped at 16).
  - `ArrowLeft` / `Shift+Space` → previous (clamped at 0).
  - `Escape` → `router.push('/HA-DrawingAnalyzer')`.
  - `preventDefault()` on Space so the page doesn't scroll.
- On `current` change, update `history.replaceState` hash to `#slide-n` (stable anchors,
  no scroll jump).
- Rendering (desktop, `hidden lg:block` wrapper):
  - All 17 slides mounted, each `position:absolute inset-0`, `id="slide-n"`.
  - Active slide: `opacity-100 z-10`. Inactive: `opacity-0 pointer-events-none z-0`.
  - `transition-opacity duration-[250ms]` for the crossfade.
- `Counter` fixed bottom-right.

## Responsive & print

- **Mobile / tablet (`lg:hidden` wrapper):** the same 17 slide components render in normal
  document flow, stacked vertically, each `min-h-screen`, page scrolls. No fixed overlay,
  no crossfade, no keyboard layer. Counter hidden.
- **Print (`@media print` in `deck.css`):** force every slide `position:static; opacity:1;
  pointer-events:auto; break-after:page;`. Hide counter and any nav affordances. White
  background. Produces a clean linear multi-page PDF as a backup deck.

## Slide content map

| # | Slide | Primary source | TODO |
|---|-------|----------------|------|
| 1 | Cover | Static: "AI Drawing Analyzer" / "Product Opportunities & MVP Recommendation" | — |
| 2 | About Me | new | timeline Brazil→NL→IL, 6 yrs ConTech, Product+Eng; photo/copy |
| 3 | Approach | `APPROACH_PHASES` (copied) | confirm phase labels |
| 4 | Selected Use Cases | `USE_CASE_1..4` title/user/phase + 🥇🥈🥉 | — |
| 5 | Change Validation | `USE_CASE_1` user/phase/1-line problem | mockup image |
| 6 | Context Link | `USE_CASE_2` | mockup image |
| 7 | Coordination Lock | `USE_CASE_3` | mockup image |
| 8 | Program Conformance Review | `USE_CASE_4` | mockup image |
| 9 | Assumptions | `ASSUMPTIONS` (copied) as cards | — |
| 10 | Prioritization Framework | `CRITERIA_DEFS` (copied) 1/3/5 rubric | — |
| 11 | Prioritization Results | `ROWS` (copied) via `ScoreTable`, CV highlighted | — |
| 12 | Recommendation | Static statement + 3 pillars (Highest Confidence / Highest Platform Leverage / Fastest Learning) | confirm pillar copy |
| 13 | Workflow | `USE_CASE_1` current/proposed via `MiniWorkflow` | — |
| 14 | Value & Risks | `USE_CASE_1` value/risk **titles only** via `MiniCard` | — |
| 15 | MVP Scope | `SCOPE_IN`/`SCOPE_OUT` (copied), large type | — |
| 16 | Interactive Prototype | poster screenshot + `eliahu.co/HA-DrawingAnalyzer/demo` URL + QR placeholder; layout leaves room to swap in a live embed later | real QR |
| 17 | Key Unknowns to Validate | `VARIABLES` (copied) — Accuracy / Latency / Cost | — |

## Acceptance criteria

- `npm run dev` renders `/HA-DrawingAnalyzer/presentation` with all 17 slides and stable
  `#slide-1..#slide-17` anchors.
- Keyboard nav works: arrows, Space/Shift+Space, Escape→`/HA-DrawingAnalyzer`.
- Crossfade ~250ms between slides.
- Print preview produces a clean linear PDF (one slide per page).
- Mobile renders slides stacked and scrollable.
- `noindex, nofollow` present on the route.
- `/HA-DrawingAnalyzer` and all other routes render **unchanged** (verified explicitly:
  `git diff main -- app/HA-DrawingAnalyzer` shows only new `presentation/` files).
- `npx tsc --noEmit` passes.
- All work on `feature/presentation`; nothing on `main`.

## Out of scope

- Real mockup images, QR code generation, final About Me / pillar copy (left as TODO).
- Any refactor of existing section files to dedupe data (would require touching them).
- Live-embedding the interactive prototype inside slide 16 (layout leaves room; not built).
