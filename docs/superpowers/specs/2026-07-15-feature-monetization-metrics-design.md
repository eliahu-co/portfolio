# Feature Monetization Strategy and Metrics Design

## Goal

Replace the KPI framing in each feature section with a clearer two-part business case: the monetization strategy followed by the feature metrics.

## Approved visual hierarchy

Each feature uses two stacked blocks in the existing left content column:

1. `MONETIZATION STRATEGY`
2. `METRICS`
3. The existing `LOOP` block

The new blocks reuse the existing `Block` and `BlockLabel` typography, spacing, and responsive behavior. They do not introduce cards, backgrounds, borders, animations, or a new color treatment.

On mobile, Monetization Strategy and Metrics remain full-width above the two-column Loop/mockup row, matching the current KPI placement. On desktop, both blocks sit in the left column above Loop, with the mockup alongside them.

## Monetization strategy presentation

Each strategy is one 14px charcoal paragraph using the existing Concept body styling. The opening mechanism phrase is bold inline; the explanation follows in regular weight on the same paragraph.

### Hometown

**Conversion and purchase frequency.** Targets high-progression, socially engaged players with a persistent Coin sink and new customization offers.

### Card Bounty

**Spend depth.** Weighted toward high-intent collectors and high spenders. Repeated Chest openings consume Coins and increase demand for existing Spin and Coin offers.

### Hot Trail

**Purchase frequency through re-engagement.** Targets recently Raided players with an urgent return session that consumes Spins and creates another opportunity to purchase.

## Metrics presentation

Rename the visible `KPI` label to `METRICS` and rename the related code/data terminology from `kpi`/`KpiList` to `metrics`/`MetricsList`.

ARPDAU is the North Star for all three features. It remains the first list item and keeps the existing gold star. Supporting metrics remain separate list items with the existing small gold diamond bullets.

### Hometown

- ★ ARPDAU
- ◆ Coin spend on Hometown per DAU
- ◆ Repeat customization
- ◆ Return sessions per Hometown user

### Card Bounty

- ★ ARPDAU
- ◆ ARPPU by payer tier
- ◆ Coin Spend on Chests per DAU
- ◆ Bounty activation

### Hot Trail

- ★ ARPDAU
- ◆ Hot Trail activation
- ◆ Return rate
- ◆ Spin consumption per exposed DAU

The star and diamonds are decorative and remain hidden from assistive technology. Metric text remains available as normal list content.

## Data model

Extend `UseCaseData` with:

```ts
monetizationStrategy?: {
  lead: string
  body: string
}
metrics?: {
  primary: string
  supporting: string[]
}
```

Remove the superseded `kpi` property. Populate both new properties for all three current feature objects in `useCaseData.ts`.

## Component changes

- Add a small strategy renderer that outputs one paragraph with a bold lead and regular body.
- Rename `KpiList` to `MetricsList` without changing the existing list styling or glyphs.
- Render Monetization Strategy immediately before Metrics in both responsive placements.
- Keep the current fallback `arpdauMechanism` behavior unchanged for any future data object that does not use `metrics`.
- Update comments so they describe strategy and metrics rather than KPI.

## Testing and verification

Add regression coverage that verifies:

- No feature section displays the label `KPI`.
- Every feature displays `MONETIZATION STRATEGY` before `METRICS`, and `METRICS` before `LOOP` within the feature's business-case column.
- Each exact strategy lead and body is rendered.
- ARPDAU is the primary starred metric for all three features.
- Each feature renders its exact supporting metrics as separate diamond-bulleted list items.
- Existing mobile/desktop placement behavior remains intact.

Run the focused assignment test suite, the full test suite, the production build, and `git diff --check`. Visually inspect all three feature sections at desktop and mobile widths before integration.

## Out of scope

- Changes to the Success Metrics table in the MVP section.
- Changes to prioritization scoring or its tooltips.
- Changes to Loop, Concept, Value Delivered, Risks, mockups, or the interactive prototype.
- New visual assets, animations, cards, or colors.
