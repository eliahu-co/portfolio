# Validation Methodology Design

## Goal

Make the Card Bounty validation section more explicit about directional targets, test setup, and follow-up experiments without adding another dense table.

## Approved hierarchy

- Rename the section heading to `Card Bounty — Feature Validation`.
- Keep `A/B Test` as the red eyebrow and place a small accessible information button beside it.
- Place a second information button beside `Proposed target`.
- Move the Feature funnel information button to Bounty Completion Rate and use the concise note `Ensures the guarantee provides value without becoming too easy.`
- Add aligned information buttons beside ARPPU by payer tier and the four Guardrail metric names. The buttons share a narrow right-hand column within the metric-name cell.
- Add `Additional Tests` as a red eyebrow subsection after the metric table and before Assumptions, without adding another gradient divider or large heading.

## Tooltip copy

- A/B Test: `Event duration and measurement windows would be finalized using internal baselines, eligible population and comparable LiveOps performance.`
- Proposed target: `Directional benchmarks. Final targets would be set using internal baselines and comparable LiveOps performance.`
- Feature funnel: retain the existing funnel explanation.

All information buttons must work on hover, focus, and click. Tooltips must render through `document.body`, outside the horizontally scrollable table.

Metric notes explain payer-tier contribution, completion attainability, Collection acceleration, Village cannibalization, post-event Chest spend, and post-event revenue.

## Metric target styling

Render the target label in normal body color and the numeric threshold in `text-charcoal/45`, lighter than the subdued Out of scope treatment. Do not render parentheses.

- `lift` + `≥5%`
- `lift` + `≥5% overall and ≥8% at high-spender cohort`
- `lift` + `≥10%`
- `lift` + `≥5%`
- Funnel targets remain unchanged and unfaded.
- `stable or small lift` + `≤115%`
- `stable` + `≥95%`
- `stable` + `≥95%`
- `stable` + `≥98%`

## Additional tests

Use a vertically spaced list with a small yellow magnifying-glass SVG. The violet test title, regular setup copy, and muted `Tests whether…` line all use 14px regular-weight type.

The list contains Meter Goal Calibration, Paid Progress Carryover, and Chest Tier Weighting. Paid Progress Carryover uses the clarified control/treatment wording approved in the design discussion.

## Responsive behavior

The existing metric table remains horizontally scrollable on narrow viewports. Tooltips must not introduce vertical scrolling inside that container. The Additional Tests list stacks at every viewport width and must not overflow at 390px.

## Verification

- Jest regression tests assert heading copy, tooltip associations and copy, split target styling, and Additional Tests content.
- Browser checks cover desktop and 390px mobile widths.
- Run the full Jest suite and `git diff --check` before committing.
