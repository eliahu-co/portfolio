# Intro, Risk Card, and Metric Pill Polish

## Goal

Align three visual details on the MA Home Assignment page with the established design system.

## Approved design

### Intro typography

The opening paragraph beginning “Coin Master’s core…” will use the same `14px` font size as the Concept paragraph beginning “Villages show progression…”. Its existing font family, line height, color, width, and spacing will remain unchanged.

### Risk cards

Risk cards in the “Value delivered & risks” blocks will have no background fill or gradient. Their crimson border, left accent, padding, radius, typography, warning marker, layout, and shadow will remain unchanged. Value and neutral card surfaces are outside this change.

### Success-metric role pills

Every role pill in the Success metrics table will use a fixed `80px` width. The label will be horizontally centered within that width. Existing role-specific fills, strokes, text colors, height, type styling, and table-cell alignment will remain unchanged.

## Verification

Focused regression tests will verify:

- the opening paragraph uses the Concept paragraph’s `14px` size;
- risk cards do not receive a background or gradient class;
- every Success metrics role pill uses the shared width and centered alignment.

The MA Home Assignment focused test suite will be run after implementation. Unrelated prototype/demo work already present in the worktree will not be modified or staged.
