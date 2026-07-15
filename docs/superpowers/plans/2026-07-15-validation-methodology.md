# Validation Methodology Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clarify the Card Bounty A/B test methodology, reformat target thresholds, and add three follow-up experiment ideas.

**Architecture:** Extend the existing validation data model with an optional muted target fragment, replace the single-purpose tooltip state with a keyed portal tooltip, and render Additional Tests from a local data array. Keep the existing section and table structure intact.

**Tech Stack:** Next.js 14, React, TypeScript, Tailwind CSS, Jest, React Testing Library.

## Global Constraints

- The heading is exactly `Card Bounty — Feature Validation`.
- Numeric threshold fragments use `text-charcoal/60` and display without parentheses.
- All tooltip buttons support hover, focus, and click and render their content through `document.body`.
- The Additional Tests list uses a yellow magnifying-glass SVG and remains stacked on all viewport widths.

---

### Task 1: Regression coverage

**Files:**
- Modify: `__tests__/ma-homeassignment.test.tsx`

**Interfaces:**
- Consumes: the rendered `MAHomeAssignmentPage` validation section.
- Produces: assertions for the new heading, methodology tooltips, muted thresholds, and Additional Tests list.

- [ ] **Step 1: Write failing tests**

Assert the exact heading, three information button labels and tooltip notes, `text-charcoal/60` on every muted threshold, absence of parentheses, and the three Additional Tests entries with SVG glyphs.

- [ ] **Step 2: Run the focused tests to verify RED**

Run: `npm.cmd test -- --runInBand __tests__/ma-homeassignment.test.tsx -t "Feature Validation|Additional Tests"`

Expected: FAIL because the new heading, tooltips, targets, and list do not exist.

### Task 2: Validation component implementation

**Files:**
- Modify: `app/MA-HomeAssignment/sections/FeatureValidation.tsx`
- Modify: `app/MA-HomeAssignment/sections/Section.tsx`

**Interfaces:**
- Consumes: `Section`, `Eyebrow`, metric group data, and React portals.
- Produces: keyed methodology tooltips, split target rendering, and the Additional Tests subsection.

- [ ] **Step 1: Extend the section eyebrow type**

Change the `eyebrow` prop from `string` to `ReactNode` so the A/B Test label can contain an accessible information button while existing string callers remain valid.

- [ ] **Step 2: Implement keyed tooltip behavior**

Use a `TooltipKey` union, a note record, an active key, and the active button element to position one portal tooltip. Give each button a unique `aria-label` and `aria-describedby`.

- [ ] **Step 3: Split and render target fragments**

Add `mutedTarget?: string` to `ValidationMetric`. Render `target` normally and `mutedTarget` in a sibling span with `text-charcoal/60`.

- [ ] **Step 4: Render Additional Tests**

Map the three approved experiments into a stacked list after the table. Use an inline SVG search icon with `text-cm-gold`.

- [ ] **Step 5: Run focused tests to verify GREEN**

Run: `npm.cmd test -- --runInBand __tests__/ma-homeassignment.test.tsx -t "Feature Validation|Additional Tests"`

Expected: PASS.

### Task 3: Visual and regression verification

**Files:**
- Test: `__tests__/ma-homeassignment.test.tsx`

**Interfaces:**
- Consumes: localhost page at `/MA-HomeAssignment#validation`.
- Produces: verified responsive layout and regression evidence.

- [ ] **Step 1: Inspect desktop and mobile layouts**

Confirm the three info buttons are reachable, tooltip content renders outside the table, target hierarchy is readable, yellow glyphs remain secondary, and neither the validation section nor Additional Tests overflows at 390px.

- [ ] **Step 2: Run complete verification**

Run: `npm.cmd test -- --runInBand`

Expected: all suites pass.

Run: `git diff --check`

Expected: exit code 0.

- [ ] **Step 3: Commit only scoped files**

```powershell
git add -- __tests__/ma-homeassignment.test.tsx app/MA-HomeAssignment/sections/FeatureValidation.tsx app/MA-HomeAssignment/sections/Section.tsx docs/superpowers/specs/2026-07-15-validation-methodology-design.md docs/superpowers/plans/2026-07-15-validation-methodology.md
git commit -m "expand Card Bounty validation methodology"
```
