# Card Bounty Coin Master Fidelity Redesign

**Date:** 2026-07-14
**Status:** Approved
**Scope:** `app/MA-HomeAssignment/demo` and the assignment-page prototype preview

## Context

The existing Card Bounty prototype proves the product flow, but its presentation reads as a custom web-game dashboard rather than a Coin Master feature. The supplied references establish a different visual and interaction grammar:

- Cards Center is a turquoise, vertically scrolling collection screen with circular illustrated set medallions.
- Ordinary dialogs are compact parchment cards over a strongly dimmed but still recognizable base screen.
- Dialog titles sit on overlapping red ribbons, with close buttons protruding from the frame.
- Chest purchase uses a floating open chest, a short information panel, vertical quantity controls, and a glossy green price button.
- The core loop is dominated by a wooden 3x3 reel machine and a large red Spin button.

This redesign changes presentation and pacing while preserving the existing Card Bounty concept, deterministic state machine, and quantity-to-progress preview.

## Goals

1. Make Cards Center, Card Bounty dialogs, chest purchase, and Spin composition closely match the supplied Coin Master references.
2. Preserve live, accessible UI for all text, counters, buttons, meters, and state changes.
3. Use generated-original artwork for decorative illustration layers rather than shipping flattened screenshots.
4. Preserve the current target-selection, chest-purchase, reward, guarantee, collection-completion, and Spin-return flow.
5. Make the Bounty long enough to communicate repeat engagement: a 300-point target and a default batch of ten Magical Chests.
6. Verify the complete experience on representative mobile and desktop viewports.

## Non-goals

- Rebuilding the full Coin Master application, shop, event rail, or networked economy.
- Adding random rewards, persistence, server state, payments, or a real slot-game outcome model.
- Replacing the deterministic portfolio-demo path with a production economy.
- Baking text or interactive controls into generated images.
- Refactoring unrelated portfolio pages or components.

## Chosen Approach

Use a layered reconstruction:

- Generated-original raster artwork supplies collection portraits, decorative characters, the slot cabinet, reel symbols, the open chest, the event badge, and scenery.
- HTML and CSS supply the responsive layout, parchment frames, ribbons, buttons, labels, values, progress meters, and animation states.
- Existing reducer-driven interactions remain the source of truth.

This gives stronger fidelity and responsiveness than a CSS-only reskin, while avoiding the accessibility and resizing problems of a rendered full-screen screenshot with interaction hotspots.

## Visual Language

The interface uses the shared visual grammar visible across the references:

- Saturated cyan and turquoise backgrounds.
- Warm peach parchment panels with dark brown outlines and beveled edges.
- Bright red title ribbons and close buttons.
- Lime-green purchase and progress controls.
- Gold trim, cream card surfaces, hard shadows, and glossy highlights.
- Chunky display typography with compact spacing, heavy outlines, and minimal uppercase tracking.
- Frequent controlled overlap: ribbons cross frames, artwork protrudes above dialogs, and reward icons overlap progress capsules.
- A dark 65–70% scrim without backdrop blur for modal states.

The implementation should avoid web-dashboard cues such as small widely tracked labels, thin borders, flat cards, glass blur, and large empty panels.

## Generated Artwork

Generated assets live under `public/coinmaster/card-bounty/generated/` and contain no baked UI text.

Required artwork:

1. Eight square or transparent collection medallion illustrations with distinct themed subjects.
2. A compact Card Bounty event badge.
3. An open, glowing Magical Chest compatible with the existing chest family.
4. A snowy core-loop background without interface elements.
5. A wooden 3x3 slot-machine cabinet with empty reel windows.
6. A small set of transparent reel symbols.
7. Supporting pet or character cutouts and compact side-event icon art.

The existing target-card and closed-chest assets remain reusable. Generated artwork should be optimized for the rendered size and must not turn the complete interface into one static image.

## Experience Architecture

### Portrait game stage

The prototype remains a portrait game surface:

- Mobile fills the available viewport.
- Desktop centers the portrait stage without changing its internal composition.
- The stage scales fluidly while retaining the same vertical hierarchy.
- Safe-area padding prevents top controls and the Spin button from colliding with mobile browser chrome.

### Cards Center

Cards Center is the persistent base screen for the Bounty flow:

