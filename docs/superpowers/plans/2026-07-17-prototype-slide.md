# Embedded Prototype Slide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace slide 11's linked preview with the real, directly playable Card Bounty prototype.

**Architecture:** Add a presentation mode to the prototype shell while preserving standalone behavior. Pass active-slide state into slide components and mount the reducer-driven prototype only while slide 11 is visible so hidden slides do not retain timers or state.

**Tech Stack:** Next.js App Router, React, TypeScript, CSS Modules, Tailwind CSS, Jest, Testing Library.

## Global Constraints

- Do not change the standalone `/MA-HomeAssignment/demo` experience.
- Keep the slide's established title and bottom navigation geometry.
- Do not use an iframe or external-tab link.
- The prototype must reset after leaving and revisiting slide 11.
- Hidden slides must not run the prototype countdown.

---

### Task 1: Define active-slide and presentation-mode contracts

**Files:**
- Modify: `app/MA-HomeAssignment/presentation/slides/Slide01Cover.tsx`
- Modify: `app/MA-HomeAssignment/presentation/PresentationDeck.tsx`
- Modify: `app/MA-HomeAssignment/demo/CardBountyPrototype.tsx`
- Modify: `app/MA-HomeAssignment/demo/DemoShell.tsx`
- Test: `__tests__/ma-presentation-deep-dive.test.tsx`
- Test: `app/MA-HomeAssignment/demo/__tests__/DemoShell.test.tsx`

**Interfaces:**
- Produces: `OpeningSlideProps.isActive?: boolean`
- Produces: `CardBountyPrototypeProps.mode?: 'standalone' | 'presentation'`
- Produces: `DemoShellProps.mode?: 'standalone' | 'presentation'`

- [ ] **Step 1: Write failing tests**

  Assert that active slide 11 contains the real `Card Bounty game prototype`, no external prototype link, and a presentation-mode shell; assert that inactive slide 11 does not mount the game.

- [ ] **Step 2: Run tests to verify RED**

  Run: `npm.cmd test -- __tests__/ma-presentation-deep-dive.test.tsx app/MA-HomeAssignment/demo/__tests__/DemoShell.test.tsx --runInBand`

  Expected: FAIL because slide 11 still renders `PrototypePreview` and the mode interfaces do not exist.

- [ ] **Step 3: Implement the minimal contracts**

  Add `isActive` to slide props, pass it from `PresentationDeck`, add the optional mode props, and render mode-specific data attributes/classes while leaving `standalone` as the default.

- [ ] **Step 4: Run tests to verify GREEN**

  Run the focused Jest command and expect all focused tests to pass.

### Task 2: Build the presentation shell and slide layout

**Files:**
- Modify: `app/MA-HomeAssignment/presentation/slides/Slide17Prototype.tsx`
- Modify: `app/MA-HomeAssignment/demo/DemoShell.tsx`
- Modify: `app/MA-HomeAssignment/demo/CardBountyPrototype.module.css`
- Test: `__tests__/ma-presentation-deep-dive.test.tsx`
- Test: `app/MA-HomeAssignment/demo/__tests__/DemoShell.test.tsx`

**Interfaces:**
- Consumes: `isActive`, `mode="presentation"`
- Produces: `[data-prototype-presentation-shell="true"]` and `[data-prototype-presentation-controls="true"]`

- [ ] **Step 1: Extend the failing tests for layout and controls**

  Assert the portrait stage, compact restart control, absence of the assignment backlink, and preservation of standalone controls.

- [ ] **Step 2: Run tests to verify RED**

  Run the focused Jest command and expect failures for the missing presentation layout.

- [ ] **Step 3: Implement the presentation CSS and markup**

  Add a constrained non-viewport shell, a uniformly scaled native `430 × 932` logical canvas, compact restart control, no orientation overlay, and slide-safe sizing. Mark the wrapper as deck-interactive.

- [ ] **Step 4: Run tests to verify GREEN**

  Run the focused Jest command and expect all focused tests to pass.

### Task 3: Regression and browser verification

**Files:**
- Verify: `app/MA-HomeAssignment/demo/__tests__/CardBountyPrototype.test.tsx`
- Verify: all repository tests and build output

**Interfaces:**
- Consumes: the complete embedded experience from Tasks 1-2
- Produces: verified branch-ready implementation

- [ ] **Step 1: Run prototype regression tests**

  Run: `npm.cmd test -- app/MA-HomeAssignment/demo/__tests__/CardBountyPrototype.test.tsx --runInBand`

  Expected: PASS with the existing complete prototype flow unchanged.

- [ ] **Step 2: Run the full suite**

  Run: `npm.cmd test -- --runInBand`

  Expected: 38 test suites and 231-or-more tests pass.

- [ ] **Step 3: Run the production build**

  Run: `npm.cmd run build`

  Expected: exit code 0 with the presentation and demo routes compiled.

- [ ] **Step 4: Verify in the browser**

  Open `/MA-HomeAssignment/presentation#slide-11`, confirm the phone fits between title and navigation, interact through representative prototype steps, navigate away and back, and confirm reset without leaving the deck.

- [ ] **Step 5: Commit**

  Stage the focused implementation, tests, spec, and plan, then commit with `embed prototype in presentation slide`.

### Task 4: Apply the MA preview backdrop and presentation hierarchy

**Files:**
- Modify: `app/MA-HomeAssignment/presentation/slides/Slide17Prototype.tsx`
- Modify: `app/MA-HomeAssignment/presentation/PresentationDeck.tsx`
- Modify: `app/MA-HomeAssignment/presentation/PresentationStage.module.css`
- Modify: `app/MA-HomeAssignment/demo/DemoShell.tsx`
- Modify: `app/MA-HomeAssignment/demo/CardBountyPrototype.module.css`
- Test: `__tests__/ma-presentation-deep-dive.test.tsx`
- Test: `__tests__/ma-presentation-deck.test.tsx`
- Test: `app/MA-HomeAssignment/demo/__tests__/DemoShell.test.tsx`

**Interfaces:**
- Produces: `[data-prototype-slide-backdrop="true"]`
- Produces: `PresentationDeck[data-current-slide="slide-11"]`
- Produces: `--prototype-control-offset` for positioning the restart control beside the scaled phone

- [ ] **Step 1: Write failing presentation tests**

  Assert the full-bleed sky artwork and preview gradients, the `Card Bounty` eyebrow, the regular-scale white `Prototype` title, the `Restart` label, and slide-11-only white navigation.

- [ ] **Step 2: Run tests to verify RED**

  Run: `npm.cmd test -- __tests__/ma-presentation-deep-dive.test.tsx __tests__/ma-presentation-deck.test.tsx app/MA-HomeAssignment/demo/__tests__/DemoShell.test.tsx --runInBand`

  Expected: FAIL because slide 11 still uses the warm slide shell, old title, under-phone restart control, and shared charcoal navigation.

- [ ] **Step 3: Implement the approved layout**

  Reuse the preview background layers as full-bleed slide decoration, align the enlarged phone to the eyebrow's top edge, expose the active slide id on the deck viewport, switch only slide 11's chrome to white, and absolutely position the MA-style restart control to the right of the scaled phone using a rendered-width offset.

- [ ] **Step 4: Run focused and full verification**

  Run the focused Jest command, `npm.cmd test -- --runInBand`, and `npm.cmd run build`; expect all commands to exit successfully.
