# Success Metrics Table Refinement

## Goal

Remove the repeated column labels from Success Metrics, reduce the funnel explanation to contextual help, and make the North Star visually match the Core Loop plaque.

## Approved direction

- Render all four metric groups inside one semantic table.
- Show `Metric` and `Proposed target` once in a shared table header.
- Preserve the four group labels as row-group headings inside the table.
- Style the North Star row group with the Core Loop plaque colors: `#FFC93C` fill and `#C77F14` edge.
- Add the existing shimmer animation to the North Star group, with reduced-motion support.
- Remove the visible funnel explanation paragraph.
- Add a small outlined `i` beside `Feature funnel`; hovering or focusing it reveals the exact existing explanation in an overlay tooltip.
- The tooltip must not shift rows or introduce scrolling, and it must expose an accessible label and description relationship.

## Structure and styling

- Keep the existing two-column proportions and metric/target typography.
- Use one `<table>` and one `<thead>`, followed by a `<tbody>` for each metric group.
- Each group begins with a `<th scope="rowgroup" colspan="2">` containing its `<h3>` label.
- Non-North-Star groups retain the restrained cream background and fine row rules.
- The North Star group uses a full-width animated yellow plaque treatment rather than a badge or soft wash.
- The Feature funnel tooltip uses the same compact cream, wood, charcoal, and gold language as the scoring-header tooltips.

## Verification

- Update the assignment test to assert one table, one pair of column headers, four ordered row groups, exact rows, North Star plaque/shimmer classes, and the Feature funnel tooltip relationship/copy.
- Assert that the old visible funnel note is absent.
- Run the focused test, full Jest suite, and production build.
- Inspect the tooltip, animation, spacing, and overflow in the local browser.

## Scope

Only `MVP.tsx`, its assignment test, and this design/plan documentation are in scope. Do not modify the prototype or demo.
