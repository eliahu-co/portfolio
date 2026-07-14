# Success Metrics Table Design

## Goal

Replace the Success metrics cards in the MA Home Assignment MVP section with a concise editorial table that communicates each metric, its decision role, and a concrete proposed target.

## Selected Direction

Use the approved **Editorial ruled table** treatment. It should feel like a refined extension of the existing prioritization table rather than a new visual system:

- Cream page background remains visible; no enclosing card or heavy table chrome.
- A two-pixel `cm-wood` rule separates the header from the body.
- Column headers use the site’s small uppercase body style with wide tracking and muted charcoal.
- Metric names use medium-weight violet text for hierarchy.
- Roles use compact pills: gold/wood for `Primary`, violet for `Economy` and `Adoption`, and crimson-tinted for `Guardrail`.
- Rows use light charcoal dividers and comfortable vertical padding.
- Proposed targets use regular body text and generous line height.
- No shimmer, alternating row fills, gradients, shadows, or card borders.

## Content

| Metric | Role | Proposed target |
|---|---|---|
| ARPDAU | Primary | +5% or more during the event |
| Chest Coin Spend per DAU | Economy | +10% or more |
| Total Coin Consumption per DAU | Economy | +5% or more, confirming incremental Coin demand |
| Bounty Activation Rate | Adoption | 20% or more of eligible daily active players select a target and open at least one Coin-purchased Chest |
| Post-Event Revenue per Player | Guardrail | Stable or higher: at least 98% of control during the following seven days |
| Post-Event Chest Coin Spend per Player | Guardrail | Stable or higher: at least 95% of control during the following seven days |
| Card Collections Completed per Player | Guardrail | No more than 15% above control across the event and following seven days |
| Village Upgrades per Player | Guardrail | Stable or higher: at least 95% of control across the event and following seven days |

## Component Structure

- Replace the existing `METRICS` card data with rows shaped as `metric`, `role`, and `target`.
- Render one semantic `<table>` inside an `overflow-x-auto` wrapper.
- Use three columns sized for scanning: Metric approximately 30%, Role approximately 16%, and Proposed target the remaining width.
- Keep the current Success metrics introductory paragraph unchanged.
- Preserve the current `max-w-3xl` section width.
- Give the table a readable minimum width on narrow screens so the existing horizontal-scroll behavior handles long targets without crushing the columns.

## Testing

Update the MA Home Assignment page regression test to verify:

- The Success metrics block contains one table with the exact three headers.
- The table contains the eight approved rows in order with exact metric, role, and target copy.
- The old warm metric cards and `Success signal` labels no longer render.
- The table retains the editorial header rule, row-divider, role-pill, width, and overflow classes.

## Acceptance Criteria

- The rendered table matches the approved Option A visual direction.
- All eight metrics and targets match the supplied copy exactly.
- The table is readable on desktop and remains accessible through horizontal scrolling on narrow screens.
- The rest of the MVP content and styling remain unchanged.
- Focused and full test suites pass, and localhost renders without console errors.
