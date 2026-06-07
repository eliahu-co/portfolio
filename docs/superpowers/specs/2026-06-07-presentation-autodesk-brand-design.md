# Presentation — Autodesk Brand Alignment Design Spec

**Date:** 2026-06-07
**Branch:** `feature/presentation-graphics`
**Scope:** `app/HA-DrawingAnalyzer/presentation/**` only, plus a **scoped** Inter font load inside
`presentation/page.tsx`. No edits to `/HA-DrawingAnalyzer`, the `/demo` route, global
`app/layout.tsx`, or `tailwind.config.ts`. Yellow is applied via arbitrary `#ffff00` (no new
Tailwind token). The shared `sections/DemoVideo.tsx` is **not** edited (it's the real product UI);
slide 16 only restyles its own button/text.

## Goal

Make the deck read as Autodesk-brand: sans-serif (no serif), bigger type with strong weight
contrast, black/white-dominant palette with Hello Yellow as the single pop accent (no blue),
square images, heavier/neutral borders, and editorial cleanups (user-as-pill, no repeated
"Phase"/"User" labels).

## Brand reference (from brand.autodesk.com)

- **Type:** Artifakt (proprietary) → substitute **Inter**. Headlines bold/black, body regular,
  subheads semibold. Sentence case, no trailing periods. Big type, weight-driven hierarchy.
- **Color:** Black `#000000` + White `#ffffff` dominate (~70–80%). **Hello Yellow `#FFFF00`** is
  the pop accent (~15–20%), used as fills/highlights with **black on top** — never as text or
  thin lines on white (fails contrast). Slate `#666666` (already the `charcoal` token) for
  secondary text/lines. Blues are tertiary/functional only → **removed from the deck**.
- **Imagery/layout:** square corners, heavier neutral borders when present, high-contrast,
  clarity-first.

## Color role mapping (replace every `autodesk-blue` usage in `presentation/`)

| Old (blue) usage | New |
|---|---|
| Eyebrows (`text-autodesk-blue`) | `text-black` (bold, uppercase, tracked) |
| Headline accent words | black; key phrase on Recommendation = black text on a **yellow** highlight |
| Lifecycle circles border/initials | black outline, black initials |
| Lifecycle stage brackets + labels | black (labels `text-black`; muted stays faded) |
| Workflow "Proposed" lane (labels/borders) | black / bold (Current lane = slate `charcoal`) |
| Workflow AI step (`bg-autodesk-blue/10` + blue glow + blue ⚡ + blue DA pill) | **yellow fill** `bg-[#ffff00]`, black border, black ⚡, **black** DA pill (white text). Drop the glow. |
| Workflow approve step (blue border) | heavy **black** `border-2` + black ✓ |
| Actor pills (blue/charcoal) | black outline pills (`border-black text-black`) |
| Selected-use-cases winner shimmer (blue gradient) | static **yellow band** `bg-[#ffff00]` behind black text (remove the shimmer animation) |
| Prioritization winner row (blue gradient) | **yellow band** `bg-[#ffff00]`, black text/total |
| Prioritization table header underline / medal totals (blue) | black |
| Key Unknowns labels (`text-autodesk-blue`) | black |
| Slide-16 prototype button (`bg-autodesk-blue`) | `bg-black` text-white |
| Mvp "in scope" check / accents (blue) | black |

`charcoal` (#666) stays as the secondary/slate tone — it is already on-brand.

## A. Typography (scoped)

1. `presentation/page.tsx`: `import { Inter } from 'next/font/google'`, instantiate with
   `weight: ['400','500','600','700','800','900']`, `subsets: ['latin']`,
   `variable: '--font-deck'`. Wrap the deck: `<div className={inter.variable}><PresentationDeck/></div>`.
2. `PresentationDeck.tsx` scoped `<style>`: add
   `.deck-root, .deck-root * { font-family: var(--font-deck), system-ui, sans-serif !important; }`
   — forces Inter across the deck regardless of `font-serif`/`font-sans` classes (deck-scoped only).
3. In presentation components, headings that were `font-serif` get heavier weight + larger size
   (e.g. `font-extrabold` / `font-black`, bumped clamp sizes). Body stays regular. This is visual
   only — the `font-family` override already removes the serif.

Heading scale (SlideShell title): `text-[clamp(34px,5vw,64px)]`, `font-extrabold`, `tracking-[-0.01em]`,
sentence case. Eyebrow: `text-[12px] font-bold uppercase tracking-[0.14em] text-black`.

## B. Per-file changes (all under `presentation/`)

- **primitives.tsx**
  - `SlideShell`: title → Inter heavy + bigger (above); eyebrow → black.
  - `Counter`: unchanged (slate) — fine.
  - `MiniWorkflow` / `MiniCard` / `ScoreTable`: recolor per the map (black/slate + yellow winner band, black value bar; risk bar may stay amber `#caa000` as a functional status or go black — **decision: black** to stay on-palette).
- **ExecWorkflow.tsx**: AI step → yellow fill + black ⚡ + black DA pill (no glow); approve → black `border-2` + black ✓; lane headers black (Proposed) / slate (Current); connectors black (Proposed) / slate (Current); actor pills → black outline.
- **slides/Slide01Cover.tsx**: title Inter heavy; remove any rounding; scrim stays. Title/subtitle black.
- **slides/Slide02AboutMe.tsx**: family photo `rounded-lg shadow-sm` → square, no shadow; timeline → black (drop blue); bullets markers → black.
- **slides/Slide03Approach.tsx**: circles/brackets/labels → black; flow arrows already black; keep faded BP/BN.
- **slides/Slide04SelectedUseCases.tsx**: winner row → yellow band (black text), remove shimmer/`cv-shine`; medals stay.
- **slides/SlideUseCase.tsx**: **User → a single black pill** placed top-right of the slide (fixed position), drop the "USER" text row; **remove the "Phase" line**; square the image (remove `rounded-lg`); drop blue border (UC2 already borderless; others → square, border removed or black — **decision: remove borders, square**).
- **slides/Slide09Assumptions.tsx**: left border accents → black/slate.
- **slides/Slide10Framework.tsx**: criterion bars/numbers → black.
- **slides/Slide11Results.tsx**: winner via `ScoreTable` yellow band.
- **slides/Slide12Recommendation.tsx**: "Change Validation" → black text on a **yellow** highlight (`bg-[#ffff00] px-2`); pillars top-border → black.
- **slides/Slide13Workflow.tsx** & **Slide14ValueRisks.tsx**: recolor via `MiniWorkflow`/`MiniCard` (black/slate; value/risk bars black).
- **slides/Slide15MvpScope.tsx**: in/out markers → black/slate.
- **slides/Slide16Prototype.tsx**: button `bg-black text-white`; text black. `DemoVideo` untouched.
- **slides/Slide17KeyUnknowns.tsx**: labels → black.

## C. User pill (fixed position)

On `SlideUseCase`, render the primary user as a solid black pill — `bg-black text-white text-[11px]
font-semibold uppercase tracking-wider px-2.5 py-1 rounded-sm` — positioned consistently
**top-right** of the slide body (absolute within the slide, or a top row aligned right). Same x/y on
every use-case slide. No "USER" label text; no "PHASE" line.

## Acceptance criteria

- No `font-serif` renders anywhere in the deck (Inter everywhere); headlines are visibly heavier/bigger.
- No `autodesk-blue` color appears in any `presentation/` file (grep clean); palette is black / white /
  slate / `#ffff00` only.
- Yellow appears only as fills/highlights with black content on top (never yellow text/lines on white).
- All deck images have square corners; no rounded image.
- Use-case slides show a single user pill in a consistent position; no repeated "USER"/"PHASE" labels.
- `/HA-DrawingAnalyzer`, `/demo`, `app/layout.tsx`, and `tailwind.config.ts` are unchanged
  (`git diff --name-only main` shows only `presentation/**` + this spec/plan).
- `npx tsc --noEmit` clean.

## Out of scope

- Editing `sections/DemoVideo.tsx` or any non-presentation file.
- Obtaining the real Artifakt font.
- Restyling the `/demo` prototype or the `/HA-DrawingAnalyzer` page.
