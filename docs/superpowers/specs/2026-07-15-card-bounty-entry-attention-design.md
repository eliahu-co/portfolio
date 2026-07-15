# Card Bounty Entry Attention Design

## Goal

Keep players inside the Card Bounty prototype from the initial Cards Center screen and make the intended LiveOps entry point easier to discover.

## Inert Cards Center close display

The top-right X remains visually identical, but it is not an available action in this prototype stage.

- Replace the assignment anchor with a non-interactive `span`.
- Mark the display `aria-hidden="true"` so assistive technology is not told that an unavailable close action exists.
- Remove link and button semantics, keyboard focus, navigation, and event handlers.
- Preserve the existing circular red-and-gold styling and X artwork.

The assignment remains reachable through the dedicated prototype controls outside the game viewport.

## Card Bounty attention cadence

Keep the existing nudge keyframes and glow treatment, but shorten the nudge cycle from `2.4s` to `1.4s`. This starts the first visible movement in about 0.8 seconds and repeats a crisp shake every 1.4 seconds without adding continuous motion.

The existing behavior remains unchanged when:

- the Card Bounty event is complete, in which case the animation stops; or
- `prefers-reduced-motion: reduce` is active, in which case motion stops and the static glow remains.

## Verification

- Assert the Cards Center exposes no close link or close button while retaining the decorative X.
- Assert the Bounty nudge uses the exact `1.4s` cadence.
- Retain the completed-state and reduced-motion animation assertions.
- Run the focused Cards Center test, the complete Jest suite, and the production build.
- Inspect the initial screen at desktop and mobile viewport sizes and verify the X is inert and the Bounty badge visibly shakes more frequently.
