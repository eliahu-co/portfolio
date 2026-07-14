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

## Acceptance Criteria

- The rendered MVP intro matches the approved paragraph exactly.
- The rendered `In scope` and `Out of scope` lists contain only the approved items in the approved order.
- No visual styling or layout changes are introduced.
- The focused MA Home Assignment tests and full test suite pass.
