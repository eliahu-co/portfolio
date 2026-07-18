# Approach Create Logos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the three selected Create-state feature headings with proportionate logos and remove all concept top rules.

**Architecture:** Keep the change inside `Slide03Approach`. Add a local feature-to-logo mapping and render Next Image assets in place of selected feature headings while retaining the existing summaries and layout.

**Tech Stack:** React, Next.js Image, Tailwind CSS, Jest, Testing Library

## Global Constraints

- Preserve the five-column Create evidence layout.
- Preserve transparent logo backgrounds and natural aspect ratios.
- Do not change other hover states or presentation slides.

---

### Task 1: Create evidence logo treatment

**Files:**
- Modify: `app/MA-HomeAssignment/presentation/slides/Slide03Approach.tsx`
- Test: `__tests__/ma-presentation-opening.test.tsx`
- Add: `public/coinmaster/hometown-logo.png`
- Add: `public/coinmaster/card-bounty-logo.png`
- Add: `public/coinmaster/hot-trail-logo.png`

**Interfaces:**
- Consumes: existing `CONCEPTS` entries and Next.js `Image`
- Produces: three accessible logo images in `data-create-evidence="true"`

- [ ] **Step 1: Write the failing test**

Assert that the Create evidence region renders the three exact logo sources and alt labels, keeps all monetization summaries, and has no `border-t` classes on concept sections.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm.cmd test -- __tests__/ma-presentation-opening.test.tsx --runInBand`

Expected: FAIL because the Create state still renders text headings and top borders.

- [ ] **Step 3: Implement the minimal slide change**

Add a typed logo mapping, render each selected feature logo with `height={72}`, `width` from its natural proportions, and `className="h-[72px] w-auto max-w-full object-contain object-left"`; remove the top-border utilities from all five sections.

- [ ] **Step 4: Verify focused and full test suites**

Run: `npm.cmd test -- __tests__/ma-presentation-opening.test.tsx --runInBand`

Run: `npm.cmd test -- --runInBand`

Expected: all tests pass.

- [ ] **Step 5: Verify the production build and live slide**

Run: `npm.cmd run build`

Open: `http://localhost:3010/MA-HomeAssignment/presentation#slide-3`

Expected: the Create hover displays three proportionate logos without top rules.
