# Embedded Prototype Slide Design

## Goal

Make slide 11 contain the real Card Bounty prototype so it can be played without leaving the presentation or opening another tab.

## Approved experience

- Replace the static preview and external link with the existing `CardBountyPrototype` experience.
- Present the game as a large portrait viewport centered in the space between the slide title and bottom navigation.
- Keep the presentation title, eyebrow, slide counter, and previous/next controls in their established positions.
- Keep a compact restart control available beside the phone; omit the assignment backlink and explanatory side panel.
- Mount the prototype only while slide 11 is active. Leaving and revisiting the slide creates a fresh prototype state and stops its countdown while hidden.
- Treat all prototype controls as deck-interactive targets so clicks, focus, and keyboard use do not accidentally advance the deck.

## Architecture

`CardBountyPrototype` and `DemoShell` gain a small `mode` interface with `standalone` as the default and `presentation` as the new variant. The standalone route remains unchanged. Presentation mode reuses the complete reducer-driven game and changes only its outer shell: constrained height, one-column game composition, compact restart control, and no full-viewport or orientation-overlay behavior.

`PresentationDeck` passes an explicit `isActive` boolean to every registered slide. Slide 11 uses that value as a mount gate around the prototype, ensuring its timer and state exist only while visible. The static preview remains available to the home-assignment page but is no longer used by the presentation.

## Layout

- The slide keeps the current `Prototype` eyebrow and `Card Bounty, interactive` title.
- The playable phone uses the available vertical region and preserves the prototype's native `430 / 932` aspect ratio.
- The phone is visually dominant, with a compact restart action positioned close enough to read as part of the experience without competing with the title.
- The prototype remains clipped inside its rounded wood frame.

## Interaction and accessibility

- Prototype buttons and links remain natively focusable.
- The deck already ignores navigation shortcuts originating in interactive elements; the embedded region is additionally marked `data-deck-interactive="true"`.
- Focus management and modal focus trapping continue to use the existing prototype implementation.
- Restart resets the reducer to its initial state.
- Re-entering slide 11 remounts the prototype and therefore also resets it.

## Compatibility and error handling

- No iframe or cross-origin behavior is introduced.
- The standalone `/MA-HomeAssignment/demo` route retains its current desktop and mobile layouts.
- If the slide is inactive, it renders a stable empty stage rather than a running hidden application.
- Reduced-motion behavior continues to come from the existing prototype stylesheet.

## Verification

- Component tests prove slide 11 mounts the real prototype only when active and contains no external prototype link.
- Component tests prove standalone mode remains the default and presentation mode exposes its dedicated shell.
- Existing prototype flow tests continue to pass.
- The complete Jest suite and production build pass.
- Browser verification checks slide 11 at the real presentation viewport and completes representative prototype interactions without leaving the deck.
