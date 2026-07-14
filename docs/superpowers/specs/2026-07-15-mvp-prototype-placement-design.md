# MVP Prototype Placement Design

## Goal

Move the existing Card Bounty prototype preview into the MVP section and remove the standalone prototype introduction.

## Structure

- Place an `Interactive prototype` subheading after the In/Out scope lists and before `Success metrics`.
- Render the existing `PrototypePreview` directly below that subheading.
- Keep the preview constrained to its existing `max-w-2xl` width and preserve its current visual styling and behavior.
- Preserve the `prototype` anchor on the embedded prototype block so the sidebar and demo return links continue to work.

## Removal

Remove the standalone `PrototypeDemo` section and its page-level render. This removes the following copy from the page:

- `Prototype demo`
- `Card Bounty, interactive`
- `An interactive concept prototype of Card Bounty within Coin Master’s Cards Center. Choose an eligible missing Card and open Coin-purchased Chests to fill the Bounty meter. Higher-value Chests add more progress; if the Card is not obtained earlier, filling the meter guarantees it.`

Delete the now-unused `PrototypeDemo.tsx` component. Keep `PrototypePreview.tsx`, the sidebar `Prototype` entry, and demo-page links to `#prototype`.

## Testing

Update the MA Home Assignment page test to verify that:

- `#prototype` is inside `#mvp`.
- The block has the `Interactive prototype` subheading and exactly one demo link/preview image.
- The removed eyebrow, title, and paragraph no longer render.
- The MVP section orders the prototype block before `Success metrics`.

## Acceptance Criteria

- The preview appears inside MVP after the scope lists and before success metrics.
- Existing prototype interactions and `#prototype` navigation remain functional.
- No duplicate prototype preview or standalone prototype section remains.
- The focused and full test suites pass.
