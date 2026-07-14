# Intro, Risk Card, and Metric Pill Polish

## Goal

Align five visual details on the MA Home Assignment page with the established design system.

## Approved design

### Intro typography

The opening paragraph beginning “Coin Master’s core…” will use the same `14px` font size as the Concept paragraph beginning “Villages show progression…”. Its existing font family, line height, color, width, and spacing will remain unchanged.

### Risk cards

Risk cards in the “Value delivered & risks” blocks will have no background fill or gradient. Their crimson border, left accent, padding, radius, typography, warning marker, layout, and shadow will remain unchanged. Value and neutral card surfaces are outside this change.

### Success-metric role pills

Every role pill in the Success metrics table will use a fixed `80px` width. The label will be horizontally centered within that width. Existing role-specific fills, strokes, text colors, height, type styling, and table-cell alignment will remain unchanged.

### Hero logo alignment

On desktop, the Coin Master logo will be anchored to the title row and vertically centered against the `<h1>` instead of positioned relative to the entire hero content block. Its right-edge placement, dimensions, artwork, shadow, and desktop-only visibility will remain unchanged. The separate mobile logo will remain unchanged.

### Assumptions list markers

The decorative em-dash before each Assumptions item will be removed. The list will retain its copy, order, typography, vertical rhythm, semantic list markup, and maximum width. The now-unused horizontal flex gap will also be removed so each item begins at the list's text edge.

## Verification

Focused regression tests will verify:

- the opening paragraph uses the Concept paragraph’s `14px` size;
- risk cards do not receive a background or gradient class;
- every Success metrics role pill uses the shared width and centered alignment;
- the desktop logo is nested in the title row and uses vertical-centering utilities;
- Assumptions items contain no decorative marker elements or em-dash text.

The MA Home Assignment focused test suite will be run after implementation. Unrelated prototype/demo work already present in the worktree will not be modified or staged.
