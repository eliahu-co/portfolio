# Task 4 Report: MA presentation concept chapter

## Status

Implemented slides 1 through 11 on branch `presentation`, based on `a2dbfd6`:

1. Cover
2. About
3. Approach
4. Coin Master economy
5. Three bets
6. Hometown thesis
7. Hometown mechanics
8. Card Bounty thesis
9. Card Bounty mechanics
10. Hot Trail thesis
11. Hot Trail mechanics

The change is additive under `app/MA-HomeAssignment/presentation/slides/` plus the focused opening test. No source-assignment, demo, hosting, deployment, merge, or unrelated files were changed.

## TDD evidence

### RED

`__tests__/ma-presentation-opening.test.tsx` was added before any slide implementation. The focused command was then run:

```powershell
npx.cmd jest __tests__/ma-presentation-opening.test.tsx --runInBand
```

Observed expected missing-feature failure:

```text
FAIL __tests__/ma-presentation-opening.test.tsx
Cannot find module '../app/MA-HomeAssignment/presentation/slides/Slide01Cover'
Test Suites: 1 failed, 1 total
Tests:       0 total
```

This established RED against the absent Task 4 slide modules.

### GREEN

After the minimum slide composition was implemented, the focused suite passed. One JSX closing-tag typo was exposed by the first implementation run and corrected; one test-only `Element`/`HTMLElement` type annotation was then tightened for TypeScript.

Fresh final focused result:

```text
Test Suites: 1 passed, 1 total
Tests:       13 passed, 13 total
Snapshots:   0 total
```

The contract covers the eleven-slide headline order, exact cover copy/assets/control-free state, all preserved About content, Brazil hover/focus parity and `slideKey` reset, all six approach steps, the complete economy map, neutral three-bet ordering, and thesis/mechanics framing for all three concepts.

## Requirement checklist

- Cover uses `/coinmaster-sky.webp` and `/coinmaster/coinmaster-logo.webp`, with `Increasing ARPDAU`, `Product Manager - Home Assignment`, and `Eliahu Cohen` visible. It has no slide-local button or link.
- About preserves `Eliahu Cohen`, `Architect, Product Manager`, `/presentation/family.jpeg`, `Brazil → Holland → Israel`, and the six original bullets in order.
- Brazil is a real keyboard-focusable button with `data-deck-interactive="true"`; hover and focus both crossfade to `Eduardo Cohen`. Mouse leave and blur restore Eliahu, Escape can clear the interaction, `slideKey` changes reset it, and print forces the normal Eliahu visual state.
- Approach renders the six canonical `APPROACH_STEPS` as one numbered process ribbon. Each visible label reveals only its supporting annotation and output through the shared callout interaction.
- Economy composes the existing `EconomyMap`, keeping all eight systems, relationships, and three ARPDAU paths visible.
- Three bets composes the existing equal-treatment `ConceptOverview` in Hometown, Card Bounty, Hot Trail order, with no medal, total, score, winner, or ranking styling.
- Each thesis slide composes the corresponding existing mockup-led `ConceptThesis` with the approved thesis and monetization summary visible.
- Each mechanics slide composes the corresponding existing `MechanicsLoop`, keeping its full loop, monetization summary, motivation labels, and risk labels visible while supporting explanations remain additive.
- Concept framing is explicitly thesis/mechanics; no artificial problem slide or AEC legacy label was introduced.
- Interactive content consumes the supplied `slideKey` through `useDeckReset` directly or via the existing shared components.

## Verification

Focused Task 4 test:

```powershell
npx.cmd jest __tests__/ma-presentation-opening.test.tsx --runInBand
```

Result: exit code 0, 1 suite and 13/13 tests passed.

TypeScript:

```powershell
npx.cmd tsc --noEmit --incremental false
```

Result: exit code 0 with no diagnostics.

Whitespace and scope:

```powershell
git diff --cached --check
```

Result: exit code 0. Staged scope contains only the focused test and eleven slide files before this report is added.

All six required local images exist: the cover sky/logo, family photo, and the three canonical concept mockups.

## Concerns

- Jest still emits the pre-existing duplicate manual-mock warnings for `three` and `three-jsm` from `.superpowers/worktrees/card-bounty-entry-attention`; the focused suite exits 0 and Task 4 does not modify that nested worktree or Jest configuration.
- Full route/browser/print QA is intentionally deferred until Task 8 integrates the registry and deck controller. Task 4 nevertheless keeps the content within the existing fixed-stage primitives and includes explicit print behavior for the preserved About identity.
- Independent review is intentionally not included here because the parent agent supplies the required reviewer.

## Commit

Requested message: `feat: build MA presentation concept chapter`.

## Review finding fix: Escape ownership on the Brazil control

The independent Task 4 review found that the Brazil button consumed Escape and called `reset()` while retaining DOM focus. That produced an inconsistent focused state: the button was still focused, but the heading reverted from Eduardo to Eliahu, and the deck never received Escape despite there being no pinned About state to clear.

### Fix RED

A regression test was added first. It focuses Brazil, sends Escape through the real control, and requires the event to remain uncancelled, reach a parent deck handler, and leave the accessible heading as `Eduardo Cohen`.

Exact command:

```powershell
npx.cmd jest --runTestsByPath __tests__/ma-presentation-opening.test.tsx --runInBand
```

Observed expected RED:

```text
FAIL MA presentation opening chapter › leaves Escape to the deck while Brazil remains focus-active
Expected: true
Received: false
Test Suites: 1 failed, 1 total
Tests:       1 failed, 13 passed, 14 total
```

The failure proved the existing handler called `preventDefault()` before the deck could own Escape.

### Fix GREEN

The slide-local `onKeyDown` handler was removed. Brazil now derives Eduardo strictly from hover/focus, and Escape bubbles normally to the deck.

Exact focused command and output:

```powershell
npx.cmd jest --runTestsByPath __tests__/ma-presentation-opening.test.tsx --runInBand
```

```text
Test Suites: 1 passed, 1 total
Tests:       14 passed, 14 total
Snapshots:   0 total
```

Exact TypeScript command:

```powershell
npx.cmd tsc --noEmit --incremental false
```

Result: exit code 0 with no diagnostics.

The focused Jest run continues to emit only the documented pre-existing duplicate `three` and `three-jsm` manual-mock warnings.
