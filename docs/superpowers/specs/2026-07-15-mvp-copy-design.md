# MVP Copy Replacement Design

## Goal

Update the MVP section of the MA Home Assignment page with the user-provided intro and scope copy.

## Scope

- Replace the introductory paragraph before the scope lists with the exact approved wording.
- Replace the `In scope` list with the eight approved items, preserving their order and punctuation.
- Replace the `Out of scope` list with the five approved items, preserving their order and punctuation.
- Preserve the existing headings, check/cross markers, colors, typography, spacing, grid, and MVP metrics.

## Implementation

Change only the copy constants in `app/MA-HomeAssignment/sections/MVP.tsx`. Add a focused page-rendering regression test that verifies the new intro and list copy and confirms superseded scope items are absent.

The approved `In scope` order is:

1. Entry point within the Cards Center, with an event countdown.
2. Target one missing Card at a time.
3. Meter goal scales with Card rarity.
4. Buying Chests advances the meter; higher-value Chests contribute more.
5. Changing the target resets the meter.
6. If the target is obtained before the meter is filled, the player can change target.
7. Reaching the meter goal awards the target, and ends the event for that player.
8. Uncompleted progress expires when the event ends.

## Acceptance Criteria

- The rendered MVP intro matches the approved paragraph exactly.
- The rendered `In scope` and `Out of scope` lists contain only the approved items in the approved order.
- No visual styling or layout changes are introduced.
- The focused MA Home Assignment tests and full test suite pass.
