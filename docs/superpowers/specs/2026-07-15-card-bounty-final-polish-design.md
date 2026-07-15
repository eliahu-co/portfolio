# Card Bounty Final Polish Design

**Date:** 2026-07-15

**Status:** Approved for implementation
**Supersedes:** Conflicting details in `2026-07-14-card-bounty-coinmaster-fidelity-design.md`

## Objective

Refine the interactive Card Bounty concept so its hierarchy, proportions, and guided loop feel much closer to Coin Master's compact mobile UI while preserving the prototype's existing end-to-end interaction. The work covers the Cards Center, bounty dialogs, purchase loop, return-to-spin screen, and the desktop presentation shell.

## Chosen approach

Use a focused, state-aware refinement rather than a CSS-only patch or a full visual rebuild.

- Keep the existing reducer-driven prototype, generated original artwork, modal shell, and chest projection behavior.
- Correct state and copy where the requested experience cannot be achieved by styling alone.
- Rebalance existing components rather than replacing the prototype with screenshots or a separate implementation.
- Use one consistent, accessible attention treatment on the single next action in each state.

This preserves the working flow while addressing the root causes behind the screenshots: oversized grid tracks, a specially positioned Sets ribbon, a hard target lock, hard-coded threshold text, overlapping grid rows, and decorative desktop cloud layers.

## Experience design

### Cards Center

- Reduce collection medallions to roughly one third of the stage width so two columns have comfortable breathing room.
- Keep each set name ribbon attached to its medallion, but place both bottom-navigation labels below their card icons.
- Show the active Sets state through the tab/icon treatment, not by lifting its label into a ribbon above the icon.
- Give the Card Bounty entry point a gentle repeating nudge and gold glow. In reduced-motion mode, retain a static high-contrast halo.

### Intro dialog

- Preserve the compact centered parchment modal.
- Remove the `Coin Chests only` chip.
- Replace the guarantee chip with the exact copy `Guaranteed when meter is complete!`.
- Make `Choose a Card` the visually guided next action.

### Target selection and confirmation

- Keep Whale Boat as the recommended missing card and give it the guided-action treatment.
- Rebuild the confirmation content with explicit grid areas: event metadata, bounded card preview, explanatory copy, requirement, and a separate action row.
- The card preview must not span into or overlap the Back/Select row at any viewport.
- Reduce the preview enough to leave visible breathing room for its drop shadow.
- Use a requirement of 150 Bounty progress and render the threshold from state rather than hard-coding it in the UI.

### Active bounty and purchase loop

- Retain ten Magical Chests per purchase and the projected meter-progress preview.
- Magical Chests add 30 progress per batch, so five batches complete the 150-point meter.
- Keep only projected progress in the purchase confirmation; current progress is not repeated there.
- Separate the coin balance row from the selected-target container so the coin pill and its shadow cannot cross the container border.
- Keep `Change` available after progress has started.
- Requesting a target change opens a compact confirmation dialog stating that all Bounty progress will be lost.
- Cancel preserves the current target, progress, and coin balance. Confirm resets progress to zero and returns to the target picker. No reset occurs before confirmation.
- Keep the Magical Chest as the guided next action after every incomplete batch, not only the first batch.

### Guided action system

Apply an idle gold halo with a restrained nudge/pulse only to the current recommended action:

1. Card Bounty entry point
2. Choose a Card
3. Whale Boat
4. Select target
5. Magical Chest while the meter is incomplete
6. Confirm purchase
7. Reward-sequence continuation controls
8. Spin on the final screen

Never animate competing actions in the same state. `prefers-reduced-motion` removes translation/scale animation but keeps a static gold outline or shadow so the next action remains obvious.

### Final Spin screen

- Keep the generated wooden slot cabinet and current reel behavior.
- Remove the Booster selector entirely.
- Replace the Raid control with a Shop button using existing original prototype artwork.
- Add a Cards Center button at the lower-left edge of the game UI. It returns to the Cards Center without resetting the completed demonstration state.
- On return, show the earned Collection progress, mark the Bounty event complete, keep replay controls available, and move keyboard focus to the Cards Center heading.
- Keep the tournament badge, energy meter, spin balance, Spin button, and collection-reward confirmation.
- Fit the Cards Center control outside the Spin button's footprint and above mobile safe-area/final-demo controls.

### Desktop presentation shell

- Remove the cloudy blue background, duplicated sky images, glow, and floating coins from the full interactive demo on desktop.
- Use the portfolio canvas token (`--color-canvas`) as the warm desktop background.
- Do not change the separate portfolio miniature/preview, which keeps its cloudy image treatment.
- Style the `Interactive concept` panel like the portfolio plaques: gray UI fill, ink border, 2px radius, and the site card shadow. Its inner controls remain visually subordinate.
- The portrait game stage itself retains its in-game sky/scene backgrounds.

## State model

- Change `BOUNTY_THRESHOLD` from 300 to 150 and derive visible labels from `state.meterThreshold`.
- Replace the permanent target-lock behavior with an explicit target-change warning overlay.
- Add request, cancel, and confirm transitions for target change.
- Confirming a target change clears the selected target, progress, target confirmation, pending purchase, error, and last-earned progress, then opens the target picker.
- Add a return-to-Cards-Center action for the final screen that changes the visible base screen without restarting resources or completion state.

## Accessibility and resilience

- New Shop and Cards Center controls are real buttons with accessible names and visible focus states.
- Existing dialog focus trap, Escape behavior, labelled title, and focus restoration remain intact.
- Attention treatments honor `prefers-reduced-motion`.
- Labels and copy remain readable at narrow mobile widths without relying on external prototype guidance, which is hidden on mobile.

## Acceptance criteria

- Cards Center medallions are visibly smaller and both nav labels sit below their card icons.
- The correct next action is obvious in every interactive state, including after the first Magical Chest purchase.
- Intro copy contains `Guaranteed when meter is complete!` and does not contain `Coin Chests only`.
- The confirmation card and action row do not overlap at 390x844, 430x932, 1366x768, or 1440x900.
- Threshold labels, meter values, and purchase projections consistently use 150.
- Five default Magical Chest batches complete the meter; each default batch still buys ten chests and projects +30.
- Changing target warns about losing all progress; cancel preserves progress and confirm resets it.
- Coin balance and selected-card container do not overlap.
- Final screen has Shop and Cards Center, and has neither Raid nor Booster.
- Cards Center returns without a full demo reset and visibly reflects the completed Collection/event state.
- Desktop demo background is warm and the Interactive concept panel matches portfolio plaque styling; the portfolio preview keeps its clouds.
- Focused tests, TypeScript, production build, and visual checks pass at the acceptance viewports.

## Non-goals

- Reproducing proprietary Coin Master assets or copying screenshots pixel-for-pixel.
- Replacing generated original artwork or the slot cabinet raster.
- Changing production chest contents or drop rates beyond the illustrative prototype balance.
- Redesigning unrelated portfolio sections or the separate prototype preview card.
- Deploying or merging to `main` without a separate explicit request.