- A fixed blue header contains a green information button, centered oversized white `CARDS CENTER` title, and red close button.
- The resource HUD is removed from this screen because it is absent from the supplied Cards Center reference.
- A scrollable turquoise patterned body contains a two-column accessible collection list.
- Each collection item uses a large circular generated medallion, colored ribbon nameplate, green `x/9` progress capsule, and reward icon.
- At least eight collection items are shown so the page reads as a real collection browser.
- A compact floating Card Bounty badge replaces the current full-width event banner and retains the accessible name `Open Card Bounty`.
- A fixed warm-beige two-tab bar anchors the bottom.

### Shared Ribbon Dialog

A reusable `RibbonDialog` primitive owns the ordinary modal grammar:

- One non-blurred dark backdrop.
- One centered parchment frame.
- An overlapping red title ribbon.
- A circular red close button straddling the upper-right corner.
- An optional protruding hero-art slot.
- `compact`, `tall`, and `purchase` size variants.

Approximate geometry within the portrait stage:

- Compact intro and confirmation: 88–90% width and content-driven height, capped near 72% viewport height.
- Target picker and Active Bounty: 90–92% width, capped near 82–84% viewport height with internal scrolling.
- Chest purchase: 90–92% width and roughly 62–68% viewport height, with chest artwork protruding above it.

The underlying Cards Center or Bounty panel stays visibly recognizable around every ordinary dialog. Reward and collection celebrations may remain full-screen transient overlays.

### Card Bounty states

The existing states retain their responsibilities while moving into the shared dialog:

- Intro explains the event in a short compact panel.
- Target picker presents the existing selectable target cards in a scrollable parchment body.
- Target confirmation keeps the selected card visually dominant and makes the commitment clear.
- Active Bounty shows the selected target, countdown, 300-point meter, and three compact chest offers without page-like empty space.
- The 300-point meter uses ten major milestone notches at 30-point intervals rather than rendering one tick for every point.
- Chest choices use pale shop cards with chest art, a green price footer, card count, and Bounty-progress badge.

### Chest Purchase

The purchase dialog is recomposed to match the Magical Chest reference:

- The open glowing chest floats above the frame.
- A red `MAGICAL CHEST` ribbon overlaps the top.
- A cream inset card presents `High chance for` rarity icons and `Cards x8`.
- The lower purchase tray uses vertical green triangular quantity controls.
- The center quantity value is large and legible.
- The glossy green price button confirms the purchase and keeps the accessible name `Confirm Chest purchase`.
- A live projected-progress area shows the current meter, projected meter, exact progress gain, and total coin cost.

Changing quantity updates price, total cards, and projected Bounty progress immediately. At the default Magical quantity, the dialog shows 80 total cards and +30 projected progress. Cancelling leaves the Active Bounty unchanged. Confirming applies the purchase once and starts the existing deterministic reward sequence.

### Reward and guarantee sequence

The current reward sequence remains intentionally concise:

- A purchased batch is represented by featured card reveals rather than animating all cards from all ten chests.
- Duplicate reveals remain deterministic.
- Progress is applied once for the confirmed batch.
- Reaching 300 opens the guaranteed-target reward.
- Claiming the target continues to the collection-completion reward and then Spin.

### Spin return

The generic village composition is replaced by the actual core-loop hierarchy:

- A snowy sky background fills the stage.
- Top resource capsules display coins, gems, Spins or energy, and menu state.
- A player plaque and compact decorative event rails occupy the upper area.
- A wooden 3x3 reel cabinet dominates the middle.
- Nine live symbol cells sit inside the cabinet.
- A multiplier strip, energy meter, and Spin balance sit directly below the reels.
- A large red trapezoidal `SPIN` button dominates the lower third.
- Pressing Spin preserves the existing readiness transition and adds a short reel-motion treatment without creating a new random outcome system.

## State and Economy

The reducer remains the single source of truth. Presentation components receive values and callbacks and do not duplicate economy calculations.

Approved demo pacing:

- Every selectable demo target uses a Bounty threshold of 300.
- Wooden Chest remains +1 progress per chest.
- Golden Chest remains +2 progress per chest.
- Magical Chest remains +3 progress per chest.
- Magical Chest opens with a default quantity of 10.
- A default Magical batch therefore previews and awards +30 progress.
- Ten default Magical batches complete the 300-point target.
- Magical Chest remains priced at 29,000,000 coins.
- Starting coins become 3,200,000,000 so the guided ten-batch path is affordable with a buffer.
- Other chest dialogs retain a default quantity of one.
- Quantity remains adjustable and is clamped to the affordable range.

