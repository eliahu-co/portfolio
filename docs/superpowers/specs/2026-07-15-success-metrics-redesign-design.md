# Success Metrics Redesign

## Goal

Replace the single role-pill success metrics table with four stacked metric groups that make the measurement hierarchy immediately clear while preserving the existing Coin Master editorial design language.

## Content hierarchy

1. **North Star**
   - ARPDAU — ≥5% lift
2. **Monetization and economy drivers**
   - ARPPU — ≥5% lift overall and ≥8% among the high-spender cohort
   - Coin spend on Chests per DAU — ≥10% lift
   - Total Coin Consumption per DAU — ≥5% lift
3. **Feature funnel**
   - Target Selection Rate — ≥30% of eligible DAU
   - First-Chest Conversion — ≥65% of players who select a target
   - Bounty Completion Rate — 10–20% of activated players
   - Supporting note: “The funnel is coherent: 30% × 65% ≈ 20% activation. The completion range ensures the guarantee provides value without becoming too easy.”
4. **Guardrails**
   - Post-Event Revenue per Player — ≥98%
   - Post-Event Chest Coin Spend per Player — ≥95%
   - Card Collections Completed per Player — ≤115%
   - Village Upgrades per Player — ≥95%

The existing eligibility/control explanatory paragraph remains unchanged.

## Visual design

- Use four vertically stacked, compact two-column tables with shared `Metric` and `Proposed target` headers.
- Remove the Role column and all role pills.
- Use restrained group headings, fine table rules, and consistent vertical rhythm.
- Give North Star a subtle gold treatment to establish its primacy without turning it into a card.
- Keep the remaining groups visually consistent with one another and the surrounding page.
- Place the funnel rationale directly under the Feature funnel table as a compact supporting note with the existing gold editorial accent.
- Avoid fixed minimum table widths so the two-column tables wrap cleanly on narrow screens without horizontal scrolling.

## Implementation

- Replace the flat `METRICS` array and role types/styles with a grouped metric data structure in `MVP.tsx`.
- Render groups through one reusable local table component to keep typography and spacing consistent.
- Keep changes scoped to Success Metrics and its tests; do not modify the prototype/demo.

## Verification

- Update the assignment test to assert all groups, metrics, targets, ordering, two-column headers, removed role pills, and the funnel note.
- Run the focused assignment test, full Jest suite, and production build.
- Inspect desktop and narrow viewport rendering in the browser, including overflow and spacing.
