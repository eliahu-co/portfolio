# Feature Validation Experiment Design

## Goal

Turn the existing Success Metrics content into a standalone validation chapter that follows the interactive prototype and frames the metrics as an actionable experiment.

## Presentation structure

- Add a new top-level section immediately after the expanded feature section that contains the prototype.
- Use section anchor `validation`.
- Use the red eyebrow `Validation`.
- Use the section title `Feature Validation`.
- Add `Validation` to the side navigation immediately after `Prototype`.
- Remove Success Metrics from the expanded feature section rather than duplicating it.

## Experiment protocol

Render the protocol as four simple, full-width text blocks. Do not use cards, tinted panels, borders, or icons.

Each label uses the same compact treatment as the feature-level `Concept` label:

`font-sans text-[10px] font-extrabold uppercase tracking-[0.14em] text-black mb-3`

The blocks and copy are:

1. **Population**
   Players with the Cards Center unlocked and at least one eligible missing Card.
2. **Control**
   Existing Cards Center without Card Bounty.
3. **Treatment**
   Existing Cards Center with Card Bounty as a time-limited LiveOps event.
4. **Hypothesis**
   A visible guarantee for a chosen missing Card increases Coin-purchased Chest openings. Higher Coin consumption increases demand for existing Spin and Coin offers, lifting ARPDAU.

Do not include a Segmentation block.

## Metrics table

Reuse the current table’s typography, borders, North Star shimmer, responsive behavior, and target values. Restore the earlier table’s three-column rhythm:

1. Metric
2. An unlabeled, accessible role column
3. Proposed target

The role header remains visually hidden. Role pills are equal width, centered, outlined, and use their established category colors.

### Primary metric

- Keep `Primary metric` as a table section heading with the warm brown divider.
- ARPDAU remains the only row and keeps the contained North Star shimmer.
- Target: `≥5% lift`.
- Do not show a Primary pill.
- Do not show the words `Decision threshold`.

### Supporting metrics

Keep `Supporting metrics` as a table section heading. Replace Monetization, Economy, and Feature funnel subgroup headings with pills in the role column.

| Metric | Pill | Proposed target |
|---|---|---|
| ARPPU by payer tier | Monetization | ≥5% lift overall and ≥8% among the high-spender cohort |
| Coin spend on Chests per DAU | Economy | ≥10% lift |
| Total Coin Consumption per DAU | Economy | ≥5% lift |
| Target Selection Rate | Feature funnel | ≥30% of eligible DAU |
| First-Chest Conversion | Feature funnel | ≥65% of players who select a target |
| Bounty Completion Rate | Feature funnel | 10–20% of activated players |

Pill colors:

- Monetization: warm gold fill, brown text and border.
- Economy: pale sky fill, dark blue text and border.
- Feature funnel: pale violet fill, deep violet text and border.

### Guardrails

Keep `Guardrails` as a table section heading. Leave the role column empty for every Guardrail row; do not render Guardrail pills.

| Metric | Proposed target |
|---|---|
| Card Collections Completed per Player | ≤115% |
| Village Upgrades per Player | ≥95% |
| Post-Event Coin Spend on Chests per Player | ≥95% |
| Post-Event Revenue per Player | ≥98% |

## Component boundaries

- Keep the expanded feature’s scope and prototype in `MVP.tsx`.
- Move experiment copy, metric data, table rendering, and tooltip behavior into a new `FeatureValidation.tsx` section component.
- Render the new component after `MVP` and before `AssumptionsSources` in the page composition.
- Add the new section to the shared `SECTIONS` navigation source.
- Preserve the current Feature funnel information tooltip and its explanatory copy. Place its small information button immediately after the Feature funnel pill in the Target Selection Rate row; the other Feature funnel pills have no duplicate button. The tooltip must render outside the table's scrolling surface so it cannot create table overflow.

## Responsive and accessibility behavior

- Desktop uses the full three-column table.
- On narrow screens, allow horizontal table scrolling only if required; never create page-level horizontal overflow.
- Keep role information available to assistive technology through the visually hidden Role header and visible pill text.
- Preserve keyboard and hover access to the Feature funnel explanation.
- Section and navigation anchors must both use `validation`.

## Verification

- Component tests assert the new section order, side-nav entry, exact protocol copy, absence of Segmentation and Decision threshold, metric targets, role-pill mapping, and absence of Guardrail pills.
- Existing tests are updated so Success Metrics is no longer expected inside MVP.
- The full Jest suite and production build must pass.
- Visual review covers desktop and mobile layout, table overflow, pill sizing, shimmer containment, tooltip placement, and side-nav behavior.
