# Card Bounty Final Polish Implementation Plan

> **For Codex:** Execute this plan test-first in the current `finetuning` checkout. Preserve unrelated dirty files and stage only named task files.

**Goal:** Make the Card Bounty prototype match the approved final-polish design across mobile and desktop without changing the separate portfolio preview.

**Architecture:** Keep the existing reducer-driven flow and component boundaries. Add explicit reducer transitions for warned target changes and returning to Cards Center, centralize the current-action cue in a small CSS module, and fix the visual hierarchy within the existing layouts.

**Tech stack:** Next.js, React, TypeScript, CSS Modules, Jest/Testing Library.

---

## Task 1: Lock the 150-point economy and target-change state contract

**Files:**
- Modify: `app/MA-HomeAssignment/demo/__tests__/demoReducer.test.ts`
- Modify: `app/MA-HomeAssignment/demo/demoData.ts`
- Modify: `app/MA-HomeAssignment/demo/demoReducer.ts`

1. Update reducer tests to expect a 150 threshold, cap progress at 150, and complete after five default Magical Chest batches.
2. Add failing tests for `REQUEST_TARGET_CHANGE`, `CANCEL_TARGET_CHANGE`, and `CONFIRM_TARGET_CHANGE`: request and cancel preserve target/progress/coins; confirm clears target and progress, unlocks selection, and opens the picker.
3. Add a failing test for `RETURN_TO_CARDS_CENTER` preserving completed resources/state while changing the visible base screen.
4. Run `npx.cmd jest app/MA-HomeAssignment/demo/__tests__/demoReducer.test.ts --runInBand` and confirm failures describe the missing behavior.
5. Change `BOUNTY_THRESHOLD` to 150 and implement the actions/overlay state without mutating state before confirmation.
6. Re-run the focused reducer test until green.

## Task 2: Wire copy, target-change warning, dynamic threshold, and guided CTAs

**Files:**
- Modify: `app/MA-HomeAssignment/demo/__tests__/CardBountyPrototype.test.tsx`
- Modify: `app/MA-HomeAssignment/demo/__tests__/ChestPurchaseDialog.test.tsx`
- Modify: `app/MA-HomeAssignment/demo/CardBountyPrototype.tsx`
- Modify: `app/MA-HomeAssignment/demo/CardBountyPanel.tsx`
- Modify: `app/MA-HomeAssignment/demo/TargetPicker.tsx`
- Modify: `app/MA-HomeAssignment/demo/ChestPurchaseDialog.tsx`
- Modify: `app/MA-HomeAssignment/demo/RewardSequence.tsx`
- Add: `app/MA-HomeAssignment/demo/GuidedAction.module.css`

1. Update integration expectations from 300/ten batches to 150/five batches and the final coin balance to 1,750,000,000.
2. Add failing intro-copy assertions: old `Coin Chests only` is absent and exact `Guaranteed when meter is complete!` is present.
3. Add failing integration coverage for changing target after one batch, cancelling with 30/150 preserved, and confirming with progress reset before choosing again.
4. Add failing assertions that the Magical Chest remains guided after the first incomplete batch and that the final Cards Center control returns to the center.
5. Update projected-progress assertions to use 150 while retaining ten chests and +30.
6. Run the focused component tests and confirm the new failures.
7. Wire new reducer actions through the prototype. Render the target-change warning in the existing `RibbonDialog` with explicit cancel/confirm controls and progress-loss copy.
8. Remove the permanent disabled/locked Change UI, render threshold labels from state, update intro chips, and keep the Magical Chest guided whenever progress is below threshold.
9. Add a shared guided-action class with a subtle gold halo/nudge and a reduced-motion static cue; apply it only to the current next action in each state.
10. Re-run focused component tests until green.

## Task 3: Correct Cards Center scale and navigation hierarchy

**Files:**
- Modify: `app/MA-HomeAssignment/demo/__tests__/CardsCenterScreen.test.tsx`
- Modify: `app/MA-HomeAssignment/demo/CardsCenterScreen.tsx`
- Modify: `app/MA-HomeAssignment/demo/CardsCenterScreen.module.css`

