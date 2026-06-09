# Slide 19 Validation Roadmap — Design

**Date:** 2026-06-09
**Branch:** `feature/presentation-validation-roadmap` (off `feature/presentation-failure-modes-rebased`)
**Scope:** Presentation deck only — `app/HA-DrawingAnalyzer/presentation/**`.

## Goal

Add a second, independent reveal to slide 19 ("Key unknowns to validate"): an 8-step
**validation roadmap** that is hidden by default and revealed by clicking the
**"Feasibility"** eyebrow. The roadmap is a single linear row of step titles; hovering a
step highlights it in yellow and shows that step's description sentence below the row.

This coexists with the existing **"validate" → failure-modes** reveal already on the slide
(built on the parent branch). The two reveals are independent.

## Content

A new `VALIDATION_STEPS` array (added to `deckData.ts`), in order. Each entry is a `title`
shown in the flow row and a `body` sentence shown on hover.

| # | title | body |
|---|---|---|
| 1 | Align | Pin down the target user, the workflow entry point, and the business objective. |
| 2 | Baseline | Measure the current review cycle to establish a baseline. |
| 3 | Data test | Run on historical drawing reviews — measure accuracy, noise, latency, and failure. |
| 4 | User test | Put prototype outputs in front of designers — do they understand, trust, and act? |
| 5 | Thresholds | Set the minimum acceptable confidence, latency, and signal-to-noise rate to surface a change. |
| 6 | MVP scope | Lock the smallest workflow that proves value. |
| 7 | Pilot | Launch on a small set of projects to validate in the field. |
| 8 | Decision | Scale, narrow scope, or pivot based on what the pilot shows. |

Titles render in uppercase via CSS; data is stored in sentence case as above.

## Interaction

State in `Slide17KeyUnknowns.tsx` (already a client component):

- `revealed` (existing) — failure-modes reveal, toggled by clicking "validate" in the title. **Unchanged.**
- `roadmap` (new, boolean) — roadmap reveal, toggled by clicking the "Feasibility" eyebrow.
- `hovered` (new, `number | null`) — index of the hovered step; `null` = none.

Behavior:

1. **Trigger.** The eyebrow "Feasibility" becomes a click toggle. It uses a `<span role="button" tabIndex={0}>` with `onClick` + Enter/Space `onKeyDown` (default arrow cursor — no pointer finger, consistent with the existing "validate" toggle). No yellow highlight on the word.
2. **On reveal (`roadmap === true`):**
   - The eyebrow, the title, and the three Accuracy/Latency/Cost columns all fade to `opacity-[0.16]` with a 300ms transition.
   - The **title + columns** block gets `pointer-events-none` so the faded "validate" word and column content underneath are not clickable. The **eyebrow stays interactive** (it is a separate element, not inside that block) so the user can click it again to toggle the roadmap back off.
   - The roadmap section fades in below the columns at full opacity, separated by a thin top divider (`border-t border-charcoal/15`, `pt-…`).
3. **Roadmap diagram:** a single centered, non-wrapping (`flex-nowrap`) row of the 8 step titles, each followed by a `→` connector except the last. Titles are uppercase, bold, `text-[13px]`.
4. **Hover a step:** the step gets a yellow background (`bg-[#ffff00]`) and stays black; the step's `body` sentence renders in a centered, fixed-height area below the row (`min-h-[2.75rem]`, `text-[16px]`, charcoal) so the layout never shifts. When no step is hovered, the area is empty.
   - Steps are hover-only (no click), rendered as plain `<span>`s, so the cursor stays the default arrow.
5. **Reset on navigation:** the existing `deck:navigate` listener resets `revealed`; extend it to also reset `roadmap` and `hovered`, so returning to the slide starts clean.


## Files

- **Modify** `app/HA-DrawingAnalyzer/presentation/deckData.ts` — add `VALIDATION_STEPS`.
- **Modify** `app/HA-DrawingAnalyzer/presentation/slides/Slide17KeyUnknowns.tsx` — add the eyebrow trigger, the fade of eyebrow/title/columns, and the roadmap row + hover description.

No changes to `PresentationDeck.tsx`, `nav.ts`, `primitives.tsx`, or any non-presentation file.
`SlideShell`'s `eyebrow` prop renders a plain `<p>`; to make the eyebrow clickable, the
slide will render its own eyebrow markup instead of passing `eyebrow`/`title` to `SlideShell`
(it already renders a custom title for the "validate" interaction).

## Verification

- `npx tsc --noEmit` clean.
- `npx jest presentation-nav` passes (no nav surface change, but run as a guard).
- Manual on localhost: clicking "Feasibility" fades eyebrow/title/columns and shows the roadmap
  below; hovering each step highlights it yellow and shows the right sentence below; the
  description area does not shift the layout; "validate" failure-modes reveal still works; both
  reset when navigating away and back.

## Out of scope

- No changes to the failure-modes content or trigger.
- No new slide; no navigation/Thank-You changes.
- No print-specific handling beyond what the slide already inherits.
