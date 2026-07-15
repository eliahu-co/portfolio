# Mobile Prioritization Feature Names

## Goal

Keep every feature name in the prioritization table on one line at mobile widths without reducing its font size or changing the table's scoring content.

## Design

- Prevent wrapping on the feature-name label, including its medal glyph.
- Preserve the current typography, row styling, winner treatment, and horizontal-scroll behavior.
- Allow the table's existing overflow container to accommodate the resulting intrinsic width.
- Do not abbreviate feature names or shrink their text.

## Verification

- Add a regression assertion that every feature-name label uses the no-wrap treatment.
- Confirm the focused assignment test fails before the production change and passes afterward.
- Check the prioritization table at a mobile viewport to verify `Card Bounty` and `Hot Trail` remain on one line and the page itself does not overflow.
- Run the complete test suite and TypeScript validation.