1. Add source/semantic contract tests for smaller capped grid tracks, both nav labels following their icons, no elevated active-label ribbon, and a reduced-motion-safe bounty-entry cue.
2. Run the focused test and confirm it fails on current styles.
3. Reduce medallion/grid sizing, normalize both nav labels below their icons, express the active state on the tab/icon, and apply the guided entry treatment.
4. Re-run the focused test until green.

## Task 4: Remove confirmation and balance overlaps

**Files:**
- Modify: `app/MA-HomeAssignment/demo/BountyPanels.module.css`
- If required after visual QA: `app/MA-HomeAssignment/demo/RibbonDialog.module.css`

1. Replace the target-confirmation row-spanning layout with explicit grid areas and a bounded preview that cannot enter the action row.
2. Reserve visible space for the card shadow and keep both Back and Select fully visible.
3. Add a real vertical gap between the active topline/coin capsule and selected-target container.
4. Keep narrow-width rules consistent with the new grid rather than reintroducing overlap.
5. Validate geometry in the browser using bounding rectangles at 390x844 and 430x932; require preview bottom to be above action-row top and balance bottom to be above target-container top.

## Task 5: Correct the final Spin controls

**Files:**
- Modify: `app/MA-HomeAssignment/demo/__tests__/SpinReturnScreen.test.tsx`
- Modify: `app/MA-HomeAssignment/demo/SpinReturnScreen.tsx`
- Modify: `app/MA-HomeAssignment/demo/SpinReturnScreen.module.css`
- Modify: `app/MA-HomeAssignment/demo/CardBountyPrototype.tsx`

1. Add failing tests for accessible Shop and Cards Center buttons and the absence of Raid, Booster, and multiplier controls.
2. Add a callback test for Cards Center.
3. Run the focused test and confirm it fails.
4. Replace Raid with Shop using existing original artwork, remove Booster, convert the status strip to energy plus spins, and add a lower-left Cards Center button with a reusable card-back icon.
5. Wire Cards Center to `RETURN_TO_CARDS_CENTER` so it preserves completed state, reflects the earned Collection, disables the completed event entry, retains replay controls, and restores focus to the Cards Center heading.
6. Add keyboard focus styles and mobile-safe positioning outside the Spin button.
7. Re-run focused tests until green.

## Task 6: Restyle the desktop presentation shell

**Files:**
- Modify: `app/MA-HomeAssignment/demo/DemoShell.tsx`
- Modify: `app/MA-HomeAssignment/demo/CardBountyPrototype.module.css`
- Add or modify a narrowly scoped CSS contract test under `app/MA-HomeAssignment/demo/__tests__/`

1. Add failing source assertions that the demo root uses `var(--color-canvas)`, the concept panel uses `var(--color-gray-ui)`, `var(--border)`, `2px`, and `var(--shadow-card)`, and the demo shell no longer references `/coinmaster-sky.webp`.
2. Keep the separate `PrototypePreview` expectation for its cloudy image unchanged.
3. Remove cloud/glow/coin decoration from `DemoShell`, apply the warm canvas, and restyle the Interactive concept controls as a site plaque.
4. Re-run focused tests until green.

## Task 7: Full verification and review handoff

**Files:** all task files only.

1. Run all demo tests: `npx.cmd jest app/MA-HomeAssignment/demo/__tests__ --runInBand`.
2. Run the full relevant assignment suite: `npx.cmd jest __tests__/ma-homeassignment.test.tsx app/MA-HomeAssignment/demo/__tests__ --runInBand` without editing the user's unrelated dirty assignment test.
3. Run `npx.cmd tsc --noEmit --incremental false`.
4. Run `npx.cmd next build`.
5. Start the production build locally and inspect the full flow at 390x844, 430x932, 1366x768, and 1440x900 with the in-app browser.
6. Verify every requested copy/state transition, the five-batch loop, no overlaps, warm desktop shell, preserved cloudy preview, reduced-motion fallback, Shop/Cards Center controls, and final return to Cards Center.
7. Run `git diff --check`, inspect `git diff --stat`, and confirm unrelated dirty files remain untouched.
8. Commit only the new spec, this plan, and exact implementation/test files on `finetuning`. Do not merge or deploy without a separate explicit request.
