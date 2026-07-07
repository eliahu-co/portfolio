# MA-HomeAssignment — Coin Master–Themed Copy of HA-DrawingAnalyzer

**Date:** 2026-07-07
**Branch:** `moonactive`
**Status:** Approved

## Goal

Create a copy of the HA-DrawingAnalyzer main page at `/MA-HomeAssignment` and restyle it
with the Coin Master (Moon Active) brand: playful gold/violet/crimson identity in the
hero and interactive elements, a warm readable cream body, and game-styled panels for
the workflow diagrams and value/risk cards. Content is unchanged — this is a visual
restyle only.

Design direction was validated visually with the brainstorm companion: hybrid direction
"C" (branded hero, calm body) plus full-immersion "B" elements for buttons, workflow
panels, and value/risk cards; workflow panel finalized as the parchment/wood treatment.

## Scope

**Copied** (from `app/HA-DrawingAnalyzer/` to `app/MA-HomeAssignment/`):

- `page.tsx`
- `SideNav.tsx`
- `sections.ts`
- `sections/` (all files: Hero, UseCase, useCaseData, Prioritization, MVP,
  PrototypeDemo, KeyUnknowns, AssumptionsSources, Approach, Section, DemoVideo)

**Not copied:** the `/demo` and `/presentation` subroutes. Links in the copied page
that point to the prototype keep their existing `/HA-DrawingAnalyzer/demo` targets.

**Untouched:** everything under `app/HA-DrawingAnalyzer/` stays exactly as it is,
including its Autodesk tokens in `tailwind.config.ts`.

**Routing:** Next.js App Router — the folder name alone wires `/MA-HomeAssignment`.

**Metadata:** identical to the original except the OpenGraph `url`, which becomes
`https://eliahu.co/MA-HomeAssignment`. `robots: { index: false, follow: false }` stays.

## Theme Tokens

Added to `tailwind.config.ts` under `theme.extend.colors` (existing tokens untouched):

| Token             | Hex       | Use                                            |
| ----------------- | --------- | ---------------------------------------------- |
| `cm-violet`       | `#3B1F63` | Hero gradient mid, headings                    |
| `cm-violet-deep`  | `#2A1B54` | Hero gradient start, dark text accents         |
| `cm-gold`         | `#F5A800` | Buttons, section rules, value-card edges       |
| `cm-gold-bright`  | `#FFC93C` | Hero title, highlights                         |
| `cm-coin`         | `#FFCB70` | Workflow parchment panel surface               |
| `cm-wood`         | `#903900` | Panel frames, outlines, warm labels            |
| `cm-sky`          | `#4FBFEF` | AI-step highlight, info surfaces               |
| `cm-crimson`      | `#C8102E` | Eyebrows, risk cards, button drop-shadow       |
| `cm-cream`        | `#FFF9EE` | Page background                                |

In the copied files, every `autodesk-blue`, `charcoal`, and hardcoded `#f4b400`
usage is remapped to these tokens per the component map below. (`charcoal` maps to
neutral dark text — keep readable grays where it is body text; brand tokens where
it is an accent.)

## Typography

- Body/headings keep the site's existing fonts (`font-serif` Playfair, `font-sans` Inter).
- The hero title uses **Lilita One** (Google Fonts, loaded via `next/font/google`
  in `app/MA-HomeAssignment/page.tsx` only — page-scoped, no global impact) as the
  chunky Coin Master–style display face, in `cm-gold-bright` with a `cm-crimson`
  drop-shadow.

## Component Styling Map

Matches the approved browser mockups (`coinmaster-style-v2.html`, choice C+B mix;
`workflow-panel-v3.html`, choice B).

- **Hero** — full-bleed violet gradient banner (`cm-violet-deep` → `#4A1E7A`);
  gold eyebrow; Lilita One title in gold with crimson drop-shadow; light lavender
  intro text; CTA as a gold pill button (gold gradient, violet text, crimson bottom
  edge shadow).
- **Page body** — `cm-cream` background; body text stays dark/readable; section
  headings deep violet serif; eyebrows crimson; the `border-t-4` section rules become
  gold→crimson gradient bars.
- **Pills/tags** — rounded gradient chips: gold gradient with violet text (e.g. the
  "DA" tag), violet gradient with white text (roles/actors).
- **Buttons/links** — gold pill treatment for primary actions; text links shift from
  Autodesk blue to `cm-wood` with crimson hover.
- **Workflow comparison** (parchment/wood, per selection B):
  - Panel: `cm-coin`-family warm gradient surface, 2px `cm-wood` border, rounded 14px,
    chunky wood drop edge.
  - Current lane: muted warm-brown header; near-white translucent step cards with
    faint wood borders; late-error/reject steps outlined crimson.
  - Proposed lane: `cm-wood` header rule; AI step is a sky-blue (`cm-sky`) gradient
    card with dark-teal border, bold text, and glow; approve steps outlined green
    (`#4C9B3C` family).
  - Connectors and legend recolored to match (wood/sky instead of charcoal/blue).
- **Value/risk cards** — white rounded cards (10px), soft violet-tinted shadow;
  value cards: thick `cm-gold` left edge and gold star; risk cards: thick
  `cm-crimson` left edge, warning badge stays gold-on-white; tradeoff line uses
  `cm-wood`/`cm-crimson` instead of `#f4b400`.
- **Blockquotes** — gold left border.
- **SideNav** — same behavior; active item gold, hover crimson.
- **Cursor/print overrides** — the `.ha-page` style block is kept (renamed scope
  class `.ma-page`), including the native-cursor override and print rules; print
  background forces white.

## Testing & Verification

- `npm test` — existing suite stays green (original page untouched).
- `npm run build` — the new route compiles.
- Visual pass on the dev server at `/MA-HomeAssignment` against the approved mockups
  (hero, section rules, workflow panel, value/risk cards, pills, buttons).

## Out of Scope

- No copy of `/demo` or `/presentation`.
- No content/text changes beyond the OG `url`.
- No changes to the original HA-DrawingAnalyzer page or shared site components.
