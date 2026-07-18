# Validation Roadmap Slide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an interactive Validation Roadmap slide after Success Criteria and rename the scoring slide title to “Score.”

**Architecture:** Build one focused client slide component containing five test rows and local hover/focus state. Register it directly after the metrics slide so slide IDs, navigation, counters, and tests remain registry-driven.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Jest, Testing Library.

## Global Constraints

- Preserve the MA presentation’s existing typography, spacing, navigation, and hover-fade interaction language.
- Use the approved eyebrow “Additional tests” and title “Validation Roadmap.”
- Feature Validation is the primary test; the other four are follow-up tests.
- Do not merge or deploy.

---

### Task 1: Add the Validation Roadmap slide

**Files:**
- Create: `app/MA-HomeAssignment/presentation/slides/SlideValidationRoadmap.tsx`
- Modify: `app/MA-HomeAssignment/presentation/slideRegistry.tsx`
- Test: `__tests__/ma-presentation-validation.test.tsx`
- Test: `__tests__/ma-presentation-registry.test.ts`

**Interfaces:**
- Consumes: `SlideShell`, `Eyebrow`, `SlideTitle`, existing resource images, `useDeckReset`.
- Produces: default `SlideValidationRoadmap` component and five `[data-validation-roadmap-test]` rows.

- [ ] **Step 1: Write failing interaction and registry tests**
- [ ] **Step 2: Run focused tests and confirm failure**
- [ ] **Step 3: Implement the five-row hover/focus slide and insert it after Success Criteria**
- [ ] **Step 4: Run focused tests and confirm pass**

### Task 2: Rename Comparative scoring

**Files:**
- Modify: `app/MA-HomeAssignment/presentation/slides/Slide13ComparativeScoring.tsx`
- Modify: `app/MA-HomeAssignment/presentation/slideRegistry.tsx`
- Test: `__tests__/ma-presentation-registry.test.ts`
- Test: `__tests__/ma-presentation-scoring.test.tsx`

**Interfaces:**
- Produces: visible title and registry title `Score`.

- [ ] **Step 1: Update tests to expect “Score”**
- [ ] **Step 2: Run focused tests and confirm failure**
- [ ] **Step 3: Update the slide and registry title**
- [ ] **Step 4: Run focused tests and confirm pass**

### Task 3: Verify the complete deck

**Files:**
- Verify: presentation registry and validation chapter tests.

- [ ] **Step 1: Run the complete Jest suite**
- [ ] **Step 2: Confirm localhost returns HTTP 200**
- [ ] **Step 3: Review the final diff for unrelated changes**
