# Guided Action Purple Halo Design

## Goal

Make every next player action in the Card Bounty demo unmistakable without changing the flow, controls, copy, or individual component layouts.

## Current problem

The shared `attention` class currently animates a yellow 7px `drop-shadow`. A drop shadow is composited behind each opaque button or card, is fully transparent at both ends of its 1.75-second cycle, and competes with the prototype's gold borders and warm parchment. The class creates an isolated stacking context but does not raise it above nearby siblings.

## Purple raised halo

Keep the existing shared class on all eight guided actions and change only `GuidedAction.module.css`:

- Raise the guided control with `position: relative` and `z-index: 3`.
- Keep a small control lift, increased to `translateY(-3px) scale(1.03)` at the pulse peak.
- Replace the animated yellow filter with a pointer-transparent `::after` halo painted above the control surface.
- Extend the halo 6px beyond the control with a 4px `#c86cff` purple ring.
- Add a dark-purple separation ring and an outer purple glow that expands to 24px at the pulse peak.
- Use a 1.4-second cycle so the cue is persistent without becoming continuous vibration.
- Preserve each control's native box shadow, hover brightness, and focus-visible outline because the shared effect no longer animates `filter` or the control's own `box-shadow`.

The pseudo-element inherits each control's border radius and has no background, so it highlights green buttons, target cards, and chest options without covering their contents.

## Motion accessibility

Under `prefers-reduced-motion: reduce`, disable both animations and transforms. Keep the purple ring and a static 18px glow at full opacity so the next action remains clear without motion.

## Verification

- Add a CSS contract test for the raised stacking context, exact purple ring geometry, halo animation, and reduced-motion treatment.
- Assert the shared stylesheet no longer contains the old yellow attention color or an animated filter.
- Retain the happy-path assertions proving the `attention` class moves through all eight guided actions.
- Run the focused guided-action test, the complete Jest suite, and the production build.
- Inspect representative guided controls on desktop and mobile: Choose a Card, Whale Boat, Magical Chest, Confirm Purchase, Continue, Add to Collection, and Collect Spins.
