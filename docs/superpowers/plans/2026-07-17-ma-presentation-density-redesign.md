# MA Presentation Density Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make slides 11 and 15 presentation-readable through phase focus and progressive metric disclosure.

**Architecture:** Add a presentation-only `PhaseFocusFlow` component so the MA source page remains untouched. Refactor `ValidationTable` to keep the primary metric persistent and switch the remaining metric groups through accessible tabs while retaining its existing row-detail interaction.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Jest, Testing Library.

## Global Constraints

- Do not modify the MA assignment page's shared player-flow component.
- Use native buttons for phases and tabs.
- Preserve the presentation shell, title, and navigation geometry.
- Use existing MA blue surfaces and presentation arrow styling.

---

### Task 1: Phase-focus player flow

**Files:**
- Create: `app/MA-HomeAssignment/presentation/components/PhaseFocusFlow.tsx`
- Modify: `app/MA-HomeAssignment/presentation/slides/Slide15PlayerFlow.tsx`
- Test: `__tests__/ma-presentation-player-flow.test.tsx`

**Interfaces:**
- Produces: `PhaseFocusFlow({ slideKey }: { slideKey: DeckSlideKey })`
- Consumes: `useDeckReset`, `FlowArrow`, and existing `data-blue-surface` styling.

- [ ] Write a failing test asserting four phase buttons, vertical detail reveal, and peer fading.
- [ ] Run `npx.cmd jest __tests__/ma-presentation-player-flow.test.tsx --runInBand` and confirm the new expectations fail.
- [ ] Implement the minimal presentation-only component and wire slide 11 to it.
- [ ] Re-run the focused test and confirm it passes.

### Task 2: Primary metric and tabs

**Files:**
- Modify: `app/MA-HomeAssignment/presentation/components/ValidationTable.tsx`
- Test: `__tests__/ma-presentation-validation.test.tsx`

**Interfaces:**
- Keeps: `ValidationTable({ slideKey }: { slideKey: DeckSlideKey })`
- Adds: accessible `Supporting metrics` and `Guardrails` tabs controlling one table body.

- [ ] Write failing tests asserting persistent ARPDAU, default Supporting metrics, and Guardrails tab switching.
- [ ] Run `npx.cmd jest __tests__/ma-presentation-validation.test.tsx --runInBand` and confirm the new expectations fail.
- [ ] Refactor `ValidationTable` to render a primary row plus one tab-selected table.
- [ ] Re-run the focused test and confirm it passes.

### Task 3: Verification

**Files:**
- Verify all files above.

- [ ] Run both focused test files together.
- [ ] Run `npx.cmd jest --runInBand` and confirm all suites pass.
- [ ] Run `npm.cmd run build` and confirm the production build passes.
- [ ] Review `git diff --check` and commit the implementation.
