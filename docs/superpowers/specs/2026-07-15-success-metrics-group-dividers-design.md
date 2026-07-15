# Success Metrics Group Dividers Design

## Goal

Clarify the visual hierarchy of the unified Success Metrics table by separating each metric group at its heading and containing the North Star shimmer to the ARPDAU row.

## Root cause

The thick wood divider currently belongs to the table's `Metric / Proposed target` header row rather than to a metric group. The North Star shimmer is applied to its entire `<tbody>`, so the animation covers both the `North Star` heading and the ARPDAU row.

## Approved change

- Remove the thick wood divider from the column-header row.
- Add `border-b-2 border-cm-wood` beneath the `North Star` group heading.
- Add `border-b-2 border-charcoal/25` beneath `Monetization and economy drivers`, `Feature funnel`, and `Guardrails`.
- Move the existing shimmer classes and gold gradient from the North Star `<tbody>` to its ARPDAU metric row.
- Preserve the existing thin separators between individual metric rows.
- Preserve the unified table, copy, tooltip, column widths, typography, and North Star target color.

## Scope

- Modify only the Success Metrics table and its regression test.
- Do not modify prototype or demo files.
- Do not change metric names, targets, or explanatory copy.

## Verification

- Assert that the column header no longer owns the thick wood border.
- Assert that every group-heading row has a two-pixel divider with the approved color.
- Assert that the North Star `<tbody>` no longer shimmers.
- Assert that only the ARPDAU metric row owns the shimmer and gradient.
- Run the focused assignment suite, full suite, and production build.
- Visually verify the table at desktop and mobile widths without overflow or console errors.
