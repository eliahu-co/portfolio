# North Star Winner Polish

## Goal

Make the Success Metrics North Star treatment quieter and consistent with the Card Bounty winner row.

## Approved design

- Remove the North Star’s bold left border.
- Remove the solid `#FFC93C` plaque fill.
- Reuse the Card Bounty winner’s exact shimmer background:
  - `rgba(245,168,0,0.08)` at both edges.
  - `rgba(245,168,0,0.28)` at the center.
  - `background-size: 200% 100%`.
- Keep `animate-shimmer` and `motion-reduce:animate-none` unchanged.
- Render the `≥5% lift` target in regular charcoal body text, not crimson/red.
- Preserve the single table header, group hierarchy, metrics, targets, and Feature funnel tooltip unchanged.

## Verification

- Update the Success Metrics test to reject the former left border, solid yellow fill, and crimson target class.
- Assert the exact winner-row shimmer gradient and charcoal target treatment.
- Run the focused test, full Jest suite, and production build.
- Inspect the North Star animation in the local browser and confirm no overflow or console errors.

## Scope

Only `MVP.tsx`, its assignment test, and this design/plan documentation are in scope. Do not modify the prototype or demo.