If fewer than ten Magical Chests are affordable, the initial quantity falls back to the maximum affordable positive quantity. The confirmed cost and progress must always match the preview shown immediately before confirmation.

## Data Flow

1. Cards Center dispatches `OPEN_BOUNTY`.
2. Dialog states dispatch existing target-selection and confirmation actions.
3. Active Bounty dispatches `OPEN_CHEST_DIALOG`.
4. Chest Purchase derives total cost and projected progress from the selected chest and quantity.
5. `SET_QUANTITY` updates the preview without mutating coins or meter progress.
6. `CONFIRM_PURCHASE` validates affordability, deducts coins, records the batch gain, and starts the reward overlay.
7. Completing the reveal either returns to Active Bounty or opens the guarantee at 300.
8. Guarantee and collection rewards lead to Spin Return.

No new global state or persistence layer is required.

## Error and Accessibility Behavior

- Invalid, non-finite, or below-minimum quantities are rejected or clamped by the reducer.
- Unaffordable quantities cannot be confirmed.
- Purchase errors appear within the active dialog and are announced.
- Event expiry continues to prevent new Bounty entry.
- Closing purchase returns to the same Active Bounty state.
- Only the topmost dialog is exposed to assistive technology.
- The dimmed base screen remains mounted but inert.
- Dialogs have labelled titles, focus containment, a reliable close action, and sensible focus restoration.
- All icon-only controls have accessible names.
- Reduced-motion users receive state changes without reel, pulse, or celebration motion.

## Component Boundaries

Targeted presentation components:

- `CardsCenterScreen`: header, collection scroll region, event badge, and bottom tabs.
- `CollectionMedallion`: one themed collection item with progress and reward.
- `RibbonDialog`: shared modal frame and accessibility behavior.
- Existing intro, picker, confirmation, and Active Bounty panels: content only.
- `ChestPurchaseDialog`: quantity, cost, and projected-progress presentation.
- `SlotMachineBoard`: cabinet and nine live reel symbols.
- `SpinReturnScreen`: Spin-screen composition around the board.
- `RewardSequence`: full-screen transient reveal states.

`CardBountyPrototype`, `demoReducer`, and `demoData` continue to coordinate the experience. Refactoring is limited to boundaries required by this redesign.

## Testing Strategy

Implementation follows test-driven development.

### Reducer and economy tests

- Every target initializes to a 300-point threshold.
- Magical Chest defaults to quantity 10.
- Ten Magical Chests preview and award +30 progress.
- Ten default Magical batches reach exactly 300.
- Cost and progress are capped and applied once.
- Cancellation and unaffordable confirmation preserve state correctly.

### Component and interaction tests

- Cards Center exposes an accessible collection list with at least eight named items and visible progress.
- `Open Card Bounty` remains the only live-event entry control.
- Base content is mounted and inert while a dialog is active.
- Chest quantity changes update total cost and projected before/after progress.
- Confirming and cancelling return to the correct overlay state.
- The complete deterministic path still reaches the guaranteed target, collection reward, and Spin screen.
- Spin renders a region named `Slot machine reels` and retains the existing readiness behavior.

Tests assert semantics and behavior rather than CSS class names.

### Visual verification

Capture and inspect Cards Center, Active Bounty, Magical Chest purchase, reward, and Spin at:

- 390x844
- 430x932
- 1366x768
- 1440x900

Acceptance requires:

- Compact dialogs leave recognizable base-screen margins.
- No mobile horizontal overflow or clipped controls.
- Cards Center scrolls behind its fixed header and tabs.
- Chest art and title ribbons protrude cleanly without clipping.
- The quantity-10 purchase clearly shows +30 projected progress.
- The reel cabinet visually dominates the Spin screen.
- Desktop uses the same portrait composition rather than stretching into a dashboard.
- A final comparison pass addresses scale, spacing, overlap, color, and hierarchy against the six supplied references.

## Implementation Constraints

- Preserve unrelated working-tree changes.
- Do not merge to `main` or `master`.
- Do not replace the existing product logic unless this specification explicitly changes it.
- Do not use temporary attachment paths as runtime dependencies.
- Do not ship the supplied screenshots as flattened interactive backgrounds.
- Treat the generated and existing game-inspired assets as portfolio-prototype material, not a redistributable asset pack.
